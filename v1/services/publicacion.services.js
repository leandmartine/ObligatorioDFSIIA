import Publicacion from "../models/publicacion.model.js";
import Usuario from "../models/usuario.model.js";
import RolesColeccion from "../models/roles.model.js";
import EstadoPublicacion from "../models/estadoPublicacion.model.js";
import Categoria from "../models/categoria.model.js";
import { isValidObjectId } from "mongoose";
import { sendPublicationReceivedEmail } from "./email.services.js";

const ESTADO_PUBLICACION_DISPONIBLE = "Disponible";
const ESTADO_PUBLICACION_CANCELADO = "Cancelado";
const ESTADO_PUBLICACION_PENDIENTE = "Pendiente_Revision";

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

export const crearPublicacionService = async (publicacionData, autorEmail) => {
  if (!autorEmail) {
    const error = new Error("El token no contiene el email del autor");
    error.status = 401;
    throw error;
  }

  const usuario = await Usuario.findOne({
    email: autorEmail,
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
      activa: true,
    });

    if (!rol) {
      const error = new Error(`El rol de alcance "${nombreRol}" no existe o está inactivo`);
      error.status = 400;
      throw error;
    }

    alcance.push(rol._id);
  }

  const nombreEstadoAlta = usuario.esPremium
    ? ESTADO_PUBLICACION_DISPONIBLE
    : ESTADO_PUBLICACION_PENDIENTE;
  const estadoPublicacion = await EstadoPublicacion.findOne({ nombre: nombreEstadoAlta });
  if (!estadoPublicacion) {
    const error = new Error(`El estado de publicación "${nombreEstadoAlta}" no existe`);
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
    const estadoCancelado = await EstadoPublicacion.findOne({
      nombre: ESTADO_PUBLICACION_CANCELADO,
    });
    if (!estadoCancelado) {
      const error = new Error(
        `El estado de publicación "${ESTADO_PUBLICACION_CANCELADO}" no existe`,
      );
      error.status = 400;
      throw error;
    }

    const publicacionesNoCanceladas = await Publicacion.countDocuments({
      autor: usuario._id,
      estadoPublicacion: { $ne: estadoCancelado._id },
    });

    if (publicacionesNoCanceladas >= LIMITE_PUBLICACIONES_NO_PREMIUM) {
      const error = new Error(
        "Los usuarios plus pueden tener hasta 4 publicaciones no canceladas",
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
    activa: usuario.esPremium,
  });
  await nuevaPublicacion.save();

  await sendPublicationReceivedEmail({
    name: usuario.name,
    email: usuario.email,
    publication: {
      titulo: nuevaPublicacion.titulo,
      descripcion: nuevaPublicacion.descripcion,
      categoria: categoria.nombre,
      precio: nuevaPublicacion.precio,
      pesosUy: nuevaPublicacion.pesosUy,
      estadoPublicacion: estadoPublicacion.nombre,
    },
  });

  return nuevaPublicacion;
};

const validarPermisoSobrePublicacion = async (
  publicacion,
  usuarioSolicitante,
  accion,
) => {
  const usuarioAutor = await Usuario.findById(publicacion.autor, "email");
  const usuarioActual = await Usuario.findOne(
    { email: usuarioSolicitante?.email, activo: true },
    "email esAdmin puedeModerar",
  );

  const esAutor = usuarioAutor?.email === usuarioActual?.email;
  const esAdministrador = usuarioActual?.esAdmin === true;
  const esModerador = usuarioActual?.puedeModerar === true;
  const puedeRealizarAccion =
    esAutor ||
    esAdministrador ||
    (accion === "editar" && esModerador);

  if (!puedeRealizarAccion) {
    const errorPermiso = new Error(
      "No es posible realizar la acción sobre la publicación de otro usuario",
    );
    errorPermiso.status = 403;
    throw errorPermiso;
  }
};

export const actualizarPublicacionService = async (
  id,
  publicacionData,
  usuarioSolicitante,
) => {
  if (!isValidObjectId(id)) {
    const errorId = new Error("El id de la publicación no es válido");
    errorId.status = 400;
    throw errorId;
  }

  const publicacion = await Publicacion.findById(id);
  if (!publicacion) {
    const errorNotFound = new Error("Publicación no encontrada");
    errorNotFound.status = 404;
    throw errorNotFound;
  }
  await validarPermisoSobrePublicacion(publicacion, usuarioSolicitante, "editar");

  const datosActualizados = { ...publicacionData };

  if (datosActualizados.alcance) {
    const alcance = [];
    for (const nombreRol of datosActualizados.alcance) {
      const rol = await RolesColeccion.findOne({
        nombre: nombreRol.trim(),
        activa: true,
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

export const obtenerPublicacionesPendientesService = async (usuarioSolicitante) => {
  const estadoPendiente = await EstadoPublicacion.findOne({
    nombre: ESTADO_PUBLICACION_PENDIENTE,
  });
  if (!estadoPendiente) {
    const error = new Error(`El estado de publicación "${ESTADO_PUBLICACION_PENDIENTE}" no existe`);
    error.status = 400;
    throw error;
  }

  return Publicacion.find({
    estadoPublicacion: estadoPendiente._id,
    activa: false,
  });
};

export const moderarPublicacionService = async (id, decision, usuarioSolicitante) => {
  if (!isValidObjectId(id)) {
    const errorId = new Error("El id de la publicación no es válido");
    errorId.status = 400;
    throw errorId;
  }

  const publicacion = await Publicacion.findById(id);
  if (!publicacion) {
    const errorNotFound = new Error("Publicación no encontrada");
    errorNotFound.status = 404;
    throw errorNotFound;
  }

  const estadoPendiente = await EstadoPublicacion.findOne({
    nombre: ESTADO_PUBLICACION_PENDIENTE,
  });
  const estadoResultado = await EstadoPublicacion.findOne({
    nombre: decision === "aprobar"
      ? ESTADO_PUBLICACION_DISPONIBLE
      : ESTADO_PUBLICACION_CANCELADO,
  });
  if (!estadoPendiente || !estadoResultado) {
    const error = new Error("No están configurados todos los estados de publicación requeridos");
    error.status = 400;
    throw error;
  }

  if (String(publicacion.estadoPublicacion) !== String(estadoPendiente._id)) {
    const errorEstado = new Error("Solo se pueden moderar publicaciones pendientes de revisión");
    errorEstado.status = 409;
    throw errorEstado;
  }

  publicacion.estadoPublicacion = estadoResultado._id;
  publicacion.activa = decision === "aprobar";
  await publicacion.save();
  return publicacion;
};

export const eliminarPublicacionService = async (id, usuarioSolicitante) => {
  if (!isValidObjectId(id)) {
    const errorId = new Error("El id de la publicación no es válido");
    errorId.status = 400;
    throw errorId;
  }

  const publicacion = await Publicacion.findById(id);
  if (!publicacion) {
    const errorNotFound = new Error("Publicación no encontrada");
    errorNotFound.status = 404;
    throw errorNotFound;
  }

  await validarPermisoSobrePublicacion(publicacion, usuarioSolicitante, "eliminar");

  publicacion.activa = false;
  await publicacion.save();
  return publicacion;
};
