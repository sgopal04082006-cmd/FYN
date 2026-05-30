const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'

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

    // attach user object (optional)
    try {
      const user = await User.findById(payload.id).select('-password')
      req.user = user || { id: payload.id, email: payload.email }
    } catch (e) {
      req.user = { id: payload.id, email: payload.email }
    }

    next()
  } catch (error) {
    res.status(500).json({ success: false, message: 'Auth error' })
  }
}
