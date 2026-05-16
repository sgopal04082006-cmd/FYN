// models/houseModel.js

const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema(
  {
    housePhotos: [
      {
        type: String, // Image URL or file path
      },
    ],

    location: {
      type: String,
      required: true,
      trim: true,
    },

    rentAmount: {
      type: Number,
      required: true,
    },

    advanceAmount: {
      type: Number,
      required: true,
    },

    additionalFeatures: [
      {
        type: String,
        trim: true,
      },
    ],

    comments: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const House = mongoose.model("House", houseSchema);

module.exports = House;