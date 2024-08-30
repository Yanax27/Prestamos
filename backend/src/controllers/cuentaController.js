const response  = require('../utils/response');
const resError  = require('../utils/resError');
const catchedAsync = require('../utils/catchedAsync');
const { Cuenta } = require('../db'); // Importamos el modelo
const cuentaService = require('../services/cuenta.service');


class CuentaoController {
  // Obtener todos los prestarios
  createCuenta = catchedAsync(async (req, res) => {
    const cuentaData = { ...req.body };

    // Pasamos el modelo de Prestario al servicio
    const cuenta = await cuentaService.createCuenta(cuentaData, Cuenta);

    return response(res, 201, cuenta);
  });

  getAllCuentas = catchedAsync(async (req, res) => {
    // Pasamos el modelo de Prestario al servicio
    const cuentas = await cuentaService.getAllCuentas(Cuenta);

    return response(res, 200, cuentas);
  });

  getCuentaById = catchedAsync(async (req, res) => {
    const { id } = req.params;
    // Pasamos el modelo de Prestario al servicio
    const cuenta = await cuentaService.getCuentaById(id, Cuenta);
    if (!cuenta) {
      return resError(res, 404, "Cuenta not found");
    }

    return response(res, 200, cuenta);
  });
  // Actualizar un cuenta
  updateCuenta = catchedAsync(async (req, res) => {
    const { id } = req.params;
    const cuentaData = req.body;
    const updateCuenta = await cuentaService.updateCuenta(id, cuentaData, Cuenta);
    if (!updateCuenta) {
      return resError(res, 404, "Cuenta not found");
    }
    response(res, 200, updateCuenta);
  });

  // Eliminar un prestario
  deleteCuenta = catchedAsync(async (req, res) => {
    const { id } = req.params;
    //console.log("id prestario",id)
    const deletedCuenta = await cuentaService.deleteCuenta(id, Cuenta);
    if (!deletedCuenta) {
      return resError(res, 404, "Cuenta not found");
    }
    response(res, 204, null);
  });
}

module.exports = new CuentaoController();


