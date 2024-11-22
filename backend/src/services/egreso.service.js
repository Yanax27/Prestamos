const { ClientError } = require('../utils/errors');
const egresoDao = require('../daos/EgresoDao');
const cuentaDao = require('../daos/CuentaDao');

class EgresoService {
  async createEgreso(egresoData, EgresoModel, CuentaModel) {
    if (!egresoData) {
      throw new ClientError('Egreso data is required', 400);
    }
    const egreso = await egresoDao.createEgreso(egresoData, EgresoModel);
    await cuentaDao.restarMontoACuentaEgreso(egreso.CuentumIdCuenta, egreso.monto, CuentaModel);
    return egreso;
  }

  async getAllEgresos(EgresoModel, cuentaId) {
    return await egresoDao.getAllEgreso(EgresoModel, cuentaId); // Pasamos el filtro al DAO
  }

  async getEgresoById(id, EgresoModel) {
    return await egresoDao.getEgresoById(id, EgresoModel);
  }

  async deleteEgreso(id, EgresoModel) {
    const egreso = await egresoDao.deleteEgreso(id, EgresoModel);
    if (!egreso) {
      throw new ClientError("Egreso not found", 404);
    }
    return egreso;
  }
}

module.exports = new EgresoService();
