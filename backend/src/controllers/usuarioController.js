const response  = require('../utils/response');
const resError  = require('../utils/resError');
const catchedAsync = require('../utils/catchedAsync');
const { Usuario } = require("../db");
const usuarioService = require('../services/usuario.service');


class UsuarioController{
// obtener todos los usuarios
getAllUsuarios = catchedAsync(async(req, res)=>{
const usuarios = await usuarioService.getAllUsuarios(Usuario);

return response(res, 200, usuarios);
});

//obtenemmos por id
getUsuariosbyId = catchedAsync(async(res, req)=>{
  const {id} = req.params;
  const usuario = usuarioService.getUsuarioById(id,Usuario);
  if (!usuario) {
    return resError(res, 404, "Usuario not founf");
  }
  return response(res, 200, usuario);
});

//crear usuario
createUsuario = catchedAsync(async(res, req)=>{
  usuarioData = { ...req.body};
  const usuario = await usuarioService.createUsuario(usuarioData, Usuario);
  return response(res, 201, usuario);
});

}
module.exports = new UsuarioController();
