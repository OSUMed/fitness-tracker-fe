import React, { useState } from "react";

import { CaretDownIcon } from "@radix-ui/react-icons";
import { Flex, TextField, Select } from "@radix-ui/themes";

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

enum WorkoutType {
  Strength = "Strength",
  Cardio = "Cardio",
  Stretch = "Stretch",
}

type Workout = Strength | Cardio | Stretch;

type AllWorkout = Workout[];

const AddWorkout = () => {
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [selectedWorkoutType, setSelectedWorkoutType] =
    useState<WorkoutType | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);

  return (
    <div>
      <Select.Root
        size="3"
        value={selectedWorkoutType ?? ""}
        onValueChange={(value) => setSelectedWorkoutType(value as WorkoutType)}
      >
        <Select.Trigger
          placeholder="Pick A Workout Type"
          variant="classic"
          radius="full"
        />
        <Select.Content>
          <Select.Group>
            <Select.Label>Workout Types</Select.Label>
            {Object.values(WorkoutType).map((type) => (
              <Select.Item key={type} value={type}>
                {type}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  );
};

export default AddWorkout;
