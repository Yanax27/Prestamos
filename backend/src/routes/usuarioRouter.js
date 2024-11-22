const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/permissionMiddleware');
const router = express.Router();

// Rutas protegidas con permisos específicos según el nivel requerido
router.get(
  '/',
  authMiddleware,
  roleMiddleware(2), // Requiere al menos nivel "prestamista" (nivel 2)
  usuarioController.getAllUsuarios
);

router.post('/login', usuarioController.login);

router.post('/logout', usuarioController.logout);

router.post('/validate/token', authMiddleware, (req, res) => {
  const { id_usuario, email, roles } = req.user;
  res.status(200).json({
    success: true,
    message: 'Token válido',
    user: { id_usuario, email, roles }, // Devuelve toda la información del usuario
  });
});


router.post(
  '/',
  //authMiddleware,
  //roleMiddleware(3), // Requiere nivel "admin" (nivel 3) para crear usuarios
  usuarioController.createUsuario
);

router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(2), // Requiere al menos nivel "prestamista" para obtener detalles de un usuario
  usuarioController.getUsuariobyId
);

router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware(2), // Requiere nivel "admin" para actualizar usuarios
  usuarioController.updateUsuario
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(3), // Requiere nivel "admin" para eliminar usuarios
  usuarioController.deleteUsuario
);

module.exports = router;
