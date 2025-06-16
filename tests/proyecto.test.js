const request = require('supertest');
const express = require('express');
const proyectoRoutes = require('../routes/proyectos');

const app = express();
app.use(express.json());
app.use('/proyectos', proyectoRoutes);

// Mock de los usecases
jest.mock('../usecases/proyecto/crearProyecto', () => ({
  crearProyectoUseCase: jest.fn().mockResolvedValue({ id_proyecto: '123' })
}));
jest.mock('../usecases/proyecto/obtenerProyectos', () => ({
  obtenerProyectosUseCase: jest.fn().mockResolvedValue([
    { id_proyecto: '123', nombre: 'Proyecto Test' }
  ])
}));
jest.mock('../usecases/proyecto/editarProyecto', () => ({
  editarProyectoUseCase: jest.fn().mockResolvedValue(true)
}));
jest.mock('../usecases/proyecto/terminarProyecto', () => ({
  terminarProyectoUseCase: jest.fn().mockResolvedValue(true)
}));
jest.mock('../usecases/proyecto/cancelarProyecto', () => jest.fn().mockResolvedValue('Proyecto cancelado.'));

const { crearProyectoUseCase } = require('../usecases/proyecto/crearProyecto');
const { obtenerProyectosUseCase } = require('../usecases/proyecto/obtenerProyectos');
const { editarProyectoUseCase } = require('../usecases/proyecto/editarProyecto');
const { terminarProyectoUseCase } = require('../usecases/proyecto/terminarProyecto');
const cancelarProyectoUseCase = require('../usecases/proyecto/cancelarProyecto');

describe('Proyectos API', () => {
  const Luser = 'admin';
  const Lpass = '1234';
  const id_creador = 'uuid-creador';

  test('POST /proyectos/crearP → debería crear un proyecto', async () => {
    const response = await request(app)
      .post('/proyectos/crearP')
      .send({
        Luser, Lpass,
        nombre: 'Proyecto Test',
        descripcion: 'Descripción test',
        fecha_limite: '2025-12-31',
        id_creador,
        usuarios: []
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('mensaje', '✅ Proyecto creado exitosamente.');
    expect(response.body).toHaveProperty('id', '123');
  });

  test('PATCH /proyectos/editarProyecto → debería editar un proyecto', async () => {
    const response = await request(app)
      .patch('/proyectos/editarProyecto')
      .send({
        Luser, Lpass,
        id: '123',
        nombre: 'Proyecto Actualizado',
        descripcion: 'Nueva descripción',
        fecha_limite: '2025-12-31',
        estado: 'Activo',
        usuarios: []
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.mensaje).toBe('Proyecto actualizado exitosamente');
  });

  test('POST /proyectos/proyectos → debería obtener todos los proyectos', async () => {
    const response = await request(app)
      .post('/proyectos/proyectos')
      .send({ Luser, Lpass, id_creador });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('id_proyecto', '123');
  });

  test('PATCH /proyectos/terminarProyecto → debería marcar proyecto como terminado', async () => {
    const response = await request(app)
      .patch('/proyectos/terminarProyecto')
      .send({ Luser, Lpass, id: '123' });

    expect(response.statusCode).toBe(200);
    expect(response.body.mensaje).toBe('Proyecto marcado como Terminado.');
  });

  test('PATCH /proyectos/cancelarProyecto → debería cancelar proyecto', async () => {
    const response = await request(app)
      .patch('/proyectos/cancelarProyecto')
      .send({ Luser, Lpass, id: '123' });

    expect(response.statusCode).toBe(200);
    expect(response.body.mensaje).toBe('Proyecto cancelado.');
  });
});
