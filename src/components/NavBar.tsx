import axios from "axios";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const NavBar = () => {
  const context = useContext(UserContext);

  // Assert that context is not undefined
  const { username, setUsername: setContextUsername } = context!;
  const navigate = useNavigate();

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
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <nav>
      <Link to={"/"}></Link>
      <ul>
        <li>
          <Link to={"/dashboard"}>Dashboard</Link>
        </li>
        <li>
          <Link to={"/chat"}>Chat Groups</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
