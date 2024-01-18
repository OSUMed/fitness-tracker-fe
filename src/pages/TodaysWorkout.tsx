import React, { Context, useContext, useState, useEffect } from "react";
import {
  Flex,
  TextField,
  Box,
  Button,
  Table,
  AlertDialog,
} from "@radix-ui/themes";
import { v4 as uuidv4 } from "uuid";
import { set } from "react-hook-form";
import { format } from "date-fns";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { UserContextType } from "../context/UserContext";
import { AddExerciseForm } from "../components/AddExerciseForm";
import {
  Cardio,
  CardioSet,
  DeleteWorkoutButtonProps,
  Exercise,
  ExerciseType,
  Strength,
  StrengthSet,
  Stretch,
  StretchSet,
  TodaysWorkout,
  WorkoutSummary,
  UpdateWorkoutButtonProps,
  WorkoutSetDataStructure,
  StaticExerciseRowProps,
  EditableExerciseRowProps,
  EditWorkoutButtonProps,
  WorkoutSummaryMobileViewProps,
} from "../types/workoutTypes";
import { defaultWorkouts } from "../util/defaultWorkouts";

const JWT_TOKEN = localStorage.getItem("accessToken");
const serverAPI = "http://localhost:8080/workouts";
const TodaysWorkoutComponent = () => {
  // Form Variables:
  const [exerciseName, setExerciseName] = useState<string>("");
  const [selectedWorkoutType, setSelectedWorkoutType] =
    useState<ExerciseType | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);

  // Helper Variables:
  const [, setIsEditing] = useState<boolean>(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  // Table State Variables:
  const [exerciseNameUpdateTable] = useState<string>("");

  // Summary and All History Variables:
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  // const [allExercisesTemp, setAllExercisesTemp] =
  //   useState<Exercise[]>(defaultWorkouts);
  const [editableRowData, setEditableRowData] = useState<Exercise>();
  const [recordTodaysWorkout, setRecordTodaysWorkout] = useState<TodaysWorkout>(
    {
      id: uuidv4(),
      date: new Date().toISOString(),
      workouts: allExercises,
    }
  );

  // useContext Variables:
  const {
    userId,
    username,
    historyRecordedWorkouts,
    setHistoryRecordedWorkouts,
    allSummaryRecordedWorkouts,
    setAllSummaryRecordedWorkouts,
    setSummaryRecordedWorkouts,
    workoutTypeCounts,
    setWorkoutTypeCounts,
  } = useContext<UserContextType>(UserContext as Context<UserContextType>);

  const callGetTodaysWorkout = () => {
    axios
      .get(`${serverAPI}/workoutlogins`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      })
      .then((response) => {
        const { exercises } = response.data;
        if (exercises.length === 0) {
          setAllExercises([]);
          return;
        }
        console.log("exercises get are: ", exercises);
        const filteredServerData = exercises.map((exercise) => {
          const { exerciseName, type, sets, id: exerciseId } = exercise;
          const filteredSets = sets.map(({ id, ...rest }) => rest);

          return {
            exerciseId,
            exerciseName,
            type,
            sets: filteredSets,
          };
        });
        setAllExercises(filteredServerData);
      })
      .catch((error) => {
        console.log("error is: ", error);
      });
  };

  useEffect(() => {
    callGetTodaysWorkout();
  }, []);

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
      date: new Date().toISOString(),
      workouts: [],
    });
    setAllExercises([]);
    setCurrentExercise(null);
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
      .map((workout) => workout.exerciseName)
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

  // Form Configurations: Select type, sets, remove sets
  const handleSelectWorkoutType = (type: ExerciseType) => {
    setSelectedWorkoutType(type);

    // Initialize a new workout when a type is selected
    if (type === ExerciseType.Strength) {
      setCurrentExercise({
        exerciseId: 0,
        type,
        exerciseName: "",
        sets: [{ reps: "", weight: "" }],
      });
    } else if (type === ExerciseType.Cardio) {
      setCurrentExercise({
        exerciseId: 0,
        type,
        exerciseName: "",
        sets: [{ distance: "" }],
      });
    } else if (type === ExerciseType.Stretch) {
      setCurrentExercise({
        exerciseId: 0,
        type,
        exerciseName: "",
        sets: [{ seconds: "" }],
      });
    }
  };

  const addSetToCurrentWorkout = () => {
    if (!currentExercise) return;

    let newSet: StrengthSet | CardioSet | StretchSet;
    let updatedStrengthSets: StrengthSet[];
    let updatedCardioSets: CardioSet[];
    let updatedStretchSets: StretchSet[];

    switch (currentExercise.type) {
      case ExerciseType.Strength:
        newSet = { reps: "", weight: "" } as StrengthSet;
        updatedStrengthSets = [
          ...(currentExercise.sets as StrengthSet[]),
          newSet,
        ];
        setCurrentExercise({
          ...currentExercise,
          sets: updatedStrengthSets,
        });
        break;
      case ExerciseType.Cardio:
        newSet = { distance: "" } as CardioSet;
        updatedCardioSets = [...(currentExercise.sets as CardioSet[]), newSet];
        setCurrentExercise({
          ...currentExercise,
          sets: updatedCardioSets,
        });
        break;
      case ExerciseType.Stretch:
        newSet = { seconds: "" } as StretchSet;
        updatedStretchSets = [
          ...(currentExercise.sets as StretchSet[]),
          newSet,
        ];
        setCurrentExercise({
          ...currentExercise,
          sets: updatedStretchSets,
        });
        break;
      default:
        throw new Error("Unsupported workout type");
    }
  };
  function removeLastSetFromCurrentWorkout(): void {
    if (!currentExercise) {
      return;
    }

    const updatedSets = currentExercise.sets
      ? [...currentExercise.sets]
      : ([] as WorkoutSetDataStructure[]);

    updatedSets.pop();

    let updatedWorkout: Exercise;

    switch (currentExercise.type) {
      case ExerciseType.Strength:
        updatedWorkout = {
          ...currentExercise,
          sets: updatedSets as StrengthSet[],
        } as Strength;
        break;
      case ExerciseType.Cardio:
        updatedWorkout = {
          ...currentExercise,
          sets: updatedSets as CardioSet[],
        } as Cardio;
        break;
      case ExerciseType.Stretch:
        updatedWorkout = {
          ...currentExercise,
          sets: updatedSets as StretchSet[],
        } as Stretch;
        break;
      default:
        throw new Error("Invalid workout type");
    }

    setCurrentExercise(updatedWorkout);
  }

  // Add Form Logic: Input OnChange Handlers & Form Submission
  const handleExerciseNameAddForm = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!currentExercise) {
      return;
    }
    const setValue = e.target.value;
    setExerciseName(setValue);
    setCurrentExercise({ ...currentExercise, exerciseName: setValue });
  };
  const handleSetAddForm = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
    index: number
  ) => {
    if (!currentExercise) {
      return;
    }

    const updatedSets = currentExercise.sets ? [...currentExercise.sets] : [];
    const setValue = e.target.value;

    if (updatedSets[index]) {
      (updatedSets[index] as WorkoutSetDataStructure)[key] = setValue;
    }

    let updatedWorkout: Exercise;

    switch (currentExercise.type) {
      case ExerciseType.Strength:
        updatedWorkout = {
          ...currentExercise,
          sets: updatedSets as StrengthSet[],
        } as Strength;
        break;
      case ExerciseType.Cardio:
        updatedWorkout = {
          ...currentExercise,
          sets: updatedSets as CardioSet[],
        } as Cardio;
        break;
      case ExerciseType.Stretch:
        updatedWorkout = {
          ...currentExercise,
          sets: updatedSets as StretchSet[],
        } as Stretch;
        break;
      default:
        throw new Error("Invalid workout type");
    }

    setCurrentExercise(updatedWorkout);
  };

  const addExerciseToDaysWorkout = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // Error Handling
    if (!currentExercise) {
      console.error(
        "addExerciseToDaysWorkout: currentExercise is empty, returning"
      );
      return;
    }

    if (!currentExercise.exerciseName) {
      console.error(
        "addExerciseToDaysWorkout: exerciseName is empty, returning"
      );
      return;
    }

    if (!selectedWorkoutType) {
      console.error(
        "addExerciseToDaysWorkout: selectedWorkoutType is empty, returning"
      );
      return;
    }

    const isAnySetFieldEmpty = currentExercise.sets.some((set) =>
      Object.values(set).some((value) => value === "")
    );

    if (isAnySetFieldEmpty) {
      console.error("addExerciseToDaysWorkout: sets is empty, returning");
      return;
    }

    console.log("exerciseName is: ", exerciseName);
    console.log(
      "currentExercise.sets.length is: ",
      currentExercise.sets.length
    );

    const postData = {
      userId: userId,
      id: recordTodaysWorkout.id,
      date: recordTodaysWorkout.date,
      exerciseData: currentExercise,
    };
    console.log("Post data is: ", postData);

    // Add current workout to workouts in server
    axios
      .post(`${serverAPI}/workoutlogins`, postData)
      .then((response) => {
        const { exercises } = response.data;
        const filteredServerData = exercises.map((exercise) => {
          const { id: exerciseId, exerciseName, type, sets } = exercise;
          const filteredSets = sets.map(({ id, ...rest }) => rest);

          return {
            exerciseId,
            exerciseName,
            type,
            sets: filteredSets,
          };
        });
        console.log("POST workoutlogins response is: ", response.data);
        console.log("serverFilteredData: ", filteredServerData);
        setAllExercises(filteredServerData);
      })
      .catch((error) => {
        console.log("error is: ", error);
      });

    // Update the recordWorkout state
    // setAllExercises([...allExercises, currentExercise]);
    setCurrentExercise(null);
    setSelectedWorkoutType(null);
    setExerciseName("");
    toast.success("Workout added!", { duration: 3000 });
  };

  // Today Workout Table Logic: Update, Delete
  // FOUND BUG. Need to update in here only so the confirmation dialog cancel works:

  const startRowEditProcess = (index: number) => {
    setIsEditing(true);
    setEditingRowIndex(index);
    console.log("edit process: ", { ...allExercises[index] });
    setEditableRowData({ ...allExercises[index] });
  };

  const handleUpdateExercise = (index: number) => {
    // console.log("updateWorkout workout! _e: ", _event);
    // const updateWorkout = allExercises.find((workout, i) => i === index);
    // let workouts = [...allExercises];
    // workouts.map((workout, i) => {
    //   if (i === index) {
    //     workout.exerciseName = "Updated Exercise Name";
    //   }
    // });
    // setAllExercises(workouts);
    const updateData = {
      userId: userId,
      id: recordTodaysWorkout.id,
      date: recordTodaysWorkout.date,
      exerciseData: editableRowData,
    };

    axios
      .put(`${serverAPI}/workoutlogins`, updateData)
      .then((response) => {
        const { exercises } = response.data;
        const filteredServerData = exercises.map((exercise) => {
          const { id: exerciseId, exerciseName, type, sets } = exercise;
          const filteredSets = sets.map(({ id, ...rest }) => rest);

          return {
            exerciseId,
            exerciseName,
            type,
            sets: filteredSets,
          };
        });
        console.log("UPDATE workoutlogins response is: ", response.data);
        console.log("serverFilteredData: ", filteredServerData);
        setAllExercises(filteredServerData);
      })
      .catch((error) => {
        console.log("error is: ", error);
      });

    // const updatedExercises = allExercises.map((workout, wIndex) => {
    //   if (wIndex === index) {
    //     return editableRowData as Exercise;
    //   }
    //   return workout;
    // });
    // console.log("Update data to server is: ", updateData, "Index is: ", index); // as Exercise
    // setAllExercises(updatedExercises);
    setEditingRowIndex(null);
    setIsEditing(false);
    console.log("updateWorkout workout!: ", index);
  };
  const handleUpdateExerciseName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableRowData((prevData: Exercise | undefined) => {
      if (!prevData) {
        return prevData;
      }
      return {
        ...prevData,
        exerciseName: e.target.value,
      };
    });
  };
  const handleUpdateExerciseSet = (
    e: React.ChangeEvent<HTMLInputElement>,
    setAttribute: string,
    setIndex: number
  ) => {
    // console.log("params are: ", e, setAttribute, setIndex);
    if (editableRowData) {
      const updatedSets = [...editableRowData.sets];

      if (updatedSets[setIndex]) {
        updatedSets[setIndex] = {
          ...updatedSets[setIndex],
          [setAttribute]: e.target.value,
        };

        if (editableRowData.type === "Strength") {
          setEditableRowData({
            ...editableRowData,
            sets: updatedSets as StrengthSet[],
          });
        } else if (editableRowData.type === "Cardio") {
          setEditableRowData({
            ...editableRowData,
            sets: updatedSets as CardioSet[],
          });
        } else if (editableRowData.type === "Stretch") {
          setEditableRowData({
            ...editableRowData,
            sets: updatedSets as StretchSet[],
          });
        }
      } else {
        console.error(`Set at index ${setIndex} does not exist.`);
      }
    } else {
      console.error("Editable row data is not set.");
    }
  };

  // const handleUpdateExerciseSet1 = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   workoutIndex: number,
  //   setAttribute: string,
  //   setIndex: number
  // ) => {
  //   const updateSets = <T extends StrengthSet | CardioSet | StretchSet>(
  //     sets: T[],
  //     sIndex: number,
  //     value: string
  //   ): T[] =>
  //     sets.map((set, idx) =>
  //       idx === sIndex ? ({ ...set, [setAttribute]: value } as T) : set
  //     );
  //   const updatedWorkouts = allExercises.map((workout, wIndex) => {
  //     if (wIndex === workoutIndex) {
  //       if (workout.type === "Strength" && "reps" in workout.sets[0]) {
  //         const updatedSets = updateSets(
  //           workout.sets as StrengthSet[],
  //           setIndex,
  //           e.target.value
  //         );
  //         return { ...workout, sets: updatedSets };
  //       } else if (workout.type === "Cardio" && "distance" in workout.sets[0]) {
  //         const updatedSets = updateSets(
  //           workout.sets as CardioSet[],
  //           setIndex,
  //           e.target.value
  //         );
  //         return { ...workout, sets: updatedSets };
  //       } else if (workout.type === "Stretch" && "seconds" in workout.sets[0]) {
  //         const updatedSets = updateSets(
  //           workout.sets as StretchSet[],
  //           setIndex,
  //           e.target.value
  //         );
  //         return { ...workout, sets: updatedSets };
  //       }
  //       return workout;
  //     }
  //     return workout;
  //   });
  //   setAllExercisesTemp(updatedWorkouts as Exercise[]);
  // };
  const handleDeleteExercise = (exerciseId: number) => {
    // const deletedWorkout = allExercises.find((_workout, i) => i === exerciseId);
    // const updatedWorkouts = allExercises.filter(
    //   (_workout, i) => i !== exerciseId
    // );
    const todaysDate = recordTodaysWorkout.date;
    console.log("delete workout is: ", exerciseId, allExercises);
    axios
      .delete(`${serverAPI}/workoutlogins/${exerciseId}`, {
        params: {
          rawWorkoutDate: todaysDate,
        },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      })
      .then((response) => {
        const { exercises } = response.data;
        if (exercises.length === 0) {
          setAllExercises([]);
          return;
        }
        const filteredServerData = exercises.map((exercise) => {
          const { exerciseName, type, sets } = exercise;
          const filteredSets = sets.map(({ id, ...rest }) => rest);

          return {
            exerciseName,
            type,
            sets: filteredSets,
          };
        });
        setAllExercises(filteredServerData);
      })
      .catch((error) => {
        console.log("error is: ", error);
      });
    // setAllExercises(updatedWorkouts);
    setIsEditing(false);
    setEditingRowIndex(null);
  };

  ///////////////////////// Testing Purposes  /////////////////////////

  // const testEndpoint = () => {
  //   console.log("testEndpoint");
  //   axios
  //     .get(`${serverAPI}/workoutlogins`)
  //     .then((response) => {
  //       console.log("response is workoutlogin: ", response.data);
  //     })
  //     .catch((error) => {
  //       console.log("error is: ", error);
  //     });
  // };
  // const testPOSTEndpoint = () => {
  //   console.log("testEndpoint");
  //   axios
  //     .post(`${serverAPI}/workoutlogins`, {
  //       email: "sri@gmail.com",
  //     })
  //     .then((response) => {
  //       console.log("response is workoutlogin: ", response.data);
  //     })
  //     .catch((error) => {
  //       console.log("error is: ", error);
  //     });
  // };

  console.log("exerciseNameUpdateTable: ", exerciseNameUpdateTable);

  console.log("allExercises is: ", allExercises[0]);

  console.log("TOdays Workout Username and id are: ", username, userId);
  return (
    <>
      <Box>
        <Box className="w-full flex justify-center items-center px-4">
          <Box className="space-y-7 px-4 items-center flex flex-col md:flex-row md:items-center md:space-x-7">
            <Box className="space-y-4">
              <AddExerciseForm
                handleSetAddForm={handleSetAddForm}
                addSetToCurrentWorkout={addSetToCurrentWorkout}
                removeLastSetFromCurrentWorkout={
                  removeLastSetFromCurrentWorkout
                }
                currentExercise={currentExercise}
                addExerciseToDaysWorkout={addExerciseToDaysWorkout}
                selectedWorkoutType={selectedWorkoutType}
                handleSelectWorkoutType={handleSelectWorkoutType}
                handleExerciseNameAddForm={handleExerciseNameAddForm}
                exerciseName={exerciseName}
                setExerciseName={setExerciseName}
              />
            </Box>

            <Box className="space-y-4 flex flex-col justify-end">
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
                  <TableHeaderContent />
                </Table.Header>
                <Table.Body>
                  {allExercises.map((workout, index) =>
                    editingRowIndex === index ? (
                      <EditableExerciseRow
                        workout={workout}
                        index={index}
                        editableRowData={editableRowData || null}
                        editingRowIndex={editingRowIndex}
                        handleUpdateExerciseName={handleUpdateExerciseName}
                        handleUpdateExerciseSet={handleUpdateExerciseSet}
                        isEditing={index === editingRowIndex}
                        UpdateWorkoutButton={UpdateWorkoutButton}
                        DeleteWorkoutButton={DeleteWorkoutButton}
                        setIsEditing={setIsEditing}
                        recordTodaysWorkout={recordTodaysWorkout}
                        setEditingRowIndex={setEditingRowIndex}
                        handleUpdateExercise={handleUpdateExercise}
                        handleDeleteExercise={handleDeleteExercise}
                      />
                    ) : (
                      <StaticExerciseRow
                        key={index}
                        workout={workout}
                        index={index}
                        recordTodaysWorkout={recordTodaysWorkout}
                        editingRowIndex={editingRowIndex}
                        startRowEditProcess={startRowEditProcess}
                        handleDeleteExercise={handleDeleteExercise}
                      />
                    )
                  )}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="sticky w-full bg-gray-100 bg-white p-4 shadow-md flex justify-end">
        <Button
          className="mt-6 text-lg py-4 px-8"
          size="4"
          variant="solid"
          color="jade"
          onClick={finishTodaysWorkout}
        >
          Finish Workout
        </Button>
      </Box>
      <Toaster />
    </>
  );
};

// Main Sections:
const TableHeaderContent: React.FC = () => {
  return (
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
  );
};
const StaticExerciseRow: React.FC<StaticExerciseRowProps> = ({
  workout,
  index,
  recordTodaysWorkout,
  editingRowIndex,
  startRowEditProcess,
  handleDeleteExercise,
}) => {
  console.log("in static exercise Row: ", workout);
  return (
    <Table.Row key={index}>
      <Table.Cell>
        <span className="hidden sm:block">
          {new Date(recordTodaysWorkout.date).toDateString()}
        </span>

        <span className="block sm:hidden">
          {format(new Date(recordTodaysWorkout.date), "MM/dd/yyyy")}
        </span>
      </Table.Cell>
      <Table.Cell>
        {workout.type}{" "}
        <Box className="block md:hidden mt-2">
          <TextField.Input
            disabled={editingRowIndex !== index}
            value={workout.exerciseName}
          />
        </Box>
        <Box className="block md:hidden">
          {workout.sets.map((individualSet, setIndex) => (
            <Box key={setIndex}>
              {Object.entries(individualSet).map(
                ([setAttribute, setValue], attributeIndex) => (
                  <Box
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
                    />
                  </Box>
                )
              )}
            </Box>
          ))}
        </Box>
      </Table.Cell>
      <Table.Cell className="hidden md:table-cell">
        <TextField.Input
          disabled={editingRowIndex !== index}
          value={workout.exerciseName}
        />
      </Table.Cell>
      <Table.Cell className="hidden md:table-cell">
        {workout.sets.map((individualSet, setIndex) => (
          <Box key={setIndex}>
            {Object.entries(individualSet).map(
              ([setAttribute, setValue], attributeIndex) => (
                <Box
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
                  />
                </Box>
              )
            )}
          </Box>
        ))}
      </Table.Cell>

      <Table.Cell className="space-y-4">
        <EditWorkoutButton
          startRowEditProcess={startRowEditProcess}
          index={index}
        />
        <span className="block md:hidden ">
          <DeleteWorkoutButton
            index={workout.exerciseId}
            onDelete={handleDeleteExercise}
          />
        </span>
      </Table.Cell>
      <Table.Cell className="hidden md:table-cell">
        <DeleteWorkoutButton
          index={workout.exerciseId}
          onDelete={handleDeleteExercise}
        />
      </Table.Cell>
    </Table.Row>
  );
};
const EditableExerciseRow: React.FC<EditableExerciseRowProps> = ({
  workout,
  index,
  editableRowData,
  editingRowIndex,
  handleUpdateExerciseName,
  handleUpdateExerciseSet,
  UpdateWorkoutButton,
  DeleteWorkoutButton,
  setEditingRowIndex,
  setIsEditing,
  handleUpdateExercise,
  handleDeleteExercise,
  recordTodaysWorkout,
}) => {
  console.log("in EditableExerciseRow: ", workout);
  return (
    <Table.Row key={index}>
      <Table.Cell>
        <span className="hidden sm:block">
          {new Date(recordTodaysWorkout.date).toDateString()}
        </span>

        <span className="block sm:hidden">
          {format(recordTodaysWorkout.date, "MM/dd/yyyy")}
        </span>
      </Table.Cell>
      <Table.Cell>
        <WorkoutSummaryMobileView
          index={workout.exerciseId}
          workout={workout}
          editingRowIndex={editingRowIndex}
          editableRowData={editableRowData as Exercise | undefined}
          handleUpdateExerciseSet={handleUpdateExerciseSet}
          handleUpdateExerciseName={handleUpdateExerciseName}
          handleUpdateExercise={handleUpdateExercise}
        />
      </Table.Cell>
      <Table.Cell className="hidden md:table-cell">
        <TextField.Input
          disabled={editingRowIndex !== index}
          value={editableRowData?.exerciseName}
          onChange={(e) => handleUpdateExerciseName(e)}
        />
      </Table.Cell>
      <Table.Cell className="hidden md:table-cell">
        {editableRowData?.sets.map((individualSet, setIndex) => (
          <Box key={setIndex}>
            {Object.entries(individualSet).map(
              ([setAttribute, setValue], attributeIndex) => (
                <Box
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
                        setAttribute, // The 'set' attribute name (e.g., 'reps', 'weight')
                        setIndex // The 'set' index in the workout's sets array
                      )
                    }
                  />
                </Box>
              )
            )}
          </Box>
        ))}
      </Table.Cell>

      <Table.Cell className="space-y-4">
        <UpdateWorkoutButton
          index={workout.exerciseId}
          onUpdate={handleUpdateExercise}
          setIsEditing={setIsEditing}
          setEditingRowIndex={setEditingRowIndex}
        />

        <span className="block md:hidden ">
          <DeleteWorkoutButton
            index={workout.exerciseId}
            onDelete={handleDeleteExercise}
          />
        </span>
      </Table.Cell>
      <Table.Cell className="hidden md:table-cell">
        <DeleteWorkoutButton
          index={workout.exerciseId}
          onDelete={handleDeleteExercise}
        />
      </Table.Cell>
    </Table.Row>
  );
};

const WorkoutSummaryMobileView: React.FC<WorkoutSummaryMobileViewProps> = ({
  workout,
  index,
  editingRowIndex,
  editableRowData,
  handleUpdateExerciseSet,
  handleUpdateExerciseName,
}) => {
  console.log("in WorkoutSummaryMobileView: ", workout);
  return (
    <>
      {workout.type}{" "}
      <Box className="block md:hidden mt-2">
        <TextField.Input
          disabled={editingRowIndex !== index}
          value={editableRowData?.exerciseName}
          onChange={(e) => handleUpdateExerciseName(e)}
        />
      </Box>
      <Box className="block md:hidden">
        {editableRowData?.sets.map((individualSet, setIndex) => (
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
                        setAttribute, // The 'set' attribute name (e.g., 'reps', 'weight')
                        setIndex // The 'set' index in the workout's sets array
                      )
                    }
                  />
                </div>
              )
            )}
          </div>
        ))}
      </Box>
    </>
  );
};

// Table Buttons:

const EditWorkoutButton: React.FC<EditWorkoutButtonProps> = ({
  startRowEditProcess,
  index,
}) => {
  console.log("in EditWorkoutButton: ", index);
  return (
    <Button
      className="p-20"
      variant="soft"
      radius="large"
      color="indigo"
      highContrast
      onClick={() => startRowEditProcess(index)}
    >
      <Pencil1Icon width="17" height="17" />
      Edit
    </Button>
  );
};
const UpdateWorkoutButton: React.FC<UpdateWorkoutButtonProps> = ({
  index,
  onUpdate,
  setEditingRowIndex,
}) => {
  console.log("in UpdateWorkoutButton: ", index);
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
          Are you sure you want to update this workout? {index}
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
  console.log("in DeleteWorkoutButton: ", index);
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
          Are you sure you want to delete this workout? {index}
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

export default TodaysWorkoutComponent;
