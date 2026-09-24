import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  ArrowLeft,
  RefreshCw,
  VideoOff
} from 'lucide-react';
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { 
  POSE_LANDMARKS, 
  POSE_CONNECTIONS, 
  analyzePosePresence, 
  ExerciseTracker 
} from '../../utils/poseAnalyzer';
import { sounds } from '../../utils/audio';

export default function AICameraModal({ 
  isOpen, 
  onClose,
  initialExercise = "Squat"
}) {
  const [selectedExercise, setSelectedExercise] = useState(initialExercise);
  
  // Camera Controller States
  // 'initializing' | 'ready' | 'error' | 'denied'
  const [cameraStatus, setCameraStatus] = useState("initializing");
  const [errorMessage, setErrorMessage] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Real-time detection & exercise states
  const [poseState, setPoseState] = useState(null); // null until camera frame is received
  const [repCount, setRepCount] = useState(0);
  const [formScore, setFormScore] = useState(86);
  const [metrics, setMetrics] = useState([
    { label: "Knee Position", status: "GOOD ✓", state: "good" },
    { label: "Back Position", status: "GOOD ✓", state: "good" },
    { label: "Squat Depth", status: "GOOD ✓", state: "good" }
  ]);
  const [aiFeedback, setAiFeedback] = useState("Ready for " + initialExercise + ". Move into frame.");
  const [statusText, setStatusText] = useState("Initializing...");

  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const trackerRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const lastSpokenFeedbackRef = useRef("");
  const lastRepRef = useRef(0);
  const hasLoggedFirstPoseRef = useRef(false);
  const hasLoggedFrameRef = useRef(false);

  // Initialize or update Exercise Tracker
  useEffect(() => {
    if (!trackerRef.current) {
      trackerRef.current = new ExerciseTracker(selectedExercise);
    } else {
      trackerRef.current.setExercise(selectedExercise);
    }
    setRepCount(0);
    setAiFeedback(`Ready for ${selectedExercise}. Move into frame.`);
  }, [selectedExercise]);

  // Text-To-Speech Cue
  const speakFeedback = useCallback((text) => {
    if (!voiceEnabled || !text) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (text === lastSpokenFeedbackRef.current) return;
      lastSpokenFeedbackRef.current = text;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      } catch {
        // safe fallback
      }
    }
  }, [voiceEnabled]);

  // 1. Load MediaPipe PoseLandmarker
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    async function loadModel() {
      setIsModelLoading(true);
      try {
        let vision;
        try {
          vision = await FilesetResolver.forVisionTasks("/wasm");
        } catch (e) {
          console.warn("Falling back to CDN for WASM tasks", e);
          vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
          );
        }

        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/pose_landmarker_lite.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numPoses: 2
        });

        if (isMounted) {
          poseLandmarkerRef.current = landmarker;
          setIsModelLoading(false);
          console.log("Pose detector initialized");
        }
      } catch (err) {
        console.warn("Local model load failed, trying CDN fallback:", err);
        try {
          const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
          );
          const landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
              delegate: "GPU"
            },
            runningMode: "VIDEO",
            numPoses: 2
          });
          if (isMounted) {
            poseLandmarkerRef.current = landmarker;
            setIsModelLoading(false);
            console.log("Pose detector initialized");
          }
        } catch (fatalErr) {
          console.error("Fatal PoseLandmarker load error:", fatalErr);
          if (isMounted) setIsModelLoading(false);
        }
      }
    }

    loadModel();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // 2. Initialize CameraController & Stream
  const initCamera = useCallback(async () => {
    console.log("Camera initialization started");
    setCameraStatus("initializing");
    setErrorMessage("");
    setIsCameraActive(false);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("getUserMedia not supported");
      setCameraStatus("error");
      setErrorMessage("Camera access is not supported by your current browser environment.");
      return;
    }

    try {
      // 1. Enumerate available cameras
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        console.log("Camera count:", videoDevices.length);
        if (videoDevices.length > 0) {
          console.log("Selected camera:", videoDevices[0].label || "Default User/Front Camera");
        }
      } catch (enumErr) {
        console.warn("Device enumeration note:", enumErr);
      }

      // 2. Request user front camera
      const constraints = {
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 30 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      console.log("Camera initialization completed");
      console.log("Camera controller initialized: true");

      // 3. Attach stream to video element
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;
        video.setAttribute("playsinline", "true");
        video.setAttribute("webkit-playsinline", "true");
        video.muted = true;

        const handlePlay = () => {
          console.log("Camera preview ready");
          console.log("Camera preview rendered");
          setIsCameraActive(true);
          setCameraStatus("ready");
          setStatusText("Camera Active");
        };

        video.onloadedmetadata = () => {
          video.play().then(handlePlay).catch(playErr => {
            console.error("video.play() failed:", playErr);
          });
        };

        // Fallback play trigger
        video.play().then(handlePlay).catch(() => {});
      } else {
        setCameraStatus("ready");
      }
    } catch (err) {
      console.error("Camera controller initialization failed:", err);
      setCameraStatus("error");
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMessage("Camera permission was denied. Please allow camera permissions in your browser address bar.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setErrorMessage("No camera hardware detected on this device.");
      } else {
        setErrorMessage(`Unable to access camera: ${err.message || 'Initialization failed'}`);
      }
    }
  }, []);

  // Stop camera controller
  const disposeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Lifecycle: Initialize camera when modal opens, dispose when closed
  useEffect(() => {
    if (isOpen) {
      initCamera();
    } else {
      disposeCamera();
    }
    return () => {
      disposeCamera();
    };
  }, [isOpen, initCamera, disposeCamera]);

  // Ensure video element receives stream whenever camera becomes ready
  useEffect(() => {
    if (cameraStatus === "ready" && streamRef.current && videoRef.current) {
      const video = videoRef.current;
      if (video.srcObject !== streamRef.current) {
        video.srcObject = streamRef.current;
        video.setAttribute("playsinline", "true");
        video.setAttribute("webkit-playsinline", "true");
        video.muted = true;
        video.play().then(() => {
          console.log("Camera preview rendered");
          setIsCameraActive(true);
        }).catch(err => {
          console.warn("Re-play error:", err);
        });
      }
    }
  }, [cameraStatus]);

  // 3. Pose Detection & Rendering Loop (Starts ONLY AFTER camera frame is live)
  useEffect(() => {
    if (cameraStatus !== "ready" || !isCameraActive || isPaused) return;

    let lastVideoTime = -1;

    const renderLoop = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState >= 2) {
        if (!hasLoggedFrameRef.current) {
          console.log("Camera frame received");
          hasLoggedFrameRef.current = true;
        }

        const videoWidth = video.videoWidth || 640;
        const videoHeight = video.videoHeight || 480;

        if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
          canvas.width = videoWidth;
          canvas.height = videoHeight;
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Only run pose detection if landmarker model is ready
        if (poseLandmarkerRef.current && video.currentTime !== lastVideoTime) {
          lastVideoTime = video.currentTime;
          const timestamp = performance.now();

          try {
            const results = poseLandmarkerRef.current.detectForVideo(video, timestamp);

            if (results.landmarks && results.landmarks.length > 0) {
              if (!hasLoggedFirstPoseRef.current) {
                console.log("Pose landmarks detected:", results.landmarks[0].length);
                hasLoggedFirstPoseRef.current = true;
              }

              if (results.landmarks.length > 1) {
                setPoseState({
                  state: "multiple",
                  message: "Please make sure only one person is visible."
                });
              } else {
                const landmarks = results.landmarks[0];
                const presence = analyzePosePresence(landmarks, videoWidth, videoHeight);
                setPoseState(presence);

                // Draw pose landmarks & skeleton on top of live camera
                drawSkeleton(ctx, landmarks, canvas.width, canvas.height, presence.state === "tracking");

                // Process movement & rep count
                if (trackerRef.current) {
                  const analysis = trackerRef.current.processFrame(landmarks);
                  setRepCount(analysis.repCount);
                  setFormScore(analysis.formScore);
                  setStatusText(analysis.status);
                  setMetrics(analysis.metrics);
                  setAiFeedback(analysis.feedback);

                  if (analysis.repCount > lastRepRef.current) {
                    sounds.repSuccess();
                    lastRepRef.current = analysis.repCount;
                    speakFeedback(`Rep ${analysis.repCount}. ${analysis.feedback}`);
                  }
                }
              }
            } else {
              setPoseState({
                state: "searching",
                message: "Move into the camera frame."
              });
            }
          } catch (detectionErr) {
            console.error("Pose detection frame error:", detectionErr);
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [cameraStatus, isCameraActive, isPaused, speakFeedback]);

  // Draw Pose Skeleton & Keypoints with Cyber Cyan Glow
  const drawSkeleton = (ctx, landmarks, width, height, isActive) => {
    ctx.save();

    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = isActive ? "rgba(0, 210, 255, 0.88)" : "rgba(255, 255, 255, 0.4)";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00d2ff";

    // 1. Draw Skeleton Connection Lines
    POSE_CONNECTIONS.forEach(([startIdx, endIdx]) => {
      const p1 = landmarks[startIdx];
      const p2 = landmarks[endIdx];

      if (p1 && p2 && (p1.visibility || 1) > 0.35 && (p2.visibility || 1) > 0.35) {
        ctx.beginPath();
        ctx.moveTo(p1.x * width, p1.y * height);
        ctx.lineTo(p2.x * width, p2.y * height);
        ctx.stroke();
      }
    });

    // 2. Draw Landmark Joint Points
    landmarks.forEach((pt, index) => {
      if (!pt || (pt.visibility || 1) < 0.35) return;

      const x = pt.x * width;
      const y = pt.y * height;

      let pointColor = "#00d2ff";
      if (index === POSE_LANDMARKS.LEFT_KNEE || index === POSE_LANDMARKS.RIGHT_KNEE) {
        pointColor = "#10b981";
      } else if (index === POSE_LANDMARKS.LEFT_HIP || index === POSE_LANDMARKS.RIGHT_HIP) {
        pointColor = "#38bdf8";
      }

      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, 2 * Math.PI);
      ctx.fillStyle = pointColor;
      ctx.shadowBlur = 10;
      ctx.shadowColor = pointColor;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, 6.5, 0, 2 * Math.PI);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    });

    ctx.restore();
  };

  // Restart Rep Counter
  const handleRestart = () => {
    sounds.click();
    if (trackerRef.current) {
      trackerRef.current.reset();
    }
    setRepCount(0);
    lastRepRef.current = 0;
    setAiFeedback("Counter reset. Ready for reps.");
  };

  // Close & Clean up
  const handleClose = () => {
    sounds.click();
    disposeCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="ai-camera-modal"
      id="modal-ai-camera"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 800,
        backgroundColor: '#020612',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        animation: 'fadeIn 0.25s ease-out',
        overflow: 'hidden'
      }}
    >
      {/* 1. Top HUD Bar */}
      <div style={{
        padding: '12px 16px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 30,
        background: 'linear-gradient(180deg, rgba(2, 6, 18, 0.85) 0%, transparent 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={handleClose}
            className="icon-btn"
            style={{ width: '34px', height: '34px', background: 'rgba(0, 0, 0, 0.6)' }}
            title="Back to AI Coach"
          >
            <ArrowLeft size={17} color="#fff" />
          </button>

          <div>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>
              AI Coach
            </span>
            <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', display: 'block', fontWeight: 600 }}>
              ● LIVE
            </span>
          </div>
        </div>

        {/* Exercise Selector */}
        <select
          value={selectedExercise}
          onChange={(e) => {
            sounds.click();
            setSelectedExercise(e.target.value);
          }}
          style={{
            background: 'rgba(0, 210, 255, 0.15)',
            border: '1px solid var(--border-cyan)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '99px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="Squats" style={{ background: '#09152b' }}>Squats</option>
          <option value="Push-ups" style={{ background: '#09152b' }}>Push-ups</option>
          <option value="Lunges" style={{ background: '#09152b' }}>Lunges</option>
          <option value="Jumping Jacks" style={{ background: '#09152b' }}>Jumping Jacks</option>
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            className="icon-btn"
            style={{ width: '34px', height: '34px', background: 'rgba(0, 0, 0, 0.6)' }}
            onClick={() => {
              setVoiceEnabled(!voiceEnabled);
              sounds.click();
            }}
            title={voiceEnabled ? "Mute Voice Cues" : "Enable Voice Cues"}
          >
            {voiceEnabled ? <Volume2 size={16} color="var(--accent-cyan)" /> : <VolumeX size={16} color="var(--text-muted)" />}
          </button>

          <button
            className="icon-btn"
            style={{ width: '34px', height: '34px', background: 'rgba(0, 0, 0, 0.6)' }}
            onClick={handleClose}
            title="End Workout"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 2. Main Live Camera Preview + Pose Skeleton Canvas */}
      <div style={{
        position: 'relative',
        flex: 1,
        margin: '0 8px',
        borderRadius: '24px',
        overflow: 'hidden',
        backgroundColor: '#050a16',
        border: '1.5px solid var(--border-cyan)',
        boxShadow: '0 0 30px rgba(0, 210, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* State 1: Camera Error State */}
        {cameraStatus === "error" && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center',
            background: 'radial-gradient(circle at 50% 40%, #1e0b12 0%, #030814 85%)',
            zIndex: 25
          }}>
            <VideoOff size={40} color="var(--accent-red)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', color: '#fff', fontWeight: 800, marginBottom: '6px' }}>
              Unable to access camera
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', maxWidth: '280px', marginBottom: '16px' }}>
              {errorMessage || "Please make sure your camera is connected and permissions are allowed."}
            </p>
            <button 
              className="btn-primary" 
              onClick={initCamera}
              style={{ maxWidth: '160px', padding: '10px 16px', fontSize: '13px' }}
            >
              <RefreshCw size={15} /> Retry Camera
            </button>
          </div>
        )}

        {/* State 2: Camera Initializing State */}
        {cameraStatus === "initializing" && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#040814',
            zIndex: 20,
            gap: '12px'
          }}>
            <RefreshCw size={32} color="var(--accent-cyan)" style={{ animation: 'spin 1.2s linear infinite' }} />
            <span style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>
              Starting camera...
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Requesting live device video stream
            </span>
          </div>
        )}

        {/* Live Video Feed - Mounted & displayed with full aspect ratio cover */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)', // Mirror front camera preview naturally
            display: cameraStatus === "ready" ? 'block' : 'none'
          }}
        />

        {/* Pose Skeleton Overlay Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)', // Matches mirrored video feed
            pointerEvents: 'none',
            zIndex: 10,
            display: isCameraActive ? 'block' : 'none'
          }}
        />

        {/* Pose Status Banner Overlay - ONLY shows when camera is live and providing frames */}
        {isCameraActive && poseState && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            background: poseState.state === 'tracking' ? 'rgba(16, 185, 129, 0.88)' : 'rgba(15, 23, 42, 0.88)',
            border: poseState.state === 'tracking' ? '1px solid var(--accent-green)' : '1px solid var(--border-cyan)',
            backdropFilter: 'blur(8px)',
            padding: '5px 14px',
            borderRadius: '99px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
            maxWidth: '90%',
            whiteSpace: 'nowrap'
          }}>
            {poseState.state === 'tracking' ? (
              <>
                <CheckCircle2 size={13} color="#fff" />
                <span style={{ fontSize: '11px', color: '#fff', fontWeight: 700 }}>
                  Pose Detection: ACTIVE ✓
                </span>
              </>
            ) : (
              <>
                <AlertTriangle size={13} color="var(--accent-orange)" />
                <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600 }}>
                  {poseState.message}
                </span>
              </>
            )}
          </div>
        )}

        {/* Paused Overlay */}
        {isPaused && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(2, 6, 18, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 25,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              Analysis Paused
            </h3>
            <button 
              className="btn-primary" 
              onClick={() => setIsPaused(false)}
              style={{ maxWidth: '140px' }}
            >
              <Play size={16} /> Resume
            </button>
          </div>
        )}
      </div>

      {/* 3. Bottom Floating Analysis Panel */}
      <div style={{
        background: 'var(--bg-surface)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        borderTop: '1px solid var(--border-cyan)',
        padding: '14px 16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 30,
        boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Top row: Exercise Name, Real-time Reps, Form Score */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Exercise
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
              {selectedExercise}
            </h3>
            <span style={{ fontSize: '11.5px', color: 'var(--accent-green)', fontWeight: 600 }}>
              {statusText}
            </span>
          </div>

          {/* Real-time Rep Counter */}
          <div style={{
            background: 'rgba(0, 210, 255, 0.12)',
            border: '1.5px solid var(--border-cyan)',
            borderRadius: '16px',
            padding: '6px 14px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              REP
            </span>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)', lineHeight: '1.1' }}>
              {String(repCount).padStart(2, '0')}
            </div>
          </div>

          {/* Real-time Form Score */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '6px 14px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              FORM SCORE
            </span>
            <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)', lineHeight: '1.1' }}>
              {formScore}%
            </div>
          </div>
        </div>

        {/* Metrics Chips (Knee Position, Back Position, Depth) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {metrics.map((m, idx) => (
            <div
              key={idx}
              style={{
                background: m.state === 'good' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.15)',
                border: m.state === 'good' ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '10px',
                padding: '6px 4px',
                textAlign: 'center'
              }}
            >
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>
                {m.label}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: m.state === 'good' ? 'var(--accent-green)' : 'var(--accent-orange)',
                display: 'block',
                marginTop: '2px'
              }}>
                {m.status}
              </span>
            </div>
          ))}
        </div>

        {/* Real-time AI Feedback Toast */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.1) 0%, rgba(10, 25, 45, 0.8) 100%)',
          border: '1px solid var(--border-cyan)',
          borderRadius: '12px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={15} color="var(--accent-cyan)" />
          <p style={{ fontSize: '12.5px', color: '#fff', fontWeight: 600, margin: 0 }}>
            “{aiFeedback}”
          </p>
        </div>

        {/* Bottom Controls: Pause, Restart, End Workout */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
          <button
            className="btn-secondary"
            onClick={() => {
              sounds.click();
              setIsPaused(!isPaused);
            }}
            style={{ flex: 1, padding: '10px 8px', fontSize: '13px' }}
          >
            {isPaused ? <Play size={15} /> : <Pause size={15} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          <button
            className="btn-secondary"
            onClick={handleRestart}
            style={{ flex: 1, padding: '10px 8px', fontSize: '13px' }}
          >
            <RotateCcw size={15} />
            Restart
          </button>

          <button
            className="btn-primary"
            onClick={handleClose}
            style={{ flex: 1.2, padding: '10px 8px', fontSize: '13px', background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', color: '#fff' }}
          >
            <X size={15} />
            End Workout
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
