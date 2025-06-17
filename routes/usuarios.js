const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
router.post('/crearUsuario', usuarioController.crearUsuarioController);
router.patch('/editarUsuario', usuarioController.editarUsuarioController);
router.post('/login', usuarioController.loginUsuarioController);
router.post('/usuarios', usuarioController.obtenerUsuariosController);
router.post('/verificar-codigo', usuarioController.verificarCodigoController);
module.exports = router;