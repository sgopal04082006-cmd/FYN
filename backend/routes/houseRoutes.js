// routes/houseRoutes.js

const express = require("express");

const {
  createHouse,
  getHouses,
  getHouseById,
  getHousesByOwner,
  updateHouse,
  deleteHouse,
} = require("../controllers/houseController");

const auth = require('../middleware/auth')
const upload = require('../middleware/multer')

const router = express.Router();

router.post(
  "/createHouse",
  auth,
  upload.fields([
    { name: 'ownerPhoto', maxCount: 1 },
    { name: 'housePhoto1', maxCount: 1 },
    { name: 'housePhoto2', maxCount: 1 },
    { name: 'housePhoto3', maxCount: 1 },
  ]),
  createHouse
);

router.get("/myHouses", auth, getHousesByOwner);

router.get("/getHouse", getHouses);

router.get("/getHouse/:id", getHouseById);

router.put("/updateHouse/:id", auth, updateHouse);

router.delete("/deleteHouse/:id", auth, deleteHouse);

module.exports = router;