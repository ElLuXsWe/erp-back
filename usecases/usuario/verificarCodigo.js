const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUserModel } = require('../../models/usuario');

const verificarCodigo = async ({ codigo, email, pass, token }) => {
  if (!codigo || !email || !pass || !token) {
    throw new Error('Código, email, contraseña y token requeridos.');
  }

  // Usamos el código como clave para verificar el token
  let payload;
  try {
    payload = jwt.verify(token, codigo); // si el código es correcto, esto funciona
  } catch (error) {
    return { valido: false, mensaje: 'Código inválido o expirado.' };
  }

  if (payload.email !== email) {
    return { valido: false, mensaje: 'Email no coincide con el token.' };
  }

  const User = await createUserModel(email, pass);
  const usuario = await User.findOne({ where: { email } });

  if (!usuario) {
    throw new Error('Usuario no encontrado.');
  }

  const contrasenaCoincide = await bcrypt.compare(pass, usuario.pass);
  if (!contrasenaCoincide) {
    throw new Error('Contraseña incorrecta.');
  }

  return {
    valido: true,
    mensaje: 'Login exitoso.',
    usuario: {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      rol: usuario.rol,
      Luser: usuario.email,
      Lpass: usuario.pass,
      imagen: usuario.imagen,
    },
  };
};

module.exports = { verificarCodigo };
