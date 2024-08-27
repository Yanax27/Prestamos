const express = require("express");
const abonoController = require("../controllers/abonoController")
const router = express();

// Rutas
router.get('/', abonoController.getAllAbonos);//obtener todo
router.get('/:id', abonoController.getAbonoById); // obtener por id
router.post('/', abonoController.createAbono);//crear prestario
router.put('/:id', abonoController.updateAbono);// Update a Prestario
router.delete('/:id', abonoController.deleteAbono);// Delete a Prestario

module.exports = router;
