const jwt = require('jsonwebtoken');

const authenticateUser = (request, response, next) => {
  const token = request.cookies.token;
  if (!token) return response.status(401).json({ message: 'No token provided in cookie' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
    next();
  } catch (err) {
    return response.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authorizeRoles = (...roles) => {
  return (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      return response.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };
