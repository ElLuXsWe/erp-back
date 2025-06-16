require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión exitosa a la base de datos de Azure');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error de conexión:', error.message);
    process.exit(1);
  });
