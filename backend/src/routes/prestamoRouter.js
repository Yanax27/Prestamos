const express = require("express");
const prestamoController = require("../controllers/prestamoController")
const router = express();
 
// Rutas
router.get('/', prestamoController.getAllPrestamos);//obtener todo
/*router.get('/:id', prestamoController.getPrestarioById); // obtener por id
router.post('/', prestamoController.createPrestario);//crear prestario
router.put('/:id', prestamoController.updatePrestario);// Update a Prestario
router.delete('/:id', prestamoController.deletePrestario);// Delete a Prestario*/

module.exports = router;
