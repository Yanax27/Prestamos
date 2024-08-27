const prestamoService = require('../services/prestamo.service');
const response = require('../utils/response');
const resError = require('../utils/resError');
const catchedAsync = require('../utils/catchedAsync');
const { Prestamo } = require('../db'); // Importamos el modelo
const prestarioService = require('../services/prestario.service');

class PrestamoController {
  getAllPrestamos = catchedAsync(async (req, res) => {
    const { nombre, email, operador } = req.query;
    const filter = { nombre, email, operador };
    // Pasamos el modelo de Prestario al servicio
    const prestamos = await prestamoService.getAllPrestamos(Prestamo, filter);

    return response(res, 200, prestamos);
  });
  // crear  prestamo
  createPrestamo = catchedAsync(async (req, res) => {
    const prestamoData = { ...req.body };

    // Pasamos el modelo de prestamo al servicio
    const prestamo = await prestamoService.createPrestamo(prestamoData, Prestamo);

    return response(res, 201, prestamo);
  });
  //obtener prestamo por id
  getPrestamoById = catchedAsync(async (req, res) => {
    const { id } = req.params;
    // Pasamos el modelo de Prestario al servicio
    const prestamo = await prestamoService.getPrestamoById(id, Prestamo);
    if (!prestamo) {
      return resError(res, 404, "Prestamo not found");
    }
    return response(res, 200, prestamo);
  });
    // Actualizar un prestamo
    updatePrestamo = catchedAsync(async (req, res) => {
      const { id } = req.params;
      const prestamoData = req.body;
      const updatedPrestamo = await prestamoService.updatePrestamo(id, prestamoData, Prestamo);
      if (!updatedPrestamo) {
        return resError(res, 404, "Prestamo not found");
      }
      response(res, 200, updatedPrestamo);
    });

    // Eliminar un prestamo
    deletePrestamo = catchedAsync(async (req, res) => {
      const { id } = req.params;
      //console.log("id prestario",id)
      const deletedPrestamo = await prestamoService.deletePrestamo(id, Prestamo);
      if (!deletedPrestamo) {
        return resError(res, 404, "Prestamo not found");
      }
      response(res, 204, null);
    });
}
module.exports = new PrestamoController();
