const dummyStrengthWorkouts: UserWorkout[] = [
  {
    name: "Bench Press",
    muscle: "Chest",
    infoLink: "https://example.com/strength/benchpress",
    notes: "Flat bench barbell press, 3 sets of 10 reps",
  },
  {
    name: "Deadlift",
    muscle: "Back",
    infoLink: "https://example.com/strength/deadlift",
    notes: "Traditional barbell deadlift, 4 sets of 6 reps",
  },
  {
    name: "Squats",
    muscle: "Legs",
    infoLink: "https://example.com/strength/squats",
    notes: "Barbell back squat, 3 sets of 8 reps",
  },
  {
    name: "Shoulder Press",
    muscle: "Shoulders",
    infoLink: "https://example.com/strength/shoulderpress",
    notes: "Dumbbell shoulder press, 3 sets of 12 reps",
  },
  {
    name: "Bicep Curls",
    muscle: "Biceps",
    infoLink: "https://example.com/strength/bicepcurls",
    notes: "Dumbbell bicep curls, 3 sets of 15 reps",
  },
];

const dummyCardioWorkouts: UserWorkout[] = [
  {
    name: "Running",
    duration: 30,
    distance: 5,
    intensity: "high",
    infoLink: "https://example.com/cardio/running",
    notes: "Outdoor running at a steady pace",
  },
  {
    name: "Cycling",
    duration: 45,
    distance: 15,
    intensity: "medium",
    infoLink: "https://example.com/cardio/cycling",
    notes: "Stationary bike cycling",
  },
  {
    name: "Swimming",
    duration: 60,
    distance: 2,
    intensity: "low",
    infoLink: "https://example.com/cardio/swimming",
    notes: "Lap swimming at a moderate pace",
  },
  {
    name: "Rowing",
    duration: 20,
    distance: null,
    intensity: "high",
    infoLink: "https://example.com/cardio/rowing",
    notes: "Indoor rowing machine workout",
  },
  {
    name: "Jump Rope",
    duration: 15,
    distance: null,
    intensity: "high",
    infoLink: "https://example.com/cardio/jumprope",
    notes: "High-intensity jump rope session",
  },
];

const dummyStretchWorkouts: UserWorkout[] = [
  {
    name: "Yoga",
    duration: 60,
    difficulty: "medium",
    infoLink: "https://example.com/stretch/yoga",
    notes: "Hatha yoga session for flexibility",
  },
  {
    name: "Pilates",
    duration: 45,
    difficulty: "hard",
    infoLink: "https://example.com/stretch/pilates",
    notes: "Pilates workout focusing on core strength",
  },
  {
    name: "Dynamic Stretching",
    duration: 20,
    difficulty: "easy",
    infoLink: "https://example.com/stretch/dynamicstretching",
    notes: "Pre-workout dynamic stretches for all major muscle groups",
  },
  {
    name: "Static Stretching",
    duration: 30,
    difficulty: "easy",
    infoLink: "https://example.com/stretch/staticstretching",
    notes: "Post-workout static stretching for muscle recovery",
  },
  {
    name: "Foam Rolling",
    duration: 15,
    difficulty: "medium",
    infoLink: "https://example.com/stretch/foamrolling",
    notes: "Foam rolling for myofascial release and muscle relaxation",
  },
];

// Combine all dummy workouts
export const allDummyWorkouts: UserWorkout[] = [
  ...dummyStrengthWorkouts,
  ...dummyCardioWorkouts,
  ...dummyStretchWorkouts,
];
