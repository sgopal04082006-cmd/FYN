// models/houseModel.js

const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    ownerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    ownerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    ownerAddress: {
      type: String,
      required: true,
      trim: true,
    },
    ownerPhoto: {
      type: String,
      required: true,
      trim: true,
    },
    houseTitle: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    houseAddress: {
      type: String,
      required: true,
      trim: true,
    },
    houseDescription: {
      type: String,
      trim: true,
      default: "",
    },
    bhk: {
      type: String,
      required: true,
      trim: true,
    },
    furnished: {
      type: String,
      required: true,
      trim: true,
    },
    balcony: {
      type: String,
      required: true,
      trim: true,
    },
    floorType: {
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
    housePhotos: [
      {
        type: String,
        trim: true,
      },
    ],
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