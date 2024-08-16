
class PrestarioDao {
    // Obtener todos los prestarios
    async getAllPrestarios(PrestarioModel) {

      return await PrestarioModel.findAll();
    }
  
    // Crear un nuevo prestario
    async createPrestario(prestarioData, PrestarioModel) {
      return await PrestarioModel.create(prestarioData);
    }
  
    // Obtener un prestario por ID
    async getPrestarioById(id, PrestarioModel) {
      return await PrestarioModel.findByPk(id);
    }
  
    // Actualizar un prestario
    async updatePrestario(id, prestarioData, PrestarioModel) {
      const prestario = await PrestarioModel.findByPk(id);
      if (!prestario) return null;
      await prestario.update(prestarioData);
      return prestario;
    }
  
    // Eliminar un prestario
    async deletePrestario(id, PrestarioModel) {
      const prestario = await PrestarioModel.findByPk(id);
      if (!prestario) return null;
      await prestario.destroy();
      return prestario;
    }
  }
  
  module.exports = new PrestarioDao();


  
  