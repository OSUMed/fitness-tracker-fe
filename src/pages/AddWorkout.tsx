import React, { useState } from "react";

import { CaretDownIcon } from "@radix-ui/react-icons";
import { Flex, Select, TextField, Box } from "@radix-ui/themes";

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

const StrengthForm = () => (
  <Flex direction="column" gap="2">
    <TextField.Input placeholder="Exercise Name" />
    <TextField.Input placeholder="Reps" />
    <TextField.Input placeholder="Weight" />
    {/* Add more fields as needed */}
  </Flex>
);

const CardioForm = () => (
  <Flex direction="column" gap="2">
    <TextField.Input placeholder="Exercise Name" />
    <TextField.Input placeholder="Distance" />
    {/* Add more fields as needed */}
  </Flex>
);

const StretchForm = () => (
  <Flex direction="column" gap="2">
    <TextField.Input placeholder="Exercise Name" />
    <TextField.Input placeholder="Seconds" />
    {/* Add more fields as needed */}
  </Flex>
);

const AddWorkout = () => {
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [selectedWorkoutType, setSelectedWorkoutType] =
    useState<WorkoutType | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);

  let workoutForm;
  switch (selectedWorkoutType) {
    case WorkoutType.Strength:
      workoutForm = <StrengthForm />;
      break;
    case WorkoutType.Cardio:
      workoutForm = <CardioForm />;
      break;
    case WorkoutType.Stretch:
      workoutForm = <StretchForm />;
      break;
    default:
      workoutForm = <div>Please select a workout type</div>;
  }

  return (
    <div className="max-w-sm ">
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
      <Box className="mt-3">{workoutForm}</Box>
    </div>
  );
};

export default AddWorkout;
