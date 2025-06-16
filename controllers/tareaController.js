const { v4: uuidv4 } = require('uuid');
const createSequelizeConnection = require('../config/database');  // Para establecer la conexión
const createTareaModel = require('../models/Tarea');
const { createUserModel } = require('../models/usuario');
const Proyecto = require('../models/Proyecto');
const { obtenerProyectoPorId } = require('./proyectoController');

// Crear una nueva tarea
const crearTarea = async (req, res) => {
    const { Luser, Lpass } = req.body;  // Credenciales de conexión
    try {
        const { titulo, descripcion, fecha_limite, id_creador, id_proyecto, id_usuario_asignado } = req.body;

        if (!titulo || !descripcion || !fecha_limite || !id_creador || !id_proyecto) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        // Conectar a la base de datos con las credenciales proporcionadas
        const sequelize = await createSequelizeConnection(Luser, Lpass);
        const TareaModel = await createTareaModel(Luser, Lpass); // Crea el modelo de Tarea dinámicamente

        const fechaAsignacion = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

        const nuevaTarea = await TareaModel.create({
            id_tarea: uuidv4(),
            titulo,
            descripcion,
            fecha_asignacion: fechaAsignacion,
            fecha_limite,
            estado: 1, // Siempre se crea con estado "1" (pendiente)
            id_creador,
            id_proyecto,
            id_usuario_asignado
        });

        res.status(201).json(nuevaTarea);
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const editarTarea = async (req, res) => {
    const { Luser, Lpass } = req.body;  // Credenciales de conexión
    try {
        const { id_tarea, id_usuario, titulo, descripcion, fecha_asignacion, fecha_limite, fecha_finalizacion, estado } = req.body;

        if (!id_tarea) {
            return res.status(400).json({ mensaje: 'La tarea es obligatoria.' });
        }

        // Conectar a la base de datos con las credenciales proporcionadas
        const sequelize = await createSequelizeConnection(Luser, Lpass);
        if (!sequelize) {
            return res.status(500).json({ mensaje: 'Error al conectar con la base de datos.' });
        }

        // Crea el modelo de Tarea dinámicamente
        const TareaModel = await createTareaModel(Luser, Lpass);
        if (!TareaModel) {
            return res.status(500).json({ mensaje: 'Error al crear el modelo de tarea.' });
        }

        const UserModel = await createUserModel(Luser, Lpass); // Creación del modelo de usuario directamente

        const usuario = await UserModel.findOne({
            where: { id_usuario },
            attributes: ['rol']
        });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        const esAdmin = usuario.rol === '1'; // Verificar si el rol es '1', indicando admin

        const tarea = await TareaModel.findOne({ where: { id_tarea } });
        if (!tarea) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada.' });
        }

        // Validar permisos según el rol de usuario
        if (estado && !esAdmin && estado !== '2') {
            return res.status(403).json({ mensaje: 'Solo los administradores pueden cambiar el estado a un valor distinto de "completado".' });
        }

        // Si el usuario no es admin, no podrá cambiar la fecha límite
        if (fecha_limite && !esAdmin) {
            return res.status(403).json({ mensaje: 'Solo los administradores pueden cambiar la fecha límite.' });
        }

        const updatedFields = {};
        if (titulo) updatedFields.titulo = titulo;
        if (descripcion) updatedFields.descripcion = descripcion;
        if (fecha_asignacion) updatedFields.fecha_asignacion = fecha_asignacion;
        if (fecha_limite) updatedFields.fecha_limite = fecha_limite;
        if (fecha_finalizacion) updatedFields.fecha_finalizacion = fecha_finalizacion;
        if (estado) updatedFields.estado = estado;

        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ mensaje: 'No se proporcionaron datos para actualizar.' });
        }

        const [updated] = await TareaModel.update(updatedFields, {
            where: { id_tarea }
        });

        if (updated === 0) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada o datos iguales.' });
        }

        res.status(200).json({
            mensaje: 'Tarea actualizada correctamente.',
            tarea_actualizada: updatedFields
        });

    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};
// Función para obtener todas las tareas
const obtenerTareas = async (req, res) => {
    const { Luser, Lpass } = req.body;  // Credenciales de conexión

    if (!Luser || !Lpass) {
        return res.status(400).json({ mensaje: 'Faltan credenciales de conexión.' });
    }

    try {
        // Crear la conexión a la base de datos
        const sequelize = await createSequelizeConnection(Luser, Lpass);
        const TareaModel = await createTareaModel(Luser, Lpass); // Crear el modelo de tarea dinámicamente

        // Consultar todas las tareas
        const tareas = await TareaModel.findAll();

        // Si no se encuentran tareas
        if (tareas.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron tareas.' });
        }

        // Devolver todas las tareas encontradas
        return res.status(200).json({
            mensaje: 'Tareas obtenidas correctamente.',
            tareas,
        });
    } catch (error) {
        console.error('Error al obtener las tareas:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor.', error });
    }
};
// Función para obtener una tarea por su ID
const obtenerTareaPorId = async (req, res) => {
    const { Luser, Lpass, id_tarea } = req.body;  // Credenciales de conexión y ID de la tarea

    if (!Luser || !Lpass || !id_tarea) {
        return res.status(400).json({ mensaje: 'Faltan credenciales de conexión o el ID de la tarea.' });
    }

    try {
        // Crear la conexión a la base de datos
        const sequelize = await createSequelizeConnection(Luser, Lpass);
        const TareaModel = await createTareaModel(Luser, Lpass); // Crear el modelo de tarea dinámicamente

        // Consultar la tarea específica por ID
        const tarea = await TareaModel.findOne({ where: { id_tarea } });

        // Si la tarea no existe
        if (!tarea) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada.' });
        }

        // Devolver la información de la tarea
        return res.status(200).json({
            mensaje: 'Tarea obtenida correctamente.',
            tarea,
        });
    } catch (error) {
        console.error('Error al obtener la tarea:', error);
        return res.status(500).json({ mensaje: 'Error interno del servidor.', error });
    }
};

module.exports = {
    crearTarea,
    editarTarea,
    obtenerTareas,
    obtenerTareaPorId
};
