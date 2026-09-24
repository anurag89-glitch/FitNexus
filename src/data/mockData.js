// Centralized Mock Data for FitNexus Prototype

export const INITIAL_USER = {
  name: "Ayush",
  greeting: "Good Morning, Ayush 👋",
  subtitle: "Ready for your workout?",
  avatar: "/fitnexus-logo.png",
  level: "Intermediate",
  goal: "Build Muscle",
  height: 175, // cm
  weight: 68, // kg
  preferredWorkout: "Strength Training",
  streakDays: 7,
  weeklyGoalCompleted: 18,
  weeklyGoalTotal: 25,
  caloriesBurnedTotal: 2480,
  workoutTimeTotal: "4h 35m",
  formScoreAverage: 86,
  smartwatchStatus: "Connected",
  smartwatchModel: "FitPulse Apex V3",
  smartwatchBattery: 88,
  lastSynced: "5 min ago",
  todayStats: {
    calories: 320,
    workoutMinutes: 28,
    steps: 4820,
    heartRate: 78,
    activeMinutes: 42,
    waterLiters: 2.1
  },
  goalProgress: {
    strength: 72,
    endurance: 58,
    consistency: 84
  }
};

export const INITIAL_NUTRITION = {
  goal: "Build Muscle",
  dietPreference: "Non-Vegetarian", // 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Eggetarian'
  activityLevel: "Moderate to High",
  preferredFoods: ["Eggs", "Paneer", "Oats", "Chicken Breast", "Bananas"],
  foodsToAvoid: ["Refined Sugar", "Excess Deep Fried"],
  waterLiters: 1.8,
  waterTarget: 2.5,
  consumed: {
    calories: 1420,
    protein: 82,
    carbs: 165,
    fats: 48
  },
  targets: {
    calories: 2200,
    protein: 120,
    carbs: 250,
    fats: 70
  }
};

export const GOAL_NUTRITION_CONFIG = {
  "Build Muscle": {
    calories: 2200,
    protein: 120,
    carbs: 250,
    fats: 70,
    guidance: "Focus on adequate protein and balanced meals to support muscle hypertrophy and repair.",
    mealHighlight: "High-protein breakfast and post-workout amino replenishment."
  },
  "Lose Weight": {
    calories: 1800,
    protein: 130,
    carbs: 160,
    fats: 50,
    guidance: "Choose nutrient-dense meals and maintain a consistent calorie target to facilitate lean fat loss.",
    mealHighlight: "Fiber-rich vegetables with lean protein sources."
  },
  "Improve Fitness": {
    calories: 2000,
    protein: 105,
    carbs: 240,
    fats: 60,
    guidance: "Focus on balanced meals, hydration and consistent energy intake for peak everyday vitality.",
    mealHighlight: "Whole grains and antioxidant-rich fruit smoothies."
  },
  "Maintain Weight": {
    calories: 2100,
    protein: 110,
    carbs: 245,
    fats: 65,
    guidance: "Balance energy expenditure with steady nutrient intake for weight stabilization.",
    mealHighlight: "Consistent meal timing and wholesome nutrient balance."
  },
  "Improve Endurance": {
    calories: 2350,
    protein: 110,
    carbs: 310,
    fats: 60,
    guidance: "Prioritize complex carbs and electrolyte replenishment to fuel aerobic stamina.",
    mealHighlight: "Carbohydrate loading with slow-digesting oats and brown rice."
  }
};

export const DEFAULT_MEALS = [
  {
    id: "meal-1",
    slot: "BREAKFAST",
    title: "Oats + Banana + Milk",
    calories: 450,
    protein: 18,
    carbs: 72,
    fats: 9,
    time: "8:30 AM",
    description: "Rolled whole oats cooked with low-fat milk, topped with sliced banana and a pinch of cinnamon.",
    ingredients: ["50g Rolled Oats", "1 Medium Banana", "200ml Toned Milk", "1 tsp Chia Seeds"],
    logged: true
  },
  {
    id: "meal-2",
    slot: "MID-MORNING",
    title: "Greek Yogurt + Fruit",
    calories: 220,
    protein: 15,
    carbs: 28,
    fats: 4,
    time: "11:15 AM",
    description: "Unsweetened creamy Greek yogurt paired with antioxidant-rich mixed berries or seasonal fruit.",
    ingredients: ["150g Greek Yogurt", "50g Fresh Berries / Apple", "5g Honey drizzle"],
    logged: true
  },
  {
    id: "meal-3",
    slot: "LUNCH",
    title: "Rice + Dal + Paneer + Salad",
    calories: 600,
    protein: 30,
    carbs: 85,
    fats: 18,
    time: "1:45 PM",
    description: "Hearty Indian plate with steamed brown rice, yellow moong dal, spiced grilled paneer, and fresh cucumber salad.",
    ingredients: ["150g Cooked Brown Rice", "1 Bowl Moong Dal", "80g Sautéed Paneer / Tofu", "Mixed Green Salad"],
    logged: true
  },
  {
    id: "meal-4",
    slot: "EVENING SNACK",
    title: "Banana + Peanut Butter",
    calories: 280,
    protein: 10,
    carbs: 35,
    fats: 12,
    time: "5:30 PM",
    description: "Energy booster prior to workout: natural unsweetened peanut butter spread on ripe banana slices.",
    ingredients: ["1 Banana", "1.5 tbsp Natural Peanut Butter"],
    logged: false
  },
  {
    id: "meal-5",
    slot: "DINNER",
    title: "Roti + Paneer/Chicken + Vegetables",
    calories: 550,
    protein: 35,
    carbs: 60,
    fats: 15,
    time: "8:45 PM",
    description: "High-protein evening meal featuring 2 whole wheat rotis, grilled chicken or paneer, and sautéed beans/carrots.",
    ingredients: ["2 Whole Wheat Rotis", "120g Grilled Chicken Breast / 100g Paneer", "1 Bowl Stir-Fry Veggies"],
    logged: false
  }
];

export const FOOD_LIBRARY = [
  { id: "f-1", name: "Paneer (Cottage Cheese)", protein: 18, calories: 265, carbs: 4, fats: 20, category: "High Protein", tags: ["Indian Food", "High Protein", "Lunch", "Dinner"] },
  { id: "f-2", name: "Whole Eggs (2 units)", protein: 13, calories: 155, carbs: 1, fats: 11, category: "High Protein", tags: ["High Protein", "Breakfast", "Snacks"] },
  { id: "f-3", name: "Yellow Dal / Lentils", protein: 9, calories: 116, carbs: 20, fats: 1, category: "Indian Food", tags: ["Indian Food", "Lunch", "Dinner"] },
  { id: "f-4", name: "Chicken Breast (100g)", protein: 31, calories: 165, carbs: 0, fats: 3.6, category: "High Protein", tags: ["High Protein", "Lunch", "Dinner"] },
  { id: "f-5", name: "Rolled Oats (50g)", protein: 13, calories: 195, carbs: 33, fats: 3.5, category: "Breakfast", tags: ["Breakfast", "High Protein"] },
  { id: "f-6", name: "Banana (Medium)", protein: 1, calories: 89, carbs: 23, fats: 0.3, category: "Fruits", tags: ["Fruits", "Snacks", "Breakfast"] },
  { id: "f-7", name: "Greek Yogurt (150g)", protein: 17, calories: 130, carbs: 6, fats: 4, category: "High Protein", tags: ["High Protein", "Snacks", "Breakfast"] },
  { id: "f-8", name: "Brown Rice (1 cup cooked)", protein: 5, calories: 216, carbs: 45, fats: 1.8, category: "Lunch", tags: ["Lunch", "Dinner"] },
  { id: "f-9", name: "Almonds (20 nuts)", protein: 6, calories: 164, carbs: 6, fats: 14, category: "Snacks", tags: ["Snacks", "High Protein"] },
  { id: "f-10", name: "Fresh Spinach Salad", protein: 3, calories: 23, carbs: 3.6, fats: 0.4, category: "Vegetables", tags: ["Vegetables", "Lunch", "Dinner"] },
  { id: "f-11", name: "Whole Wheat Roti (1 pc)", protein: 3.5, calories: 120, carbs: 24, fats: 0.5, category: "Indian Food", tags: ["Indian Food", "Lunch", "Dinner"] },
  { id: "f-12", name: "Soya Chunks (30g dry)", protein: 16, calories: 105, carbs: 10, fats: 0.2, category: "High Protein", tags: ["Indian Food", "High Protein", "Vegan"] },
  { id: "f-13", name: "Whey Protein Scoop", protein: 24, calories: 120, carbs: 2, fats: 1.5, category: "High Protein", tags: ["High Protein", "Snacks"] },
  { id: "f-14", name: "Peanut Butter (2 tbsp)", protein: 8, calories: 188, carbs: 6, fats: 16, category: "Snacks", tags: ["Snacks", "Breakfast"] }
];

export const WORKOUTS = [
  {
    id: "full-body-today",
    title: "Full Body Strength",
    category: "Full Body",
    level: "Intermediate",
    duration: 25,
    calories: 220,
    tags: ["Full Body", "Intermediate", "Strength", "No Equipment"],
    rating: 4.9,
    completions: "14.2k",
    description: "An explosive total-body conditioning circuit designed to engage core stabilizers, enhance muscle endurance, and optimize metabolic burn without bulky weights.",
    featured: true,
    bannerGradient: "linear-gradient(135deg, rgba(0, 168, 255, 0.28) 0%, rgba(10, 132, 255, 0.12) 100%)",
    exercises: [
      {
        id: "ex-1",
        name: "Bodyweight Squat",
        sets: 3,
        reps: 12,
        durationSeconds: 45,
        restSeconds: 20,
        muscle: "Quadriceps, Glutes, Core",
        aiGuidance: "Keep your knees aligned with toes. Drive up through your heels.",
        tips: "Keep your chest high, engage your core, and ensure hips drop below knee level."
      },
      {
        id: "ex-2",
        name: "Push Ups",
        sets: 3,
        reps: 10,
        durationSeconds: 40,
        restSeconds: 25,
        muscle: "Chest, Triceps, Anterior Deltoids",
        aiGuidance: "Keep elbows at 45 degrees. Maintain a straight spine from neck to ankles.",
        tips: "Avoid sagging your lower back. Push the floor away at the top of the motion."
      },
      {
        id: "ex-3",
        name: "Reverse Lunges",
        sets: 3,
        reps: 10,
        durationSeconds: 45,
        restSeconds: 20,
        muscle: "Hamstrings, Glutes, Calves",
        aiGuidance: "Lower until front thigh is parallel to floor. Torso upright.",
        tips: "Step back smoothly and maintain stable foot pressure through front midfoot."
      },
      {
        id: "ex-4",
        name: "Plank Hold",
        sets: 3,
        reps: "30 sec",
        durationSeconds: 30,
        restSeconds: 20,
        muscle: "Transverse Abdominis, Obliques",
        aiGuidance: "Draw navel inward. Squeeze glutes and press forearms firmly into mat.",
        tips: "Do not let hips pike up or drop down. Breathe evenly throughout."
      },
      {
        id: "ex-5",
        name: "Mountain Climbers",
        sets: 3,
        reps: 20,
        durationSeconds: 35,
        restSeconds: 30,
        muscle: "Core, Hip Flexors, Shoulders",
        aiGuidance: "Drive knees toward chest with controlled tempo. Keep shoulders stacked over wrists.",
        tips: "Maintain a steady rhythm and keep hips stable without excessive bounce."
      }
    ]
  },
  {
    id: "full-body-starter",
    title: "Full Body Starter",
    category: "Full Body",
    level: "Beginner",
    duration: 25,
    calories: 180,
    tags: ["Beginner", "Full Body", "Foundation"],
    rating: 4.8,
    completions: "22.5k",
    description: "Gentle introduction to foundational movement patterns with built-in cadence timers and posture cues.",
    exercises: [
      { id: "s-1", name: "Glute Bridges", sets: 3, reps: 12, restSeconds: 20, muscle: "Glutes, Lower Back" },
      { id: "s-2", name: "Incline Push Ups", sets: 3, reps: 10, restSeconds: 20, muscle: "Upper Chest, Arms" },
      { id: "s-3", name: "Air Squats", sets: 3, reps: 12, restSeconds: 25, muscle: "Quads, Core" },
      { id: "s-4", name: "Deadbugs", sets: 3, reps: 12, restSeconds: 20, muscle: "Core Stability" }
    ]
  },
  {
    id: "upper-body-strength",
    title: "Upper Body Strength",
    category: "Strength",
    level: "Intermediate",
    duration: 35,
    calories: 250,
    tags: ["Strength", "Hypertrophy", "Upper Body"],
    rating: 4.95,
    completions: "18.9k",
    description: "Targeted upper torso routine focusing on chest contraction, shoulder stability, and bicep/tricep pump.",
    exercises: [
      { id: "u-1", name: "Standard Push Ups", sets: 4, reps: 12, restSeconds: 30, muscle: "Chest & Shoulders" },
      { id: "u-2", name: "Pike Push Ups", sets: 3, reps: 8, restSeconds: 30, muscle: "Deltoids & Traps" },
      { id: "u-3", name: "Doorframe Rows", sets: 4, reps: 12, restSeconds: 25, muscle: "Lats & Rhomboids" },
      { id: "u-4", name: "Tricep Chair Dips", sets: 3, reps: 14, restSeconds: 25, muscle: "Triceps Brachii" }
    ]
  },
  {
    id: "hiit-burn",
    title: "HIIT Burn & Shred",
    category: "Cardio",
    level: "Advanced",
    duration: 20,
    calories: 220,
    tags: ["HIIT", "Cardio", "Fat Burn", "High Energy"],
    rating: 4.9,
    completions: "31.0k",
    description: "High-intensity interval training designed to push VO2 max thresholds and torch calories in record time.",
    exercises: [
      { id: "h-1", name: "Burpees", sets: 4, reps: 15, restSeconds: 20, muscle: "Total Body" },
      { id: "h-2", name: "High Knees", sets: 4, reps: "30 sec", restSeconds: 15, muscle: "Cardio & Calves" },
      { id: "h-3", name: "Jumping Squats", sets: 4, reps: 12, restSeconds: 20, muscle: "Fast-Twitch Quads" },
      { id: "h-4", name: "Bicycle Crunches", sets: 3, reps: 20, restSeconds: 20, muscle: "Obliques & Rectus" }
    ]
  },
  {
    id: "core-abs-crusher",
    title: "Core & Abs Crusher",
    category: "Core",
    level: "Intermediate",
    duration: 18,
    calories: 160,
    tags: ["Core", "Abs", "Definition"],
    rating: 4.75,
    completions: "15.4k",
    description: "Intense 360-degree core workout focusing on anti-rotational strength, deep abdominal wall tone, and lower back endurance.",
    exercises: [
      { id: "c-1", name: "Hollow Body Hold", sets: 3, reps: "30 sec", restSeconds: 20, muscle: "Deep Core" },
      { id: "c-2", name: "Russian Twists", sets: 3, reps: 20, restSeconds: 20, muscle: "Obliques" },
      { id: "c-3", name: "Leg Raises", sets: 3, reps: 12, restSeconds: 20, muscle: "Lower Abs" },
      { id: "c-4", name: "Side Plank Left & Right", sets: 3, reps: "30 sec", restSeconds: 25, muscle: "Lateral Stabilizers" }
    ]
  },
  {
    id: "mobility-flow",
    title: "Mobility & Flexibility Flow",
    category: "Flexibility",
    level: "Beginner",
    duration: 20,
    calories: 110,
    tags: ["Recovery", "Flexibility", "Joint Health"],
    rating: 4.88,
    completions: "9.8k",
    description: "Gentle joint decompression, hip opening, and spinal articulation to accelerate recovery and reduce stiffness.",
    exercises: [
      { id: "m-1", name: "Cat-Cow Dynamic Stretch", sets: 3, reps: 10, restSeconds: 15, muscle: "Thoracic Spine" },
      { id: "m-2", name: "World's Greatest Stretch", sets: 3, reps: 6, restSeconds: 20, muscle: "Hips, Groin & Thoracic" },
      { id: "m-3", name: "Pigeon Pose", sets: 2, reps: "45 sec", restSeconds: 15, muscle: "Gluteus Medius & Piriformis" },
      { id: "m-4", name: "Downward Facing Dog", sets: 3, reps: "30 sec", restSeconds: 15, muscle: "Hamstrings & Shoulders" }
    ]
  },
  {
    id: "home-power",
    title: "Home Calisthenics Power",
    category: "Home",
    level: "Advanced",
    duration: 30,
    calories: 270,
    tags: ["Home", "Calisthenics", "Advanced"],
    rating: 4.92,
    completions: "11.2k",
    description: "Athletic bodyweight mastery session testing balance, kinetic chain coordination, and maximum tension.",
    exercises: [
      { id: "p-1", name: "Archer Push Ups", sets: 3, reps: 8, restSeconds: 30, muscle: "Chest & Scapula" },
      { id: "p-2", name: "Pistol Squat Progression", sets: 3, reps: 6, restSeconds: 35, muscle: "Unilateral Leg Strength" },
      { id: "p-3", name: "L-Sit Tucks", sets: 3, reps: "20 sec", restSeconds: 30, muscle: "Core & Hip Flexors" },
      { id: "p-4", name: "Wall Walk Handstand Hold", sets: 3, reps: "25 sec", restSeconds: 40, muscle: "Shoulders & Core" }
    ]
  }
];

export const AI_COACH_DATA = {
  heroTitle: "Start Camera-Guided Workout",
  heroSubtitle: "Real-time posture feedback powered by FitNexus Computer Vision",
  todayRecommendation: "Your recovery looks good. Try a moderate full-body workout today.",
  recommendationDetails: "Based on your 78 BPM resting heart rate and 7h 45m deep sleep detected by your smartwatch, your muscle readiness is 92%. A 20–25 minute full-body session is optimal today.",
  recentAnalyses: [
    { exercise: "Squats", score: 86, status: "Good Form", date: "Today, 10:15 AM", feedback: "Knee alignment 98%, spine angle 84%" },
    { exercise: "Push Ups", score: 91, status: "Excellent", date: "Yesterday", feedback: "Perfect 45-degree elbow path" },
    { exercise: "Lunges", score: 84, status: "Needs Minor Focus", date: "2 days ago", feedback: "Front knee tended forward by 3cm" }
  ],
  weeklyInsight: "Your posture consistency improved by 12% this week.",
  liveAnalysisMock: {
    exercise: "Bodyweight Squat",
    poseDetected: true,
    fps: 30,
    metrics: [
      { label: "Knee Position", status: "GOOD ✓", state: "good", detail: "Tracking over second toe" },
      { label: "Back Position", status: "IMPROVE ⚠", state: "warning", detail: "Slight forward torso tilt (34°)" },
      { label: "Depth", status: "GOOD ✓", state: "good", detail: "Parallel to floor (92°)" }
    ],
    formScore: 86,
    liveFeedbacks: [
      "Keep your back straight and slightly lower your hips.",
      "Great knee alignment. Keep going!",
      "Chest elevated — excellent rep rhythm!"
    ]
  }
};

export const PROGRESS_DATA = {
  weeklyWorkoutsChart: [
    { day: "Mon", calories: 380, minutes: 35, done: true },
    { day: "Tue", calories: 420, minutes: 40, done: true },
    { day: "Wed", calories: 310, minutes: 28, done: true },
    { day: "Thu", calories: 500, minutes: 45, done: true },
    { day: "Fri", calories: 440, minutes: 38, done: true },
    { day: "Sat", calories: 430, minutes: 35, done: true },
    { day: "Sun", calories: 0, minutes: 0, done: false, isToday: true }
  ],
  monthlyWorkoutsChart: [
    { day: "Week 1", calories: 2350, minutes: 210, done: true },
    { day: "Week 2", calories: 2580, minutes: 240, done: true },
    { day: "Week 3", calories: 2480, minutes: 225, done: true },
    { day: "Week 4", calories: 2750, minutes: 260, done: true }
  ],
  achievements: [
    { id: "ach-1", title: "7 Day Streak", icon: "🔥", desc: "Completed training 7 consecutive days", unlocked: true, date: "Unlocked today" },
    { id: "ach-2", title: "10 Workouts", icon: "💪", desc: "Reached your first double-digit workout milestone", unlocked: true, date: "Unlocked 2d ago" },
    { id: "ach-3", title: "2,500 Calories", icon: "🔥", desc: "Torched 2,500 total active kilocalories", unlocked: true, date: "Unlocked this week" },
    { id: "ach-4", title: "Early Bird", icon: "⚡", desc: "Finished a guided workout before 8:00 AM", unlocked: true, date: "Unlocked 3d ago" },
    { id: "ach-5", title: "AI Perfectionist", icon: "🎯", desc: "Achieved >90% posture score in 3 sessions", unlocked: false, date: "In Progress (2/3)" },
    { id: "ach-6", title: "Iron Core", icon: "🛡️", desc: "Accumulate 15 minutes of cumulative plank hold", unlocked: false, date: "In Progress (9/15m)" }
  ]
};

export const NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Your workout is waiting 💪",
    body: "Today's Full Body session is ready. 25 min to hit your daily goal.",
    time: "10m ago",
    unread: true,
    action: "start_workout"
  },
  {
    id: "notif-2",
    title: "Your 7-day streak is active 🔥",
    body: "Phenomenal momentum! Complete today's session to extend to 8 days.",
    time: "2h ago",
    unread: true,
    action: "view_progress"
  },
  {
    id: "notif-3",
    title: "Smartwatch synced successfully ✓",
    body: "Heart rate (78 BPM) and 4,820 steps updated from FitPulse Apex.",
    time: "5m ago",
    unread: false,
    action: "open_wearable"
  },
  {
    id: "notif-4",
    title: "New AI recommendation available 🤖",
    body: "Recovery readiness computed: Moderate load optimal for peak hypertrophy.",
    time: "3h ago",
    unread: false,
    action: "open_ai_coach"
  }
];
