const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/permissionMiddleware');
const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('admin'), usuarioController.getAllUsuarios);
router.post('/login', usuarioController.login);
router.post('/logout', usuarioController.logout);
router.post('/', /*authMiddleware, roleMiddleware('admin'),*/usuarioController.createUsuario);
router.get('/:id', authMiddleware, roleMiddleware('admin'),usuarioController.getUsuariobyId);
router.patch('/:id', authMiddleware, roleMiddleware('admin'), usuarioController.updateUsuario);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), usuarioController.deleteUsuario);

module.exports = router;
