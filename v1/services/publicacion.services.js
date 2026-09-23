import mongoose from "mongoose";
import Publicacion from "../models/publicacion.model.js";
import { isValidObjectId } from "mongoose";

export const obtenerPublicacionesService = async (busqueda = {}) => {
    const publicaciones = await Publicacion.find({ ...busqueda, activa: true });
    return publicaciones;
}

export const obtenerPublicacionService = async (id) => {
  if (!isValidObjectId(id)) {
      const errorId = new Error("El id de la publicación no es válido");
      errorId.status = 400;
      throw errorId;
  }
  const publicaciones = await Publicacion.find({ _id: id, activa: true });
  const publicacion = publicaciones[0];
  if (!publicacion) {
      const errorNotFound = new Error("Publicación no encontrada");
      errorNotFound.status = 404;
      throw errorNotFound;
  }
  return publicacion;
}

export const crearPublicacionService = async (publicacionData) => {
    const nuevaPublicacion = new Publicacion(publicacionData);
    await nuevaPublicacion.save();
    return nuevaPublicacion;
}

export const actualizarPublicacionService = async (id, publicacionData) => {
    const publicacionActualizada = await Publicacion.findByIdAndUpdate(id,
        publicacionData, { publicacion: publicacionActualizada });
    return publicacionActualizada;
}

export const eliminarPublicacionService = async (id) => {
    if (!isValidObjectId(id)) {
        const errorId = new Error("El id de la publicación no es válido");
        errorId.status = 400;
        throw errorId;
    }
    const publicacionEliminada = await Publicacion.findByIdAndDelete(id);
    if(!publicacionEliminada) {
        const errorNotFound = new Error("Publicación no encontrada");
        errorNotFound.status = 404;
        throw errorNotFound;
    }

    return publicacionEliminada;
    
}