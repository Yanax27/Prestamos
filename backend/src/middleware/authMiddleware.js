const jwt = require('jsonwebtoken');
const resError = require('../utils/resError');
const { JWT_SECRET } = process.env;

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return resError(res, 401, 'No autenticado');
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || !decoded.id_usuario || !decoded.email || !decoded.roles) {
      return resError(res, 401, 'Token inválido');
    }

    req.user = decoded; // Pasamos toda la información decodificada al request
    next();
  });
};

module.exports = authMiddleware;

