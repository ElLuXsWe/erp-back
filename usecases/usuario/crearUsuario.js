const bcrypt = require('bcrypt');
const { createUserModel, crearUsuarioDB } = require('../../models/usuario');
const crearUsuario = async (datosUsuario) => {
  const { Luser, Lpass, nombre, email, pass, rol, creado_por, imagen } = datosUsuario;
  if (!Luser || !Lpass) throw new Error('Faltan credenciales de conexión.');
  if (!nombre || !email || !pass || !rol || !creado_por || !imagen) {
    throw new Error('Faltan datos para crear usuario.');
  }
  const salt = await bcrypt.genSalt(10);
  const contraseñaEncriptada = await bcrypt.hash(pass, salt);
  const User = await createUserModel(Luser, Lpass);
  const usuarioCreador = await User.findOne({ where: { id_usuario: creado_por } });
  if (!usuarioCreador) throw new Error('Usuario creador no encontrado.');
  if (usuarioCreador.rol === '3') throw new Error('No tiene permisos para crear usuarios.');
  const correoExistente = await User.findOne({ where: { email } });
  if (correoExistente) throw new Error('El correo electrónico ya está registrado.');
  const nuevoUsuario = await User.create({
    nombre,
    email,
    pass: contraseñaEncriptada,
    rol,
    creado_por,
    imagen,
  });
  await crearUsuarioDB(Luser, Lpass, { nombre, email, pass, rol, creado_por, imagen });
  return {
    id_usuario: nuevoUsuario.id_usuario,
    nombre: nuevoUsuario.nombre,
    email: nuevoUsuario.email,
    rol: nuevoUsuario.rol,
    fecha_creacion: nuevoUsuario.fecha_creacion,
  };
};
module.exports = crearUsuario;
