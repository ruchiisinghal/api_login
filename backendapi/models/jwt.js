const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    sub: user._id,
    iat: Date.now(),
  };
  const options = {
    expiresIn: '1h',
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};
