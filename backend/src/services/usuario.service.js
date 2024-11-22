const { ClientError } = require('../utils/errors');
const usuarioDao = require('../daos/UsuarioDao');

class UsuarioService {
  async getAllUsuarios(UsuarioModel, RoleModel, filter = {}) {
    // Pasar el filtro al DAO para aplicarlo en la consulta
    return await usuarioDao.getAllUsuarios(UsuarioModel, RoleModel, filter);
}

    async getUsuarioById(id, UsuarioModel, RoleModel) {
        return await usuarioDao.getUsuarioById(id, UsuarioModel, RoleModel);
    }

    async getUsuarioByEmail(email, UsuarioModel, RoleModel) {
        return await usuarioDao.getUsuarioByEmail(email, UsuarioModel, RoleModel);
    }

    async createUsuario(usuarioData, UsuarioModel, RoleModel) {
        if (!usuarioData) {
            throw new ClientError('Usuario data is required', 400);
        }
        return await usuarioDao.createUsuario(usuarioData, UsuarioModel, RoleModel);
    }

    async updateUsuario(id, usuarioData, UsuarioModel, RoleModel) {
        const usuario = await usuarioDao.updateUsuario(id, usuarioData, UsuarioModel, RoleModel);
        if (!usuario) {
            throw new ClientError("Usuario not found", 404);
        }
        return usuario;
    }

    async deleteUsuario(id, UsuarioModel) {
        const usuario = await usuarioDao.deleteUsuario(id, UsuarioModel);
        if (!usuario) {
            throw new ClientError("Usuario not found", 404);
        }
        return usuario;
    }
}

module.exports = new UsuarioService();
