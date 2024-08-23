const { ClientError } = require('../utils/errors');
const prestamoDao = require('../daos/PrestamoDao');


class PrestamoService {

  async getAllPrestamos(PrestamoModel, filter) {
    // Pasamos el modelo al DAO
    return await prestamoDao.getAllPrestamos(PrestamoModel, filter);
  }
}

module.exports = new PrestamoService();