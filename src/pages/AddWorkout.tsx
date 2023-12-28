import React from "react";

type StrengthSet = {
  reps: string;
  weight: string;
};

type CardioSet = {
  distance: string;
};

type StretchSet = {
  seconds: string;
};

type Strength = {
  type: "Strength";
  exercise_name: string;
  sets: StrengthSet[];
};

type Cardio = {
  type: "Cardio";
  exercise_name: string;
  sets: CardioSet[];
};

type Stretch = {
  type: "Stretch";
  exercise_name: string;
  sets: StretchSet[];
};

type Workout = Strength | Cardio | Stretch;

type AllWorkout = Workout[];

const AddWorkout = () => {
  return <div>AddWorkout</div>;
};

export default AddWorkout;
