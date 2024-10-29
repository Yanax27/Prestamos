const { ClientError } = require('../utils/errors');
const prestamoDao = require('../daos/PrestamoDao');
const cuentaDao = require('../daos/CuentaDao'); // Importamos cuentaDao aquí
const usuarioDao = require('../daos/UsuarioDao'); // Para obtener el usuario y su cuenta

class PrestamoService {

  async getAllPrestamos(PrestamoModel, filter) {
    return await prestamoDao.getAllPrestamos(PrestamoModel, filter);
  }

// Crear préstamo y actualizar cuenta
async createPrestamo(prestamoData, PrestamoModel, CuentaModel, UsuarioModel, RoleModel) {
  if (!prestamoData) {
    throw new ClientError('Prestamo data is required', 400);
  }

  // Crear el préstamo
  const prestamo = await prestamoDao.createPrestamo(prestamoData, PrestamoModel);

  // Obtener el usuario por el ID asociado en el prestamoData
  const usuario = await usuarioDao.getUsuarioById(prestamoData.UsuarioIdUsuario, UsuarioModel, RoleModel); // Asumimos que el prestamoData incluye UsuarioId

  if (!usuario) {
    throw new ClientError('Usuario not found', 404);
  }

  // Obtener el ID de la cuenta del usuario
  const cuentaId = usuario.CuentumIdCuenta; // Asegúrate de que este campo refleje la relación correcta en tu modelo
  if (!cuentaId) {
    throw new ClientError('No account associated with this user', 400);
  }

  // Restar el monto del préstamo al capital de la cuenta del usuario
  const cuenta = await cuentaDao.getCuentaById(cuentaId, CuentaModel);
  if (!cuenta) {
    throw new ClientError('Cuenta not found', 404);
  }

  await cuentaDao.restarMontoACuenta(cuenta.id_cuenta, prestamoData.monto, CuentaModel);

  return prestamo;
}

  async getPrestamoById(id, PrestamoModel) {
    return await prestamoDao.getPrestamoById(id, PrestamoModel);
  }

  async updatePrestamo(id, prestamoData, PrestamoModel) {
    const prestamo = await prestamoDao.updatePrestamo(id, prestamoData, PrestamoModel);
    if (!prestamo) {
      throw new ClientError("Prestamo not found", 404);
    }
    return prestamo;
  }

  async deletePrestamo(id, PrestamoModel, CuentaModel, UsuarioModel, RoleModel) {
    // Buscar el préstamo por ID
    const prestamo = await prestamoDao.getPrestamoById(id, PrestamoModel);
    if (!prestamo) {
      throw new ClientError("Prestamo not found", 404);
    }

    // Obtener el usuario asociado al préstamo
    const usuario = await usuarioDao.getUsuarioById(prestamo.UsuarioIdUsuario, UsuarioModel, RoleModel);
    if (!usuario) {
      throw new ClientError("Usuario not found", 404);
    }

    // Obtener el ID de la cuenta del usuario
    const cuentaId = usuario.CuentumIdCuenta;
    if (!cuentaId) {
      throw new ClientError("No account associated with this user", 400);
    }

    // Restaurar el monto eliminado en la cuenta
    await cuentaDao.sumarMontoACuenta(cuentaId, prestamo.monto, CuentaModel);

    // Eliminar el préstamo
    await prestamoDao.deletePrestamo(id, PrestamoModel);

    return prestamo;
  }
}


module.exports = new PrestamoService();
