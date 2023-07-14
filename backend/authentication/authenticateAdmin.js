const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'No access token provided' });
    }

    // Verify the access token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decodedToken.userId);

    if (!user || user.role!=='admin') {
      return res.status(401).json({ message: 'Invalid access token OR User not admin' });
    }

    // Pass the user object to the request for further use
    req.user = user;

    // Proceed to the next middleware/route
    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = authenticateAdmin;
