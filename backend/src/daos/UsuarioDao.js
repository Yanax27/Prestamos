
class UsuarioDao {
    //obtener todos los usuar[ios
    async getAllUsuarios(UsuarioModel) {
        return await UsuarioModel.findAll(
            {
                attributes: { exclude: ['password'] },  
                include: [{
                    association: 'Role',
                    attributes: ['tipo'] 
                }]
            },
        );
    }
//obtener usuario por id
    async getUsuarioById(id, UsuarioModel) {
        return await UsuarioModel.findByPk(id);
    }
    // Crear un nuevo usuarios
    async createUsuario(usuarioData, UsuarioModel) {
        return await UsuarioModel.create(usuarioData);
    }
    async getUsuarioByEmail(email, UsuarioModel) {
        return await UsuarioModel.findOne({
            where: { email },
            include: [{
                association: 'Role',
                attributes: ['tipo'] 
            }]
        },
        
    );
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
