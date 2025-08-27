const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'veyg_secret_key_2025'
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d'

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  })
}

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
}

module.exports = {
  generateToken,
  verifyToken
}
