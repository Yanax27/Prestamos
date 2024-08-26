const { ClientError } = require('../utils/errors');
const prestamoDao = require('../daos/PrestamoDao');


class PrestamoService {

  async getAllPrestamos(PrestamoModel, filter) {
    // Pasamos el modelo al DAO
    return await prestamoDao.getAllPrestamos(PrestamoModel, filter);
  }
  //crear prestamos
  async createPrestamo(prestamoData, PrestamoModel) {
    if (!prestamoData) {
      throw new ClientError('Prestamo data is required', 400);
    }
    // Pasamos el modelo al DAO
    return await prestamoDao.createPrestamo(prestamoData, PrestamoModel);
  }
  //obtener prestamo por id
  async getPrestamoById(id, {PrestamoModel}) {
    // Pasamos el modelo al DAO
    return await prestamoDao.getPrestamoById(id, PrestamoModel);
  }
  //actualziar prestamo
  async updatePrestamo(id, prestamoData, PrestamoModel) {
    const prestamo = await prestamoDao.updatePrestamo(id, prestamoData, PrestamoModel);
    if (!prestamo) {
      throw new ClientError("Prestamo not found", 404);
    }
    return prestamo;
  }
  async deletePrestamo(id, PrestamoModel) {
    const prestamo = await prestamoDao.deletePrestamo(id, PrestamoModel);
    if (!prestamo) {
      throw new ClientError("Prestamo not found", 404);
    }
    return prestamo;
  }
}
module.exports = new PrestamoService();
