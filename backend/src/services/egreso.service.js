const { ClientError } = require('../utils/errors');
const egresoDao = require('../daos/EgresoDao');
const cuentaDao = require('../daos/CuentaDao');


class EgresoService {
  async createEgreso(egresoData, IngresoModel, CuentaModel) {
    if (!egresoData) {
      throw new ClientError('Egreso data is required', 400);
    }

    // Crear el egreso
    const egreso = await egresoDao.createEgreso(egresoData, IngresoModel);

    // Actualizar capital y cajaActual en la cuenta solicitando funcion desde cuentaDao
    await cuentaDao.restarMontoACuenta(egreso.CuentumIdCuenta, egreso.monto, CuentaModel);

    return egreso;
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
