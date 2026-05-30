// models/userModel.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        phoneNumber: {
            type: String,
            default: "",
        },

        work: {
            type: String,
            default: "",
        },

        address: {
            type: String,
            default: "",
        },
        profilePhoto: {
            type: String, // Store image URL or file path
            default: "",
        },

    previousHouse: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "House",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;