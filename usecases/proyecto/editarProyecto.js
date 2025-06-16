const createProyectoModel = require('../../models/Proyecto');
const editarProyectoUseCase = async ({
  Luser,
  Lpass,
  id_proyecto,
  nombre,
  descripcion,
  fecha_limite,
  estado,
  usuarios
}) => {
  const { Proyecto, ProyectoUsuarioAsignado } = await createProyectoModel(Luser, Lpass);
  const proyecto = await Proyecto.findByPk(id_proyecto);
  if (!proyecto) {
    throw new Error('Proyecto no encontrado.');
  }
  await proyecto.update({
    nombre,
    descripcion,
    fecha_limite: fecha_limite || null,
    estado: estado || proyecto.estado
  });
  await ProyectoUsuarioAsignado.destroy({ where: { id_proyecto } });
  const usuarios2 = usuarios.map(({ value: id_usuario }) => ({ id_usuario }));
  if (Array.isArray(usuarios2) && usuarios2.length > 0) {
    const asignaciones = usuarios2.map(({ id_usuario }) => ({
      id_proyecto,
      id_usuario
    }));
    await ProyectoUsuarioAsignado.bulkCreate(asignaciones);
  }
};
module.exports = {
  editarProyectoUseCase
};
