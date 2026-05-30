// routes/houseRoutes.js

const express = require("express");

const {
  createHouse,
  getHouses,
  getHouseById,
  updateHouse,
  deleteHouse,
} = require("../controllers/houseController");

const auth = require('../middleware/auth')

const router = express.Router();

router.post("/createHouse", auth, createHouse);

router.get("/getHouse", getHouses);

router.get("/getHouse/:id", getHouseById);

router.put("/updateHouse/:id", auth, updateHouse);

router.delete("/deleteHouse/:id", auth, deleteHouse);

module.exports = router;