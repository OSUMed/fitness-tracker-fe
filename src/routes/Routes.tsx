import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from "../pages/Chat";

import { UserContext } from "../context/UserContext";
import RegisterLogin from "../pages/RegisterLogin";

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
          <Route path="/" element={<RegisterLogin />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
