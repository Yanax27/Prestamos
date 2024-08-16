const express = require("express");
const prestarioController = require("../controllers/prestarioController")
const router = express();
 
// Rutas
router.post('/', prestarioController.createPrestario);
router.get('/', prestarioController.getAllPrestarios);
router.get('/:id', prestarioController.getPrestarioById);

module.exports = router;
