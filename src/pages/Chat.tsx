import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

const Chat: React.FC = () => {
  const context = useContext(UserContext);

  // Assert that context is not undefined
  const { username, setUsername: setContextUsername } = context!;

  const handleLogout = async () => {
    try {
      const jwtToken = localStorage.getItem("accessToken");

      if (jwtToken) {
        await axios.post(
          "http://localhost:8080/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
            withCredentials: true,
          }
        );
      }

      localStorage.clear();
      setContextUsername(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <p>Welcome, {username}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Chat;
