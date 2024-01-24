// Workout Types:
export type AlgoExercise = {
  name: string;
  muscle: string;
  infoLink: string;
};

export type StrengthWorkout = {
  type: string;
  id: number;
  name: string;
  muscle: string;
  infoLink: string;
  notes: string;
};

export type CardioWorkout = {
  type: string;
  id: number;
  name: string;
  duration: number;
  distance?: number;
  infoLink: string;
  notes: string;
};

export type StretchWorkout = {
  type: string;
  id: number;
  name: string;
  duration: number;
  difficulty: string;
  infoLink: string;
  notes: string;
};
export type UserWorkout = StrengthWorkout | CardioWorkout | StretchWorkout;

export type WorkoutProps = {
  workout: UserWorkout;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
};

export type CardioDatabaseFormProps = {
  cardioForm: CardioWorkout;
  setCardioForm: React.Dispatch<React.SetStateAction<CardioWorkout>>;
};

export type StretchDatabaseFormProps = {
  stretchForm: StretchWorkout;
  setStretchForm: React.Dispatch<React.SetStateAction<StretchWorkout>>;
};

export type StrengthDatabaseFormProps = {
  strengthForm: StrengthWorkout;
  setStrengthForm: React.Dispatch<React.SetStateAction<StrengthWorkout>>;
  setExerciseList: React.Dispatch<React.SetStateAction<AlgoExercise[]>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  chosenExercise: AlgoExercise | undefined;
};

export type StrengthExerciseSearchResultsProps = {
  handleExerciseClick: (exercise: AlgoExercise) => void;
  currentExercises: AlgoExercise[];
  exerciseList: AlgoExercise[];
  handlePageClick: (data: { selected: number }) => void;
  exercisesPerPage: number;
};

export type SearchViewUpdateExerciseDatabaseProps = {
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
  clearFilters: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  sliderRef: React.RefObject<HTMLDivElement>;
  filteredWorkouts: UserWorkout[];
  searchQuery: string;
  filter: string;
  updateDatabaseWorkout: (id: string) => void;
  deleteDatabaseWorkout: (exerciseDetailId: string) => void;
};

export type WorkoutUpdateModalProps = {
  workout: UserWorkout; // Replace with your actual type for a workout
  onSaveUpdatedWorkout: (updatedWorkout: UserWorkout) => void;
  onCancel: () => void;
};
