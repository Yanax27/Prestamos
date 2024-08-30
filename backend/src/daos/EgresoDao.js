class EgresoDao {
  // Obtener todos los egreso
  async getAllEgreso(EgresoModel) {
    return await EgresoModel.findAll();
  }

  // Crear un nuevo egreso
  async createEgreso(egresoData, EgresoModel) {
    return await EgresoModel.create(egresoData);
  }

  // Obtener un egreso por ID
  async getEgresoById(id, EgresoModel) {
    return await EgresoModel.findByPk(id);
  }

  // Eliminar un egreso
  async deleteEgreso(id, EgresoModel) {
    const egreso = await EgresoModel.findByPk(id);
    if (!egreso) return null;
    await egreso.destroy();
    return egreso;
  }
}

module.exports = new EgresoDao();

