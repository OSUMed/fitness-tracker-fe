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
import axiosInstance from "../util/axiosInterceptor";
interface PrivateResponse {
  username: string;
}

// Define the shape of the context
export interface UserContextType {
  username: string | null;
  userId: string | null;
  isAdmin: boolean;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
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

const clearLocalStorage = () => {
  localStorage.clear();
};

interface UserContextProviderProps {
  children: ReactNode;
}

type Workout = Strength | Cardio | Stretch;
export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<string | null>(null);
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
  // useEffect(() => {
  //   console.log("UserContext username is: ", username);
  //   if (!username || username == "anonymousUser") {
  //     localStorage.clear();
  //   }
  // }, [username]);
  useEffect(() => {
    // Retrieve the JWT token from local storage
    const jwtToken = localStorage.getItem("accessToken");

    if (jwtToken) {
      axiosInstance
        .get("http://localhost:8080/account")
        .then((response) => {
          const { username, userId, authorities } = response.data;
          console.log("account GET response.data is: ", response.data);
          console.log("account GET response.data is2: ", username, userId);
          setUsername(username);
          setUserId(userId);

          // Determine if the user has the ROLE_ADMIN authority
          const adminRole = authorities.includes("ROLE_ADMIN");
          setIsAdmin(adminRole);
          console.log("adminRole in useeffect is: ", adminRole);
        })
        .catch((error) => {
          console.error("Error fetching user info:", error);
        });
    }
  }, [username]);
  console.log("Username and id are: ", username, userId);
  console.log("admin?: ", isAdmin);
  return (
    <UserContext.Provider
      value={{
        username,
        setUsername,
        setUserId,
        userId,
        isAdmin,
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
