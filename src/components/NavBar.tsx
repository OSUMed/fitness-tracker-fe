import axios from "axios";
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../custom-styles.css";
import { IoFitness } from "react-icons/io5";
import classNames from "classnames";

const NavBar = () => {
  const context = useContext(UserContext);

  // Assert that context is not undefined
  const { username: contextUsername, setUsername: setContextUsername } =
    context!;
  const navigate = useNavigate();

  const location = useLocation();

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
  const authenticatedLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Chat", href: "/chat" },
    { label: "Logout", href: "/logout" },
  ];
  const unauthenticatedLinks = [
    {
      label: "About Us",
      href: "/aboutus",
    },
    {
      label: "Sign In",
      href: "/signin",
    },
  ];

  return (
    <nav className="flex justify-between border-b border-blue-500 mb-5 p-5 h-14 items-center">
      <Link to="/">
        <Link to="/">
          <IoFitness className="text-3xl custom-icon-color " />
        </Link>
      </Link>
      {contextUsername ? (
        <ul className="flex space-x-8">
          {authenticatedLinks.map((link) => (
            <li key={link.href}>
              {link.label === "Logout" ? (
                <button
                  className="text-blue-500 hover:text-blue-700 hover:underline transition-colors"
                  onClick={handleLogout}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  to={link.href}
                  className={classNames({
                    "text-blue-500 hover:text-blue-700 hover:underline transition-colors":
                      true,
                  })}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex space-x-8">
          {unauthenticatedLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className="text-blue-500 hover:text-blue-700 hover:underline transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
