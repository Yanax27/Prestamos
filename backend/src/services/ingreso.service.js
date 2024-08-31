const { ClientError } = require('../utils/errors');
const ingresoDao = require('../daos/IngresoDao');


class IngresoService {
  async createIngreso(ingresoData, IngresoModel) {
    if (!ingresoData) {
      throw new ClientError('ingreso data is required', 400);
    }
    // Pasamos el modelo al DAO
    return await ingresoDao.createIngreso(ingresoData, IngresoModel);
  }

  async getAllIngresos(IngresoModel) {
    // Pasamos el modelo al DAO
    return await ingresoDao.getAllIngreso(IngresoModel);
  }

  async getIngresoById(id, IngresoModel) {
    // Pasamos el modelo al DAO
    return await ingresoDao.getIngresoById(id, IngresoModel);
  }

  async deleteIngreso(id, IngresoModel) {
    const ingreso = await ingresoDao.deleteIngreso(id, IngresoModel);
    if (!ingreso) {
      throw new ClientError("ingreso not found", 404);
    }
    return ingreso;
  }
}

module.exports = new IngresoService();
