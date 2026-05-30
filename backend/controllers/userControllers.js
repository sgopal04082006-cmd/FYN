// controllers/userController.js

const User = require("../models/userModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

// Create User
const createUser = async (req, res) => {
  try {
    const { password, email } = req.body
    const normalizedEmail = email?.trim().toLowerCase()

    if (!password || !normalizedEmail) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }

    // check if user exists
    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) return res.status(409).json({ success: false, message: 'User already exists' })

    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)

    const payload = { ...req.body, email: normalizedEmail, password: hash }
    const user = await User.create(payload)

    const userObj = user.toObject()
    delete userObj.password

    // sign JWT so user is logged in immediately after signup
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' })

    res.status(201).json({ success: true, token, user: userObj })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
};

// Login user -> returns JWT
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()
    if (!normalizedEmail || !password) return res.status(400).json({ success: false, message: 'Email and password required' })

    const user = await User.findOne({ email: normalizedEmail })
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' })

      let match = false
      try {
        // If password appears to be a bcrypt hash, use bcrypt.compare
        if (typeof user.password === 'string' && user.password.startsWith('$2')) {
          match = await bcrypt.compare(password, user.password)
        } else {
          // fallback for legacy/plaintext passwords
          match = user.password === password
        }
      } catch (e) {
        // fallback safe compare
        match = user.password === password
      }
      if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' })

    const userObj = user.toObject()
    delete userObj.password

    res.status(200).json({ success: true, token, user: userObj })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single User
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update User
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
};