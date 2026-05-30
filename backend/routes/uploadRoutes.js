// routes/uploadRoutes.js

const express = require("express");

const upload = require("../middleware/multer");

const {
  singleImageUpload,
  multipleImageUpload,
} = require("../controllers/uploadController");

const router = express.Router();

// Single Image Upload
router.post(
  "/single",
  require('../middleware/auth'),
  upload.single("image"),
  singleImageUpload
);

// Multiple Image Upload
router.post(
  "/multiple",
  require('../middleware/auth'),
  upload.array("images", 10),
  multipleImageUpload
);

module.exports = router;