const express = require("express");
const cuentaController = require("../controllers/cuentaController")
const router = express();

// Rutas
router.get('/', cuentaController.getAllCuentas);//obtener todo
router.get('/:id', cuentaController.getCuentaById); // obtener por id
router.post('/', cuentaController.createCuenta);//crear cuenta
router.put('/:id', cuentaController.updateCuenta);// Update a cuenta
router.delete('/:id', cuentaController.deleteCuenta);// Delete a cuenta

module.exports = router;
