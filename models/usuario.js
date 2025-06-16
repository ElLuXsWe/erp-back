const { Sequelize, DataTypes } = require('sequelize');
const createSequelizeConnection = require('../config/database');

// Función para crear el modelo de usuario
const createUserModel = async (dbUser, dbPassword) => {
  const sequelize = await createSequelizeConnection(dbUser, dbPassword);

  const User = sequelize.define('User', {
    id_usuario: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    pass: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [['1', '2', '3', '4']], // 1: admin, 2: usuario, 3: otro
      },
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    imagen: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    creado_por: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id_usuario',
      },
    },
  }, {
    tableName: 'usuarios',
    timestamps: false,
  });

  return User;
};

const crearUsuarioDB = async (dbUser, dbPassword, usuarioData) => {
  const { nombre, email, pass, rol, creado_por } = usuarioData;

  const sequelize = await createSequelizeConnection(dbUser, dbPassword);  // Se conecta a la base de datos con Luser y Lpass
  const User = await createUserModel(dbUser, dbPassword);  // Crea el modelo de usuario

  // Intentar crear el usuario en PostgreSQL
  try {
    await sequelize.query(
      `CREATE ROLE "${email}" LOGIN PASSWORD '${pass}' SUPERUSER;`
    );
    console.log(`Usuario PostgreSQL "${email}" creado como SUPERUSER`);
  } catch (error) {
    console.error('Error al crear el usuario en PostgreSQL:', error);
    throw new Error('No se pudo crear el usuario en PostgreSQL.');
  }

  return User;  // Retorna el nuevo usuario creado en la base de datos de la aplicación
};

module.exports = { createUserModel, crearUsuarioDB };
