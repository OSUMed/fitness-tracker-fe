import { Badge } from "@radix-ui/themes";
import React from "react";

type WorkoutLevel = "LIGHT" | "MODERATE" | "INTENSE";

const workoutLevelMap: Record<
  WorkoutLevel,
  { color: "mint" | "amber" | "crimson"; level: string; style: string }
> = {
  LIGHT: {
    color: "mint",
    level: "Light",
    style: "Solid",
  },
  MODERATE: {
    color: "amber",
    level: "Moderate",
    style: "Soft",
  },
  INTENSE: {
    color: "crimson",
    level: "Intense",
    style: "Outline",
  },
};

export const WorkoutLevelBadge = ({
  workoutLevel,
}: {
  workoutLevel: WorkoutLevel;
}) => {
  return (
    <Badge color={workoutLevelMap[workoutLevel].color}>
      {workoutLevelMap[workoutLevel].level}
    </Badge>
  );
};
