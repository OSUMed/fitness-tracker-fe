export type AllExercise = Exercise[];
export type Exercise = Strength | Cardio | Stretch;
export type ExerciseSet = StrengthSet | CardioSet | StretchSet;
export enum ExerciseType {
  Strength = "Strength",
  Cardio = "Cardio",
  Stretch = "Stretch",
}
export interface EditableRowData {
  exercise_name: string;
  type: ExerciseType;
  sets: ExerciseSet[];
}

export type Strength = {
  type: "Strength";
  exercise_name: string;
  sets: StrengthSet[];
};

export type Cardio = {
  type: "Cardio";
  exercise_name: string;
  sets: CardioSet[];
};

export type Stretch = {
  type: "Stretch";
  exercise_name: string;
  sets: StretchSet[];
};
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

export type WorkoutSummary = {
  id: string;
  date: number;
  summaryDetails: string;
};
export interface TodaysWorkout {
  id: string;
  date: number;
  workouts: AllExercise;
}

export interface DeleteWorkoutButtonProps {
  index: number;
  onDelete: (index: number) => void;
}
