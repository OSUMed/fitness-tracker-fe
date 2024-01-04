import React, { useEffect, useState } from "react";
import { WorkoutLevelBadge } from "../components/WorkoutLevelBadge";
import { Box, Button, Select } from "@radix-ui/themes";
import { WorkoutLevel } from "../components/WorkoutLevelBadge";
interface Exercise {
  name: string;
}

interface PlannedWorkout {
  id: string;
  type: string;
  exercises: Exercise[];
}

interface DayPlan {
  day: string;
  workouts: PlannedWorkout[];
  duration: string;
  intensity: string;
}

const initialPlanData: DayPlan[] = [
  {
    day: "Sunday",
    workouts: [
      {
        id: "1",
        type: "Stretch",
        exercises: [{ name: "Exercise 1" }, { name: "Exercise 2" }],
      },
      {
        id: "2",
        type: "Cardio",
        exercises: [{ name: "Running" }, { name: "Jumping Jacks" }],
      },
    ],
    duration: "30 minutes",
    intensity: "Light",
  },
  {
    day: "Monday",
    workouts: [
      {
        id: "3",
        type: "Strength",
        exercises: [{ name: "Push-Ups" }, { name: "Dumbbell Curls" }],
      },
    ],
    duration: "45 minutes",
    intensity: "Moderate",
  },
  {
    day: "Tuesday",
    workouts: [
      {
        id: "4",
        type: "Strength",
        exercises: [{ name: "Squats" }, { name: "Leg Curls" }],
      },
    ],
    duration: "60 minutes",
    intensity: "Intense",
  },
  {
    day: "Wednesday",
    workouts: [
      {
        id: "5",
        type: "Strength",
        exercises: [{ name: "Shoulder Press" }, { name: "Preacher Curls" }],
      },
    ],
    duration: "90 minutes",
    intensity: "Intense",
  },
  {
    day: "Thursday",
    workouts: [
      {
        id: "6",
        type: "Strength",
        exercises: [{ name: "Leg Press" }, { name: "Deadlifts" }],
      },
    ],
    duration: "10 minutes",
    intensity: "Light",
  },
  {
    day: "Friday",
    workouts: [
      {
        id: "7",
        type: "Chest",
        exercises: [{ name: "Dips" }, { name: "Incline Press" }],
      },
    ],
    duration: "40 minutes",
    intensity: "Moderate",
  },
  {
    day: "Saturday",
    workouts: [
      {
        id: "8",
        type: "Strength",
        exercises: [{ name: "Pull-ups" }, { name: "Bicep Curls" }],
      },
    ],
    duration: "20 minutes",
    intensity: "Moderate",
  },
];

const WeekGrid = () => {
  const [planData, setPlanData] = useState<DayPlan[]>(initialPlanData);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const handleEditClick = (day) => {
    console.log("handleEditClick   pressed!");
    // setIsEditing(false);
    setSelectedDay(day);
  };

  const handleSaveClick = () => {
    // setIsEditing(true);
    setSelectedDay(null);
    console.log("handleSaveClick pressed!");
    const updatedPlanData = [...planData];
    setPlanData(updatedPlanData);
  };

  const findPlanForDay = (day: string) => {
    const dayPlan = planData.find((plan) => plan.day === day);
    return dayPlan;
  };

  return (
    <div className="py-4 px-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-2xl">
      <div className="flex overflow-x-auto snap-x snap-mandatory">
        {planData.map((dayPlan) => (
          <DayCard
            key={dayPlan.day}
            dayPlan={dayPlan}
            onEditClick={() => handleEditClick(dayPlan.day)}
            handleSaveClick={handleSaveClick}
          />
        ))}
      </div>
    </div>
  );
};

interface DayCardProps {
  dayPlan: DayPlan | undefined;

  onEditClick: () => void;
  handleSaveClick: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ dayPlan }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [dayOutline, setDayOutline] = useState<DayPlan>(dayPlan!);

  const handleAddNewExercise = (workoutId: string) => {
    setDayOutline((prevDayOutline) => {
      return {
        ...prevDayOutline,
        workouts: prevDayOutline.workouts.map((workout) => {
          // Append an empty exercise to the workout with the matching id
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
  const handleRemoveLastExercise = (workoutId: string) => {
    setDayOutline((prevDayOutline) => {
      return {
        ...prevDayOutline,
        workouts: prevDayOutline.workouts.map((workout) => {
          if (workout.id === workoutId) {
            return {
              ...workout,
              exercises: workout.exercises.slice(0, -1), // Create a new array without the last element
            };
          }
          return workout;
        }),
      };
    });
  };

  useEffect(() => {
    setDayOutline(dayPlan);
  }, [dayPlan]);

  if (!dayPlan) {
    return <div>Loading...</div>; // Or any other placeholder
  }

  const handleWorkoutTypeChange = (workoutId: string, newType: string) => {
    const updatedWorkouts = dayOutline.workouts.map((workout) => {
      if (workout.id === workoutId) {
        return { ...workout, type: newType };
      }
      return workout;
    });
    setDayOutline({ ...dayOutline, workouts: updatedWorkouts });
  };

  const handleExerciseNameChange = (
    workoutId: string,
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

  return (
    <Box className="border rounded-lg p-4 m-2 bg-gray-100 shadow space-y-4">
      <h2 className="font-bold text-lg mb-2">
        {dayPlan.day} <br />
        <WorkoutLevelBadge
          workoutLevel={
            convertToWorkoutLevelKey(dayOutline.intensity) as WorkoutLevel
          }
        />{" "}
      </h2>
      {dayOutline.workouts.map((workout) => (
        <div key={workout.id} className="mb-4">
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
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              <div key={index}>{exercise.name}</div>
            )
          )}
          {isEditing && (
            <Box className="space-x-3 mb-3">
              <Button
                onClick={() => handleRemoveLastExercise(workout.id)}
                className="text-white py-1 px-3 rounded mt-2"
              >
                -
              </Button>
              <Button
                onClick={() => handleAddNewExercise(workout.id)}
                className="text-white py-1 px-3 rounded mt-2"
              >
                +
              </Button>
            </Box>
          )}
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

      <Box hidden={!isEditing} className="mt-3 mb-3">
        <Select.Root
          size="2"
          disabled={!isEditing}
          onValueChange={(value) => {
            setDayOutline({ ...dayPlan, intensity: value });
          }}
        >
          <Select.Trigger
            placeholder="Pick A Workout Intensity"
            variant="surface"
          />
          <Select.Content variant="solid" position="popper">
            <Select.Group>
              <Select.Label>Intensity</Select.Label>
              <Select.Item value="LIGHT">Light</Select.Item>
              <Select.Item value="MODERATE">Moderate</Select.Item>
              <Select.Item value="INTENSE">Intense</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
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
                className="text-white py-1 px-3 rounded mt-2"
                onClick={() => setIsEditing(false)}
              >
                Save
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mt-2">
                Add Exercise
              </Button>
            </Box>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default WeekGrid;
