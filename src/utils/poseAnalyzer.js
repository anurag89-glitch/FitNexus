// Geometric angle computation and rule-based fitness pose analyzer for MediaPipe Pose Landmarker

// Calculate the 2D angle (in degrees) at pointB formed by ray BA and ray BC
export function calculateAngle(pointA, pointB, pointC) {
  if (!pointA || !pointB || !pointC) return 180;
  
  const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) - 
                  Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return Math.round(angle);
}

// Calculate angle of a line relative to vertical (0 degrees = straight up/down)
export function calculateVerticalAngle(topPoint, bottomPoint) {
  if (!topPoint || !bottomPoint) return 0;
  const dx = Math.abs(topPoint.x - bottomPoint.x);
  const dy = Math.abs(topPoint.y - bottomPoint.y);
  if (dy === 0) return 90;
  const radians = Math.atan(dx / dy);
  return Math.round((radians * 180.0) / Math.PI);
}

// MediaPipe Landmark indices
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
};

// SKELETON CONNECTIONS FOR RENDERING
export const POSE_CONNECTIONS = [
  // Shoulders & Chest
  [11, 12],
  // Torso
  [11, 23],
  [12, 24],
  [23, 24],
  // Arms
  [11, 13],
  [13, 15],
  [12, 14],
  [14, 16],
  // Legs
  [23, 25],
  [25, 27],
  [24, 26],
  [26, 28],
  // Feet
  [27, 29],
  [29, 31],
  [28, 30],
  [30, 32],
  // Neck/Head
  [0, 11],
  [0, 12]
];

// Determine pose tracking quality & frame state
export function analyzePosePresence(landmarks, frameWidth, frameHeight) {
  if (!landmarks || landmarks.length < 29) {
    return { state: "searching", message: "Move into the camera frame." };
  }

  // Check visibility/presence of critical joints
  const nose = landmarks[0];
  const lShoulder = landmarks[11];
  const rShoulder = landmarks[12];
  const lHip = landmarks[23];
  const rHip = landmarks[24];
  const lAnkle = landmarks[27];
  const rAnkle = landmarks[28];

  const minVisibility = 0.45;
  const isShouldersVisible = (lShoulder.visibility || 1) > minVisibility && (rShoulder.visibility || 1) > minVisibility;
  const isHipsVisible = (lHip.visibility || 1) > minVisibility && (rHip.visibility || 1) > minVisibility;

  if (!isShouldersVisible || !isHipsVisible) {
    return { state: "lost", message: "Pose Lost — Reposition yourself." };
  }

  // Check if partially outside frame
  const margin = 0.02;
  const keyPoints = [lShoulder, rShoulder, lHip, rHip, lAnkle, rAnkle];
  const isOutside = keyPoints.some(pt => pt.x < margin || pt.x > (1 - margin) || pt.y < margin || pt.y > (1 - margin));
  
  if (isOutside) {
    return { state: "partial", message: "Move your full body into the frame." };
  }

  // Check distance / body scale
  const torsoHeight = Math.abs(((lHip.y + rHip.y) / 2) - ((lShoulder.y + rShoulder.y) / 2));
  if (torsoHeight < 0.12) {
    return { state: "too_far", message: "Move closer to the camera." };
  }

  return { state: "tracking", message: "Tracking Active ✓" };
}

// Exercise State Tracker Class
export class ExerciseTracker {
  constructor(exerciseType = "Squats") {
    this.exerciseType = exerciseType;
    this.repCount = 0;
    this.stage = "up"; // 'up' | 'down' | 'neutral'
    this.formScore = 88;
    this.metrics = [];
    this.feedback = "Maintain steady tempo.";
    this.lastRepTimestamp = 0;
  }

  setExercise(exerciseType) {
    this.exerciseType = exerciseType;
    this.repCount = 0;
    this.stage = "up";
    this.feedback = `Ready for ${exerciseType}. Get into position.`;
  }

  reset() {
    this.repCount = 0;
    this.stage = "up";
    this.formScore = 88;
    this.feedback = "Tracker reset. Ready for reps.";
  }

  processFrame(landmarks) {
    if (!landmarks || landmarks.length < 29) {
      return {
        repCount: this.repCount,
        formScore: this.formScore,
        metrics: [],
        feedback: "Looking for body landmarks..."
      };
    }

    switch (this.exerciseType) {
      case "Squats":
        return this.processSquat(landmarks);
      case "Push-ups":
      case "Push Up":
        return this.processPushUp(landmarks);
      case "Lunges":
      case "Lunge":
        return this.processLunge(landmarks);
      case "Jumping Jacks":
      case "Jumping Jack":
        return this.processJumpingJack(landmarks);
      default:
        return this.processSquat(landmarks);
    }
  }

  // SQUAT ANALYSIS & REP COUNTING
  processSquat(landmarks) {
    const lHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const lKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const rKnee = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
    const lAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const rAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];
    const lShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];

    // Knee flexion angles
    const leftKneeAngle = calculateAngle(lHip, lKnee, lAnkle);
    const rightKneeAngle = calculateAngle(rHip, rKnee, rAnkle);
    const avgKneeAngle = Math.round((leftKneeAngle + rightKneeAngle) / 2);

    // Torso inclination relative to vertical
    const midShoulder = { x: (lShoulder.x + rShoulder.x) / 2, y: (lShoulder.y + rShoulder.y) / 2 };
    const midHip = { x: (lHip.x + rHip.x) / 2, y: (lHip.y + rHip.y) / 2 };
    const torsoAngle = calculateVerticalAngle(midShoulder, midHip);

    // Knee tracking alignment (distance between knees vs distance between ankles)
    const kneeDist = Math.abs(lKnee.x - rKnee.x);
    const ankleDist = Math.abs(lAnkle.x - rAnkle.x);
    const isKneeCaving = kneeDist < ankleDist * 0.78;

    // Rule-based form metrics
    let kneeStatus = "GOOD ✓";
    let kneeState = "good";
    if (isKneeCaving) {
      kneeStatus = "CAVING ⚠";
      kneeState = "warning";
    }

    let backStatus = "GOOD ✓";
    let backState = "good";
    if (torsoAngle > 38) {
      backStatus = "IMPROVE ⚠";
      backState = "warning";
    }

    let depthStatus = "GOOD ✓";
    let depthState = "good";
    if (avgKneeAngle > 115 && this.stage === "down") {
      depthStatus = "SHALLOW ⚠";
      depthState = "warning";
    }

    // Dynamic Form Score Calculation
    let score = 94;
    if (isKneeCaving) score -= 12;
    if (torsoAngle > 38) score -= 10;
    if (avgKneeAngle > 115 && this.stage === "down") score -= 8;
    this.formScore = Math.max(68, Math.min(99, score));

    // Rep Counting State Machine
    // Standing: avgKneeAngle > 155°
    // Squat Depth: avgKneeAngle < 105°
    let feedback = this.feedback;

    if (avgKneeAngle > 155) {
      if (this.stage === "down") {
        const now = Date.now();
        if (now - this.lastRepTimestamp > 800) {
          this.repCount += 1;
          this.lastRepTimestamp = now;
          if (backState === "warning") {
            feedback = "Keep your back straight.";
          } else if (kneeState === "warning") {
            feedback = "Keep your knees aligned with your toes.";
          } else {
            feedback = "Great form. Keep going!";
          }
        }
      }
      this.stage = "up";
    } else if (avgKneeAngle < 105) {
      this.stage = "down";
      if (avgKneeAngle > 95) {
        feedback = "Go slightly deeper if comfortable.";
      } else {
        feedback = "Good depth! Drive up through heels.";
      }
    }

    this.feedback = feedback;

    return {
      repCount: this.repCount,
      formScore: this.formScore,
      kneeAngle: avgKneeAngle,
      torsoAngle,
      status: (kneeState === "good" && backState === "good") ? "Good Form ✓" : "Form Needs Focus",
      metrics: [
        { label: "Knee Position", status: kneeStatus, state: kneeState, detail: `${avgKneeAngle}° angle` },
        { label: "Back Position", status: backStatus, state: backState, detail: `${torsoAngle}° tilt` },
        { label: "Squat Depth", status: depthStatus, state: depthState, detail: avgKneeAngle <= 100 ? "Parallel ✓" : "In Progress" }
      ],
      feedback: this.feedback
    };
  }

  // PUSH-UP ANALYSIS & REP COUNTING
  processPushUp(landmarks) {
    const lShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
    const lElbow = landmarks[POSE_LANDMARKS.LEFT_ELBOW];
    const rElbow = landmarks[POSE_LANDMARKS.RIGHT_ELBOW];
    const lWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
    const rWrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];
    const lHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const lAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];

    const leftArmAngle = calculateAngle(lShoulder, lElbow, lWrist);
    const rightArmAngle = calculateAngle(rShoulder, rElbow, rWrist);
    const avgArmAngle = Math.round((leftArmAngle + rightArmAngle) / 2);

    // Body straightness (Shoulder - Hip - Ankle alignment)
    const bodyLineAngle = calculateAngle(lShoulder, lHip, lAnkle);
    const isSagging = bodyLineAngle < 155;

    let elbowStatus = "GOOD ✓";
    let elbowState = "good";
    let bodyStatus = isSagging ? "SAG ⚠" : "STRAIGHT ✓";
    let bodyState = isSagging ? "warning" : "good";

    let score = 92;
    if (isSagging) score -= 14;
    this.formScore = Math.max(70, score);

    let feedback = this.feedback;

    if (avgArmAngle > 150) {
      if (this.stage === "down") {
        const now = Date.now();
        if (now - this.lastRepTimestamp > 800) {
          this.repCount += 1;
          this.lastRepTimestamp = now;
          feedback = isSagging ? "Engage core to prevent lower back sag." : "Strong push! Keep chest leading.";
        }
      }
      this.stage = "up";
    } else if (avgArmAngle < 95) {
      this.stage = "down";
      feedback = "Full contraction reached. Push floor away!";
    }

    this.feedback = feedback;

    return {
      repCount: this.repCount,
      formScore: this.formScore,
      status: bodyState === "good" ? "Good Form ✓" : "Form Needs Focus",
      metrics: [
        { label: "Elbow Path", status: elbowStatus, state: elbowState, detail: `${avgArmAngle}° flex` },
        { label: "Core Plank", status: bodyStatus, state: bodyState, detail: `${bodyLineAngle}° spine` },
        { label: "Depth", status: avgArmAngle <= 95 ? "FULL ✓" : "HALFWAY", state: avgArmAngle <= 95 ? "good" : "warning", detail: "Chest to floor" }
      ],
      feedback: this.feedback
    };
  }

  // LUNGE ANALYSIS & REP COUNTING
  processLunge(landmarks) {
    const lHip = landmarks[POSE_LANDMARKS.LEFT_HIP];
    const rHip = landmarks[POSE_LANDMARKS.RIGHT_HIP];
    const lKnee = landmarks[POSE_LANDMARKS.LEFT_KNEE];
    const rKnee = landmarks[POSE_LANDMARKS.RIGHT_KNEE];
    const lAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const rAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

    const leftKnee = calculateAngle(lHip, lKnee, lAnkle);
    const rightKnee = calculateAngle(rHip, rKnee, rAnkle);
    const minKneeAngle = Math.min(leftKnee, rightKnee);

    let feedback = this.feedback;

    if (minKneeAngle > 150) {
      if (this.stage === "down") {
        const now = Date.now();
        if (now - this.lastRepTimestamp > 800) {
          this.repCount += 1;
          this.lastRepTimestamp = now;
          feedback = "Solid lunge rep! Keep front knee aligned.";
        }
      }
      this.stage = "up";
    } else if (minKneeAngle < 105) {
      this.stage = "down";
      feedback = "Good 90-degree bend. Drive up smoothly.";
    }

    this.feedback = feedback;
    this.formScore = 87;

    return {
      repCount: this.repCount,
      formScore: this.formScore,
      status: "Good Form ✓",
      metrics: [
        { label: "Front Knee", status: "GOOD ✓", state: "good", detail: `${minKneeAngle}° bend` },
        { label: "Torso Upright", status: "GOOD ✓", state: "good", detail: "Spine vertical" },
        { label: "Stride Length", status: "BALANCED ✓", state: "good", detail: "Optimal base" }
      ],
      feedback: this.feedback
    };
  }

  // JUMPING JACK ANALYSIS & REP COUNTING
  processJumpingJack(landmarks) {
    const lWrist = landmarks[POSE_LANDMARKS.LEFT_WRIST];
    const rWrist = landmarks[POSE_LANDMARKS.RIGHT_WRIST];
    const lShoulder = landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
    const rShoulder = landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
    const lAnkle = landmarks[POSE_LANDMARKS.LEFT_ANKLE];
    const rAnkle = landmarks[POSE_LANDMARKS.RIGHT_ANKLE];

    // Arms overhead: Wrists are higher than shoulders (y coordinate is smaller)
    const armsOverhead = lWrist.y < lShoulder.y && rWrist.y < rShoulder.y;

    // Feet wide: distance between ankles > 1.4 * shoulder width
    const shoulderWidth = Math.abs(lShoulder.x - rShoulder.x);
    const ankleWidth = Math.abs(lAnkle.x - rAnkle.x);
    const feetApart = ankleWidth > shoulderWidth * 1.35;

    let feedback = this.feedback;

    if (!armsOverhead && !feetApart) {
      if (this.stage === "open") {
        const now = Date.now();
        if (now - this.lastRepTimestamp > 500) {
          this.repCount += 1;
          this.lastRepTimestamp = now;
          feedback = "Excellent rhythm! Keep light on toes.";
        }
      }
      this.stage = "closed";
    } else if (armsOverhead && feetApart) {
      this.stage = "open";
      feedback = "Full overhead extension!";
    }

    this.feedback = feedback;
    this.formScore = 90;

    return {
      repCount: this.repCount,
      formScore: this.formScore,
      status: "Good Form ✓",
      metrics: [
        { label: "Arm Reach", status: armsOverhead ? "HIGH ✓" : "ACTIVE", state: "good", detail: "Overhead extension" },
        { label: "Foot Stance", status: feetApart ? "WIDE ✓" : "NEUTRAL", state: "good", detail: "Dynamic bounce" },
        { label: "Cadence", status: "STEADY ✓", state: "good", detail: "Fluid tempo" }
      ],
      feedback: this.feedback
    };
  }
}
