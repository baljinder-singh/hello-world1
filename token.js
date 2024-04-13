const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key


function generateToken(userData) {
  const payload = {
    user: {
      id: 'baljinder',
      username: 'balnit'
    }, // Replace with actual user data to be stored in token
  };
  const options = { expiresIn: '1h' }; // Set token expiration time (optional)
  return jwt.sign(payload, secretKey, options);
}

module.exports = {
  generateToken: generateToken
};

