import React, {
  Context,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
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

type Exercise = Strength | Cardio | Stretch;
type AllExercise = Exercise[];
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
enum ExerciseType {
  Strength = "Strength",
  Cardio = "Cardio",
  Stretch = "Stretch",
}
type WorkoutSummary = {
  id: string;
  date: number;
  summaryDetails: string;
};
interface TodaysWorkout {
  id: string;
  date: number;
  workouts: AllExercise;
}

interface DeleteWorkoutButtonProps {
  index: number;
  onDelete: (index: number) => void;
}

interface UpdateWorkoutButtonProps {
  index: number;
  onUpdate: (index: number) => void;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingRowIndex: Dispatch<SetStateAction<number | null>>;
}

interface WorkoutSetDataStructure {
  [key: string]: string;
}

const serverAPI = "http://localhost:8080/workouts";
const AddWorkout = () => {
  const [allWorkouts, setAllWorkouts] = useState<Exercise[]>(defaultWorkouts);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  const [recordTodaysWorkout, setRecordTodaysWorkout] = useState<TodaysWorkout>(
    {
      id: uuidv4(),
      date: Date.now(),
      workouts: allWorkouts,
    }
  );
  const [selectedWorkoutType, setSelectedWorkoutType] =
    useState<ExerciseType | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<Exercise | null>(null);
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
    workoutTypeCounts,
    setWorkoutTypeCounts,
  } = useContext<UserContextType>(UserContext as Context<UserContextType>);
  useEffect(() => {
    console.log("allWorkouts is: ", allWorkouts);
  }, [allWorkouts]);

  // Finish Today Workout & Save to History
  const finishTodaysWorkout = () => {
    const daySummary = summarizeDayWorkout();
    setHistoryRecordedWorkouts([
      ...historyRecordedWorkouts,
      recordTodaysWorkout,
    ]);
    updateWorkoutTypeCounts();
    setSummaryRecordedWorkouts(daySummary);
    setAllSummaryRecordedWorkouts([...allSummaryRecordedWorkouts, daySummary]);
    console.log("daySummary is: ", daySummary);
    console.log("allSummaryRecordedWorkouts is: ", allSummaryRecordedWorkouts);
    setRecordTodaysWorkout({
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
  const summarizeDayWorkout = (): WorkoutSummary => {
    // Types of workouts performed
    const workoutTypes = new Set(
      recordTodaysWorkout.workouts.map((workout) => workout.type)
    );
    const workoutTypesSummary = Array.from(workoutTypes).join(", ");

    // Exercise names
    const exerciseNamesSummary = recordTodaysWorkout.workouts
      .map((workout) => workout.exercise_name)
      .join(", ");

    // Total number of sets
    const totalSets = recordTodaysWorkout.workouts.reduce(
      (total, workout) => total + workout.sets.length,
      0
    );

    return {
      id: recordTodaysWorkout.id,
      date: recordTodaysWorkout.date,
      summaryDetails: `${workoutTypesSummary} | ${exerciseNamesSummary} | ${totalSets} Sets`,
    };
  };

  // Running Statistics for dashboard
  const updateWorkoutTypeCounts = () => {
    const newCounts = { ...workoutTypeCounts };
    const newRecordWorkout = [...recordTodaysWorkout.workouts];
    newRecordWorkout.forEach((workout) => {
      newCounts[workout.type] += 1;
    });
    setWorkoutTypeCounts(newCounts);
  };

  // Form Configurations: Select type, add sets, remove sets
  const handleSelectWorkoutType = (type: ExerciseType) => {
    setSelectedWorkoutType(type);

    // Initialize a new workout when a type is selected
    if (type === ExerciseType.Strength) {
      setCurrentWorkout({
        type,
        exercise_name: "",
        sets: [{ reps: "", weight: "" }],
      });
    } else if (type === ExerciseType.Cardio) {
      setCurrentWorkout({ type, exercise_name: "", sets: [{ distance: "" }] });
    } else if (type === ExerciseType.Stretch) {
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
      case ExerciseType.Strength:
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
      case ExerciseType.Cardio:
        newSet = { distance: "" } as CardioSet;
        updatedCardioSets = [...(currentWorkout.sets as CardioSet[]), newSet];
        setCurrentWorkout({
          ...currentWorkout,
          sets: updatedCardioSets,
        });
        break;
      case ExerciseType.Stretch:
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
  function removeLastSetFromCurrentWorkout(): void {
    if (!currentWorkout) {
      return;
    }

    const updatedSets = currentWorkout.sets
      ? [...currentWorkout.sets]
      : ([] as WorkoutSetDataStructure[]);

    updatedSets.pop();

    let updatedWorkout: Exercise;

    switch (currentWorkout.type) {
      case ExerciseType.Strength:
        updatedWorkout = {
          ...currentWorkout,
          sets: updatedSets as StrengthSet[],
        } as Strength;
        break;
      case ExerciseType.Cardio:
        updatedWorkout = {
          ...currentWorkout,
          sets: updatedSets as CardioSet[],
        } as Cardio;
        break;
      case ExerciseType.Stretch:
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

  // Add Form Logic: Input OnChange Handlers & Form Submission
  const handleExerciseNameAddForm = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!currentWorkout) {
      return;
    }
    const setValue = e.target.value;
    console.log("new exercise name is: ", setValue);
    setCurrentWorkout({ ...currentWorkout, exercise_name: setValue });
  };
  const handleSetAddForm = (
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

    let updatedWorkout: Exercise;

    switch (currentWorkout.type) {
      case ExerciseType.Strength:
        updatedWorkout = {
          ...currentWorkout,
          sets: updatedSets as StrengthSet[],
        } as Strength;
        break;
      case ExerciseType.Cardio:
        updatedWorkout = {
          ...currentWorkout,
          sets: updatedSets as CardioSet[],
        } as Cardio;
        break;
      case ExerciseType.Stretch:
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
  const addExerciseToDaysWorkout = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event?.preventDefault();

    // Error Handling
    if (!currentWorkout) {
      console.log(
        "addExerciseToDaysWorkout: currentWorkout is empty, returning"
      );
      return;
    }

    if (!currentWorkout.exercise_name) {
      console.log("addExerciseToDaysWorkout: exerciseName is empty, returning");
      return;
    }

    if (!selectedWorkoutType) {
      console.log(
        "addExerciseToDaysWorkout: selectedWorkoutType is empty, returning"
      );
      return;
    }

    const isAnySetFieldEmpty = currentWorkout.sets.some((set) =>
      Object.values(set).some((value) => value === "")
    );

    if (isAnySetFieldEmpty) {
      console.log("addExerciseToDaysWorkout: sets is empty, returning");
      return;
    }

    console.log("exerciseName is: ", exerciseName);
    console.log("currentWorkout.sets.length is: ", currentWorkout.sets.length);

    // Add current workout to workouts in server
    axios
      .post(`${serverAPI}/workoutlogins`, {
        id: recordTodaysWorkout.id,
        date: recordTodaysWorkout.date,
        workout: currentWorkout,
      })
      .then((response) => {
        console.log("response is: ", response.data);
      })
      .catch((error) => {
        console.log("error is: ", error);
      });

    // Update the recordWorkout state
    setAllWorkouts([...allWorkouts, currentWorkout]);
    setCurrentWorkout(null);
    setSelectedWorkoutType(null);
    setExerciseName("");
    toast.success("Workout added!", { duration: 3000 });
  };

  // Today Workout Table Logic: Update, Delete
  // FOUND BUG. Need to update in here only so the confirmation dialog cancel works:
  const handleUpdateExercise = (
    _event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    // console.log("updateWorkout workout! _e: ", _event);
    // const updateWorkout = allWorkouts.find((workout, i) => i === index);
    // let workouts = [...allWorkouts];
    // workouts.map((workout, i) => {
    //   if (i === index) {
    //     workout.exercise_name = "Updated Exercise Name";
    //   }
    // });
    // setAllWorkouts(workouts);
    setIsEditing(false);
    setEditingRowIndex(null);
    console.log("updateWorkout workout!: ", index);
  };
  const handleUpdateExerciseName = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedWorkoutList = allWorkouts.map((currentWorkout, workoutIdx) => {
      if (workoutIdx === index) {
        return {
          ...currentWorkout,
          exercise_name: e.target.value,
        };
      }
      return currentWorkout;
    });
    setAllWorkouts(updatedWorkoutList);
  };
  const handleUpdateExerciseSet = (
    e: React.ChangeEvent<HTMLInputElement>,
    workoutIndex: number,
    setAttribute: string,
    setIndex: number
  ) => {
    const updateSets = <T extends StrengthSet | CardioSet | StretchSet>(
      sets: T[],
      sIndex: number,
      value: string
    ): T[] =>
      sets.map((set, idx) =>
        idx === sIndex ? ({ ...set, [setAttribute]: value } as T) : set
      );
    const updatedWorkouts = allWorkouts.map((workout, wIndex) => {
      if (wIndex === workoutIndex) {
        if (workout.type === "Strength" && "reps" in workout.sets[0]) {
          const updatedSets = updateSets(
            workout.sets as StrengthSet[],
            setIndex,
            e.target.value
          );
          return { ...workout, sets: updatedSets };
        } else if (workout.type === "Cardio" && "distance" in workout.sets[0]) {
          const updatedSets = updateSets(
            workout.sets as CardioSet[],
            setIndex,
            e.target.value
          );
          return { ...workout, sets: updatedSets };
        } else if (workout.type === "Stretch" && "seconds" in workout.sets[0]) {
          const updatedSets = updateSets(
            workout.sets as StretchSet[],
            setIndex,
            e.target.value
          );
          return { ...workout, sets: updatedSets };
        }
        return workout;
      }
      return workout;
    });

    setAllWorkouts(updatedWorkouts as Exercise[]);
  };
  const handleDeleteExercise = (index: number) => {
    const deletedWorkout = allWorkouts.find((workout, i) => i === index);
    const updatedWorkouts = allWorkouts.filter((workout, i) => i !== index);
    setAllWorkouts(updatedWorkouts);
    setIsEditing(false);
    setEditingRowIndex(null);
    console.log("delete workout!: ", index, deletedWorkout);
  };

  ///////////////////////// Testing Purposes  /////////////////////////

  const testEndpoint = () => {
    console.log("testEndpoint");
    axios
      .get(`${serverAPI}/workoutlogins`)
      .then((response) => {
        console.log("response is workoutlogin: ", response.data);
      })
      .catch((error) => {
        console.log("error is: ", error);
      });
  };
  const testPOSTEndpoint = () => {
    console.log("testEndpoint");
    axios
      .post(`${serverAPI}/workoutlogins`, {
        email: "sri@gmail.com",
      })
      .then((response) => {
        console.log("response is workoutlogin: ", response.data);
      })
      .catch((error) => {
        console.log("error is: ", error);
      });
  };

  console.log("allWorkouts is: ", allWorkouts[0]);
  return (
    <>
      <div>
        <div className="w-full flex justify-center items-center px-4">
          <Box className="space-y-7 px-4 items-center flex flex-col md:flex-row md:items-center md:space-x-7">
            <Box className="space-y-4">
              {" "}
              <Flex direction="column" gap="2">
                <form onSubmit={addExerciseToDaysWorkout}>
                  <Select.Root
                    size="3"
                    value={selectedWorkoutType ?? ""}
                    onValueChange={(value) => {
                      handleSelectWorkoutType(value as ExerciseType);
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
                    onChange={(e) => handleExerciseNameAddForm(e)}
                  />
                  {currentWorkout?.sets.map((item, index) => (
                    <div key={index}>
                      <h3>Set {index + 1}</h3>
                      {Object.keys(item).map((key) => (
                        <TextField.Input
                          key={key}
                          placeholder={`${key}`}
                          onChange={(e) => handleSetAddForm(e, key, index)}
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
                    onClick={removeLastSetFromCurrentWorkout}
                  >
                    <MinusIcon aria-hidden="true" /> Delete Last Set
                  </Button>
                  <Box className="mt-3 ">
                    <Button
                      variant="solid"
                      color="teal"
                      type="submit"
                      // onClick={addExerciseToDaysWorkout}
                      size="4"
                      className="shadow-md items-center flex justify-center "
                      mx-6
                    >
                      {" "}
                      <CheckIcon width="19" height="19" aria-hidden="true" />
                      <Text className="font-medium">Finish Exercise</Text>
                    </Button>
                  </Box>
                </form>
              </Flex>
            </Box>

            <Box className="space-y-4 flex flex-col justify-end">
              <Button onClick={testEndpoint}>Test Endpoint</Button>
              <Button onClick={testPOSTEndpoint}>Test POST Endpoint</Button>
              <Button
                className="mt-6 text-lg py-4 px-8"
                size="2"
                variant="solid"
                color="jade"
                onClick={finishTodaysWorkout}
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
                      <div className="block md:hidden"> Workout Summary</div>
                      <div className="hidden md:block"> Exercise Type</div>
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
                          {new Date(recordTodaysWorkout.date).toDateString()}
                        </span>

                        <span className="block sm:hidden">
                          {format(recordTodaysWorkout.date, "MM/dd/yyyy")}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        {workout.type}{" "}
                        <div className="block md:hidden mt-2">
                          <TextField.Input
                            disabled={editingRowIndex !== index}
                            value={workout.exercise_name}
                            onChange={(e) => handleUpdateExerciseName(e, index)}
                          />
                        </div>
                        <div className="block md:hidden">
                          {workout.sets.map((individualSet, setIndex) => (
                            <div key={setIndex}>
                              {Object.entries(individualSet).map(
                                ([setAttribute, setValue], attributeIndex) => (
                                  <div
                                    key={attributeIndex}
                                    className="flex flex mb-2 items-center"
                                  >
                                    <label className="mb-1 text-sm font-medium text-gray-700 pr-3">
                                      {setAttribute}:
                                    </label>

                                    <TextField.Input
                                      disabled={editingRowIndex !== index}
                                      className="border-b border-black last:border-b-0 py-2"
                                      key={attributeIndex}
                                      value={setValue}
                                      onChange={(e) =>
                                        handleUpdateExerciseSet(
                                          e,
                                          index, // Index of the workout in allWorkouts
                                          setAttribute, // The attribute name of the set (e.g., 'reps', 'weight')
                                          setIndex // Index of the set in the workout's sets array
                                        )
                                      }
                                    />
                                  </div>
                                )
                              )}
                            </div>
                          ))}
                        </div>
                      </Table.Cell>
                      <Table.Cell className="hidden md:table-cell">
                        <TextField.Input
                          disabled={editingRowIndex !== index}
                          value={workout.exercise_name}
                          onChange={(e) => {
                            const updatedWorkoutList = allWorkouts.map(
                              (currentWorkout, workoutIdx) => {
                                if (workoutIdx === index) {
                                  return {
                                    ...currentWorkout,
                                    exercise_name: e.target.value,
                                  };
                                }
                                return currentWorkout;
                              }
                            );
                            setAllWorkouts(updatedWorkoutList);
                          }}
                        />
                      </Table.Cell>
                      <Table.Cell className="hidden md:table-cell">
                        {workout.sets.map((individualSet, setIndex) => (
                          <div key={setIndex}>
                            {Object.entries(individualSet).map(
                              ([setAttribute, setValue], attributeIndex) => (
                                <div
                                  key={attributeIndex}
                                  className="flex flex-col lg:flex-row mb-2"
                                >
                                  <label className="mb-1 text-sm font-medium text-gray-700 pr-3">
                                    {setAttribute}:
                                  </label>

                                  <TextField.Input
                                    disabled={editingRowIndex !== index}
                                    className="border-b border-black last:border-b-0 py-2"
                                    key={attributeIndex}
                                    value={setValue}
                                    onChange={(e) =>
                                      handleUpdateExerciseSet(
                                        e,
                                        index, // Index of the workout in allWorkouts
                                        setAttribute, // The attribute name of the set (e.g., 'reps', 'weight')
                                        setIndex // Index of the set in the workout's sets array
                                      )
                                    }
                                  />
                                </div>
                              )
                            )}
                          </div>
                        ))}
                      </Table.Cell>

                      <Table.Cell className="space-y-4">
                        {editingRowIndex === index ? (
                          <UpdateWorkoutButton
                            index={index}
                            onUpdate={(e) => handleUpdateExercise(e, index)}
                            setIsEditing={setIsEditing}
                            setEditingRowIndex={setEditingRowIndex}
                          />
                        ) : (
                          <Button
                            className="p-20"
                            variant="soft"
                            radius="large"
                            color="indigo"
                            highContrast
                            onClick={() => setEditingRowIndex(index)}
                          >
                            <Pencil1Icon width="17" height="17" />
                            Edit
                          </Button>
                        )}
                        <span className="block md:hidden ">
                          <DeleteWorkoutButton
                            index={index}
                            onDelete={handleDeleteExercise}
                          />
                        </span>
                      </Table.Cell>
                      <Table.Cell className="hidden md:table-cell">
                        <DeleteWorkoutButton
                          index={index}
                          onDelete={handleDeleteExercise}
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
          onClick={finishTodaysWorkout}
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
  setEditingRowIndex,
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
        <AlertDialog.Title>Confirm Update</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure you want to update this workout?
        </AlertDialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button
              variant="soft"
              color="gray"
              onClick={() => setEditingRowIndex(null)}
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
