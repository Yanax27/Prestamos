const { ClientError } = require('../utils/errors');
const cuentaDao = require('../daos/CuentaDao');


class CuentaService {
  async createCuenta(cuentaData, CuentaModel) {
    if (!cuentaData) {
      throw new ClientError('Cuenta data is required', 400);
    }
    // Pasamos el modelo al DAO
    return await cuentaDao.createCuenta(cuentaData, CuentaModel);
  }

  async getAllCuentas(CuentaModel) {
    // Pasamos el modelo al DAO
    return await cuentaDao.getAllCuenta(CuentaModel);
  }

  async getCuentaById(id, CuentaModel) {
    // Pasamos el modelo al DAO
    return await cuentaDao.getCuentaById(id, CuentaModel);
  }

  async updateCuenta(id, cuentaData, CuentaModel) {
    const cuenta = await cuentaDao.updateCuenta(id, cuentaData, CuentaModel);
    if (!cuenta) {
      throw new ClientError("Cuenta not found", 404);
    }
    return cuenta;
  }

  async deleteCuenta(id, CuentaModel) {
    const cuenta = await cuentaDao.deleteCuenta(id, CuentaModel);
    if (!cuenta) {
      throw new ClientError("Cuenta not found", 404);
    }
    return cuenta;
  }
}

module.exports = new CuentaService();
