import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Chat from "../pages/Chat";

import { UserContext } from "../context/UserContext";
import RegisterLogin from "../pages/RegisterLogin";
import Dashboard from "../pages/Dashboard";
import NavBar from "../components/NavBar";
import AboutUs from "../pages/About Us";
import TodaysWorkoutComponent from "../pages/TodaysWorkout";
import WeekPlanner from "../pages/WeekGrid";
import WeekGrid from "../pages/WeekGrid";
import { Container } from "@radix-ui/themes";
import WorkoutDatabase from "../pages/WorkoutDatabase";

const AppRoutes: React.FC = () => {
  const userContext = useContext(UserContext);

  // If null, return Loading screen
  if (!userContext) {
    return <div>Loading...</div>;
  }

  const { username } = userContext;
  console.log("What is the username? ", username);
  return (
    <Router>
      <NavBar />
      <Container>
        <main className="p-5">
          <Routes>
            <Route
              path="/"
              element={
                username ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/signin" />
                )
              }
            />

            {/* Authenticated Routes */}
            {username && (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat" element={<Chat />} />
                <Route
                  path="/addworkout"
                  element={<TodaysWorkoutComponent />}
                />
                <Route path="/weekgrid" element={<WeekGrid />} />
                <Route path="/workoutdatabase" element={<WorkoutDatabase />} />
              </>
            )}

            <Route path="/signin" element={<RegisterLogin />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </main>
      </Container>
    </Router>
  );
};

export default AppRoutes;
