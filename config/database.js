const { Sequelize } = require('sequelize');

const createSequelizeConnection = async (Luser, Lpass) => {
  console.log('user',Luser)
  console.log('pass',Lpass)
  const sequelize = new Sequelize({
    host: 'bderp.postgres.database.azure.com',
    dialect: 'postgres',
    port: '5432',
   database: 'postgres',// Nombre de la base de datos a la que deseas conectarte
    username: Luser,       // El nombre de usuario de la base de datos
    password: Lpass, 
    logging: false,
      dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Azure usa certificados autofirmados, así que esto evita problemas
    }
  },
    pool: {
      max: 5,       // Máximo 5 conexiones simultáneas
      min: 0,       // Mínimo 0 conexiones (libera recursos cuando no se usan)
      acquire: 10000, // Máximo 10s esperando una conexión
      idle: 5000,   // Cierra conexiones inactivas después de 5s
    },
  });

  try {
    await sequelize.authenticate();
    console.log(process.env.DB_PORT)
    console.log('✅ Conexión exitosa a la base de datos.');
    return sequelize;
  } catch (error) {
    console.error('❌ Error en la conexión a la base de datos:', error.message);
    throw error;
  }
};

module.exports = createSequelizeConnection;
