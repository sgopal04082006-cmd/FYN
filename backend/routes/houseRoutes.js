// routes/houseRoutes.js

const express = require("express");

const {
  createHouse,
  getHouses,
  getHouseById,
  updateHouse,
  deleteHouse,
} = require("../controllers/houseController");

const router = express.Router();

router.post("/createHouse", createHouse);

router.get("/getHouse", getHouses);

router.get("/getHouse/:id", getHouseById);

router.put("/updateHouse/:id", updateHouse);

router.delete("/deleteHouse/:id", deleteHouse);

module.exports = router;