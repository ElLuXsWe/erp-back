const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');

// Rutas para crear y editar tarea
router.post('/crearT', tareaController.crearTarea);
router.patch('/editarTarea', tareaController.editarTarea);
router.get('/tareas', tareaController.obtenerTareas);
router.get('/tarea/:id_tarea', tareaController.obtenerTareaPorId);
module.exports = router;
