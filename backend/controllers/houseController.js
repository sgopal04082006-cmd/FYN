// controllers/houseController.js

const House = require("../models/houseModel");

// Create House
const createHouse = async (req, res) => {
  try {
    const house = await House.create(req.body);

    res.status(201).json({
      success: true,
      data: house,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Houses
const getHouses = async (req, res) => {
  try {
    const houses = await House.find();

    res.status(200).json({
      success: true,
      data: houses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single House
const getHouseById = async (req, res) => {
  try {
    const house = await House.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: house,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update House
const updateHouse = async (req, res) => {
  try {
    const house = await House.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: house,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete House
const deleteHouse = async (req, res) => {
  try {
    await House.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "House deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createHouse,
  getHouses,
  getHouseById,
  updateHouse,
  deleteHouse,
};