require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'default_secret_key';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key', (err, user) => {
    if (err) {
      return res.sendStatus(403); 
    }
    req.user = user;
    req.userId = user.id;
    req.userName = user.name;
    next();
  });
};

const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    const { user } = req;
    if (!user) {
      return res.sendStatus(401); 
    }
    if (user.role !== requiredRole && user.role !== 'admin') {
      return res.sendStatus(403);
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
