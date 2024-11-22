const response = require('../utils/response');
const resError = require('../utils/resError');
const catchedAsync = require('../utils/catchedAsync');
const { Egreso } = require('../db'); // Importamos el modelo
const { Cuenta } = require('../db'); // Importamos el modelo
const egresoService = require('../services/egreso.service');

class EgresoController {
  // Crear un nuevo egreso
  createEgreso = catchedAsync(async (req, res) => {
    const egresoData = { ...req.body };
    const egreso = await egresoService.createEgreso(egresoData, Egreso, Cuenta);
    return response(res, 201, egreso);
  });

  // Obtener todos los egresos con filtro opcional de CuentumIdCuenta
  getAllEgresos = catchedAsync(async (req, res) => {
    const { cuentaId } = req.query; // Obtener el filtro de la consulta
    const egresos = await egresoService.getAllEgresos(Egreso, cuentaId);
    return response(res, 200, egresos);
  });

  getEgresoById = catchedAsync(async (req, res) => {
    const { id } = req.params;
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
    const updatedEgreso = await egresoService.updateEgreso(id, egresoData, Egreso);
    if (!updatedEgreso) {
      return resError(res, 404, "Egreso not found");
    }
    response(res, 200, updatedEgreso);
  });

  // Eliminar un egreso
  deleteEgreso = catchedAsync(async (req, res) => {
    const { id } = req.params;
    const deletedEgreso = await egresoService.deleteEgreso(id, Egreso);
    if (!deletedEgreso) {
      return resError(res, 404, "Egreso not found");
    }
    response(res, 204, null);
  });
}

module.exports = new EgresoController();
