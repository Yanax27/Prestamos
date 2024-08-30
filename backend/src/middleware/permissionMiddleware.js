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

      if (usuario.Role.tipo !== requiredRole) { // Verificamos el rol si es diferente  de admin etnocen no tiene permiso
        return resError(res, 403, 'No tienes permiso para realizar esta acción');
      }
      req.user;
      next();
    } catch (error) {
      return resError(res, 500, 'Error de servidor');
    }
  };
};

module.exports = roleMiddleware;

/*const usuarioService = require('../services/usuario.service');
const resError = require('../utils/resError');
const { Usuario } = require("../db");
const catchedAsync = require('../utils/catchedAsync');

const roleMiddleware = (requiredRole) => {
  return catchedAsync(async (req, res, next) => {
    const email = req.user?.email; // Obtenemos el email del token decodificado
    console.log("email clg:", email);

    if (!email) {
      return resError(res, 401, 'No autenticado');
    }

    const usuario = await usuarioService.getUsuarioByEmail(email, Usuario); // Obtenemos el usuario
    console.log("usuario clg:", usuario);

    if (!usuario) {
      return resError(res, 404, 'Usuario no encontrado');
    }

    if (usuario.Role.tipo !== requiredRole) { // Verificamos el rol
      return resError(res, 403, 'No tienes permiso para realizar esta acción');
    }

    next(); // Continua si el rol es correcto
  });
};

module.exports = roleMiddleware;
*/

