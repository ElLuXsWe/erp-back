const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
router.post('/proyectos', proyectoController.obtenerProyectos);
router.post('/crearP', proyectoController.crearProyecto);
router.patch('/editarProyecto', proyectoController.editarProyecto);
router.patch('/cancelarProyecto', proyectoController.cancelarProyecto);
router.patch('/terminarProyecto', proyectoController.terminarProyecto);
module.exports = router;
