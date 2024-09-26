const { Op } = require("sequelize");

class UsuarioDao {
    async getAllUsuarios(UsuarioModel, RoleModel) {
        return await UsuarioModel.findAll({
            attributes: { exclude: ['password'] },
            include: [{
                model: RoleModel,
                as: 'Roles',
                attributes: ['tipo'],
                through: { attributes: [] }  // Esto excluye los atributos de la tabla intermedia
            }]
        });
    }

    async getUsuarioById(id, UsuarioModel, RoleModel) {
        return await UsuarioModel.findByPk(id, {
            include: [{
                model: RoleModel,
                as: 'Roles',
                attributes: ['tipo'],
                through: { attributes: [] }
            }]
        });
    }

    async createUsuario(usuarioData, UsuarioModel, RoleModel) {
        const { roles, ...userData } = usuarioData;
        const usuario = await UsuarioModel.create(userData);
        if (roles && roles.length > 0) {
            const rolesToAssign = await RoleModel.findAll({
                where: { tipo: { [Op.in]: roles } }
            });
            await usuario.setRoles(rolesToAssign);
        }
        return usuario;
    }

    async getUsuarioByEmail(email, UsuarioModel, RoleModel) {
        return await UsuarioModel.findOne({
            where: { email },
            include: [{
                model: RoleModel,
                as: 'Roles',
                attributes: ['tipo'],
                through: { attributes: [] }
            }]
        });
    }

    async updateUsuario(id, usuarioData, UsuarioModel, RoleModel) {
        const usuario = await UsuarioModel.findByPk(id);
        if (!usuario) return null;
        const { roles, ...userData } = usuarioData;
        await usuario.update(userData);
        if (roles && roles.length > 0) {
            const rolesToAssign = await RoleModel.findAll({
                where: { tipo: { [Op.in]: roles } }
            });
            await usuario.setRoles(rolesToAssign);
        }
        return usuario;
    }

    async deleteUsuario(id, UsuarioModel) {
        const usuario = await UsuarioModel.findByPk(id);
        if (!usuario) return null;
        await usuario.destroy();
        return usuario;
    }
}

module.exports = new UsuarioDao();
