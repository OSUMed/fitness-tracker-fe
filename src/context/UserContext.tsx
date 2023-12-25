import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface PrivateResponse {
  username: string;
}

// Define the shape of the context
interface UserContextType {
  username: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the context with an initial empty state
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [username, setUsername] = useState<string | null>(null);

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
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
