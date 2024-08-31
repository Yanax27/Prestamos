const response  = require('../utils/response');
const resError  = require('../utils/resError');
const catchedAsync = require('../utils/catchedAsync');
const { Ingreso } = require('../db'); // Importamos el modelo
const ingresoService = require('../services/ingreso.service');


class IngresoController {
  // Obtener todos los prestarios
  createIngreso = catchedAsync(async (req, res) => {
    const ingresoData = { ...req.body };

    // Pasamos el modelo de Prestario al servicio
    const ingreso = await ingresoService.createIngreso(ingresoData, Ingreso);

    return response(res, 201, ingreso);
  });

  getAllIngresos = catchedAsync(async (req, res) => {
    // Pasamos el modelo de ingreso al servicio
    const ingresos = await ingresoService.getAllIngresos(Ingreso);

    return response(res, 200, ingresos);
  });

  getIngresoById = catchedAsync(async (req, res) => {
    const { id } = req.params;
    // Pasamos el modelo de ingreso al servicio
    const ingreso = await ingresoService.getIngresoById(id, Ingreso);
    if (!ingreso) {
      return resError(res, 404, "Ingreso not found");
    }

    return response(res, 200, ingreso);
  });

  // Eliminar un ingreso
  deleteIngreso = catchedAsync(async (req, res) => {
    const { id } = req.params;
    const deletedIngreso = await ingresoService.deleteIngreso(id, Ingreso);
    if (!deletedIngreso) {
      return resError(res, 404, "Ingreso not found");
    }
    response(res, 204, null);
  });
}

module.exports = new IngresoController();


