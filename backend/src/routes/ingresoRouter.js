const express = require("express");
const ingresoController = require("../controllers/ingresoController")
const router = express();

// Rutas
router.get('/', ingresoController.getAllIngresos);//obtener todo
router.get('/:id', ingresoController.getIngresoById); // obtener por id
router.post('/', ingresoController.createIngreso);//crear ingreso
router.delete('/:id', ingresoController.deleteIngreso);// Delete a ingreso

module.exports = router;
