const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/permissionMiddleware');
const router = express.Router();

router.get('/', authMiddleware, /*roleMiddleware('admin'),*/ usuarioController.getAllUsuarios);
router.post('/login', usuarioController.login);
router.post('/logout', usuarioController.logout);
router.post('/', usuarioController.createUsuario);
router.get('/:id', authMiddleware, usuarioController.getUsuariobyId);
router.put('/:id', authMiddleware, roleMiddleware('admin'), usuarioController.updateUsuario);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), usuarioController.deleteUsuario);

module.exports = router;






/*const express = require("express");
const usuarioController = require("../controllers/usuarioController")
const router = express();
 
// Rutas
router.get('/', usuarioController.getAllUsuarios);//obtener todo
router.get('/:id', usuarioController.getUsuariobyId); // obtener por id
router.post('/', usuarioController.createUsuario);//crear usuario
router.put('/:id', usuarioController.updateUsuario);// Update a usuario
router.delete('/:id', usuarioController.deleteUsuario);// Delete a usuario

module.exports = router;*/
