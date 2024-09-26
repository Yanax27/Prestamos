const usuarioService = require('../services/usuario.service');
const resError = require('../utils/resError');
const { Usuario, Roles } = require("../db");

const roleMiddleware = (requiredRoles) => {
  // Convertimos requiredRoles a un array si no lo es
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  return async (req, res, next) => {
    try {
      const email = req.user.email; // obtener el email del token decodificado
      const usuario = await usuarioService.getUsuarioByEmail(email, Usuario, Roles);

      if (!usuario) {
        return resError(res, 404, 'Usuario no encontrado');
      }

      // Obtenemos los tipos de roles del usuario
      const userRoles = usuario.Roles.map(role => role.tipo);

      // Verificamos si el usuario tiene al menos uno de los roles requeridos
      const hasRequiredRole = roles.some(role => userRoles.includes(role));

      if (!hasRequiredRole) {
        return resError(res, 403, 'No tienes permiso para realizar esta acción');
      }

      // Añadimos los roles del usuario a req.user para uso posterior si es necesario
      req.user.roles = userRoles;

      next();
    } catch (error) {
      console.error('Error en roleMiddleware:', error);
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

