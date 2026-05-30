// index.js or server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const houseRoutes = require("./routes/houseRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/house-rental")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log(error);
  });

// Main Route
app.get("/", (req, res) => {
  res.send("House Rental API Running...");
});

// Routes
app.use("/api/users", userRoutes);

app.use("/api/owners", ownerRoutes);

app.use("/api/houses", houseRoutes);

app.use("/api/upload", uploadRoutes);

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});