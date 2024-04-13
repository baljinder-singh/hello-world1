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

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user; // Attach decoded user data to the request object
    next();
  } catch (error) {
    res.status(403).send('Invalid Token');
  }
}


module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken
};

