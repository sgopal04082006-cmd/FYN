// routes/userRoutes.js

const express = require("express");

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/createUser", createUser);

router.get("/getUser", getUsers);

router.get("/getUser/:id", getUserById);

router.put("/updateUser/:id", updateUser);

router.delete("/deleteUser/:id", deleteUser);

module.exports = router;