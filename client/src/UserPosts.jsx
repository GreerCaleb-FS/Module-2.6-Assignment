// client/src/UserPosts.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function UserPosts() {
  const { id } = useParams(); // gets the user ID from "/users/:id"
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_API_URL || "";

  // Fetch user info
  useEffect(() => {
    fetch(`${API}/users/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setUser(json.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load user");
      });
  }, [id]);

  // Fetch posts by this user
  useEffect(() => {
    fetch(`${API}/posts?userId=${id}&sort=-createdAt`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setPosts(json.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load posts");
      });
  }, [id]);

  return (
    <div style={{ padding: 20 }}>
      <Link to="/">← Back to Users</Link>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {user && (
        <h2>
          Posts by {user.firstName} {user.lastName}
        </h2>
      )}

      {!user && !error && <p>Loading user details…</p>}

      <ul>
        {posts.map((p) => (
          <li key={p._id} style={{ marginBottom: "1em" }}>
            <h3>{p.title}</h3>
            <small>{new Date(p.createdAt).toLocaleString()}</small>
            <p>{p.content}</p>
          </li>
        ))}
      </ul>

      {posts.length === 0 && user && <p>No posts found for this user.</p>}
    </div>
  );
}
