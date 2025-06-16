const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');
const createSequelizeConnection = require('./config/database');  // Este archivo configura la conexión a la DB

// Crear la conexión con la base de datos (sin necesidad de enviar los datos estáticamente)
const sequelize = createSequelizeConnection();  // Se usa la conexión dinámica desde el archivo de config

// Crear la aplicación Express
const app = express();
const port = 3002;

// Middleware para parsear el cuerpo de las solicitudes (JSON)
app.use(bodyParser.json());

// Modelo Usuario
const Usuario = sequelize.define('usuarios', {
  id_usuario: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  pass: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false,  // Deshabilitar las columnas createdAt y updatedAt
});

// Ruta para el login
app.post('/login', async (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  try {
    // Buscar al usuario por su email
    const usuario = await Usuario.findOne({ where: { email } });
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si la contraseña proporcionada coincide con la almacenada
    const esContraseñaCorrecta = bcrypt.compareSync(password, usuario.pass);
    
    if (esContraseñaCorrecta) {
      res.status(200).json({ message: 'Login exitoso', usuario });
    } else {
      res.status(401).json({ message: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error al intentar hacer login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
