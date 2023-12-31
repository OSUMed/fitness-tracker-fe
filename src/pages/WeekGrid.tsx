import React, { useEffect, useState } from "react";
import { WorkoutLevelBadge } from "../components/WorkoutLevelBadge";
import { Box, Button } from "@radix-ui/themes";
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
    <div className="y-space-18">
      <div className="mx-4 my-2">
        <div className="flex flex-col divide-y divide-gray-300 md:flex-row divide-x divide-gray-300 bg-gray-100 rounded-lg shadow-md">
          <Box className="flex-1 flex items-center justify-center text-gray-800 bg-blue-600 hover:bg-orange-500 transition-transform transform hover:scale-105 rounded-t-lg md:rounded-l-lg">
            <DayCard
              dayPlan={findPlanForDay("Sunday")}
              onEditClick={() => handleEditClick("Sunday")}
              handleSaveClick={handleSaveClick}
            />
          </Box>
          <Box className="flex-1 flex items-center justify-center text-gray-800 bg-blue-600 hover:bg-orange-500 transition-transform transform hover:scale-105">
            <DayCard
              dayPlan={findPlanForDay("Monday")}
              onEditClick={() => handleEditClick("Monday")}
              handleSaveClick={handleSaveClick}
            />
          </Box>
          <Box className="flex-1 flex items-center justify-center text-gray-800 bg-blue-600 hover:bg-orange-500 transition-transform transform hover:scale-105">
            <DayCard
              dayPlan={findPlanForDay("Tuesday")}
              onEditClick={() => handleEditClick("Tuesday")}
              handleSaveClick={handleSaveClick}
            />
          </Box>
          <Box className="flex-1 flex items-center justify-center text-gray-800 bg-blue-600 hover:bg-orange-500 transition-transform transform hover:scale-105">
            <DayCard
              dayPlan={findPlanForDay("Wednesday")}
              onEditClick={() => handleEditClick("Wednesday")}
              handleSaveClick={handleSaveClick}
            />
          </Box>
          <Box className="flex-1 flex items-center justify-center text-gray-800 bg-blue-600 hover:bg-orange-500 transition-transform transform hover:scale-105">
            <DayCard
              dayPlan={findPlanForDay("Thursday")}
              onEditClick={() => handleEditClick("Thursday")}
              handleSaveClick={handleSaveClick}
            />
          </Box>
          <Box className="flex-1 flex items-center justify-center text-gray-800 bg-blue-600 hover:bg-orange-500 transition-transform transform hover:scale-105">
            <DayCard
              dayPlan={findPlanForDay("Friday")}
              onEditClick={() => handleEditClick("Friday")}
              handleSaveClick={handleSaveClick}
            />
          </Box>
          <Box className="flex-1 flex items-center justify-center text-gray-800 bg-blue-600 hover:bg-orange-500 transition-transform transform hover:scale-105 rounded-b-lg md:rounded-r-lg">
            <DayCard
              dayPlan={findPlanForDay("Saturday")}
              onEditClick={() => handleEditClick("Saturday")}
              handleSaveClick={handleSaveClick}
            />
          </Box>
        </div>
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
    <div className="border rounded-lg p-4 m-2 bg-gray-100 shadow">
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
        </div>
      ))}
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
      <label hidden={!isEditing} htmlFor="intensity">
        Intensity
      </label>
      <select
        id="intensity"
        value={dayOutline.intensity}
        disabled={!isEditing}
        hidden={!isEditing}
        onChange={(e) =>
          setDayOutline({ ...dayPlan, intensity: e.target.value })
        }
        className="border rounded px-2 py-1 w-full mt-2"
      >
        <option value="LIGHT">Light</option>
        <option value="MODERATE">Moderate</option>
        <option value="INTENSE">Intense</option>
      </select>
      <div className="flex justify-evenly">
        {isEditing ? (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded mt-2"
            onClick={() => setIsEditing(false)}
          >
            Save
          </button>
        ) : (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded mt-2"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
        {isEditing && (
          <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mt-2">
            Add Exercise
          </button>
        )}
      </div>
    </div>
  );
};

export default WeekGrid;
