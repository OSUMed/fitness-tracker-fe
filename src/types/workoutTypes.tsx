export type StrengthSet = {
  reps: string;
  weight: string;
};

export type CardioSet = {
  distance: string;
};

export type StretchSet = {
  seconds: string;
};

export type Strength = {
  type: "strength";
  exercise_name: string;
  sets: StrengthSet[];
};

export type Cardio = {
  type: "cardio";
  exercise_name: string;
  sets: CardioSet[];
};

export type Stretch = {
  type: "stretch";
  exercise_name: string;
  sets: StretchSet[];
};

export type WorkoutSummary = {
  id: string;
  date: number;
  summaryDetails: string;
};
export type Workout = Strength | Cardio | Stretch;

export type AllWorkout = Workout[];

export interface WorkoutSetDataStructure {
  [key: string]: string;
}
export interface workoutFinal {
  id: string;
  date: number;
  workouts: Workout[];
}
