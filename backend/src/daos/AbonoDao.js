
class AbonoDao {
  // Obtener todos los abono
  async getAllAbono(AbonoModel) {

    return await AbonoModel.findAll();
  }

  // Crear un nuevo abono
  async createAbono(abonoData, AbonoModel) {
    return await AbonoModel.create(abonoData);
  }

  // Obtener un abono por ID
  async getAbonoById(id, AbonoModel) {
    return await AbonoModel.findByPk(id);
  }

  // Actualizar un abono
  async updateAbono(id, abonoData, AbonoModel) {
    const abono = await AbonoModel.findByPk(id);
    if (!abono) return null;
    await abono.update(abonoData);
    return abono;
  }

  // Eliminar un abono
  async deleteAbono(id, AbonoModel) {
    const abono = await AbonoModel.findByPk(id);
    if (!abono) return null;
    await abono.destroy();
    return abono;
  }
}

module.exports = new AbonoDao();



