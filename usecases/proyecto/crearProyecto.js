const { v4: uuidv4 } = require('uuid');
const createProyectoModel = require('../../models/Proyecto');
const crearProyectoUseCase = async ({
  Luser,
  Lpass,
  nombre,
  descripcion,
  id_creador,
  fecha_limite,
  usuarios
}) => {
  const { Proyecto, ProyectoUsuarioAsignado } = await createProyectoModel(Luser, Lpass);
  const id_proyecto = uuidv4();
  const fecha_inicio = new Date().toISOString().split('T')[0];
  const nuevoProyecto = await Proyecto.create({
    id_proyecto,
    nombre,
    estado: 1,
    fecha_inicio,
    descripcion,
    id_creador,
    fecha_limite: fecha_limite || null
  });
  if (Array.isArray(usuarios) && usuarios.length > 0) {
    const asignaciones = usuarios.map(({ value: id_usuario }) => ({
      id_proyecto,
      id_usuario
    }));
    await ProyectoUsuarioAsignado.bulkCreate(asignaciones);
  }
  return { id_proyecto };
};
module.exports = {
  crearProyectoUseCase
};
