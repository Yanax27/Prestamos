const { ClientError } = require('../utils/errors');
const egresoDao = require('../daos/EgresoDao');


class EgresoService {
  async createEgreso(egresoData, EgresoModel) {
    if (!egresoData) {
      throw new ClientError('egreso data is required', 400);
    }
    // Pasamos el modelo al DAO
    return await egresoDao.createEgreso(egresoData, EgresoModel);
  }

  async getAllEgresos(EgresoModel) {
    // Pasamos el modelo al DAO
    return await egresoDao.getAllEgreso(EgresoModel);
  }

  async getEgresoById(id, EgresoModel) {
    // Pasamos el modelo al DAO
    return await egresoDao.getEgresoById(id, EgresoModel);
  }

  async deleteEgreso(id, EgresoModel) {
    const egreso = await egresoDao.deleteEgreso(id, EgresoModel);
    if (!egreso) {
      throw new ClientError("egreso not found", 404);
    }
    return egreso;
  }
}

module.exports = new EgresoService();
