const { createUserModel } = require('../../models/usuario');
const obtenerUsuarios = async ({ Luser, Lpass }) => {
  if (!Luser || !Lpass) {
    throw { status: 400, mensaje: 'Faltan credenciales de conexión.' };
  }
  try {
    const User = await createUserModel(Luser, Lpass);
    const usuarios = await User.findAll();
    if (!usuarios || usuarios.length === 0) {
      throw { status: 404, mensaje: 'No se encontraron usuarios.' };
    }
    return usuarios;
  } catch (error) {
    console.error('Error en obtenerUsuarios usecase:', error);
    throw {
      status: error.status || 500,
      mensaje: error.mensaje || 'Error al obtener los usuarios.',
    };
  }
};
module.exports = obtenerUsuarios;