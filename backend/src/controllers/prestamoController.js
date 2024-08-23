const prestamoService = require('../services/prestamo.service');
const response  = require('../utils/response');
const resError  = require('../utils/resError');
const catchedAsync = require('../utils/catchedAsync');
const { Prestamo } = require('../db'); // Importamos el modelo 

class PrestamoController{
    getAllPrestamos = catchedAsync(async (req, res) => {
      const {nombre, email, operador} = req.query;
      const filter = {nombre, email, operador};
        // Pasamos el modelo de Prestario al servicio
        const prestamos = await prestamoService.getAllPrestamos(Prestamo, filter);
        
        return response(res, 200, prestamos);
      });
}
module.exports = new PrestamoController();