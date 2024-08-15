const { ClientError } = require('../utils/errors');
const prestarioDao = require('../daos/PrestarioDao');

class PrestarioService {
  async createPrestario(prestarioData, PrestarioModel) {
    if (!prestarioData) {
      throw new ClientError("Prestario data is required", 400);
    }
    return await prestarioDao.createPrestario(prestarioData, PrestarioModel);
  }

  async getAllPrestarios(PrestarioModel) {
    return await prestarioDao.getAllPrestarios(PrestarioModel);
  }

  async getPrestarioById(id, PrestarioModel) {
    const prestario = await prestarioDao.getPrestarioById(id, PrestarioModel);
    if (!prestario) {
      throw new ClientError("Prestario not found", 404);
    }
    return prestario;
  }

  async updatePrestario(id, prestarioData, PrestarioModel) {
    const prestario = await prestarioDao.updatePrestario(id, prestarioData, PrestarioModel);
    if (!prestario) {
      throw new ClientError("Prestario not found", 404);
    }
    return prestario;
  }

  async deletePrestario(id, PrestarioModel) {
    const prestario = await prestarioDao.deletePrestario(id, PrestarioModel);
    if (!prestario) {
      throw new ClientError("Prestario not found", 404);
    }
    return prestario;
  }
}

module.exports = new PrestarioService();