import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import {
  Workout,
  Strength,
  WorkoutSummary,
  workoutFinal,
  Cardio,
  Stretch,
} from "../types/Workout";
interface PrivateResponse {
  username: string;
}

// Define the shape of the context
export interface UserContextType {
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
  historyRecordedWorkouts: workoutFinal[];
  setHistoryRecordedWorkouts: React.Dispatch<
    React.SetStateAction<workoutFinal[]>
  >;
  allSummaryRecordedWorkouts: WorkoutSummary[];
  setAllSummaryRecordedWorkouts: React.Dispatch<
    React.SetStateAction<WorkoutSummary[]>
  >;
  summaryRecordedWorkouts: WorkoutSummary | null;
  setSummaryRecordedWorkouts: React.Dispatch<
    React.SetStateAction<WorkoutSummary | null>
  >;
  workoutTypeCounts: {
    Cardio: number;
    Strength: number;
    Stretch: number;
  };
  setWorkoutTypeCounts: React.Dispatch<
    React.SetStateAction<{
      Cardio: number;
      Strength: number;
      Stretch: number;
    }>
  >;
}

// Create the context with an initial empty state
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserContextProviderProps {
  children: ReactNode;
}

type Workout = Strength | Cardio | Stretch;
export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [username, setUsername] = useState<string | null>(null);
  const [historyRecordedWorkouts, setHistoryRecordedWorkouts] = useState<
    workoutFinal[]
  >([]);
  const [summaryRecordedWorkouts, setSummaryRecordedWorkouts] =
    useState<WorkoutSummary | null>(null);
  const [allSummaryRecordedWorkouts, setAllSummaryRecordedWorkouts] = useState<
    WorkoutSummary[]
  >([]);
  const [workoutTypeCounts, setWorkoutTypeCounts] = useState({
    Cardio: 1,
    Strength: 1,
    Stretch: 1,
  });
  useEffect(() => {
    // Retrieve the JWT token from local storage
    const jwtToken = localStorage.getItem("accessToken");
    console.log("jwtToken is: ", jwtToken);

    if (jwtToken) {
      axios
        .get("http://localhost:8080/account", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
        .then((response) => {
          console.log("response.data is: ", response.data);
          setUsername(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        historyRecordedWorkouts,
        setHistoryRecordedWorkouts,
        allSummaryRecordedWorkouts,
        setAllSummaryRecordedWorkouts,
        summaryRecordedWorkouts,
        setSummaryRecordedWorkouts,
        workoutTypeCounts,
        setWorkoutTypeCounts,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
