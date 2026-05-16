// routes/ownerRoutes.js

const express = require("express");

const {
  createOwner,
  getOwners,
  getOwnerById,
  updateOwner,
  deleteOwner,
} = require("../controllers/ownerController");

const router = express.Router();

router.post("/createOwner", createOwner);

router.get("/getOwners", getOwners);

router.get("/getOwner/:id", getOwnerById);

router.put("/updateOwner/:id", updateOwner);

router.delete("/deleteOwner/:id", deleteOwner);

module.exports = router;