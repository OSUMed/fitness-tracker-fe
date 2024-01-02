import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";
import SummaryWorkouts from "../components/SummaryWorkouts";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
const Dashboard: React.FC = () => {
  const context = useContext(UserContext);

  // Assert that context is not undefined
  const { username, workoutTypeCounts } = context!;

  const workoutTypeCountsData = {
    labels: Object.keys(workoutTypeCounts),
    datasets: [
      {
        data: Object.values(workoutTypeCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome, {username}</h1>

      <div className="flex justify-start mb-6">
        <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
          <h2 className="text-lg font-semibold mb-4">
            Workout Type Distribution
          </h2>
          <Doughnut data={workoutTypeCountsData} />
        </div>
        {/* Other content can go here */}
      </div>

      <SummaryWorkouts />
    </div>
  );
};

export default Dashboard;
