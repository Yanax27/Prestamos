const response  = require('../utils/response');
const resError  = require('../utils/resError');
const catchedAsync = require('../utils/catchedAsync');
const { Egreso } = require('../db'); // Importamos el modelo
const { Cuenta } = require('../db'); // Importamos el modelo
const egresoService = require('../services/egreso.service');


class EgresoController {
  // Obtener todos los prestarios
  createEgreso = catchedAsync(async (req, res) => {
    const egresoData = { ...req.body };
    // Pasamos el modelo de Prestario al servicio
    const egreso = await egresoService.createEgreso(egresoData, Egreso, Cuenta);

    return response(res, 201, egreso);
  });

  getAllEgresos = catchedAsync(async (req, res) => {
    // Pasamos el modelo de Prestario al servicio
    const egresos = await egresoService.getAllEgresos(Egreso);

    return response(res, 200, egresos);
  });

  getEgresoById = catchedAsync(async (req, res) => {
    const { id } = req.params;
    // Pasamos el modelo de Prestario al servicio
    const egreso = await egresoService.getEgresoById(id, Egreso);
    if (!egreso) {
      return resError(res, 404, "Egreso not found");
    }

    return response(res, 200, egreso);
  });
  // Actualizar un egreso
  updateEgreso = catchedAsync(async (req, res) => {
    const { id } = req.params;
    const egresoData = req.body;
    const updateEgreso = await egresoService.updateEgreso(id, egresoData, Egreso);
    if (!updateEgreso) {
      return resError(res, 404, "Egreso not found");
    }
    response(res, 200, updateEgreso);
  });

  // Eliminar un prestario
  deleteEgreso = catchedAsync(async (req, res) => {
    const { id } = req.params;
    //console.log("id prestario",id)
    const deletedEgreso = await egresoService.deleteEgreso(id, Egreso);
    if (!deletedEgreso) {
      return resError(res, 404, "Egreso not found");
    }
    response(res, 204, null);
  });
}

module.exports = new EgresoController();


