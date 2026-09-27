import Publicacion from "../models/publicacion.model.js";
import Usuario from "../models/usuario.model.js";
import RolesColeccion from "../models/roles.model.js";
import EstadoPublicacion from "../models/estadoPublicacion.model.js";
import Categoria from "../models/categoria.model.js";
import { isValidObjectId } from "mongoose";

export const obtenerPublicacionesService = async (busqueda = {}) => {
  const publicaciones = await Publicacion.find({ ...busqueda, activa: true });
  return publicaciones;
};

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
};

export const crearPublicacionService = async (publicacionData) => {
  const usuario = await Usuario.findOne({
    email: publicacionData.autor.trim(),
    activo: true,
  });
  const LIMITE_PUBLICACIONES_NO_PREMIUM = 4;

  if (!usuario) {
    const error = new Error("El autor no existe o está inactivo");
    error.status = 404;
    throw error;
  }

  const alcance = [];
  for (const nombreRol of publicacionData.alcance) {
    const rol = await RolesColeccion.findOne({
      nombre: nombreRol.trim(),
      activo: true,
    });

    if (!rol) {
      const error = new Error(`El rol de alcance "${nombreRol}" no existe o está inactivo`);
      error.status = 400;
      throw error;
    }

    alcance.push(rol._id);
  }

  const estadoPublicacion = await EstadoPublicacion.findOne({
    nombre: publicacionData.estadoPublicacion.trim(),
  });
  if (!estadoPublicacion) {
    const error = new Error("El estado de publicación no existe");
    error.status = 400;
    throw error;
  }

  const categoria = await Categoria.findOne({
    nombre: publicacionData.categoria.trim(),
    activa: true,
  });
  if (!categoria) {
    const error = new Error("La categoría no existe o está inactiva");
    error.status = 400;
    throw error;
  }

  if (!usuario.esPremium) {
    const publicacionesActivas = await Publicacion.countDocuments({
      autor: usuario._id,
      activa: true,
    });

    if (publicacionesActivas >= LIMITE_PUBLICACIONES_NO_PREMIUM) {
      const error = new Error(
        "Los usuarios no premium pueden tener hasta 4 publicaciones activas"
      );
      error.status = 403;
      throw error;
    }
  }

  const nuevaPublicacion = new Publicacion({
    ...publicacionData,
    autor: usuario._id,
    alcance,
    estadoPublicacion: estadoPublicacion._id,
    categoria: categoria._id,
  });
  await nuevaPublicacion.save();

  return nuevaPublicacion;
};

export const actualizarPublicacionService = async (id, publicacionData) => {
  if (!isValidObjectId(id)) {
    const errorId = new Error("El id de la publicación no es válido");
    errorId.status = 400;
    throw errorId;
  }

  const datosActualizados = { ...publicacionData };

  if (datosActualizados.alcance) {
    const alcance = [];
    for (const nombreRol of datosActualizados.alcance) {
      const rol = await RolesColeccion.findOne({
        nombre: nombreRol.trim(),
        activo: true,
      });

      if (!rol) {
        const error = new Error(`El rol de alcance "${nombreRol}" no existe o está inactivo`);
        error.status = 400;
        throw error;
      }

      alcance.push(rol._id);
    }
    datosActualizados.alcance = alcance;
  }

  if (datosActualizados.estadoPublicacion !== undefined) {
    const estado = await EstadoPublicacion.findOne({
      nombre: datosActualizados.estadoPublicacion.trim(),
    });
    if (!estado) {
      const error = new Error("El estado de publicación no existe");
      error.status = 400;
      throw error;
    }
    datosActualizados.estadoPublicacion = estado._id;
  }

  if (datosActualizados.categoria !== undefined) {
    const categoria = await Categoria.findOne({
      nombre: datosActualizados.categoria.trim(),
      activa: true,
    });
    if (!categoria) {
      const error = new Error("La categoría no existe o está inactiva");
      error.status = 400;
      throw error;
    }
    datosActualizados.categoria = categoria._id;
  }

  if (datosActualizados.autor !== undefined) {
    const autor = await Usuario.findOne({
      email: datosActualizados.autor.trim(),
      activo: true,
    });
    if (!autor) {
      const error = new Error("El autor no existe o está inactivo");
      error.status = 400;
      throw error;
    }
    datosActualizados.autor = autor._id;
  }

  const publicacionActualizada = await Publicacion.findByIdAndUpdate(
    id,
    datosActualizados,
    { new: true, runValidators: true },
  );
  if (!publicacionActualizada) {
    const errorNotFound = new Error("Publicación no encontrada");
    errorNotFound.status = 404;
    throw errorNotFound;
  }
  return publicacionActualizada;
};

export const eliminarPublicacionService = async (id) => {
  if (!isValidObjectId(id)) {
    const errorId = new Error("El id de la publicación no es válido");
    errorId.status = 400;
    throw errorId;
  }
  const publicacionEliminada = await Publicacion.findByIdAndDelete(id);
  if (!publicacionEliminada) {
    const errorNotFound = new Error("Publicación no encontrada");
    errorNotFound.status = 404;
    throw errorNotFound;
  }

  return publicacionEliminada;
};
