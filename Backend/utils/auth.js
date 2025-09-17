const jwt = require('jsonwebtoken')

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  
  try {
    const token = jwt.sign(payload, secret, {
      expiresIn: '7d'
    });
    return token;
  } catch (error) {
    throw error;
  }
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
  } catch (error) {
    throw new Error('Invalid token')
  }
}

module.exports = {
  generateToken,
  verifyToken
}
