const { Op } = require('sequelize');
const createProyectoModel = require('../../models/Proyecto');
const obtenerProyectosUseCase = async ({ Luser, Lpass, id_creador }) => {
  const { Proyecto, ProyectoUsuarioAsignado, Usuario } = await createProyectoModel(Luser, Lpass);
  Proyecto.belongsToMany(Usuario, {
    through: ProyectoUsuarioAsignado,
    foreignKey: 'id_proyecto',
    otherKey: 'id_usuario',
    as: 'asignados',
  });
  const proyectosCreados = await Proyecto.findAll({
    where: { id_creador },
    include: [{
      model: Usuario,
      as: 'asignados',
      through: { attributes: [] }
    }]
  });
  const proyectosAsignados = await Proyecto.findAll({
    include: [{
      model: Usuario,
      as: 'asignados',
      where: { id_usuario: id_creador },
      through: { attributes: [] }
    }],
    where: {
      id_creador: { [Op.ne]: id_creador }
    }
  });
  const mapaProyectos = new Map();
  [...proyectosCreados, ...proyectosAsignados].forEach(proy => {
    if (proy && proy.id_proyecto !== undefined) {
      mapaProyectos.set(proy.id_proyecto, proy);
    }
  });
  return Array.from(mapaProyectos.values()).map(proy => proy.toJSON());
};
module.exports = {
  obtenerProyectosUseCase
};
