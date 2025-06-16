const createProyectoModel = require('../../models/Proyecto');
const cancelarProyectoUseCase = async ({ Luser, Lpass, id_proyecto }) => {
  const { Proyecto } = await createProyectoModel(Luser, Lpass);
  const proyecto = await Proyecto.findByPk(id_proyecto);
  if (!proyecto) {
    throw new Error('Proyecto no encontrado.');
  }
  await proyecto.update({ 
    fecha_fin: new Date()
  });
  return 'Proyecto cancelado correctamente.';
};
module.exports = cancelarProyectoUseCase;
