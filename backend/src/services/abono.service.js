const { ClientError } = require('../utils/errors');
const abonoDao = require('../daos/AbonoDao');
const prestamoDao = require('../daos/PrestamoDao');


class AbonoService {
  async createAbono(abonoData, PrestamoModel, AbonoModel) {
    const { monto, fecha, PrestamoIdPrestamo } = abonoData;

    // Crear el abono
    const nuevoAbono = await abonoDao.createAbono({ monto, fecha, PrestamoIdPrestamo }, AbonoModel);

    // Obtener el préstamo
    const prestamo = await prestamoDao.getPrestamoById(PrestamoIdPrestamo, PrestamoModel);
    if (!prestamo) throw new ClientError("Préstamo no encontrado", 404);

    // Lógica para procesar el abono
    const valorCuota = prestamo.valorCuota;
    let totalAbonoAplicable = monto + prestamo.saldoAbono;
    let cuotasPagadas = prestamo.cuotasPagadas;
    const verificarPagoActualizado = [...prestamo.verificarPago];
    // Calcular cuántas cuotas se pueden pagar con el totalAbonoAplicable
    while (totalAbonoAplicable >= valorCuota && cuotasPagadas < prestamo.numeroCuota) {
      totalAbonoAplicable -= valorCuota;
      cuotasPagadas++;

      // Cambia el último valor "pendiente" a "pagada" en verificarPago
      for (let i = verificarPagoActualizado.length - 1; i >= 0; i--) {
        if (verificarPagoActualizado[i] === "pendiente") {
          verificarPagoActualizado[i] = "pagoAbono";
          break; // Solo cambia el último "pendiente"
        }
      }
    }

    // Actualizar los datos del préstamo
    await prestamo.update({
      saldoAbono: totalAbonoAplicable,
      cuotasPagadas,
      deudaActual: prestamo.deudaActual - monto,
      verificarPago: verificarPagoActualizado,
    });

    return nuevoAbono;
  }



  async getAllAbonos(AbonoModel) {
    // Pasamos el modelo al DAO
    return await abonoDao.getAllAbono(AbonoModel);
  }

  async getAbonoById(id, AbonoModel) {
    // Pasamos el modelo al DAO
    return await abonoDao.getAbonoById(id, AbonoModel);
  }

  async updateAbono(id, abonoData, AbonoModel) {
    const abono = await abonoDao.updateAbono(id, abonoData, AbonoModel);
    if (!abono) {
      throw new ClientError("abono not found", 404);
    }
    return abono;
  }

  async deleteAbono(id, AbonoModel) {
    const abono = await abonoDao.deleteAbono(id, AbonoModel);
    if (!abono) {
      throw new ClientError("abono not found", 404);
    }
    return abono;
  }
}

module.exports = new AbonoService();
