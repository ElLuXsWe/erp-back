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

  const sequelize = await createSequelizeConnection(dbUser, dbPassword);
  const User = await createUserModel(dbUser, dbPassword);

  try {
    // Verificar si el rol ya existe
    const existingRole = await sequelize.query(
      `SELECT 1 FROM pg_roles WHERE rolname = :email`,
      { replacements: { email }, type: sequelize.QueryTypes.SELECT }
    );

    if (existingRole.length > 0) {
      // El rol existe: actualizar contraseña
      await sequelize.query(
        `ALTER ROLE "${email}" WITH LOGIN PASSWORD :pass CREATEROLE;`,
        { replacements: { pass } }
      );
      console.log(`Rol "${email}" ya existía, contraseña actualizada.`);
    } else {
      // El rol no existe: crear nuevo
      await sequelize.query(
        `CREATE ROLE "${email}" LOGIN PASSWORD :pass CREATEROLE;`,
        { replacements: { pass } }
      );
      console.log(`Rol "${email}" creado.`);
    }

    // Otorgar permisos (puede repetir sin problema)
    await sequelize.query(`GRANT CONNECT ON DATABASE postgres TO "${email}";`);
    await sequelize.query(`GRANT USAGE ON SCHEMA public TO "${email}";`);
    await sequelize.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "${email}";`);
    await sequelize.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "${email}";`);
    await sequelize.query(`GRANT CREATE ON SCHEMA public TO "${email}";`);
    await sequelize.query(`GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO "${email}";`);
    await sequelize.query(`GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO "${email}";`);
    await sequelize.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO "${email}";`);
    await sequelize.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO "${email}";`);

    console.log(`Permisos otorgados al rol "${email}".`);
  } catch (error) {
    console.error('Error al crear o actualizar el usuario en PostgreSQL:', error);
    throw new Error('No se pudo crear o actualizar el usuario en PostgreSQL.');
  }

  return User;
};


module.exports = { createUserModel, crearUsuarioDB };
