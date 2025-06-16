const jwt = require('jsonwebtoken');
require('dotenv').config(); // Cargar variables de entorno

// Función para crear un token JWT
const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1h', // El token expira en 1 hora
  });
  return token;
};

// Función para verificar un token JWT
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null; // Si el token es inválido, retorna null
  }
};

module.exports = { generateToken, verifyToken };
