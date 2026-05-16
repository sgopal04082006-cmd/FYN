// utils/cloudinaryUpload.js

const cloudinary = require("../config/cloudinary");

// Single Image Upload
const uploadSingleImage = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "house-rental",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      )
      .end(file.buffer);
  });
};

// Multiple Image Upload
const uploadMultipleImages = async (files) => {
  const imageUrls = [];

  for (const file of files) {
    const result = await uploadSingleImage(file);
    imageUrls.push(result);
  }

  return imageUrls;
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
};