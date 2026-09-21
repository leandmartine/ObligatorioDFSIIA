import mongoose from "mongoose";
import Usuario from "../models/usuario.model.js";
import { isValidObjectId } from "mongoose";

export const obtenerUsuariosService = async (busqueda = {}) => {
    const usuarios = await Usuario.find({ ...busqueda, activo: true });
    return usuarios;
}


export const obtenerUsuarioService = async (id) => {
  if (!isValidObjectId(id)) {
      const errorId = new Error("El id del usuario no es válido");
      errorId.status = 400;
      throw errorId;
  }
  const usuario = await Usuario.findById(id);
  if (!usuario) {
      const errorNotFound = new Error("Usuario no encontrado");
      errorNotFound.status = 404;
      throw errorNotFound;
  }
  return usuario;
}

export const crearUsuarioService = async (usuarioData) => {
    const nuevoUsuario = new Usuario(usuarioData);
    await nuevoUsuario.save();
    return nuevoUsuario;
}

export const actualizarUsuarioService = async (id, usuarioData) => {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(id,
        usuarioData, { returnDocument: 'after' });
    return usuarioActualizado;
}

export const eliminarUsuarioService = async (id) => {
    if (!isValidObjectId(id)) {
        const errorId = new Error("El id del usuario no es válido");
        errorId.status = 400;
        throw errorId;
    }
    
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);
    if(!usuarioEliminado) {
        const errorNotFound = new Error("Usuario no encontrado");
        errorNotFound.status = 404;
        throw errorNotFound;
    }

    return usuarioEliminado;
    
}

