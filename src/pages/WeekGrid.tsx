import React, { useState } from "react";
import { WorkoutLevelBadge } from "../components/WorkoutLevelBadge";
import { Box, Grid } from "@radix-ui/themes";

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

const WeekGrid = () => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="y-space-18">
      <div className="mx-4 my-2">
        <form>
          <input type="text" placeholder="Workout Type" />
          <button type="submit">Submit</button>
        </form>
        <div className="flex flex-col divide-y divide-gray-300 md:flex-row divide-x divide-gray-300 bg-gray-100 rounded-lg shadow-md">
          <Box className="flex-1 flex items-center justify-center text-gray-800 bg-blue-600 hover:bg-orange-500 transition-transform transform hover:scale-105 rounded-t-lg md:rounded-l-lg">
            <DayCard day="Sunday" />
          </Box>
          <Box className="flex-1 flex items-center justify-center text-gray-800 bg-blue-600 hover:bg-orange-500 transition-transform transform hover:scale-105">
            <DayCard day="Monday" />
          </Box>
          <Box className="flex-1 flex items-center justify-center text-gray-800 bg-blue-600 hover:bg-orange-500 transition-transform transform hover:scale-105">
            <DayCard day="Tuesday" />
          </Box>
          <Box className="flex-1 flex items-center justify-center text-gray-800 bg-blue-600 hover:bg-orange-500 transition-transform transform hover:scale-105">
            <DayCard day="Wednesday" />
          </Box>
          <Box className="flex-1 flex items-center justify-center text-gray-800 bg-blue-600 hover:bg-orange-500 transition-transform transform hover:scale-105">
            <DayCard day="Thursday" />
          </Box>
          <Box className="flex-1 flex items-center justify-center text-gray-800 bg-blue-600 hover:bg-orange-500 transition-transform transform hover:scale-105">
            <DayCard day="Friday" />
          </Box>
          <Box className="flex-1 flex items-center justify-center text-gray-800 bg-blue-600 hover:bg-orange-500 transition-transform transform hover:scale-105 rounded-b-lg md:rounded-r-lg">
            <DayCard day="Saturday" />
          </Box>
        </div>
      </div>
    </div>
  );
};

const DayCard = ({ day }: { day: string }) => {
  return <div className="text-white">{day}</div>;
};

export default WeekGrid;
