const jwt = require('jsonwebtoken')

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  console.log('🔑 JWT Secret exists:', !!process.env.JWT_SECRET);
  
  try {
    const token = jwt.sign(payload, secret, {
      expiresIn: '7d'
    });
    console.log('✅ JWT token generated successfully');
    return token;
  } catch (error) {
    console.error('❌ JWT generation error:', error);
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
