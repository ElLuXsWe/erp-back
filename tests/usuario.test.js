
jest.mock('../usecases/usuario/crearUsuario', () => jest.fn());
jest.mock('../usecases/usuario/editarUsuario', () => jest.fn());
jest.mock('../usecases/usuario/obtenerUsuario', () => jest.fn());

// Importación corregida
const crearUsuarioUseCase = require('../usecases/usuario/crearUsuario');
const editarUsuarioUseCase = require('../usecases/usuario/editarUsuario');
const obtenerUsuarios = require('../usecases/usuario/obtenerUsuario');
const {
  crearUsuarioController,
  editarUsuarioController,
  obtenerUsuariosController
} = require('../controllers/usuarioController');

// Mock de req/res
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Controlador Usuario', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('crearUsuarioController', () => {
    it('debería retornar 201 si el usuario fue creado', async () => {
      const req = {
        body: {
          nombre: 'Nuevo Usuario',
          email: 'nuevo@ejemplo.com',
          pass: '123456',
          rol: '2',
          creado_por: 1
        }
      };
      const res = mockResponse();

      crearUsuarioUseCase.mockResolvedValue({ id_usuario: 123 });

      await crearUsuarioController(req, res);

      expect(crearUsuarioUseCase).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ mensaje: 'Usuario creado exitosamente.' })
      );
    });

    it('debería retornar 500 si ocurre un error', async () => {
      const req = { body: {} };
      const res = mockResponse();

      crearUsuarioUseCase.mockRejectedValue(new Error('Error al crear usuario'));

      await crearUsuarioController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ mensaje: 'Error al crear usuario' })
      );
    });
  });

  describe('editarUsuarioController', () => {
    it('debería retornar 200 si el usuario fue editado', async () => {
      const req = {
        body: {
          id_usuario: 1,
          nombre: 'Editado'
        }
      };
      const res = mockResponse();

      editarUsuarioUseCase.mockResolvedValue({ id_usuario: 1 });

      await editarUsuarioController(req, res);

      expect(editarUsuarioUseCase).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ mensaje: 'Usuario actualizado exitosamente.' })
      );
    });

    it('debería retornar 500 si ocurre un error', async () => {
      const req = { body: {} };
      const res = mockResponse();

      editarUsuarioUseCase.mockRejectedValue(new Error('Error al editar usuario'));

      await editarUsuarioController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ mensaje: 'Error al editar usuario' })
      );
    });
  });

 

  describe('obtenerUsuariosController', () => {
    it('debería retornar lista de usuarios', async () => {
      const req = {
        body: {
          Luser: 'admin',
          Lpass: 'adminpass'
        }
      };
      const res = mockResponse();

      obtenerUsuarios.mockResolvedValue([{ id_usuario: 1 }, { id_usuario: 2 }]);

      await obtenerUsuariosController(req, res);

      expect(obtenerUsuarios).toHaveBeenCalledWith({
        Luser: 'admin',
        Lpass: 'adminpass'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ mensaje: 'Usuarios obtenidos exitosamente.' })
      );
    });

    it('debería retornar error si falla', async () => {
      const req = {
        body: { Luser: 'admin', Lpass: 'adminpass' }
      };
      const res = mockResponse();

      obtenerUsuarios.mockRejectedValue({ status: 401, mensaje: 'Acceso denegado' });

      await obtenerUsuariosController(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ mensaje: 'Acceso denegado' })
      );
    });
  });
});
