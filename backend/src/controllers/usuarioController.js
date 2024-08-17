const response = require('../utils/response');
const resError = require('../utils/resError');
const catchedAsync = require('../utils/catchedAsync');
const { Usuario } = require("../db");
const usuarioService = require('../services/usuario.service');


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
    const usuarioData = { ...req.body };
    const usuario = await usuarioService.createUsuario(usuarioData, Usuario);
    return response(res, 201, usuario);
  });
  //actualizar usuario usuando id
  updateUsuario = catchedAsync(async (req, res) => {

    const { id } = req.params;
    const usuariosData = req.body;
    const updateUsuario = await usuarioService.updateUsuario(id, usuariosData, Usuario)
    if (!updateUsuario) {
      return resError(res, 404, "Prestario no found")
    }
    return response(res, 200, updateUsuario);
  });

  //eliminar suuario por id
  deleteUsuario = catchedAsync(async (req, res) => {
    const { id } = req.params;
    const deletedUsuario = await usuarioService.deleteUsuario(id, Usuario);
    if (!deletedUsuario) {
      return resError(res, 404, "Prestario not found");
    }
    response(res, 204, null);
  })

}
module.exports = new UsuarioController();
