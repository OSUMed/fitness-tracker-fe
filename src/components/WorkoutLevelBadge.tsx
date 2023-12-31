import { Badge } from "@radix-ui/themes";
import React from "react";

type WorkoutLevel = "LIGHT" | "MODERATE" | "INTENSE";

const workoutLevelMap: Record<
  WorkoutLevel,
  {
    color: "mint" | "amber" | "crimson";
    level: string;
    style: "solid" | "soft" | "outline" | "surface";
    radius: "full" | "none" | "large";
  }
> = {
  LIGHT: {
    color: "mint",
    level: "Light",
    style: "outline",
    radius: "none",
  },
  MODERATE: {
    color: "amber",
    level: "Moderate",
    style: "soft",
    radius: "large",
  },
  INTENSE: {
    color: "crimson",
    level: "Intense",
    style: "solid",
    radius: "full",
  },
};

interface Props {
  workoutLevel: WorkoutLevel;
}

export const WorkoutLevelBadge = ({ workoutLevel }: Props) => {
  return (
    <Badge
      variant={workoutLevelMap[workoutLevel].style}
      color={workoutLevelMap[workoutLevel].color}
      radius={workoutLevelMap[workoutLevel].radius}
    >
      {workoutLevelMap[workoutLevel].level}
    </Badge>
  );
};
