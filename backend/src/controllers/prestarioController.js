const prestarioService = require('../services/prestario.service');
const { response } = require('../utils/response');
const { resError } = require('../utils/resError');
const catchedAsync = require('../utils/catchedAsync');

class PrestarioController {
  // Obtener todos los prestarios
  getAllPrestarios = catchedAsync(async (req, res) => {
    const prestarios = await prestarioService.getAllPrestarios();
    response(res, 200, prestarios);
  });

  // Crear un nuevo prestario
  createPrestario = catchedAsync(async (req, res) => {
    const prestarioData = req.body;
    const prestario = await prestarioService.createPrestario(prestarioData);
    response(res, 201, prestario);
  });

  // Obtener prestario por ID
  getPrestarioById = catchedAsync(async (req, res) => {
    const { id } = req.params;
    const prestario = await prestarioService.getPrestarioById(id);
    if (!prestario) {
      return resError(res, 404, "Prestario not found");
    }
    response(res, 200, prestario);
  });

  // Actualizar un prestario
  updatePrestario = catchedAsync(async (req, res) => {
    const { id } = req.params;
    const prestarioData = req.body;
    const updatedPrestario = await prestarioService.updatePrestario(id, prestarioData);
    if (!updatedPrestario) {
      return resError(res, 404, "Prestario not found");
    }
    response(res, 200, updatedPrestario);
  });

  // Eliminar un prestario
  deletePrestario = catchedAsync(async (req, res) => {
    const { id } = req.params;
    const deletedPrestario = await prestarioService.deletePrestario(id);
    if (!deletedPrestario) {
      return resError(res, 404, "Prestario not found");
    }
    response(res, 204, null);
  });
}

module.exports = new PrestarioController();