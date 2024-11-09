const express = require("express");
const prestamoController = require("../controllers/prestamoController")
const router = express();

// Rutas
router.get('/', prestamoController.getAllPrestamos);//obtener todo
router.get('/:id', prestamoController.getPrestamoById); // obtener por id
router.get('/:id', prestamoController.getPrestamoById); // obtener por id
router.patch('/', prestamoController.createPrestamo);//crear prestario
router.put('/:id', prestamoController.updatePrestamo);// Update a Prestario
router.delete('/:id', prestamoController.deletePrestamo);// Delete a Prestario
router.put('/:id/cambiar-estados-cuotas', prestamoController.updateEstadosCuotasMasivo);// Delete a Prestario
module.exports = router;
