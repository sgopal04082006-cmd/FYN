// controllers/houseController.js

const House = require("../models/houseModel");
const { uploadSingleImage } = require("../utils/cloudinaryUpload");

// Create House
const createHouse = async (req, res) => {
  console.log(req.body)
  try {
    if (!req.user || req.user.role !== 'owner') {
      return res.status(403).json({ success: false, message: 'Owner access only' })
    }

    const {
      ownerName,
      ownerEmail,
      ownerPhone,
      ownerAddress,
      houseTitle,
      location,
      houseAddress,
      houseDescription,
      bhk,
      furnished,
      balcony,
      floorType,
      rentAmount,
      advanceAmount,
    } = req.body

    const files = req.files || {}
    const ownerPhotoFile = files.ownerPhoto?.[0]
    const housePhotoFiles = [
      files.housePhoto1?.[0],
      files.housePhoto2?.[0],
      files.housePhoto3?.[0],
    ]

    if (
      !ownerName ||
      !ownerEmail ||
      !ownerPhone ||
      !ownerAddress ||
      !ownerPhotoFile ||
      !houseTitle ||
      !location ||
      !houseAddress ||
      !bhk ||
      !furnished ||
      !balcony ||
      !floorType ||
      !rentAmount ||
      !advanceAmount ||
      housePhotoFiles.some(photo => !photo)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required house fields and upload owner photo plus three home images.',
      })
    }

    const ownerPhotoUrl = await uploadSingleImage(ownerPhotoFile)
    const housePhotos = []
    for (const photoFile of housePhotoFiles) {
      housePhotos.push(await uploadSingleImage(photoFile))
    }

    const housePayload = {
      ownerId: req.user.id,
      ownerName,
      ownerEmail,
      ownerPhone,
      ownerAddress,
      ownerPhoto: ownerPhotoUrl,
      houseTitle,
      location,
      houseAddress,
      houseDescription: houseDescription || '',
      bhk,
      furnished,
      balcony,
      floorType,
      rentAmount: Number(rentAmount),
      advanceAmount: Number(advanceAmount),
      housePhotos,
    }

    const house = await House.create(housePayload);

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

// Get Houses by Owner
const getHousesByOwner = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'owner') {
      return res.status(403).json({ success: false, message: 'Owner access only' })
    }

    const houses = await House.find({ ownerId: req.user.id });

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
    if (!req.user || req.user.role !== 'owner') {
      return res.status(403).json({ success: false, message: 'Owner access only' })
    }

    const house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ success: false, message: 'House not found' })
    }
    if (String(house.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'You can only edit your own houses' })
    }

    const updatedHouse = await House.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedHouse,
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
    if (!req.user || req.user.role !== 'owner') {
      return res.status(403).json({ success: false, message: 'Owner access only' })
    }

    const house = await House.findById(req.params.id);
    if (!house) {
      return res.status(404).json({ success: false, message: 'House not found' })
    }
    if (String(house.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'You can only delete your own houses' })
    }

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
  getHousesByOwner,
  updateHouse,
  deleteHouse,
};