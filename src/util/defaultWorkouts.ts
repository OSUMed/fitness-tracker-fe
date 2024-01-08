import { Exercise } from "../types/workoutTypes";

export const defaultWorkouts: Exercise[] = [
  {
    type: "Cardio",
    exercise_name: "Running",
    sets: [{ distance: "5 km" }],
  },
  {
    type: "Stretch",
    exercise_name: "Yoga",
    sets: [{ seconds: "1800" }],
  },
  {
    type: "Strength",
    exercise_name: "Deadlift",
    sets: [
      { reps: "8", weight: "185 lbs" },
      { reps: "6", weight: "205 lbs" },
    ],
  },
  {
    type: "Cardio",
    exercise_name: "Cycling",
    sets: [{ distance: "20 km" }],
  },
];
