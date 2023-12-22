import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from "../pages/Chat";
import Register from "../pages/Register";
import { UserContext } from "../context/UserContext";

const AppRoutes: React.FC = () => {
  const userContext = useContext(UserContext);

  // If null, return Loading screen
  if (!userContext) {
    return <div>Loading...</div>;
  }

  const { username } = userContext;

  return (
    <Router>
      <Routes>
        {username ? (
          <Route path="/" element={<Chat />} />
        ) : (
          <Route path="/" element={<Register />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
