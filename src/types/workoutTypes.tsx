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
  exerciseName: string;
  type: ExerciseType;
  sets: ExerciseSet[];
}

export type Strength = {
  exerciseId: number;
  type: "Strength";
  exerciseName: string;
  sets: StrengthSet[];
};

export type Cardio = {
  exerciseId: number;
  type: "Cardio";
  exerciseName: string;
  sets: CardioSet[];
};

export type Stretch = {
  exerciseId: number;
  type: "Stretch";
  exerciseName: string;
  sets: StretchSet[];
};
export type StrengthSet = {
  id: number;
  reps: string;
  weight: string;
};

export type CardioSet = {
  id: number;
  distance: string;
};

export type StretchSet = {
  id: number | null;
  seconds: string;
};

export type WorkoutSummary = {
  id: string;
  date: string;
  summaryDetails: string;
};
export interface TodaysWorkout {
  id: string;
  date: string;
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
export interface StaticExerciseRowProps {
  key: React.Key;
  workout: Exercise;
  index: number;
  recordTodaysWorkout: TodaysWorkout;
  editingRowIndex: number | null;
  startRowEditProcess: (index: number) => void;
  handleDeleteExercise: (index: number) => void;
}
export interface EditableExerciseRowProps {
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
    index: number,
    event?: React.MouseEvent<HTMLButtonElement>
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
  handleUpdateExercise: (
    index: number,
    event?: React.MouseEvent<HTMLButtonElement>
  ) => void;
  handleUpdateExerciseName: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleUpdateExerciseSet: (
    event: React.ChangeEvent<HTMLInputElement>,
    setAttribute: string,
    setIndex: number
  ) => void;
};
