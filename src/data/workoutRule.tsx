type WorkoutRule = {
  type: string;
  fields: {
    sets: boolean;
    reps: boolean;
    weight: boolean;
    duration: boolean;
    distance: boolean;
    notes: boolean;
  };
};
export type { WorkoutRule };
