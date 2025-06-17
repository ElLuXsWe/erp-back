const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUserModel } = require('../../models/usuario');
const { enviarCodigoPorCorreo } = require('../../infraestructure/email/nodemailerService');

const loginUsuario = async ({ email, pass, codigo }) => {
  if (!email || !pass) {
    throw new Error('Faltan credenciales para iniciar sesión.');
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

  if (codigo === true || codigo === 'true') {
    const codigoGenerado = Math.floor(100000 + Math.random() * 900000).toString();

    const token = jwt.sign(
      { email, timestamp: Date.now() },
      codigoGenerado, // el código como clave secreta
      { expiresIn: '5m' }
    );

    await enviarCodigoPorCorreo(email, codigoGenerado);
    return { mensaje: 'Código enviado al correo.', token };
  }

  return {
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

module.exports = { loginUsuario };
