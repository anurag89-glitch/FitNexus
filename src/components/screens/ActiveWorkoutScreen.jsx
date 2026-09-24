import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Sparkles, 
  Camera, 
  Check, 
  Flame, 
  Clock, 
  Volume2, 
  VolumeX,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../utils/audio';

export default function ActiveWorkoutScreen({
  workout,
  onClose,
  onCompleteWorkout,
  onLaunchAICamera
}) {
  const exercises = workout?.exercises || [
    { name: "Bodyweight Squat", sets: 3, reps: 12, aiGuidance: "Keep your knees aligned with toes." },
    { name: "Push Ups", sets: 3, reps: 10, aiGuidance: "Keep elbows at 45 degrees." }
  ];

  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(2); // As specified in prompt: "Set 2 of 3"
  const [totalSets] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(20);
  const [elapsedSeconds, setElapsedSeconds] = useState(145);
  const [soundMuted, setSoundMuted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentExercise = exercises[currentExIndex];

  // Rest timer countdown
  useEffect(() => {
    let timer = null;
    if (isResting && !isPaused && restTimer > 0) {
      timer = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            sounds.repSuccess();
            setIsResting(false);
            return 20;
          }
          if (prev <= 3) sounds.beep();
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isResting, isPaused, restTimer]);

  // Overall workout clock
  useEffect(() => {
    let timer = null;
    if (!isPaused && !isCompleted) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused, isCompleted]);

  const handleNext = () => {
    sounds.click();
    if (currentSet < totalSets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setRestTimer(20);
    } else if (currentExIndex < exercises.length - 1) {
      setCurrentExIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(true);
      setRestTimer(25);
    } else {
      finishWorkout();
    }
  };

  const handlePrevious = () => {
    sounds.click();
    if (currentSet > 1) {
      setCurrentSet(prev => prev - 1);
    } else if (currentExIndex > 0) {
      setCurrentExIndex(prev => prev - 1);
      setCurrentSet(totalSets);
    }
  };

  const handleSkip = () => {
    sounds.click();
    if (currentExIndex < exercises.length - 1) {
      setCurrentExIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = () => {
    setIsCompleted(true);
    sounds.successFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(
    ((currentExIndex * totalSets + currentSet) / (exercises.length * totalSets)) * 100
  );

  // Workout Completion Modal
  if (isCompleted) {
    return (
      <div 
        className="active-workout-screen"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 600,
          background: 'radial-gradient(circle at 50% 30%, #0c2044 0%, #040812 80%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '28px 24px',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'rgba(0, 210, 255, 0.2)',
          border: '2px solid var(--accent-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 35px rgba(0, 210, 255, 0.5)',
          marginBottom: '20px'
        }}>
          <Trophy size={46} color="var(--accent-cyan)" />
        </div>

        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-cyan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Workout Complete!
        </span>

        <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', marginTop: '6px', marginBottom: '8px' }}>
          Sensational Effort, Ayush!
        </h2>

        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '300px' }}>
          You crushed “{workout?.title}”. Your activity and streak metrics have been logged to your progress.
        </p>

        {/* Summary Card */}
        <div className="nexus-card glow-border" style={{ width: '100%', marginBottom: '24px', padding: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Duration</span>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>
                {formatTime(elapsedSeconds)}
              </div>
            </div>

            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Calories</span>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-orange)' }}>
                ~220 kcal
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AI Form</span>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                88%
              </div>
            </div>
          </div>
        </div>

        <button 
          className="btn-primary" 
          id="btn-workout-completed-done"
          onClick={() => {
            sounds.click();
            onCompleteWorkout({ calories: 220, minutes: Math.round(elapsedSeconds / 60) });
          }}
        >
          Done & Return to Home
        </button>
      </div>
    );
  }

  return (
    <div 
      className="active-workout-screen"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 550,
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 20px 24px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      {/* 1. Header with Close, Title & Progress Bar */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <button 
            className="icon-btn" 
            onClick={() => {
              sounds.click();
              if (window.confirm("Quit current workout session?")) {
                onClose();
              }
            }}
          >
            <X size={18} />
          </button>

          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Active Workout
            </span>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
              {formatTime(elapsedSeconds)}
            </div>
          </div>

          <button 
            className="icon-btn"
            onClick={() => setSoundMuted(!soundMuted)}
            title={soundMuted ? "Unmute" : "Mute audio"}
          >
            {soundMuted ? <VolumeX size={18} color="var(--text-muted)" /> : <Volume2 size={18} color="var(--accent-cyan)" />}
          </button>
        </div>

        {/* Workout Progress Bar at Top */}
        <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '99px',
          overflow: 'hidden',
          marginBottom: '6px'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #00d2ff, #0a84ff)',
            boxShadow: '0 0 10px rgba(0, 210, 255, 0.5)',
            transition: 'width 0.4s ease'
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>Exercise {currentExIndex + 1} of {exercises.length}</span>
          <span>{progressPercent}% Complete</span>
        </div>
      </div>

      {/* 2. Current Exercise Visual Illustration / Skeleton Simulation Area */}
      <div style={{
        flex: 1,
        margin: '12px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        {/* Visual Athletic Silhouette Box */}
        <div style={{
          width: '100%',
          maxWidth: '320px',
          height: '240px',
          borderRadius: '24px',
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 210, 255, 0.12) 0%, rgba(8, 16, 32, 0.95) 80%)',
          border: '1.5px solid var(--border-cyan)',
          boxShadow: '0 0 35px rgba(0, 210, 255, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          {/* Animated Glowing Ring representing posture guidance */}
          <div style={{
            position: 'absolute',
            width: '170px',
            height: '170px',
            borderRadius: '50%',
            border: '2px dashed rgba(0, 210, 255, 0.3)',
            animation: isPaused ? 'none' : 'spin 20s linear infinite'
          }} />

          {/* Central Athletic Pose Vector Graphic */}
          <svg width="120" height="150" viewBox="0 0 100 130" fill="none" style={{ position: 'relative', zIndex: 2 }}>
            {/* Head */}
            <circle cx="50" cy="20" r="10" stroke="#00d2ff" strokeWidth="3" fill="rgba(0, 210, 255, 0.2)" />
            {/* Spine */}
            <line x1="50" y1="30" x2="50" y2="70" stroke="#00d2ff" strokeWidth="4" strokeLinecap="round" />
            {/* Arms / Shoulders */}
            <path d="M22 45 L50 38 L78 45" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Hips */}
            <line x1="38" y1="70" x2="62" y2="70" stroke="#00d2ff" strokeWidth="4" strokeLinecap="round" />
            {/* Left Leg (Squat angle) */}
            <path d="M38 70 L26 95 L22 122" stroke="#00d2ff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Right Leg (Squat angle) */}
            <path d="M62 70 L74 95 L78 122" stroke="#00d2ff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Joint Tracker Dots */}
            <circle cx="50" cy="38" r="3" fill="#10b981" />
            <circle cx="38" cy="70" r="3" fill="#10b981" />
            <circle cx="62" cy="70" r="3" fill="#10b981" />
            <circle cx="26" cy="95" r="3" fill="#10b981" />
            <circle cx="74" cy="95" r="3" fill="#10b981" />
          </svg>

          {/* Rest Overlay if resting */}
          {isResting && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(4, 8, 18, 0.92)',
              backdropFilter: 'blur(8px)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '24px'
            }}>
              <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: 700, letterSpacing: '0.06em' }}>
                REST TIME
              </span>
              <div style={{ fontSize: '44px', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-display)', margin: '4px 0' }}>
                {restTimer}s
              </div>
              <button 
                className="btn-ghost" 
                onClick={() => setIsResting(false)}
                style={{ fontSize: '12px', color: 'var(--accent-cyan)' }}
              >
                Skip Rest →
              </button>
            </div>
          )}

          {/* Quick AI Camera button trigger inside illustration */}
          <button
            onClick={() => {
              sounds.click();
              onLaunchAICamera();
            }}
            style={{
              position: 'absolute',
              bottom: '12px',
              background: 'rgba(0, 210, 255, 0.18)',
              border: '1px solid var(--border-cyan)',
              borderRadius: '99px',
              padding: '5px 12px',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(0, 210, 255, 0.25)',
              zIndex: 5
            }}
          >
            <Camera size={13} color="var(--accent-cyan)" />
            AI Pose Track
          </button>
        </div>

        {/* Current Exercise Name & Set Details */}
        <div style={{ textAlign: 'center', marginTop: '14px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
            {currentExercise.name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--accent-cyan)',
              background: 'rgba(0, 210, 255, 0.12)',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              Set {currentSet} of {totalSets}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              • {currentExercise.reps} {typeof currentExercise.reps === 'number' ? 'reps' : ''}
            </span>
          </div>
        </div>

        {/* 3. Simulated AI Guidance Box */}
        <div style={{
          width: '100%',
          maxWidth: '340px',
          background: 'rgba(0, 210, 255, 0.08)',
          border: '1px solid var(--border-cyan)',
          borderRadius: '14px',
          padding: '10px 14px',
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={14} color="#040812" />
          </div>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Simulated AI Guidance
            </span>
            <p style={{ fontSize: '12.5px', color: '#fff', fontWeight: 500, lineHeight: '1.3' }}>
              “{currentExercise.aiGuidance || 'Keep your knees aligned.'}”
            </p>
          </div>
        </div>
      </div>

      {/* 4. Controls: Previous, Pause, Next, Skip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '10px 0 6px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <button 
          className="icon-btn" 
          onClick={handlePrevious}
          title="Previous"
          style={{ width: '44px', height: '44px' }}
        >
          <SkipBack size={19} />
        </button>

        <button 
          onClick={() => {
            sounds.click();
            setIsPaused(!isPaused);
          }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#030816',
            boxShadow: '0 0 20px rgba(0, 210, 255, 0.4)',
            cursor: 'pointer'
          }}
          title={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? <Play size={24} fill="#030816" /> : <Pause size={24} fill="#030816" />}
        </button>

        <button 
          className="icon-btn" 
          onClick={handleNext}
          title="Next Rep/Set"
          style={{ width: '44px', height: '44px', border: '1px solid var(--border-cyan)', color: 'var(--accent-cyan)' }}
        >
          <Check size={20} strokeWidth={2.5} />
        </button>

        <button 
          className="icon-btn" 
          onClick={handleSkip}
          title="Skip Exercise"
          style={{ width: '44px', height: '44px' }}
        >
          <SkipForward size={19} />
        </button>
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
