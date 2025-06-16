const bcrypt = require('bcrypt');
const obtenerUsuarios = require('../usecases/usuario/obtenerUsuario');
const { loginUsuario } = require('../usecases/usuario/loginUsuario');
const { verificarCodigo } = require('../usecases/usuario/verificarCodigo');
const crearUsuarioUseCase = require('../usecases/usuario/crearUsuario');
const editarUsuarioUseCase = require('../usecases/usuario/editarUsuario');
const crearUsuarioController = async (req, res) => {
  try {
    const resultado = await crearUsuarioUseCase(req.body);
    return res.status(201).json({
      mensaje: 'Usuario creado exitosamente.',
      usuario: resultado,
    });
  } catch (error) {
    console.error('Error en la creación del usuario:', error);
    return res.status(500).json({
      mensaje: error.message || 'Error al crear el usuario.',
    });
  }
};
const editarUsuarioController = async (req, res) => {
  try {
    const usuarioActualizado = await editarUsuarioUseCase(req.body);
    return res.status(200).json({
      mensaje: 'Usuario actualizado exitosamente.',
      usuario_actualizado: usuarioActualizado,
    });
  } catch (error) {
    console.error('Error en editarUsuario usecase:', error);
    return res.status(500).json({ mensaje: error.message || 'Error al actualizar el usuario.' });
  }
};
const loginUsuarioController = async (req, res) => {
  try {
    const resultado = await loginUsuario(req.body);
    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};

const verificarCodigoController = async (req, res) => {
  try {
    const resultado = await verificarCodigo(req.body);
    return res.status(200).json(resultado);
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ mensaje: error.message });
  }
};
const obtenerUsuariosController = async (req, res) => {
  const { Luser, Lpass } = req.body;

  try {
    const usuarios = await obtenerUsuarios({ Luser, Lpass });

    return res.status(200).json({
      mensaje: 'Usuarios obtenidos exitosamente.',
      usuarios,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      mensaje: error.mensaje || 'Error interno del servidor.',
    });
  }
};


module.exports = { crearUsuarioController, editarUsuarioController,loginUsuarioController ,obtenerUsuariosController , verificarCodigoController};
