const { ClientError } = require('../utils/errors');
const abonoDao = require('../daos/AbonoDao');


class AbonoService {
  async createAbono(abonoData, AbonoModel) {
    if (!abonoData) {
      throw new ClientError('abono data is required', 400);
    }
    // Pasamos el modelo al DAO
    return await abonoDao.createAbono(abonoData, AbonoModel);
  }

  async getAllAbonos(AbonoModel) {
    // Pasamos el modelo al DAO
    return await abonoDao.getAllAbono(AbonoModel);
  }

  async getAbonoById(id, AbonoModel) {
    // Pasamos el modelo al DAO
    return await abonoDao.getAbonoById(id, AbonoModel);
  }

  async updateAbono(id, abonoData, AbonoModel) {
    const abono = await abonoDao.updateAbono(id, abonoData, AbonoModel);
    if (!abono) {
      throw new ClientError("abono not found", 404);
    }
    return abono;
  }

  async deleteAbono(id, AbonoModel) {
    const abono = await abonoDao.deleteAbono(id, AbonoModel);
    if (!abono) {
      throw new ClientError("abono not found", 404);
    }
    return abono;
  }
}

module.exports = new AbonoService();
