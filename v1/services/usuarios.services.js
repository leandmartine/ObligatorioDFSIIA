import mongoose from "mongoose";
import Usuario from "../models/usuario.model.js";
import RolesColeccion from "../models/rolesColeccion.model.js";
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
  const usuarios = await Usuario.find({ _id: id, activo: true });
  const usuario = usuarios[0];
  if (!usuario) {
      const errorNotFound = new Error("Usuario no encontrado");
      errorNotFound.status = 404;
      throw errorNotFound;
  }
  return usuario;
}

export const crearUsuarioService = async (usuarioData) => {
    if (!isValidObjectId(usuarioData.role)) {
        const errorId = new Error("El id del rol no es válido");
        errorId.status = 400;
        throw errorId;
    }

    const rol = await RolesColeccion.findOne({
        _id: usuarioData.role,
        activo: true,
    });
    if (!rol) {
        const errorNotFound = new Error("El rol no existe o está inactivo");
        errorNotFound.status = 400;
        throw errorNotFound;
    }

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
