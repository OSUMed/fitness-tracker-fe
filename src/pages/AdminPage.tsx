import React, { useState, useEffect } from "react";
import axiosInstance from "../util/axiosInterceptor";

const serverAPI = "http://localhost:8080/admin";
type Authority = {
  id: number;
  name: string;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  authorities: Authority[];
};

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch users from your API
    axiosInstance.get(`${serverAPI}/users`).then((response) => {
      setUsers(response.data);
    });
  }, []);

  const elevateToAdmin = (userId: number) => {
    axiosInstance
      .post(`${serverAPI}/makeAdmin?userId=${userId}`)
      .then(() => {});
  };

  const demoteToUser = (userId: number) => {
    axiosInstance
      .post(`${serverAPI}/demoteAdmin?userId=${userId}`)
      .then(() => {});
  };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.firstName}</td>
            <td>{user.lastName}</td>
            <td>{user.email}</td>
            <td>{user.authorities.map((auth) => auth.name).join(", ")}</td>
            <td>
              {!user.authorities.some((auth) => auth.name === "ROLE_ADMIN") && (
                <button onClick={() => elevateToAdmin(user.id)}>
                  Elevate to Admin
                </button>
              )}
              {user.authorities.some((auth) => auth.name === "ROLE_ADMIN") && (
                <button onClick={() => demoteToUser(user.id)}>
                  Demote to User
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminPage;
