import React, { useEffect, useState } from "react";
import {
  Flex,
  Select,
  TextField,
  Box,
  Text,
  Button,
  Table,
  Card,
} from "@radix-ui/themes";
import { Label } from "@radix-ui/react-label";
import { v4 as uuidv4 } from "uuid";
import { set } from "react-hook-form";
import { format } from "date-fns";
import {
  Pencil1Icon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  MinusIcon,
} from "@radix-ui/react-icons";

const defaultWorkouts: Workout[] = [
  {
    type: "Cardio",
    exercise_name: "Running",
    sets: [{ distance: "5 km" }],
  },
  {
    type: "Stretch",
    exercise_name: "Yoga",
    sets: [{ seconds: "1800" }],
  },
  {
    type: "Strength",
    exercise_name: "Deadlift",
    sets: [
      { reps: "8", weight: "185 lbs" },
      { reps: "6", weight: "205 lbs" },
    ],
  },
  {
    type: "Cardio",
    exercise_name: "Cycling",
    sets: [{ distance: "20 km" }],
  },
];

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

type WorkoutSummary = {
  id: string;
  date: number;
  summaryDetails: string;
};

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
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>(defaultWorkouts);

  const [recordWorkout, setRecordWorkout] = useState<workoutFinal>({
    id: uuidv4(),
    date: Date.now(),
    workouts: allWorkouts,
  });
  const [selectedWorkoutType, setSelectedWorkoutType] =
    useState<WorkoutType | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [exerciseName, setExerciseName] = useState<string>("");

  // State to hold the history of recorded workouts, summary of today's workout,
  // and summary of all recorded workouts
  const [historyRecordedWorkouts, setHistoryRecordedWorkouts] = useState<
    workoutFinal[]
  >([]);
  const [summaryRecordedWorkouts, setSummaryRecordedWorkouts] =
    useState<WorkoutSummary | null>(null);
  const [allSummaryRecordedWorkouts, setAllSummaryRecordedWorkouts] = useState<
    WorkoutSummary[]
  >([]);

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
  useEffect(() => {
    console.log("allWorkouts is: ", allWorkouts);
  }, [allWorkouts]);
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

  const handleDeleteWorkout = (index: number) => {
    const deletedWorkout = allWorkouts.find((workout, i) => i === index);
    const updatedWorkouts = allWorkouts.filter((workout, i) => i !== index);
    setAllWorkouts(updatedWorkouts);
    console.log("delete workout!: ", index, deletedWorkout);
  };

  const handleUpdateWorkout = (index: number) => {
    const updateWorkout = allWorkouts.find((workout, i) => i === index);
    let workouts = [...allWorkouts];
    workouts.map((workout, i) => {
      if (i === index) {
        workout.exercise_name = "Updated Exercise Name";
      }
    });
    setAllWorkouts(workouts);
    console.log("updateWorkout workout!: ", index, updateWorkout);
  };

  return (
    <div className="w-full flex justify-center items-center px-4">
      <Box className="px-4 flex flex-col md:flex-row md:items-center md:space-x-7">
        <Card variant="surface" size="3">
          <Box className="flex flex-col justify-center items-center">
            <Text mb="3" size="4" weight="bold" className="m-2">
              Add Todays Workout
            </Text>
            <Box className="space-y-4 mt-3">
              <Box className="flex flex-col">
                <Label htmlFor="workoutType">Workout Type</Label>
                <Select.Root
                  size="3"
                  value={selectedWorkoutType ?? ""}
                  onValueChange={(value) =>
                    handleSelectWorkoutType(value as WorkoutType)
                  }
                >
                  <Select.Trigger
                    placeholder="Pick A Workout Type"
                    variant="surface"
                    id="workoutType"
                  />
                  <Select.Content
                    variant="solid"
                    position="popper"
                    sideOffset={2}
                  >
                    <Select.Group>
                      <Select.Label>Workout Types</Select.Label>
                      {Object.values(WorkoutType).map((type) => (
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
              </Box>
              <Box className="space-y-4 flex flex-col justify-center items-center">
                {" "}
                <Box>
                  <Text as="label">Exercise Name</Text>
                  <Flex direction="column" gap="2">
                    <TextField.Input
                      placeholder="Exercise Name"
                      onChange={(e) => handleAddExerciseName(e)}
                      className="focus:border-yellow-400 border-2"
                    />
                    {currentWorkout?.sets.map((item, index) => (
                      <Box key={index}>
                        <Text as="label">Set {index + 1}</Text>
                        {Object.keys(item).map((key) => (
                          <TextField.Input
                            key={key}
                            placeholder={`${key}`}
                            onChange={(e) => handleAddWorkout(e, key, index)}
                            className="focus:border-yellow-400 border-2"
                          />
                        ))}
                      </Box>
                    ))}

                    <Button
                      variant="soft"
                      color="green"
                      radius="large"
                      onClick={addSetToCurrentWorkout}
                    >
                      <PlusIcon aria-hidden="true" /> Add Set
                    </Button>
                    <Button
                      variant="soft"
                      color="orange"
                      radius="large"
                      onClick={deleteLastWorkoutSet}
                    >
                      <MinusIcon aria-hidden="true" />{" "}
                      <span className="inline md:hidden lg:inline">
                        Delete Last Set
                      </span>
                      <span className=" hidden md:inline lg:hidden">
                        Delete
                      </span>
                    </Button>
                  </Flex>
                </Box>
                <Button
                  variant="solid"
                  color="green"
                  onClick={addWorkoutToAllWorkouts}
                >
                  {" "}
                  <CheckIcon width="16" height="16" aria-hidden="true" />{" "}
                  <span className="inline md:hidden lg:inline">
                    Submit Exercise
                  </span>
                  <span className=" hidden md:inline lg:hidden">Submit</span>
                </Button>
              </Box>
              <Button
                className="mt-6"
                variant="outline"
                color="gray"
                highContrast
                onClick={printCurrentWorkout}
              >
                <span className="inline md:hidden lg:inline">
                  Print Current Workout
                </span>
                <span className=" hidden md:inline lg:hidden">Print</span>
              </Button>
            </Box>
          </Box>
        </Card>
        <Box className="flex flex-col justify-center items-center">
          <Text mb="3" size="4" weight="bold" className="m-2">
            Todays Workout
          </Text>
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell className="text-center ">
                  Date
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-center ">
                  Exercise Type
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-center hidden md:table-cell">
                  Exercise Name
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-center hidden md:table-cell">
                  Sets
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-center">
                  Edit
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell className="text-center hidden md:table-cell">
                  Delete
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {allWorkouts.map((workout, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    {/* {new Date(recordWorkout.date).toDateString()} */}
                    <span className="hidden sm:block">
                      {new Date(recordWorkout.date).toDateString()}
                    </span>

                    <span className="block sm:hidden">
                      {format(recordWorkout.date, "MM/dd/yyyy")}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {workout.type}{" "}
                    <div className="block md:hidden">
                      {workout.exercise_name}
                    </div>
                    <div className="block md:hidden">
                      {workout.sets.map((set, workoutIndex) => (
                        <div key={workoutIndex}>
                          {Object.entries(set).map(([key, value], setIndex) => (
                            <div
                              className="border-b border-black last:border-b-0 py-2"
                              key={setIndex}
                            >{`${key}: ${value}`}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="hidden md:table-cell">
                    {workout.exercise_name}
                  </Table.Cell>
                  <Table.Cell className="hidden md:table-cell">
                    {workout.sets.map((set, workoutIndex) => (
                      <div key={workoutIndex}>
                        {Object.entries(set).map(([key, value], setIndex) => (
                          <div
                            key={setIndex}
                            className="border-b border-black last:border-b-0 py-2"
                          >{`${key}: ${value}`}</div>
                        ))}
                      </div>
                    ))}
                  </Table.Cell>

                  <Table.Cell className="space-y-4">
                    <Button
                      className="p-20"
                      variant="soft"
                      radius="large"
                      color="indigo"
                      highContrast
                      onClick={() => handleUpdateWorkout(index)}
                    >
                      <Pencil1Icon width="17" height="17" />
                      Edit
                    </Button>
                    <span className="block md:hidden ">
                      <Button
                        variant="soft"
                        radius="large"
                        color="crimson"
                        highContrast
                        onClick={() => handleDeleteWorkout(index)}
                      >
                        <TrashIcon width="17" height="17" /> Delete
                      </Button>
                    </span>
                  </Table.Cell>
                  <Table.Cell className="hidden md:table-cell">
                    <Button
                      variant="soft"
                      radius="large"
                      color="crimson"
                      highContrast
                      onClick={() => handleDeleteWorkout(index)}
                    >
                      <TrashIcon width="17" height="17" />
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </div>
  );
};

export default AddWorkout;
