const { Op } = require('sequelize');

class EgresoDao {
  // Obtener todos los egresos con filtro opcional de cuenta
  async getAllEgreso(EgresoModel, cuentaId) {
    const query = cuentaId ? { CuentumIdCuenta: cuentaId } : {};
    return await EgresoModel.findAll({ query });
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
