const { ClientError } = require('../utils/errors');
const usuarioDao = require('../daos/UsuarioDao');

class UsuarioService {
    async getAllUsuarios(UsuarioModel) {
        // Pasamos el modelo al DAO
        return await usuarioDao.getAllUsuarios(UsuarioModel);
    }

    async getUsuarioById(id, UsuarioModel) {
        // Pasamos el modelo al DAO
        return await usuarioDao.getUsuarioById(id, UsuarioModel);
    }
    //obtenemos usuario por email
    async getUsuarioByEmail(email, UsuarioModel) {
        return await usuarioDao.getUsuarioByEmail(email, UsuarioModel);
    }

    async createUsuario(usuarioData, UsuarioModel) {
        if (!usuarioData) {
            throw new ClientError('Usuario data is required', 400);
        }
        // Pasamos el modelo al DAO
        return await usuarioDao.createUsuario(usuarioData, UsuarioModel);
    }
    async updateUsuario(id, usuarioData, UsuarioModel) {
        const usuario = await usuarioDao.updateUsuario(id, usuarioData, UsuarioModel);
        if (!usuario) {
            throw new ClientError("Usuario not found", 404);
        }
        return usuario;
    }

    async deleteUsuario(id, UsuarioModel){
        const usuario = await usuarioDao.deleteUsuario(id, UsuarioModel);
        if (!usuario) {
            throw new ClientError("Usuario not found", 404);
        }
        return usuario;
    }
}

module.exports = new UsuarioService();