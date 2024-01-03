// Workout Types:
type WorkoutProps = {
  workout: UserWorkout;
};

type AlgoExercise = {
  name: string;
  muscle: string;
  infoLink: string;
};

type StrengthWorkout = {
  name: string;
  muscle: string;
  infoLink: string;
  notes: string;
};

type CardioWorkout = {
  name: string;
  duration: number;
  distance?: number;
  intensity: string;
  infoLink: string;
  notes: string;
};

type StretchWorkout = {
  name: string;
  duration: number;
  difficulty: string;
  infoLink: string;
  notes: string;
};
type UserWorkout = StrengthWorkout | CardioWorkout | StretchWorkout;
