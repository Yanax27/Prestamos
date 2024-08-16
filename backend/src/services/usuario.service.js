const { ClientError } = require('../utils/errors');
const usuarioDao = require('../daos/UsuarioDao');

class UsuarioService {
    async getAllUsuarios(UsuarioModel) {
        // Pasamos el modelo al DAO
        return await usuarioDao.getAllUsuarios(UsuarioModel);
    }

    async getPrestarioById(id, UsuarioModel) {
        // Pasamos el modelo al DAO
        return await usuarioDao.getUsuarioById(id, UsuarioModel);
    }
    async createUsuario(usuarioData, UsuarioModel) {
        if (!usuarioData) {
            throw new ClientError('Usuario data is required', 400);
        }
        // Pasamos el modelo al DAO
        return await usuarioDao.createUsuario(usuarioData, UsuarioModel);
    }
    async updateUsuario(id, usuarioData, UsuarioModel) {
        const usuario = await usuarioDao.updatePrestario(id, usuarioData, UsuarioModel);
        if (!usuario) {
            throw new ClientError("Usuario not found", 404);
        }
        return usuario;
    }

    async deleteUsuario(id, PrestarioModel) {
        const usuario = await prestarioDao.deleteUsuario(id, UsuarioModel);
        if (!usuario) {
            throw new ClientError("Usuario not found", 404);
        }
        return usuario;
    }
}

module.exports = new UsuarioService();