const { DataTypes } = require('sequelize');
const createSequelizeConnection = require('../config/database');
const createProyectoModel = async (dbUser, dbPassword) => {
  const sequelize = await createSequelizeConnection(dbUser, dbPassword);
  const Proyecto = sequelize.define('Proyecto', {
    id_proyecto: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    nombre: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    fecha_inicio: DataTypes.DATEONLY,
    fecha_limite: DataTypes.DATEONLY,
    estado: DataTypes.INTEGER,
    id_creador: DataTypes.UUID
  }, {
    tableName: 'proyectos',
    timestamps: false
  });

  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    nombre: DataTypes.STRING,
  }, {
    tableName: 'usuarios',
    timestamps: false
  });

  const ProyectoUsuarioAsignado = sequelize.define('ProyectoUsuarioAsignado', {
    id_proyecto: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.UUID,
      primaryKey: true,
    }
  }, {
    tableName: 'proyectos_usuarios_asignados',
    timestamps: false
  });

  Proyecto.belongsToMany(Usuario, {
    through: ProyectoUsuarioAsignado,
    foreignKey: 'id_proyecto',
    otherKey: 'id_usuario',
    as: 'usuarios_asignados'
  });

  Usuario.belongsToMany(Proyecto, {
    through: ProyectoUsuarioAsignado,
    foreignKey: 'id_usuario',
    otherKey: 'id_proyecto',
    as: 'proyectos_asignados'
  });
  return { Proyecto, Usuario, ProyectoUsuarioAsignado, sequelize };
};
module.exports = createProyectoModel;
