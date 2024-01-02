import React, { Context, useContext, useEffect, useState } from "react";
import {
  Flex,
  Select,
  TextField,
  Box,
  Button,
  Table,
  Text,
  AlertDialog,
} from "@radix-ui/themes";
import { v4 as uuidv4 } from "uuid";
import { set } from "react-hook-form";
import { format } from "date-fns";
import {
  Pencil1Icon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  MinusIcon,
  Update,
} from "@radix-ui/react-icons";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { UserContextType } from "../context/UserContext";

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

interface DeleteWorkoutButtonProps {
  index: number;
  onDelete: (index: number) => void; // This is the type signature for the deletion handler function
}

interface UpdateWorkoutButtonProps {
  index: number;
  onUpdate: (index: number) => void; // This is the type signature for the deletion handler function
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [isEditing, setIsEditing] = useState<boolean>(false);
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
  const {
    historyRecordedWorkouts,
    setHistoryRecordedWorkouts,
    allSummaryRecordedWorkouts,
    setAllSummaryRecordedWorkouts,
    summaryRecordedWorkouts,
    setSummaryRecordedWorkouts,
  } = useContext<UserContextType>(UserContext as Context<UserContextType>);

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

  const summarizeDayWorkout = (): WorkoutSummary => {
    // Types of workouts performed
    const workoutTypes = new Set(
      recordWorkout.workouts.map((workout) => workout.type)
    );
    const workoutTypesSummary = Array.from(workoutTypes).join(", ");

    // Exercise names
    const exerciseNamesSummary = recordWorkout.workouts
      .map((workout) => workout.exercise_name)
      .join(", ");

    // Total number of sets
    const totalSets = recordWorkout.workouts.reduce(
      (total, workout) => total + workout.sets.length,
      0
    );

    return {
      id: uuidv4(),
      date: recordWorkout.date,
      summaryDetails: `${workoutTypesSummary} | ${exerciseNamesSummary} | ${totalSets} Sets`,
    };
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
    toast.success("Workout added!", { duration: 3000 });
  };
  const finishCurrentWorkout = () => {
    const daySummary = summarizeDayWorkout();
    setHistoryRecordedWorkouts([...historyRecordedWorkouts, recordWorkout]);
    setSummaryRecordedWorkouts(daySummary);
    setAllSummaryRecordedWorkouts([...allSummaryRecordedWorkouts, daySummary]);
    console.log("daySummary is: ", daySummary);
    console.log("allSummaryRecordedWorkouts is: ", allSummaryRecordedWorkouts);
    setRecordWorkout({
      id: uuidv4(),
      date: Date.now(),
      workouts: [],
    });
    setAllWorkouts([]);
    setCurrentWorkout(null);
    setSelectedWorkoutType(null);
    setExerciseName("");
    toast.success("Workout saved!", { duration: 3000 });
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
    setIsEditing(false);
    console.log("updateWorkout workout!: ", index, updateWorkout);
  };

  return (
    <>
      <div>
        <div className="w-full flex justify-center items-center px-4">
          <Box className="space-y-7 px-4 items-center flex flex-col md:flex-row md:items-center md:space-x-7">
            <Box className="space-y-4">
              {" "}
              <Flex direction="column" gap="2">
                <Select.Root
                  size="3"
                  value={selectedWorkoutType ?? ""}
                  onValueChange={(value) => {
                    handleSelectWorkoutType(value as WorkoutType);
                    axios.patch("Fake Error").catch(() => {
                      toast.error("Changes could not be saved", {
                        duration: 3000,
                      });
                    });
                  }}
                >
                  <Select.Trigger
                    placeholder="Pick A Workout Type"
                    variant="surface"
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

                <Button
                  variant="solid"
                  color="green"
                  onClick={addSetToCurrentWorkout}
                >
                  <PlusIcon aria-hidden="true" /> Add Set
                </Button>
                <Button
                  variant="soft"
                  color="orange"
                  onClick={deleteLastWorkoutSet}
                >
                  <MinusIcon aria-hidden="true" /> Delete Last Set
                </Button>
                <Box className="mt-3 ">
                  <Button
                    variant="solid"
                    color="teal"
                    onClick={addWorkoutToAllWorkouts}
                    size="4"
                    className="shadow-md items-center flex justify-center "
                    mx-6
                  >
                    {" "}
                    <CheckIcon width="19" height="19" aria-hidden="true" />
                    <Text className="font-medium">Finish Exercise</Text>
                  </Button>
                </Box>
              </Flex>
            </Box>

            <Box className="space-y-4 flex flex-col justify-end">
              <Button
                className="mt-6 text-lg py-4 px-8"
                size="2"
                variant="solid"
                color="jade"
                onClick={finishCurrentWorkout}
              >
                Finish Workout
              </Button>
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
                              {Object.entries(set).map(
                                ([key, value], setIndex) => (
                                  <div
                                    className="border-b border-black last:border-b-0 py-2"
                                    key={setIndex}
                                  >{`${key}: ${value}`}</div>
                                )
                              )}
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
                            {Object.entries(set).map(
                              ([key, value], setIndex) => (
                                <div
                                  key={setIndex}
                                  className="border-b border-black last:border-b-0 py-2"
                                >{`${key}: ${value}`}</div>
                              )
                            )}
                          </div>
                        ))}
                      </Table.Cell>

                      <Table.Cell className="space-y-4">
                        {isEditing ? (
                          <UpdateWorkoutButton
                            index={index}
                            onUpdate={handleUpdateWorkout}
                            setIsEditing={setIsEditing}
                          />
                        ) : (
                          <Button
                            className="p-20"
                            variant="soft"
                            radius="large"
                            color="indigo"
                            highContrast
                            onClick={() => setIsEditing(true)}
                          >
                            <Pencil1Icon width="17" height="17" />
                            Edit
                          </Button>
                        )}
                        <span className="block md:hidden ">
                          <DeleteWorkoutButton
                            index={index}
                            onDelete={handleDeleteWorkout}
                          />
                        </span>
                      </Table.Cell>
                      <Table.Cell className="hidden md:table-cell">
                        <DeleteWorkoutButton
                          index={index}
                          onDelete={handleDeleteWorkout}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        </div>
      </div>
      <div className="sticky w-full bg-gray-100 bg-white p-4 shadow-md flex justify-end">
        <Button
          className="mt-6 text-lg py-4 px-8"
          size="4"
          variant="solid"
          color="jade"
          onClick={finishCurrentWorkout}
        >
          Finish Workout
        </Button>
      </div>
      <Toaster />
    </>
  );
};

const UpdateWorkoutButton: React.FC<UpdateWorkoutButtonProps> = ({
  index,
  onUpdate,
  setIsEditing,
}) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button variant="soft" color="sky" radius="large">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.90321 7.29677C1.90321 10.341 4.11041 12.4147 6.58893 12.8439C6.87255 12.893 7.06266 13.1627 7.01355 13.4464C6.96444 13.73 6.69471 13.9201 6.41109 13.871C3.49942 13.3668 0.86084 10.9127 0.86084 7.29677C0.860839 5.76009 1.55996 4.55245 2.37639 3.63377C2.96124 2.97568 3.63034 2.44135 4.16846 2.03202L2.53205 2.03202C2.25591 2.03202 2.03205 1.80816 2.03205 1.53202C2.03205 1.25588 2.25591 1.03202 2.53205 1.03202L5.53205 1.03202C5.80819 1.03202 6.03205 1.25588 6.03205 1.53202L6.03205 4.53202C6.03205 4.80816 5.80819 5.03202 5.53205 5.03202C5.25591 5.03202 5.03205 4.80816 5.03205 4.53202L5.03205 2.68645L5.03054 2.68759L5.03045 2.68766L5.03044 2.68767L5.03043 2.68767C4.45896 3.11868 3.76059 3.64538 3.15554 4.3262C2.44102 5.13021 1.90321 6.10154 1.90321 7.29677ZM13.0109 7.70321C13.0109 4.69115 10.8505 2.6296 8.40384 2.17029C8.12093 2.11718 7.93465 1.84479 7.98776 1.56188C8.04087 1.27898 8.31326 1.0927 8.59616 1.14581C11.4704 1.68541 14.0532 4.12605 14.0532 7.70321C14.0532 9.23988 13.3541 10.4475 12.5377 11.3662C11.9528 12.0243 11.2837 12.5586 10.7456 12.968L12.3821 12.968C12.6582 12.968 12.8821 13.1918 12.8821 13.468C12.8821 13.7441 12.6582 13.968 12.3821 13.968L9.38205 13.968C9.10591 13.968 8.88205 13.7441 8.88205 13.468L8.88205 10.468C8.88205 10.1918 9.10591 9.96796 9.38205 9.96796C9.65819 9.96796 9.88205 10.1918 9.88205 10.468L9.88205 12.3135L9.88362 12.3123C10.4551 11.8813 11.1535 11.3546 11.7585 10.6738C12.4731 9.86976 13.0109 8.89844 13.0109 7.70321Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
          Update
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure you want to update this workout?
        </AlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button
              variant="soft"
              color="gray"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={() => onUpdate(index)}>
              Update
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

const DeleteWorkoutButton: React.FC<DeleteWorkoutButtonProps> = ({
  index,
  onDelete,
}) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button variant="soft" radius="large" color="crimson" highContrast>
          <TrashIcon width="17" height="17" />
          Delete
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>Confirm Deletion</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure you want to delete this workout?
        </AlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={() => onDelete(index)}>
              Delete
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default AddWorkout;
