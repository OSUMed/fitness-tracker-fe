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
    const headers = new Headers();
    headers.append(
      "Authorization",
      "Basic " + btoa("user:d5b60771-492f-4713-99d4-23b9d3229480")
    );

    fetch("http://localhost:8080/private", { headers })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: PrivateResponse) => {
        setUsername(data.username);
        console.log(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });

    // axios
    //   .get("http://localhost:8080/users")
    //   .then(({ data }) => {
    //     setUsername("Srikanth");
    //     console.log("The useEffect data is: ", data);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};
