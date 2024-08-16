const express = require("express");
const prestarioController = require("../controllers/prestarioController")
const router = express();
 
// Rutas
router.get('/', prestarioController.getAllPrestarios);//obtener todo
router.get('/:id', prestarioController.getPrestarioById); // obtener por id
router.post('/', prestarioController.createPrestario);//crear prestario
router.put('/:id', prestarioController.updatePrestario);// Update a Prestario
router.delete('/:id', prestarioController.deletePrestario);// Delete a Prestario

module.exports = router;
