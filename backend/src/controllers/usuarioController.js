const response = require('../utils/response');
const resError = require('../utils/resError');
const catchedAsync = require('../utils/catchedAsync');
const { Usuario } = require("../db");
const usuarioService = require('../services/usuario.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;


class UsuarioController {
  // obtener todos los usuarios
  getAllUsuarios = catchedAsync(async (req, res) => {
    const usuarios = await usuarioService.getAllUsuarios(Usuario);
    return response(res, 200, usuarios);
  });

  //obtenemmos por id
  getUsuariobyId = catchedAsync(async (req, res) => {
    const { id } = req.params;
    const usuario = await usuarioService.getUsuarioById(id, Usuario);
    if (!usuario) {
      return resError(res, 404, "Usuario not found");
    }
    return response(res, 200, usuario);
  });

  //crear usuario
  createUsuario = catchedAsync(async (req, res) => {
    const { password, ...usuarioData } = req.body;
    // Hasheamos la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await usuarioService.createUsuario({ ...usuarioData, password: hashedPassword }, Usuario);
    return response(res, 201, usuario);
  });

  // Iniciar sesión
  login = catchedAsync(async (req, res) => {
    const { email, password } = req.body;

    // Verificamos si el usuario existe
    const usuario = await usuarioService.getUsuarioByEmail(email, Usuario);
    if (!usuario) {
      return resError(res, 404, 'Usuario no encontrado');
    }
    
    // Verificamos si la contraseña es correcta
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return resError(res, 401, 'Contraseña incorrecta');
    }

    // Creamos el token JWT
    const token = jwt.sign({ id: usuario.id, role: usuario.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Establecemos el token en una cookie
    res.cookie('jwt', token, {
      httpOnly: true,     // Para que la cookie no sea accesible desde JavaScript en el frontend
      secure: false,      // Cambia a 'true' si estás utilizando HTTPS
      sameSite: 'lax',    // Evitar CSRF, puede ser 'lax', 'strict' o 'none'
      domain: 'localhost',// Asegúrate de que coincida con el dominio
      path: '/',          // La ruta donde será accesible la cookie
     // maxAge: 24 * 60 * 60 * 1000 // Expiración en 24 horas
    });

    return response(res, 200, { message: 'Login exitoso', token });
  });

  // Cerrar sesión (opcional)
  logout = catchedAsync(async (req, res) => {
    res.clearCookie('jwt');
    return response(res, 200, { message: 'Logout exitoso' });
  });

  //actualizar usuario usuando id
  updateUsuario = catchedAsync(async (req, res) => {

    const { id } = req.params;
    const usuariosData = req.body;
    const updateUsuario = await usuarioService.updateUsuario(id, usuariosData, Usuario)
    if (!updateUsuario) {
      return resError(res, 404, "Usuario not found")
    }
    return response(res, 200, updateUsuario);
  });

  //eliminar suuario por id
  deleteUsuario = catchedAsync(async (req, res) => {
    const { id } = req.params;
    const deletedUsuario = await usuarioService.deleteUsuario(id, Usuario);
    if (!deletedUsuario) {
      return resError(res, 404, "Usuario not found");
    }
    response(res, 204, null);
  })

}
module.exports = new UsuarioController();
