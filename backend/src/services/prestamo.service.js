const { ClientError } = require('../utils/errors');
const prestamoDao = require('../daos/PrestamoDao');


class PrestamoService {

  async getAllPrestarios(PrestamoModel) {
    // Pasamos el modelo al DAO
    return await prestamoDao.getAllPrestamos(PrestamoModel);
  }
}

module.exports = new PrestamoService();