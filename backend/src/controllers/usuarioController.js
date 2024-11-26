const response = require('../utils/response');
const resError = require('../utils/resError');
const catchedAsync = require('../utils/catchedAsync');
const { Usuario, Roles } = require("../db");
const usuarioService = require('../services/usuario.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

class UsuarioController {
  // Obtener todos los usuarios
  getAllUsuarios = catchedAsync(async (req, res) => {
    const { email } = req.query;
    const filter = { email };

    const usuarios = await usuarioService.getAllUsuarios(Usuario, Roles, filter);
    return response(res, 200, usuarios);
  });

  // Obtener usuario por ID
  getUsuariobyId = catchedAsync(async (req, res) => {
    const { id } = req.params;
    const usuario = await usuarioService.getUsuarioById(id, Usuario, Roles);
    if (!usuario) {
      return resError(res, 404, "Usuario not found");
    }
    return response(res, 200, usuario);
  });

  // Crear usuario
  createUsuario = catchedAsync(async (req, res) => {
    const { password, roles, ...usuarioData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await usuarioService.createUsuario(
      { ...usuarioData, password: hashedPassword, roles },
      Usuario,
      Roles
    );
    return response(res, 201, usuario);
  });

  // Iniciar sesión
  login = catchedAsync(async (req, res) => {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const usuario = await usuarioService.getUsuarioByEmail(email, Usuario, Roles);
    if (!usuario) {
      return resError(res, 404, 'Usuario no encontrado');
    }

    // Verificar si la contraseña es correcta
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return resError(res, 401, 'Contraseña incorrecta');
    }

    // Obtener los roles del usuario
    const roles = usuario.Roles.map(role => role.tipo);

    // Crear el token JWT
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, email: usuario.email, roles },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Establecer el token en una cookie
    res.cookie('jwt', token, {
      httpOnly: false,
      secure: true, // Cambiar a 'true' si estás utilizando HTTPS
      sameSite: 'lax',
      domain: 'fantastic-rejoicing-production.up.railway.app',
      path: '/',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Enviar respuesta con el token y datos del usuario
    return response(res, 200, {
      message: 'Login exitoso',
      token,
      userLogin: {
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        roles,
      },
    });
  });

  // Cerrar sesión
  logout = catchedAsync(async (req, res) => {
    res.clearCookie('jwt');

    return response(res, 200, { message: 'Logout exitoso' });
  });

  // Actualizar usuario usando ID
  updateUsuario = catchedAsync(async (req, res) => {
    const { id } = req.params;
    const usuariosData = req.body;
    const updateUsuario = await usuarioService.updateUsuario(id, usuariosData, Usuario, Roles);
    if (!updateUsuario) {
      return resError(res, 404, "Usuario not found");
    }
    return response(res, 200, updateUsuario);
  });

  // Eliminar usuario por ID
  deleteUsuario = catchedAsync(async (req, res) => {
    const { id } = req.params;
    const deletedUsuario = await usuarioService.deleteUsuario(id, Usuario);
    if (!deletedUsuario) {
      return resError(res, 404, "Usuario not found");
    }
    response(res, 204, null);
  });
}

module.exports = new UsuarioController();
