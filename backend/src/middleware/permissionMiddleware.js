const usuarioService = require('../services/usuario.service');
const resError = require('../utils/resError');
const { Usuario, Roles } = require("../db");

// Definimos los niveles de los roles
const ROLE_LEVELS = {
  user: 1,
  prestamista: 2,
  admin: 3,
};

const roleMiddleware = (minRequiredLevel) => {
  return (req, res, next) => {
    try {
      const { roles } = req.user; // Accedemos a los roles directamente del token
      const userMaxLevel = Math.max(...roles.map(role => ROLE_LEVELS[role] || 0));

      if (userMaxLevel < minRequiredLevel) {
        return resError(res, 403, 'No tienes permiso para realizar esta acción');
      }

      next();
    } catch (error) {
      console.error('Error en roleMiddleware:', error);
      return resError(res, 500, 'Error de servidor');
    }
  };
};

module.exports = roleMiddleware;

