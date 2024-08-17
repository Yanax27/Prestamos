const express = require("express");
const usuarioController = require("../controllers/usuarioController")
const router = express();
 
// Rutas
router.get('/', usuarioController.getAllUsuarios);//obtener todo
router.get('/:id', usuarioController.getUsuariobyId); // obtener por id
router.post('/', usuarioController.createUsuario);//crear usuario
router.put('/:id', usuarioController.updateUsuario);// Update a usuario
router.delete('/:id', usuarioController.deleteUsuario);// Delete a usuario

module.exports = router;
