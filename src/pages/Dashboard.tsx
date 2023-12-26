import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";

const Dashboard: React.FC = () => {
  const context = useContext(UserContext);

  // Assert that context is not undefined
  const { username } = context!;

  return (
    <div>
      <NavBar />
      <p>Welcome to the Dashboard, {username}</p>
    </div>
  );
};

export default Dashboard;
