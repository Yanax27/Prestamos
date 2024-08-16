const Usuario = require("../models/Usuario");

class UsuarioDao {
    //obtener todos los usuarios
    async getAllUsuarios(UsuarioModel) {
        return await Usuario.findAll();
    }
//obtener usuario por id
    async getUsuarioById(id, UsuarioModel) {
        return await UsuarioModel.findbyId(id);
    }
    // Crear un nuevo usuarios
    async createUsuario(usuarioData, UsuarioModel) {
        return await UsuarioModel.create(usuarioData);
    }
    // Actualizar un usuario
    async updateUsuario(id, usuarioData, UsuarioModel) {
        const usuario = await UsuarioModel.findByPk(id);
        if (!usuario) return null;
        await usuario.update(usuarioData);
        return usuario;
    }
    // Eliminar un usuario
    async deleteUsuario(id, UsuarioModel) {
        const usuario = await UsuarioModel.findByPk(id);
        if (!usuario) return null;
        await usuario.destroy();
        return usuario;
    }
}
module.exports = new UsuarioDao();
