import { v4 as uuidv4 } from "uuid";

const dummyStrengthWorkouts = [
  {
    id: uuidv4(),
    name: "Bench Press",
    muscle: "Chest",
    infoLink: "https://example.com/strength/benchpress",
    notes: "Flat bench barbell press, 3 sets of 10 reps",
    type: "strength",
  },
  {
    id: uuidv4(),
    name: "Deadlift",
    muscle: "Back",
    infoLink: "https://example.com/strength/deadlift",
    notes: "Traditional barbell deadlift, 4 sets of 6 reps",
    type: "strength",
  },
  {
    id: uuidv4(),
    name: "Squats",
    muscle: "Legs",
    infoLink: "https://example.com/strength/squats",
    notes: "Barbell back squat, 3 sets of 8 reps",
    type: "strength",
  },
  {
    id: uuidv4(),
    name: "Shoulder Press",
    muscle: "Shoulders",
    infoLink: "https://example.com/strength/shoulderpress",
    notes: "Dumbbell shoulder press, 3 sets of 12 reps",
    type: "strength",
  },
  {
    id: uuidv4(),
    name: "Bicep Curls",
    muscle: "Biceps",
    infoLink: "https://example.com/strength/bicepcurls",
    notes: "Dumbbell bicep curls, 3 sets of 15 reps",
    type: "strength",
  },
];

const dummyCardioWorkouts = [
  {
    id: uuidv4(),
    name: "Running",
    duration: 30,
    distance: 5,
    intensity: "high",
    infoLink: "https://example.com/cardio/running",
    notes: "Outdoor running at a steady pace",
    type: "cardio",
  },
  {
    id: uuidv4(),
    name: "Cycling",
    duration: 45,
    distance: 15,
    intensity: "medium",
    infoLink: "https://example.com/cardio/cycling",
    notes: "Stationary bike cycling",
    type: "cardio",
  },
  {
    id: uuidv4(),
    name: "Swimming",
    duration: 60,
    distance: 2,
    intensity: "low",
    infoLink: "https://example.com/cardio/swimming",
    notes: "Lap swimming at a moderate pace",
    type: "cardio",
  },
  {
    id: uuidv4(),
    name: "Rowing",
    duration: 20,
    distance: null,
    intensity: "high",
    infoLink: "https://example.com/cardio/rowing",
    notes: "Indoor rowing machine workout",
    type: "cardio",
  },
  {
    id: uuidv4(),
    name: "Jump Rope",
    duration: 15,
    distance: null,
    intensity: "high",
    infoLink: "https://example.com/cardio/jumprope",
    notes: "High-intensity jump rope session",
    type: "cardio",
  },
];

const dummyStretchWorkouts = [
  {
    id: uuidv4(),
    name: "Yoga",
    duration: 60,
    difficulty: "medium",
    infoLink: "https://example.com/stretch/yoga",
    notes: "Hatha yoga session for flexibility",
    type: "stretch",
  },
  {
    id: uuidv4(),
    name: "Pilates",
    duration: 45,
    difficulty: "hard",
    infoLink: "https://example.com/stretch/pilates",
    notes: "Pilates workout focusing on core strength",
    type: "stretch",
  },
  {
    id: uuidv4(),
    name: "Dynamic Stretching",
    duration: 20,
    difficulty: "easy",
    infoLink: "https://example.com/stretch/dynamicstretching",
    notes: "Pre-workout dynamic stretches for all major muscle groups",
    type: "stretch",
  },
  {
    id: uuidv4(),
    name: "Static Stretching",
    duration: 30,
    difficulty: "easy",
    infoLink: "https://example.com/stretch/staticstretching",
    notes: "Post-workout static stretching for muscle recovery",
    type: "stretch",
  },
  {
    id: uuidv4(),
    name: "Foam Rolling",
    duration: 15,
    difficulty: "medium",
    infoLink: "https://example.com/stretch/foamrolling",
    notes: "Foam rolling for myofascial release and muscle relaxation",
    type: "stretch",
  },
];

export const allDummyWorkouts = [
  ...dummyStrengthWorkouts,
  ...dummyCardioWorkouts,
  ...dummyStretchWorkouts,
];
