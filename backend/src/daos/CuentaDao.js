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
   //suma los montos de ingresos hecho a la cuenta
   async sumarMontoACuentaIngreso(id_cuenta, monto, CuentaModel) {
    const cuenta = await CuentaModel.findByPk(id_cuenta);
    if (!cuenta) {
      throw new Error("Cuenta no encontrada");
    }

    cuenta.capital += monto;
    cuenta.cajaActual += monto;

    await cuenta.save();
    return cuenta;
  }
  //suma los montos de prestamo hecho a la cuenta
  async sumarMontoACuenta(id_cuenta, monto, CuentaModel) {
    const cuenta = await CuentaModel.findByPk(id_cuenta);
    if (!cuenta) {
      throw new Error("Cuenta no encontrada");
    }

    cuenta.capital += monto;
    cuenta.cajaActual += monto;
    cuenta.ventas -= monto;

    await cuenta.save();
    return cuenta;
  }
  //resta el monto de un egreso a la cuenta
  async restarMontoACuentaEgreso(id_cuenta, monto, CuentaModel) {
    const cuenta = await CuentaModel.findByPk(id_cuenta);
    if (!cuenta) {
      throw new Error("Cuenta no encontrada");
    }

    cuenta.capital =cuenta.capital - monto;
    cuenta.cajaActual =cuenta.cajaActual - monto;


    await cuenta.save();

    return cuenta;
  }
  //resta el monto de prestamo a la cuenta
  async restarMontoACuenta(id_cuenta, monto, CuentaModel) {
    const cuenta = await CuentaModel.findByPk(id_cuenta);
    if (!cuenta) {
      throw new Error("Cuenta no encontrada");
    }

    cuenta.capital =cuenta.capital - monto;
    cuenta.cajaActual =cuenta.cajaActual - monto;
    cuenta.ventas += monto;

    await cuenta.save();

    return cuenta;
  }

}
module.exports = new CuentaDao();
