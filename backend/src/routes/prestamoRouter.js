const express = require("express");
const prestamoController = require("../controllers/prestamoController")
const router = express();

// Rutas
router.get('/', prestamoController.getAllPrestamos);//obtener todo
router.get('/:id', prestamoController.getPrestamoById); // obtener por id
router.get('/:id', prestamoController.getPrestamoById); // obtener por id
router.post('/', prestamoController.createPrestamo);//crear prestario
router.put('/:id', prestamoController.updatePrestamo);// Update a Prestario
router.delete('/:id', prestamoController.deletePrestamo);// Delete a Prestario

module.exports = router;
