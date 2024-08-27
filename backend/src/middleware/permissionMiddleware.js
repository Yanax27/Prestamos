const usuarioService = require('../services/usuario.service'); // Asegúrate de importar el servicio correcto
const resError = require('../utils/resError');
const { Usuario } = require("../db");

const roleMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const email = req.user.email; // obtener el email del token decodificado
      const usuario = await usuarioService.getUsuarioByEmail(email, Usuario); // obtener el usuario

      if (!usuario) {
        return resError(res, 404, 'Usuario no encontrado');
      }

      if (usuario.Role.tipo !== requiredRole) { // Verificamos el rol
        return resError(res, 403, 'No tienes permiso para realizar esta acción');
      }

      next();
    } catch (error) {
      return resError(res, 500, 'Error de servidor');
    }
  };
};

module.exports = roleMiddleware;

