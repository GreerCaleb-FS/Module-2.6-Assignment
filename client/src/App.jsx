// client/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UsersList from "./UsersList";
import UserPosts from "./UserPosts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route #1: "/" shows UsersList */}
        <Route path="/" element={<UsersList />} />

        {/* Route #2: "/users/:id" shows that user’s posts */}
        <Route path="/users/:id" element={<UserPosts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
