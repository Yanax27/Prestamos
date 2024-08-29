class CuentaDao {
  // Obtener todos los cuenta
  async getAllCuenta(CuentaModel) {

    return await CuentaModel.findAll();
  }

  // Crear un nuevo cuenta
  async createCuenta(cuentaData, CuentaModel) {
    return await CuentaModel.create(cuentaData);
  }

  // Obtener un cuenta por ID
  async getCuentaById(id, CuentaModel) {
    return await CuentaModel.findByPk(id);
  }

  // Actualizar un cuenta
  async updateCuenta(id, cuentaData, CuentaModel) {
    const cuenta = await CuentaModel.findByPk(id);
    if (!cuenta) return null;
    await cuenta.update(cuentaData);
    return cuenta;
  }

  // Eliminar un cuenta
  async deleteCuenta(id, CuentaModel) {
    const cuenta = await CuentaModel.findByPk(id);
    if (!cuenta) return null;
    await cuenta.destroy();
    return cuenta;
  }
}
module.exports = new CuentaDao();
