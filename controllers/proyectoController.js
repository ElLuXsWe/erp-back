const { crearProyectoUseCase } = require('../usecases/proyecto/crearProyecto.js');
const { obtenerProyectosUseCase } = require('../usecases/proyecto/obtenerProyectos.js');
const { editarProyectoUseCase } = require('../usecases/proyecto/editarProyecto');
const { terminarProyectoUseCase } = require('../usecases/proyecto/terminarProyecto');
const  cancelarProyectoUseCase   = require('../usecases/proyecto/cancelarProyecto.js');
const crearProyecto = async (req, res) => {
  const { Luser, Lpass, nombre, descripcion, id_creador, fecha_limite, usuarios } = req.body;
  if (!Luser || !Lpass || !nombre || !descripcion) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
  }
  try {
    const resultado = await crearProyectoUseCase({
      Luser,
      Lpass,
      nombre,
      descripcion,
      id_creador,
      fecha_limite,
      usuarios
    });
    return res.status(200).json({
      mensaje: '✅ Proyecto creado exitosamente.',
      id: resultado.id_proyecto
    });
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    return res.status(500).json({
      mensaje: '❌ Error al crear el proyecto.',
      error: error.message || error
    });
  }
};
const obtenerProyectos = async (req, res) => {
  const { Luser, Lpass, id_creador } = req.body;

  if (!Luser || !Lpass || !id_creador) {
    return res.status(400).json({ mensaje: 'Faltan credenciales o el ID del usuario.' });
  }

  try {
    const proyectos = await obtenerProyectosUseCase({ Luser, Lpass, id_creador });
    return res.status(200).json(proyectos);
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
    return res.status(500).json({ mensaje: 'Error al obtener los proyectos.', error: error.message || error });
  }
};
const editarProyecto = async (req, res) => {
  const { Luser, Lpass, id, nombre, descripcion, fecha_limite, estado, usuarios } = req.body;
  if (!Luser || !Lpass || !id || !nombre || !descripcion) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
  }

  try {
    await editarProyectoUseCase({
      Luser,
      Lpass,
      id_proyecto: id,
      nombre,
      descripcion,
      fecha_limite,
      estado,
      usuarios
    });

    return res.status(200).json({ mensaje: 'Proyecto actualizado exitosamente' });
  } catch (error) {
    console.error('Error al editar el proyecto:', error);
    return res.status(500).json({ mensaje: 'Error al editar el proyecto.', error: error.message || error });
  }
};
const terminarProyecto = async (req, res) => {
  const { Luser, Lpass, id } = req.body;
  if (!Luser || !Lpass || !id) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
  }
  try {
    await terminarProyectoUseCase({ Luser, Lpass, id_proyecto: id });
    return res.status(200).json({ mensaje: 'Proyecto marcado como Terminado.' });
  } catch (error) {
    console.error('Error al terminar el proyecto:', error);
    return res.status(500).json({ mensaje: 'Error al terminar el proyecto.', error: error.message || error });
  }
};
const cancelarProyecto = async (req, res) => {
  const { Luser, Lpass, id } = req.body;
  const id_proyecto = id;
  if (!Luser || !Lpass || !id_proyecto) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios.' });
  }
  try {
    const resultado = await cancelarProyectoUseCase({ Luser, Lpass, id_proyecto });
    return res.status(200).json({ mensaje: resultado });
  } catch (error) {
    console.error('Error al cancelar el proyecto:', error);
    return res.status(500).json({ mensaje: 'Error al cancelar el proyecto.', error: error.message });
  }
};
module.exports = {
 obtenerProyectos,crearProyecto,editarProyecto,terminarProyecto,cancelarProyecto
};
