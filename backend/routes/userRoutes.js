// routes/userRoutes.js

const express = require("express");

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/userControllers");

const router = express.Router();

router.post("/register", createUser);
router.post("/createUser", createUser); // legacy alias
router.post('/login', loginUser);

router.get("/", getUsers);
router.get("/getUser", getUsers); // legacy alias

router.get("/:id", getUserById);
router.get("/getUser/:id", getUserById); // legacy alias

const auth = require('../middleware/auth')

router.put("/:id", auth, updateUser);
router.put("/updateUser/:id", auth, updateUser); // legacy alias

router.delete("/:id", auth, deleteUser);
router.delete("/deleteUser/:id", auth, deleteUser); // legacy alias

module.exports = router;