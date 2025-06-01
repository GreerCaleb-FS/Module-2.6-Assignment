// app.js
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./app/routes/userRoutes");
const postRoutes = require("./app/routes/postRoutes");

const app = express();

app.use(express.json()); // For parsing application/json

// Use the routes
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Connect to MongoDB, will add database name later
mongoose
  .connect("mongodb://localhost:27017/UserPost", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
