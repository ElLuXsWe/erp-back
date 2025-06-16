const { createUserModel } = require('../../models/usuario');
const editarUsuario = async (datosUsuario) => {
  const { Luser, Lpass, id_usuario, nombre, email, rol, imagen } = datosUsuario;

  if (!Luser || !Lpass) {
    throw new Error('Faltan credenciales de conexión.');
  }
  const User = await createUserModel(Luser, Lpass);
  const sequelize = User.sequelize;
  const usuarioExistente = await User.findOne({ where: { id_usuario } });
  if (!usuarioExistente) {
    throw new Error('Usuario no encontrado.');
  }
  const updatedFields = {};
  if (nombre) updatedFields.nombre = nombre;
  if (email) updatedFields.email = email;
  if (rol) updatedFields.rol = rol;
  if (imagen) updatedFields.imagen = imagen;
  const emailAnterior = usuarioExistente.email;
  if (email && email !== emailAnterior) {
    try {
      await sequelize.query(`ALTER ROLE "${emailAnterior}" RENAME TO "${email}"`);
      console.log(`Rol PostgreSQL renombrado de ${emailAnterior} a ${email}`);
    } catch (err) {
      throw new Error('Error al renombrar el rol en PostgreSQL: ' + err.message);
    }
  }
  const [updatedRowsCount] = await User.update(updatedFields, { where: { id_usuario } });
  if (updatedRowsCount === 0) {
    throw new Error('No se actualizó ningún usuario. Verifica el ID o los permisos del usuario.');
  }
  return updatedFields;
};
module.exports = editarUsuario;
