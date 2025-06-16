const { Sequelize, DataTypes } = require('sequelize');
const createSequelizeConnection = require('../config/database');  // Función para crear la conexión a la base de datos

// Función para crear el modelo de Tarea
const createTareaModel = async (Luser, Lpass) => {
  const sequelize = await createSequelizeConnection(Luser, Lpass); // Conexión dinámica

  const Tarea = sequelize.define('Tarea', {
    id_tarea: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fecha_asignacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: Sequelize.NOW // Asigna la fecha actual al momento de la asignación
    },
    fecha_limite: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fecha_finalizacion: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isIn: [[0, 1, 2, 3, 4]] // Estados permitidos
      }
    },
    id_proyecto: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'proyectos',
        key: 'id_proyecto'
      }
    },
    id_creador: {
      type: DataTypes.UUID,
      allowNull: false
    },
    id_usuario_asignado: {
      type: DataTypes.UUID
    }
  }, {
    tableName: 'tareas',
    timestamps: false
  });

  return Tarea;
};

module.exports = createTareaModel;
