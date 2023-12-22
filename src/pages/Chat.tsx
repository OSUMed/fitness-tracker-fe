import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Chat: React.FC = () => {
  const context = useContext(UserContext);

  // Assert that context is not undefined
  const { username } = context!;

  return (
    <div>
      <h1>Chat</h1>
      <p>Welcome, {username}</p>
    </div>
  );
};

export default Chat;
