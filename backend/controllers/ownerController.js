// controllers/ownerController.js

const Owner = require("../models/ownerModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

// Register Owner
const registerOwner = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address, additionalPhoneNumber, profilePhoto } = req.body
    const normalizedEmail = email?.trim().toLowerCase()

    if (!name || !normalizedEmail || !password || !phoneNumber || !address) {
      return res.status(400).json({ success: false, message: 'Name, email, password, phone number, and address are required' })
    }

    const existing = await Owner.findOne({ email: normalizedEmail })
    if (existing) return res.status(409).json({ success: false, message: 'Owner already exists' })

    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)

    const payload = {
      name,
      email: normalizedEmail,
      password: hash,
      phoneNumber,
      address,
      additionalPhoneNumber: additionalPhoneNumber || '',
      profilePhoto: profilePhoto || '',
    }

    const owner = await Owner.create(payload)
    const ownerObj = owner.toObject()
    delete ownerObj.password

    const token = jwt.sign({ id: owner._id, email: owner.email, role: 'owner' }, JWT_SECRET, { expiresIn: '1d' })

    res.status(201).json({ success: true, token, owner: ownerObj })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Login owner -> returns JWT
const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = email?.trim().toLowerCase()
    if (!normalizedEmail || !password) return res.status(400).json({ success: false, message: 'Email and password required' })

    const owner = await Owner.findOne({ email: normalizedEmail })
    if (!owner || !owner.password) return res.status(404).json({ success: false, message: 'Owner not found. Please sign up first.' })

    let match = false
    try {
      if (typeof owner.password === 'string' && owner.password.startsWith('$2')) {
        match = await bcrypt.compare(password, owner.password)
      } else {
        match = owner.password === password
      }
    } catch (e) {
      match = owner.password === password
    }
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const token = jwt.sign({ id: owner._id, email: owner.email, role: 'owner' }, JWT_SECRET, { expiresIn: '1d' })

    const ownerObj = owner.toObject()
    delete ownerObj.password

    res.status(200).json({ success: true, token, owner: ownerObj })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Create Owner
const createOwner = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'owner') {
      return res.status(403).json({ success: false, message: 'Owner access only' })
    }
    const payload = { ...req.body }
    if (payload.email) payload.email = payload.email.trim().toLowerCase()
    if (payload.password) {
      const saltRounds = 10
      payload.password = await bcrypt.hash(payload.password, saltRounds)
    }

    const existing = payload.email ? await Owner.findOne({ email: payload.email }) : null
    if (existing) return res.status(409).json({ success: false, message: 'Owner already exists' })

    const owner = await Owner.create(payload)

    const ownerObj = owner.toObject()
    delete ownerObj.password

    res.status(201).json({
      success: true,
      data: ownerObj,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
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
    if (!req.user || req.user.role !== 'owner') {
      return res.status(403).json({ success: false, message: 'Owner access only' })
    }
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
    if (!req.user || req.user.role !== 'owner') {
      return res.status(403).json({ success: false, message: 'Owner access only' })
    }
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
  registerOwner,
  loginOwner,
  createOwner,
  getOwners,
  getOwnerById,
  updateOwner,
  deleteOwner,
};