const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cloudcare-dev-secret-key-3.0';
const JWT_EXPIRES_IN = 86400; // 24 hours in seconds

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { code: 'UNAUTHENTICATED', message: 'Missing or invalid token.' }
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: { code: 'UNAUTHENTICATED', message: 'Token is invalid or expired.' }
    });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: { code: 'UNAUTHENTICATED', message: 'Authentication required.' }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Access denied for your role.' }
      });
    }

    next();
  };
}

module.exports = {
  generateToken,
  authenticate,
  requireRole,
  JWT_EXPIRES_IN
};
