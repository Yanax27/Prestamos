const { ClientError } = require('../utils/errors');
const ingresoDao = require('../daos/IngresoDao');
const cuentaDao = require('../daos/CuentaDao')

class IngresoService {

    async createIngreso(ingresoData, IngresoModel, CuentaModel) {
      if (!ingresoData) {
        throw new ClientError('Ingreso data is required', 400);
      }

      // Crear el ingreso
      const ingreso = await ingresoDao.createIngreso(ingresoData, IngresoModel);

      // Actualizar capital y cajaActual en la cuenta solicitando funcion desde cuentaDao
      await cuentaDao.sumarMontoACuentaIngreso(ingresoData.CuentumIdCuenta, ingreso.monto, CuentaModel);

      return ingreso;
    }

    async getAllIngresos(IngresoModel, filter) {
      // Pasamos el filtro al DAO
      return await ingresoDao.getAllIngreso(IngresoModel, filter);
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
