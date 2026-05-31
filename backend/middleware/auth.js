const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Owner = require('../models/ownerModel')

const JWT_SECRET = process.env.JWT_SECRET

module.exports = async function auth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization']
    if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided' })

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ success: false, message: 'Invalid authorization format' })
    }

    const token = parts[1]
    let payload
    try {
      payload = jwt.verify(token, JWT_SECRET)
    } catch (e) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' })
    }

    try {
      if (payload.role === 'owner') {
        const owner = await Owner.findById(payload.id).select('-password')
        req.user = owner || { id: payload.id, email: payload.email, role: 'owner' }
      } else {
        const user = await User.findById(payload.id).select('-password')
        req.user = user || { id: payload.id, email: payload.email }
      }
    } catch (e) {
      req.user = { id: payload.id, email: payload.email, role: payload.role || 'user' }
    }

    next()
  } catch (error) {
    res.status(500).json({ success: false, message: 'Auth error' })
  }
}
