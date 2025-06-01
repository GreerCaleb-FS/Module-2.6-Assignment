// client/src/UsersList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    //  GET /users on the API
    const API = import.meta.env.VITE_API_URL || "";
    fetch(`${API}/users?fields=firstName,lastName`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        //  array of user objects
        setUsers(json.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load users");
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>All Users</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {/* Link to /users/<id> */}
            <Link to={`/users/${u._id}`}>
              {u.firstName} {u.lastName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
