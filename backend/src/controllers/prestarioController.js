const prestarioService = require('../services/prestario.service');
const response  = require('../utils/response');
const resError  = require('../utils/resError');
const catchedAsync = require('../utils/catchedAsync');
const { Prestario } = require('../db'); // Importamos el modelo 


class PrestarioController {
  // Obtener todos los prestarios
  createPrestario = catchedAsync(async (req, res) => {
    const prestarioData = { ...req.body };
    
    // Pasamos el modelo de Prestario al servicio
    const prestario = await prestarioService.createPrestario(prestarioData, Prestario);
    
    return response(res, 201, prestario);
  });

  getAllPrestarios = catchedAsync(async (req, res) => {
    // Pasamos el modelo de Prestario al servicio
    const prestarios = await prestarioService.getAllPrestarios(Prestario);
    
    return response(res, 200, prestarios);
  });

  getPrestarioById = catchedAsync(async (req, res) => {
    const { id } = req.params;

    // Pasamos el modelo de Prestario al servicio
    const prestario = await prestarioService.getPrestarioById(id, Prestario);
    
    if (!prestario) {
      return resError(res, 404, "Prestario not found");
    }

    return response(res, 200, prestario);
  });
  // Actualizar un prestario
  updatePrestario = catchedAsync(async (req, res) => {
    const { id } = req.params;
    const prestarioData = req.body;
    const updatedPrestario = await prestarioService.updatePrestario(id, prestarioData, Prestario);
    if (!updatedPrestario) {
      return resError(res, 404, "Prestario not found");
    }
    response(res, 200, updatedPrestario);
  });

  // Eliminar un prestario
  deletePrestario = catchedAsync(async (req, res) => {
    const { id } = req.params;
    //console.log("id prestario",id)
    const deletedPrestario = await prestarioService.deletePrestario(id, Prestario);
    //console.log("true?",deletedPrestario)
    if (!deletedPrestario) {
      return resError(res, 404, "Prestario not found");
    }
    response(res, 204, null);
  });
}

module.exports = new PrestarioController();


