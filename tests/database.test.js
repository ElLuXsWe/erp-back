const createSequelizeConnection = require('../config/database');

describe('Pruebas de conexión a la base de datos', () => {

  test('Debe conectar correctamente con credenciales válidas', async () => {
    // Variables de entorno para la base de datos
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '5432';

    const user = 'gggggsaucedo@gmail.com';  // Cambia esto por tu usuario real
    const pass = 'Admin1';  // Cambia esto por tu contraseña real

    const sequelize = await createSequelizeConnection(user, pass); // Se pasan como parámetros

    expect(sequelize).toBeDefined();  // Verifica que la conexión se haya realizado
    await sequelize.close();  // Cerramos la conexión después del test
  });

  test('Debe fallar con credenciales inválidas', async () => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '5432';

    const user = 'usuarioInvalido';  // Usuario incorrecto
    const pass = 'contraseñaInvalida';  // Contraseña incorrecta

    // Verifica que lance un error cuando las credenciales son inválidas
    await expect(createSequelizeConnection(user, pass)).rejects.toThrow();
  });

});
