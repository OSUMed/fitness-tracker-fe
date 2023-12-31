import React from "react";
import { WorkoutLevelBadge } from "../components/WorkoutLevelBadge";

const WeeklyPlanner = () => {
  return (
    <div>
      <WorkoutLevelBadge workoutLevel="LIGHT" />
      <WorkoutLevelBadge workoutLevel="MODERATE" />
      <WorkoutLevelBadge workoutLevel="INTENSE" />
    </div>
  );
};

export default WeeklyPlanner;
