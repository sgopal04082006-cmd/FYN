// controllers/uploadController.js

const {
  uploadSingleImage,
  uploadMultipleImages,
} = require("../utils/cloudinaryUpload");

// Upload Single Image
const singleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    const imageUrl = await uploadSingleImage(req.file);

    res.status(200).json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Upload Multiple Images
const multipleImageUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const imageUrls = await uploadMultipleImages(req.files);

    res.status(200).json({
      success: true,
      imageUrls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  singleImageUpload,
  multipleImageUpload,
};