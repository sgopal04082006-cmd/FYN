// controllers/ownerController.js

const Owner = require("../models/ownerModel");

// Create Owner
const createOwner = async (req, res) => {
  try {
    const owner = await Owner.create(req.body);

    res.status(201).json({
      success: true,
      data: owner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Owners
const getOwners = async (req, res) => {
  try {
    const owners = await Owner.find();

    res.status(200).json({
      success: true,
      data: owners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Owner
const getOwnerById = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: owner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Owner
const updateOwner = async (req, res) => {
  try {
    const owner = await Owner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: owner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Owner
const deleteOwner = async (req, res) => {
  try {
    await Owner.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Owner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOwner,
  getOwners,
  getOwnerById,
  updateOwner,
  deleteOwner,
};