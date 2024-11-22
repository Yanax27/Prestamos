const prestamoService = require('../services/prestamo.service');
const response = require('../utils/response');
const resError = require('../utils/resError');
const catchedAsync = require('../utils/catchedAsync');
const { Prestamo, Cuenta, Usuario, Roles } = require('../db'); // Importamos el modelo



class PrestamoController {
  getAllPrestamos = catchedAsync(async (req, res) => {
    const { nombre, email, operador, idPrestario } = req.query;
    const filter = { nombre, email, operador, idPrestario };
    // Pasamos el modelo de Prestario al servicio
    const prestamos = await prestamoService.getAllPrestamos(Prestamo, filter);

    return response(res, 200, prestamos);
  });
  // crear  prestamo
  createPrestamo = catchedAsync(async (req, res) => {
    const prestamoData = { ...req.body };

    // Pasamos el modelo de prestamo al servicio
    const prestamo = await prestamoService.createPrestamo(prestamoData, Prestamo, Cuenta, Usuario, Roles);

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
  //obtener prestamo por clienteid
  getPrestamoByClienteId = catchedAsync(async (req, res) => {
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
    const deletedPrestamo = await prestamoService.deletePrestamo(id, Prestamo, Cuenta, Usuario, Roles);
    if (!deletedPrestamo) {
      return resError(res, 404, "Prestamo not found");
    }
    response(res, 204, null);
  });

 // Cambiar el estado de múltiples cuotas de manera masiva
 updateEstadosCuotasMasivo = catchedAsync(async (req, res) => {
  const { id } = req.params;
  const { cuotas, nuevoEstado } = req.body; // `cuotas` es un array de índices, `nuevoEstado` es el nuevo estado
  const prestamoActualizado = await prestamoService.updateEstadosCuotasMasivo(id, cuotas, nuevoEstado, Prestamo);

  if (!prestamoActualizado) {
    return resError(res, 404, "Préstamo no encontrado");
  }
  return response(res, 200, prestamoActualizado);
});
}
module.exports = new PrestamoController();
