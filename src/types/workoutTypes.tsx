import { Dispatch, SetStateAction } from "react";

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
export interface UpdateWorkoutButtonProps {
  index: number;
  onUpdate: (index: number) => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingRowIndex: Dispatch<SetStateAction<number | null>>;
}

export interface WorkoutSetDataStructure {
  [key: string]: string;
}
export interface StaticWorkoutRowProps {
  key: React.Key;
  workout: Exercise;
  index: number;
  recordTodaysWorkout: TodaysWorkout;
  editingRowIndex: number | null;
  startRowEditProcess: (index: number) => void;
  handleDeleteExercise: (index: number) => void;
}
export interface EditableWorkoutRowProps {
  workout: Exercise;
  index: number;
  recordTodaysWorkout: TodaysWorkout;
  editableRowData: Exercise | null;
  editingRowIndex: number | null;
  handleUpdateExerciseName: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleUpdateExerciseSet: (
    event: React.ChangeEvent<HTMLInputElement>,
    setAttribute: string,
    setIndex: number
  ) => void;
  isEditing: boolean;
  UpdateWorkoutButton: React.ComponentType<UpdateWorkoutButtonProps>;
  DeleteWorkoutButton: React.ComponentType<DeleteWorkoutButtonProps>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingRowIndex: Dispatch<SetStateAction<number | null>>;
  handleUpdateExercise: (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => void;
  handleDeleteExercise: (index: number) => void;
}
export interface EditWorkoutButtonProps {
  startRowEditProcess: (index: number) => void;
  index: number;
}
export type WorkoutSummaryMobileViewProps = {
  index: number;
  workout: Exercise;
  editingRowIndex: number | null;
  editableRowData: Exercise | undefined;
  handleUpdateExerciseName: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleUpdateExerciseSet: (
    event: React.ChangeEvent<HTMLInputElement>,
    setAttribute: string,
    setIndex: number
  ) => void;
};
