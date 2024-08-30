const express = require("express");
const egresoController = require("../controllers/egresoController")
const router = express();

// Rutas
router.get('/', egresoController.getAllEgresos);//obtener todo
router.get('/:id', egresoController.getEgresoById); // obtener por id
router.post('/', egresoController.createEgreso);//crear egreso
router.delete('/:id', egresoController.deleteEgreso);// Delete a egreso

module.exports = router;
