// Workout Types:

type StrengthWorkout = {
  type: string;
  id: number;
  name: string;
  muscle: string;
  infoLink: string;
  notes: string;
};

type CardioWorkout = {
  type: string;
  id: number;
  name: string;
  duration: number;
  distance?: number;
  infoLink: string;
  notes: string;
};

type StretchWorkout = {
  type: string;
  id: number;
  name: string;
  duration: number;
  difficulty: string;
  infoLink: string;
  notes: string;
};
type UserWorkout = StrengthWorkout | CardioWorkout | StretchWorkout;
