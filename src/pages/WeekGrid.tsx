import React, { useEffect, useState } from "react";
import { WorkoutLevelBadge } from "../components/WorkoutLevelBadge";
import { Box, Button, Text } from "@radix-ui/themes";
import { WorkoutLevel } from "../components/WorkoutLevelBadge";
import * as Select from "@radix-ui/react-select";
import axiosInstance from "../util/axiosInterceptor";
const serverAPI = "http://localhost:8080";

interface PlannedWorkout {
  id: number;
  type: string;
  exercises: { name: string }[];
}

interface DayPlan {
  id: number;
  day: string;
  workouts: PlannedWorkout[];
  duration: string;
  intensity: string;
}
const newWeek = [
  {
    id: 0,
    day: "Sunday",
    workouts: [
      {
        id: 0,
        exercises: [],
      },
    ],
    duration: "",
    intensity: "Light",
  },
  {
    id: 0,
    day: "Monday",
    workouts: [
      {
        id: 0,
        exercises: [],
      },
    ],
    duration: "",
    intensity: "Light",
  },
  {
    id: 0,
    day: "Tuesday",
    workouts: [
      {
        id: 0,
        exercises: [],
      },
    ],
    duration: "",
    intensity: "Light",
  },
  {
    id: 0,
    day: "Wednesday",
    workouts: [
      {
        id: 0,
        exercises: [],
      },
    ],
    duration: "",
    intensity: "Light",
  },
  {
    id: 0,
    day: "Thursday",
    workouts: [
      {
        id: 0,
        exercises: [],
      },
    ],
    duration: "",
    intensity: "Light",
  },
  {
    id: 0,
    day: "Friday",
    workouts: [
      {
        id: 0,
        exercises: [],
      },
    ],
    duration: "",
    intensity: "Light",
  },
  {
    id: 0,
    day: "Saturday",
    workouts: [
      {
        id: 0,
        exercises: [],
      },
    ],
    duration: "",
    intensity: "Light",
  },
];
const initialPlanData: DayPlan[] = [
  {
    id: 0,
    day: "Sunday",
    workouts: [
      {
        id: 0,
        type: "Stretch",
        exercises: [{ name: "Exercise 1" }, { name: "Exercise 2" }],
      },
      {
        id: 0,
        type: "Cardio",
        exercises: [{ name: "Running" }, { name: "Jumping Jacks" }],
      },
    ],
    duration: "30 minutes",
    intensity: "Light",
  },
  {
    id: 0,
    day: "Monday",
    workouts: [
      {
        id: 0,
        type: "Strength",
        exercises: [{ name: "Push-Ups" }, { name: "Dumbbell Curls" }],
      },
    ],
    duration: "45 minutes",
    intensity: "Moderate",
  },
  {
    id: 0,
    day: "Tuesday",
    workouts: [
      {
        id: 0,
        type: "Strength",
        exercises: [{ name: "Squats" }, { name: "Leg Curls" }],
      },
    ],
    duration: "60 minutes",
    intensity: "Intense",
  },
  {
    id: 0,
    day: "Wednesday",
    workouts: [
      {
        id: 0,
        type: "Strength",
        exercises: [{ name: "Shoulder Press" }, { name: "Preacher Curls" }],
      },
    ],
    duration: "90 minutes",
    intensity: "Intense",
  },
  {
    id: 0,
    day: "Thursday",
    workouts: [
      {
        id: 0,
        type: "Strength",
        exercises: [{ name: "Leg Press" }, { name: "Deadlifts" }],
      },
    ],
    duration: "10 minutes",
    intensity: "Light",
  },
  {
    id: 0,
    day: "Friday",
    workouts: [
      {
        id: 0,
        type: "Chest",
        exercises: [{ name: "Dips" }, { name: "Incline Press" }],
      },
    ],
    duration: "40 minutes",
    intensity: "Moderate",
  },
  {
    id: 0,
    day: "Saturday",
    workouts: [
      {
        id: 0,
        type: "Strength",
        exercises: [{ name: "Pull-ups" }, { name: "Bicep Curls" }],
      },
    ],
    duration: "20 minutes",
    intensity: "Moderate",
  },
];

const WeekGrid = () => {
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(initialPlanData);
  const [userTemplateWeek, setUserTemplateWeek] =
    useState<DayPlan[]>(initialPlanData);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    getWeekPlanCall();
  }, []);

  const deleteCurrentWeek = () => {
    console.log("Make Call: ");
    axiosInstance.delete(`${serverAPI}/weekplan/`).then((response) => {
      console.log("DELETE weekplan res: ", response.data);
      setWeekPlan(newWeek);
    });
  };

  const getWeekPlanCall = () => {
    axiosInstance.get(`${serverAPI}/weekplan/`).then((response) => {
      console.log("GET weekplan res: ", response.data);
      setWeekPlan(response.data);
    });
  };
  const saveCurrentWeek = () => {
    axiosInstance.post(`${serverAPI}/weekplan/`, weekPlan).then((response) => {
      console.log("GET weekplan res: ", response.data);
      setWeekPlan(response.data);
    });
  };
  const saveBadgeCurrentWeek = (newDayPlan: DayPlan) => {
    const updatedPlanData = weekPlan.map((plan) =>
      plan.day === newDayPlan.day ? newDayPlan : plan
    );
    setWeekPlan(updatedPlanData);
    // axiosInstance
    //   .post(`${serverAPI}/weekplan/`, updatedPlanData)
    //   .then((response) => {
    //     console.log("GET weekplan res: ", response.data);
    //   });
  };
  const postWeekPlanCall = (updatedDayPlan) => {
    const updatedPlanData = weekPlan.map((plan) =>
      plan.day === updatedDayPlan.day ? updatedDayPlan : plan
    );
    console.log(
      "We are sending this to server: ",
      JSON.stringify(updatedPlanData)
    );
    axiosInstance
      .post(`${serverAPI}/weekplan/`, JSON.stringify(updatedPlanData))
      .then((response) => {
        console.log("POST weekplan res: ", response.data);
        setWeekPlan(response.data);
      })
      .catch((error) => {
        console.log("postWeekPlanCall error is: ", error);
      });
  };

  const handleEditClick = (day) => {
    console.log("handleEditClick   pressed!");
    // setIsEditing(false);
    setSelectedDay(day);
  };
  const updateDayPlan = (updatedDayPlan: DayPlan) => {
    const updatedPlanData = weekPlan.map((plan) =>
      plan.day === updatedDayPlan.day ? updatedDayPlan : plan
    );
    setWeekPlan(updatedPlanData);
  };

  const handleSaveClick = (updatedDayPlan: DayPlan) => {
    console.log("updatedDayPlan is: ", updatedDayPlan);
    try {
      setSelectedDay(null);
      console.log("handleSaveClick pressed!");
      // updateDayPlan(updatedDayPlan);
      postWeekPlanCall(updatedDayPlan);
      // const updatedPlanData = [...weekPlan];
      // setWeekPlan(updatedPlanData);
    } catch (error) {
      console.log("error: ", error);
      // setWeekPlan(updatedPlanData);
    }
    // setIsEditing(true);
  };
  const saveUserWeek = () => {
    axiosInstance
      .post(`${serverAPI}/weekplan/`, JSON.stringify(weekPlan))
      .then((response) => {
        console.log("SAVED weekplan res: ", response.data);
        setWeekPlan(response.data);
      })
      .catch((error) => {
        console.log("postWeekPlanCall error is: ", error);
      });
  };

  const findPlanForDay = (day: string) => {
    const dayPlan = weekPlan.find((plan) => plan.day === day);
    return dayPlan;
  };
  const handleResetWeek = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the entire week's workouts?"
      )
    ) {
      const clearedPlanData = weekPlan.map((dayPlan) => ({
        ...dayPlan,
        workouts: [],
        intensity: "LIGHT",
        duration: "",
      }));

      setWeekPlan(clearedPlanData);
    }
  };
  const loadTemplateWeek = () => {
    if (
      window.confirm(
        "Are you sure you want to load the template week's workouts?"
      )
    ) {
      setWeekPlan(userTemplateWeek);
    }
  };

  const saveTemplateWeek = () => {
    if (
      window.confirm(
        "Are you sure you want to save the current week as the template?"
      )
    ) {
      setUserTemplateWeek(weekPlan);
    }
  };
  console.log("weekPlan is : ", weekPlan);
  console.log("weekPlan is typeof: ", typeof weekPlan);
  return (
    <div className="space-y-4">
      <Box className="flex flex-column justify-between space-x-4">
        <Box className="space-x-4">
          <Button onClick={loadTemplateWeek}>Load Template Week</Button>
          <Button onClick={saveTemplateWeek}>Save Week As Template</Button>
          <Button onClick={deleteCurrentWeek}>Delete Current Week</Button>
        </Box>
        <Box>
          <Button onClick={saveCurrentWeek}>Save Current Week</Button>
        </Box>
      </Box>
      <div className="py-4 px-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-2xl">
        <div className="flex overflow-x-auto snap-x snap-mandatory">
          {weekPlan.map((dayPlan) => (
            <DayCard
              key={dayPlan.day}
              dayPlan={dayPlan}
              onEditClick={() => handleEditClick(dayPlan.day)}
              handleSaveClick={handleSaveClick}
              updateDayPlan={updateDayPlan}
              saveBadgeCurrentWeek={saveBadgeCurrentWeek}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface DayCardProps {
  dayPlan: DayPlan;
  onEditClick: () => void;
  handleSaveClick: (dayOutline: DayPlan) => void;
  saveBadgeCurrentWeek: (dayOutline: DayPlan) => void;
  updateDayPlan: (updatedDayPlan: DayPlan) => void;
}

const DayCard: React.FC<DayCardProps> = ({
  dayPlan,
  handleSaveClick,
  updateDayPlan,
  saveBadgeCurrentWeek,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [dayOutline, setDayOutline] = useState<DayPlan>(dayPlan!);
  const [originalDayPlan, setOriginalDayPlan] = useState<DayPlan>(dayPlan!);

  const handleAddNewExercise = (workoutId: number) => {
    setDayOutline((prevDayOutline) => {
      return {
        ...prevDayOutline,
        workouts: prevDayOutline.workouts.map((workout) => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              exercises: [...workout.exercises, { name: "" }],
            };
          }
          return workout;
        }),
      };
    });
  };
  const handleRemoveLastExercise = (workoutId: number) => {
    setDayOutline((prevDayOutline) => {
      return {
        ...prevDayOutline,
        workouts: prevDayOutline.workouts.map((workout) => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              exercises: workout.exercises.slice(0, -1),
            };
          }
          return workout;
        }),
      };
    });
  };
  const handleAddNewWorkout = (day) => {
    setDayOutline((prevDayOutline) => {
      if (prevDayOutline.day === day) {
        const newWorkout = {
          id: Date.now().toString(),
          type: "",
          exercises: [],
        };

        return {
          ...prevDayOutline,
          workouts: [...prevDayOutline.workouts, newWorkout],
        };
      }
      return prevDayOutline;
    });
  };
  const handleRemoveLastWorkout = (day) => {
    setDayOutline((prevDayOutline) => {
      if (prevDayOutline.day === day && prevDayOutline.workouts.length > 0) {
        return {
          ...prevDayOutline,
          workouts: prevDayOutline.workouts.slice(0, -1),
        };
      }
      return prevDayOutline;
    });
  };
  useEffect(() => {
    setDayOutline(dayPlan);
    setOriginalDayPlan(dayPlan!);
  }, [dayPlan]);

  const handleSaveDay = (day) => {
    try {
      setDayOutline((prevDayOutline) => {
        if (prevDayOutline.day === day) {
          // Filter out exercises with empty names & with no exercises
          const filteredWorkouts = prevDayOutline.workouts
            .map((workout) => {
              return {
                ...workout,
                exercises: workout.exercises.filter(
                  (exercise) => exercise.name !== ""
                ),
              };
            })
            .filter((workout) => workout.exercises.length > 0);

          return {
            ...prevDayOutline,
            workouts: filteredWorkouts,
          };
        }
        return prevDayOutline;
      });
      handleSaveClick(dayOutline);
      // updateDayPlan(dayOutline);
      // setDayOutline({ ...dayOutline, intensity: originalDayPlan.intensity });
      setIsEditing(false);
      console.log("handleSaveDay in Child");
    } catch (error) {
      updateDayPlan(originalDayPlan);
      console.log("Error, returning back to last saved: ", originalDayPlan);
    }
  };

  // useEffect(() => {
  //   setDayOutline(dayPlan);
  // }, [dayPlan]);

  if (!dayPlan) {
    return <div>Loading...</div>;
  }

  const handleWorkoutTypeChange = (workoutId: number, newType: string) => {
    const updatedWorkouts = dayOutline.workouts.map((workout) => {
      if (workout.id === workoutId) {
        return { ...workout, type: newType };
      }
      return workout;
    });
    setDayOutline({ ...dayOutline, workouts: updatedWorkouts });
  };

  const handleExerciseNameChange = (
    workoutId: number,
    exerciseIndex: number,
    newName: string
  ) => {
    console.log("workoutId is: ", workoutId);
    const updatedWorkouts = dayOutline.workouts.map((workout) => {
      if (workout.id === workoutId) {
        const updatedExercises = workout.exercises.map((exercise, index) => {
          if (index === exerciseIndex) {
            console.log(
              "editing exercise name",
              workout,
              exercise.name,
              newName
            );
            return { ...exercise, name: newName };
          }
          console.log("returned exercise is: ", exercise);
          return exercise;
        });
        console.log("returned updatedExercises is: ", updatedExercises);
        return { ...workout, exercises: updatedExercises };
      }
      return workout;
    });
    console.log("new workout is: ", updatedWorkouts);
    setDayOutline({ ...dayOutline, workouts: updatedWorkouts });
  };

  function convertToWorkoutLevelKey(key: string): WorkoutLevel {
    return key.toUpperCase() as WorkoutLevel;
  }
  const handleQuickIntensityChange = (
    day: string,
    intensityToUpdate: string
  ) => {
    console.log("handleQuickIntensityChange: ", day, intensityToUpdate);
    const intensities = ["Light", "Moderate", "Intense"];
    let toggleIntensityInd = intensities.findIndex(
      (intensity) => intensity === intensityToUpdate
    );
    toggleIntensityInd = (toggleIntensityInd + 1) % intensities.length;
    console.log(
      "New intensity is: ",
      intensities[toggleIntensityInd],
      toggleIntensityInd
    );
    const newIntensity = intensities[toggleIntensityInd];
    console.log("updatedWorkouts is: ", newIntensity);
    const newDayPlan = { ...dayPlan, intensity: newIntensity };
    saveBadgeCurrentWeek(newDayPlan);
    setDayOutline(newDayPlan);
    // handleSaveDay(dayOutline.day);
  };

  return (
    <Box className="border rounded-lg p-4 m-2 bg-gray-100 shadow space-y-4">
      <h2 className="font-bold text-lg mb-2">
        {dayPlan.day} <br />
        <Box
          onClick={() =>
            handleQuickIntensityChange(dayPlan.day, dayPlan.intensity)
          }
        >
          <WorkoutLevelBadge
            workoutLevel={
              convertToWorkoutLevelKey(dayOutline.intensity) as WorkoutLevel
            }
          />{" "}
        </Box>
      </h2>

      <Box hidden={!isEditing} className="mt-3 mb-3">
        <SelectIntensityUI
          setDayOutline={setDayOutline}
          dayOutline={dayOutline}
        />
      </Box>
      {dayOutline.workouts.map((workout, index) => (
        <div key={index} className="mb-4">
          {isEditing ? (
            <>
              <label hidden={!isEditing} htmlFor="type">
                Excercise Type
              </label>
              <select
                id="type"
                value={workout.type}
                disabled={!isEditing}
                hidden={!isEditing}
                onChange={(e) =>
                  handleWorkoutTypeChange(workout.id, e.target.value)
                }
                className="border rounded px-2 py-1 w-full"
              >
                <option value="Stretch">Stretch</option>
                <option value="Strength">Strength</option>
                <option value="Cardio">Cardio</option>
              </select>
            </>
          ) : (
            <div className="font-bold text-l mb-1 underline">
              {workout.type}
            </div>
          )}
          {workout.exercises.map((exercise, index) =>
            isEditing ? (
              <input
                key={index}
                type="text"
                value={exercise.name}
                onChange={(e) =>
                  handleExerciseNameChange(workout.id, index, e.target.value)
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddNewExercise(workout.id);
                  }
                }}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              <div key={index}>- {exercise.name}</div>
            )
          )}

          {isEditing && (
            <Box className="mt-2 space-x-3 mb-3 flex items-center">
              <Button
                onClick={() => handleRemoveLastExercise(workout.id)}
                className="text-white py-1 px-3 rounded mt-2"
              >
                -
              </Button>
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevents the default form submission behavior
                  handleAddNewExercise(workout.id);
                }}
              >
                <Button>+</Button>
              </form>
            </Box>
          )}
          <hr />
        </div>
      ))}
      <Box>
        <label hidden={!isEditing} htmlFor="duration">
          Duration
        </label>
        <input
          id="duration"
          type="text"
          value={dayOutline.duration}
          disabled={!isEditing}
          onChange={(e) =>
            setDayOutline({ ...dayPlan, duration: e.target.value })
          }
          className="border rounded px-2 py-1 w-full"
        />
      </Box>

      <Box>
        {!isEditing && (
          <Button
            className="w-full bg-blue-500 text-white hover:bg-blue-700"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
        {isEditing && (
          <Box className="flex flex-col space-y-3">
            <Box className="flex justify-evenly space-x-2">
              <Button
                onClick={() => handleRemoveLastWorkout(dayOutline.day)}
                className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mt-2"
              >
                - Exercise
              </Button>
              <Button
                onClick={() => handleAddNewWorkout(dayOutline.day)}
                className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mt-2"
              >
                + Exercise
              </Button>
            </Box>

            <Button
              className="text-white py-1 px-3 rounded mt-2"
              onClick={() => handleSaveDay(dayOutline.day)}
            >
              Save
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                setDayOutline(originalDayPlan); // Reset to original plan
              }}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
interface SelectIntensityUIProps {
  dayOutline: DayPlan;
  setDayOutline: (updatedDayPlan: DayPlan) => void;
}
const SelectIntensityUI: React.FC<SelectIntensityUIProps> = ({
  setDayOutline,
  dayOutline,
}) => {
  return (
    <>
      <Text>Pick Workout Intensity</Text>
      <Select.Root
        value={dayOutline.intensity}
        onValueChange={(value) => {
          console.log("value is: ", value);
          setDayOutline({ ...dayOutline, intensity: value });
        }}
      >
        <Select.Trigger
          className="inline-flex items-center justify-between rounded-md px-4 py-2 text-sm leading-none h-9 gap-2 bg-blue-500 text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
          aria-label="Intensities"
        >
          <Select.Value>{dayOutline.intensity} </Select.Value>
          <Select.Icon />
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default" />
            <Select.Viewport className="p-[10px]">
              <Select.Group>
                <Select.Label className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100">
                  Intensity
                </Select.Label>
                <Select.Item
                  className="px-4 py-2 text-sm hover:bg-blue-50"
                  value="Light"
                >
                  Light
                </Select.Item>
                <Select.Item
                  className="px-4 py-2 text-sm hover:bg-blue-50"
                  value="Moderate"
                >
                  Moderate
                </Select.Item>
                <Select.Item
                  className="px-4 py-2 text-sm hover:bg-blue-50"
                  value="Intense"
                >
                  Intense
                </Select.Item>
              </Select.Group>
            </Select.Viewport>
            <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default" />
            <Select.Arrow />
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </>
  );
};

export default WeekGrid;
