import React, { useState } from "react";
import { Flex, Select, TextField, Box, Button, Table } from "@radix-ui/themes";
import { v4 as uuidv4 } from "uuid";
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

interface WorkoutSetDataStructure {
  [key: string]: string;
}
interface workoutFinal {
  id: string;
  date: number;
  workouts: Workout[];
}
const AddWorkout = () => {
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);

  const [recordWorkout, setRecordWorkout] = useState<workoutFinal>({
    id: uuidv4(),
    date: Date.now(),
    workouts: allWorkouts,
  });
  const [selectedWorkoutType, setSelectedWorkoutType] =
    useState<WorkoutType | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [exerciseName, setExerciseName] = useState<string>("");

  const handleSelectWorkoutType = (type: WorkoutType) => {
    setSelectedWorkoutType(type);

    // Initialize a new workout when a type is selected
    if (type === WorkoutType.Strength) {
      setCurrentWorkout({
        type,
        exercise_name: "",
        sets: [{ reps: "", weight: "" }],
      });
    } else if (type === WorkoutType.Cardio) {
      setCurrentWorkout({ type, exercise_name: "", sets: [{ distance: "" }] });
    } else if (type === WorkoutType.Stretch) {
      setCurrentWorkout({ type, exercise_name: "", sets: [{ seconds: "" }] });
    }
  };

  const addSetToCurrentWorkout = () => {
    if (!currentWorkout) return;

    let newSet: StrengthSet | CardioSet | StretchSet;
    let updatedStrengthSets: StrengthSet[];
    let updatedCardioSets: CardioSet[];
    let updatedStretchSets: StretchSet[];

    switch (currentWorkout.type) {
      case WorkoutType.Strength:
        newSet = { reps: "", weight: "" } as StrengthSet;
        updatedStrengthSets = [
          ...(currentWorkout.sets as StrengthSet[]),
          newSet,
        ];
        setCurrentWorkout({
          ...currentWorkout,
          sets: updatedStrengthSets,
        });
        break;
      case WorkoutType.Cardio:
        newSet = { distance: "" } as CardioSet;
        updatedCardioSets = [...(currentWorkout.sets as CardioSet[]), newSet];
        setCurrentWorkout({
          ...currentWorkout,
          sets: updatedCardioSets,
        });
        break;
      case WorkoutType.Stretch:
        newSet = { seconds: "" } as StretchSet;
        updatedStretchSets = [...(currentWorkout.sets as StretchSet[]), newSet];
        setCurrentWorkout({
          ...currentWorkout,
          sets: updatedStretchSets,
        });
        break;
      default:
        throw new Error("Unsupported workout type");
    }
  };

  const handleAddWorkout = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
    index: number
  ) => {
    if (!currentWorkout) {
      return;
    }

    const updatedSets = currentWorkout.sets ? [...currentWorkout.sets] : [];
    const setValue = e.target.value;

    if (updatedSets[index]) {
      (updatedSets[index] as WorkoutSetDataStructure)[key] = setValue;
    }

    let updatedWorkout: Workout;

    switch (currentWorkout.type) {
      case WorkoutType.Strength:
        updatedWorkout = {
          ...currentWorkout,
          sets: updatedSets as StrengthSet[],
        } as Strength;
        break;
      case WorkoutType.Cardio:
        updatedWorkout = {
          ...currentWorkout,
          sets: updatedSets as CardioSet[],
        } as Cardio;
        break;
      case WorkoutType.Stretch:
        updatedWorkout = {
          ...currentWorkout,
          sets: updatedSets as StretchSet[],
        } as Stretch;
        break;
      default:
        throw new Error("Invalid workout type");
    }

    setCurrentWorkout(updatedWorkout);
  };
  const handleAddExerciseName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentWorkout) {
      return;
    }
    const setValue = e.target.value;
    console.log("new exercise name is: ", setValue);
    setCurrentWorkout({ ...currentWorkout, exercise_name: setValue });
  };

  const addWorkoutToAllWorkouts = () => {
    if (!currentWorkout) {
      console.log(
        "addWorkoutToAllWorkouts: currentWorkout is empty, returning"
      );
      return;
    }

    if (!currentWorkout.exercise_name) {
      console.log("addWorkoutToAllWorkouts: exerciseName is empty, returning");
      return;
    }

    if (!selectedWorkoutType) {
      console.log(
        "addWorkoutToAllWorkouts: selectedWorkoutType is empty, returning"
      );
      return;
    }

    const isAnySetFieldEmpty = currentWorkout.sets.some((set) =>
      Object.values(set).some((value) => value === "")
    );

    if (isAnySetFieldEmpty) {
      console.log("addWorkoutToAllWorkouts: sets is empty, returning");
      return;
    }

    console.log("exerciseName is: ", exerciseName);
    console.log("currentWorkout.sets.length is: ", currentWorkout.sets.length);

    setAllWorkouts([...allWorkouts, currentWorkout]);
    setCurrentWorkout(null);
    setSelectedWorkoutType(null);
    setExerciseName("");
  };
  const printCurrentWorkout = () => {
    console.log("All workouts are: ", allWorkouts);
  };

  function deleteLastWorkoutSet(): void {
    if (!currentWorkout) {
      return;
    }

    const updatedSets = currentWorkout.sets
      ? [...currentWorkout.sets]
      : ([] as WorkoutSetDataStructure[]);

    updatedSets.pop();

    let updatedWorkout: Workout;

    switch (currentWorkout.type) {
      case WorkoutType.Strength:
        updatedWorkout = {
          ...currentWorkout,
          sets: updatedSets as StrengthSet[],
        } as Strength;
        break;
      case WorkoutType.Cardio:
        updatedWorkout = {
          ...currentWorkout,
          sets: updatedSets as CardioSet[],
        } as Cardio;
        break;
      case WorkoutType.Stretch:
        updatedWorkout = {
          ...currentWorkout,
          sets: updatedSets as StretchSet[],
        } as Stretch;
        break;
      default:
        throw new Error("Invalid workout type");
    }

    setCurrentWorkout(updatedWorkout);
  }

  return (
    <div className="w-full max-w ">
      <Flex justify="center" gap="7">
        <Box>
          <Select.Root
            size="3"
            value={selectedWorkoutType ?? ""}
            onValueChange={(value) =>
              handleSelectWorkoutType(value as WorkoutType)
            }
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
          <Box className="mt-3">
            {" "}
            <Flex direction="column" gap="2">
              <TextField.Input
                placeholder="Exercise Name"
                onChange={(e) => handleAddExerciseName(e)}
              />
              {currentWorkout?.sets.map((item, index) => (
                <div key={index}>
                  <h3>Set {index + 1}</h3>
                  {Object.keys(item).map((key) => (
                    <TextField.Input
                      key={key}
                      placeholder={`${key}`}
                      onChange={(e) => handleAddWorkout(e, key, index)}
                    />
                  ))}
                </div>
              ))}

              <Button onClick={addSetToCurrentWorkout}>Add Set</Button>
              <Button onClick={deleteLastWorkoutSet}>Delete Last Set</Button>
            </Flex>
            <Button onClick={addWorkoutToAllWorkouts}>Finish Exercise</Button>
          </Box>
          <Button onClick={printCurrentWorkout}> Print Current Workout</Button>
        </Box>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Exercise Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Exercise Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Sets</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Update</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Delete</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {allWorkouts.map((workout, index) => (
              <Table.Row key={index}>
                <Table.Cell>
                  {new Date(recordWorkout.date).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{workout.type}</Table.Cell>
                <Table.Cell>{workout.exercise_name}</Table.Cell>
                <Table.Cell>
                  {workout.sets.map((set, workoutIndex) => (
                    <div key={workoutIndex}>
                      {Object.entries(set).map(([key, value], setIndex) => (
                        <div key={setIndex}>{`${key}: ${value}`}</div>
                      ))}
                      <hr />
                    </div>
                  ))}
                </Table.Cell>
                <Table.Cell>
                  <Button>Update</Button>
                </Table.Cell>
                <Table.Cell>
                  <Button>Delete</Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Flex>
    </div>
  );
};

export default AddWorkout;
