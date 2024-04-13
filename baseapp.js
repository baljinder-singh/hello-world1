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
  verifyToken: verifyToken
};
