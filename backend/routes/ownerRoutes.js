// routes/ownerRoutes.js

const express = require("express");

const {
  createOwner,
  getOwners,
  getOwnerById,
  updateOwner,
  deleteOwner,
} = require("../controllers/ownerController");

const auth = require('../middleware/auth')

const router = express.Router();

router.post("/createOwner", auth, createOwner);

router.get("/getOwners", getOwners);

router.get("/getOwner/:id", getOwnerById);

router.put("/updateOwner/:id", auth, updateOwner);

router.delete("/deleteOwner/:id", auth, deleteOwner);

module.exports = router;