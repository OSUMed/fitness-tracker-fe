import { WorkoutRule } from "./workoutRule";

const workoutRules: WorkoutRule[] = [
  {
    type: "stretch-based",
    fields: {
      sets: false,
      reps: false,
      weight: false,
      duration: false,
      distance: true,
      notes: false,
    },
  },
  {
    type: "cardiovascular_endurance",
    fields: {
      sets: false,
      reps: false,
      weight: false,
      duration: true,
      distance: true,
      notes: false,
    },
  },
  {
    type: "hiit",
    fields: {
      sets: true,
      reps: true,
      weight: true,
      duration: true,
      distance: false,
      notes: false,
    },
  },
  {
    type: "strength_training",
    fields: {
      sets: true,
      reps: true,
      weight: true,
      duration: false,
      distance: false,
      notes: false,
    },
  },
  {
    type: "yoga_pilates",
    fields: {
      sets: false,
      reps: false,
      weight: false,
      duration: true,
      distance: false,
      notes: true,
    },
  },
  {
    type: "functional_fitness",
    fields: {
      sets: true,
      reps: true,
      weight: true,
      duration: false,
      distance: false,
      notes: false,
    },
  },
  {
    type: "sports_specific_training",
    fields: {
      sets: true,
      reps: true,
      weight: true,
      duration: true,
      distance: true,
      notes: true,
    },
  },
  {
    type: "mobility_flexibility",
    fields: {
      sets: false,
      reps: false,
      weight: false,
      duration: false,
      distance: false,
      notes: true,
    },
  },
  {
    type: "mind_body_tai_chi",
    fields: {
      sets: false,
      reps: false,
      weight: false,
      duration: false,
      distance: false,
      notes: true,
    },
  },
];

export { workoutRules };
