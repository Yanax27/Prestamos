class IngresoDao{
  // Obtener todos los ingresos con posible filtro por CuentumIdCuenta
  async getAllIngreso(IngresoModel, filter) {
    const query = filter.CuentumIdCuenta
      ? { where: { CuentumIdCuenta: filter.CuentumIdCuenta } }
      : {};

    return await IngresoModel.findAll(query);
  }

  // Crear un nuevo ingreso
  async createIngreso(ingresoData, IngresoModel) {
    return await IngresoModel.create(ingresoData);
  }

  // Obtener un ingreso por ID
  async getIngresoById(id, IngresoModel) {
    return await IngresoModel.findByPk(id);
  }

  // Eliminar un ingreso
  async deleteIngreso(id, IngresoModel) {
    const ingreso = await IngresoModel.findByPk(id);
    if (!ingreso) return null;
    await ingreso.destroy();
    return ingreso;
  }
}
module.exports = new IngresoDao();
