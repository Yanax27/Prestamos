const response  = require('../utils/response');
const resError  = require('../utils/resError');
const catchedAsync = require('../utils/catchedAsync');
const { Abono } = require('../db'); // Importamos el modelo
const abonoService = require('../services/abono.service');


class AbonooController {
  // Obtener todos los prestarios
  createAbono = catchedAsync(async (req, res) => {
    const abonoData = { ...req.body };

    // Pasamos el modelo de Prestario al servicio
    const abono = await abonoService.createAbono(abonoData, Abono);

    return response(res, 201, abono);
  });

  getAllAbonos = catchedAsync(async (req, res) => {
    // Pasamos el modelo de Prestario al servicio
    const abonos = await abonoService.getAllAbonos(Abono);

    return response(res, 200, abonos);
  });

  getAbonoById = catchedAsync(async (req, res) => {
    const { id } = req.params;
    // Pasamos el modelo de Prestario al servicio
    const abono = await abonoService.getAbonoById(id, Abono);
    if (!abono) {
      return resError(res, 404, "Abono not found");
    }

    return response(res, 200, abono);
  });
  // Actualizar un abono
  updateAbono = catchedAsync(async (req, res) => {
    const { id } = req.params;
    const abonoData = req.body;
    const updateAbono = await abonoService.updateAbono(id, abonoData, Abono);
    if (!updateAbono) {
      return resError(res, 404, "Abono not found");
    }
    response(res, 200, updateAbono);
  });

  // Eliminar un prestario
  deleteAbono = catchedAsync(async (req, res) => {
    const { id } = req.params;
    //console.log("id prestario",id)
    const deletedAbono = await abonoService.deleteAbono(id, Abono);
    if (!deletedAbono) {
      return resError(res, 404, "Abono not found");
    }
    response(res, 204, null);
  });
}

module.exports = new AbonooController();


