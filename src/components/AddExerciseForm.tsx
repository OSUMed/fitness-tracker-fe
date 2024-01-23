import React from "react";
import { Select, TextField, Box, Flex, Button, Text } from "@radix-ui/themes";
import { Exercise, ExerciseType } from "../types/workoutTypes";
import axios from "axios";
import { CheckIcon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";

type AddExerciseFormProps = {
  exerciseName: string;
  setExerciseName: React.Dispatch<React.SetStateAction<string>>;
  handleSetAddForm: (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
    index: number
  ) => void;
  addSetToCurrentWorkout: () => void;
  removeLastSetFromCurrentWorkout: () => void;
  currentExercise: Exercise | null;
  addExerciseToDaysWorkout: (event: React.FormEvent<HTMLFormElement>) => void;
  selectedWorkoutType: ExerciseType | null;
  handleSelectWorkoutType: (value: ExerciseType) => void;
  handleExerciseNameAddForm: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const AddExerciseForm: React.FC<AddExerciseFormProps> = ({
  handleSetAddForm,
  addSetToCurrentWorkout,
  removeLastSetFromCurrentWorkout,
  currentExercise,
  addExerciseToDaysWorkout,
  selectedWorkoutType,
  handleSelectWorkoutType,
  handleExerciseNameAddForm,
  exerciseName,
}) => {
  return (
    <Flex direction="column" gap="2">
      <form onSubmit={addExerciseToDaysWorkout}>
        <Box className="space-y-3 mb-4">
          <Select.Root
            size="3"
            value={selectedWorkoutType ?? ""}
            onValueChange={(value) => {
              handleSelectWorkoutType(value as ExerciseType);
            }}
          >
            <Select.Trigger
              placeholder="Pick A Workout Type"
              variant="surface"
            />
            <Select.Content variant="solid" position="popper" sideOffset={2}>
              <Select.Group>
                <Select.Label>Workout Types</Select.Label>
                {Object.values(ExerciseType).map((type) => (
                  <Select.Item
                    key={type}
                    value={type}
                    className="focus:bg-yellow-400"
                  >
                    {type}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>

          <TextField.Input
            placeholder="Exercise Name"
            value={exerciseName}
            onChange={(e) => handleExerciseNameAddForm(e)}
          />
        </Box>
        {currentExercise?.sets.map((item, index) => (
          <div key={index}>
            <h3>Set {index + 1}</h3>
            {Object.keys(item)
              .filter((key) => key !== "id")
              .map((key) => (
                <TextField.Input
                  key={key}
                  placeholder={`${key}`}
                  onChange={(e) => handleSetAddForm(e, key, index)}
                />
              ))}
          </div>
        ))}
        <Button
          type="button"
          variant="solid"
          color="green"
          onClick={addSetToCurrentWorkout}
        >
          <PlusIcon aria-hidden="true" /> Add Set
        </Button>
        <Button
          type="button"
          variant="soft"
          color="orange"
          onClick={removeLastSetFromCurrentWorkout}
        >
          <MinusIcon aria-hidden="true" />
          Delete Last Set
        </Button>
        <Box className="mt-3 ">
          <Button
            variant="solid"
            color="teal"
            type="submit"
            // onClick={addExerciseToDaysWorkout}
            size="4"
            className="shadow-md items-center flex justify-center"
          >
            {" "}
            <CheckIcon width="19" height="19" aria-hidden="true" />
            <Text className="font-medium">Finish Exercise</Text>
          </Button>
        </Box>
      </form>
    </Flex>
  );
};
