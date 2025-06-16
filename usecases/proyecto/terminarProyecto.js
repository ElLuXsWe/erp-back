const createProyectoModel = require('../../models/Proyecto');
const terminarProyectoUseCase = async ({ Luser, Lpass, id_proyecto }) => {
  const { Proyecto } = await createProyectoModel(Luser, Lpass);
  const proyecto = await Proyecto.findByPk(id_proyecto);
  if (!proyecto) {
    throw new Error('Proyecto no encontrado.');
  }
  await proyecto.update({ 
    estado: 2,
    fecha_fin: new Date()
  });
};
module.exports = {
  terminarProyectoUseCase
};
