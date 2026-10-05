import Usuario from "../models/usuario.model.js";
import Publicacion from "../models/publicacion.model.js";
import RolesColeccion from "../models/roles.model.js";
import { isValidObjectId } from "mongoose";

const validarPermisoSobreUsuario = (usuario, usuarioSolicitante) => {
    const esAdministrador = usuarioSolicitante?.esAdmin === true;
    const esMismoUsuario = usuarioSolicitante?.email === usuario.email;

    if (!esAdministrador && !esMismoUsuario) {
        const errorPermiso = new Error("No es posible realizar la acción sobre otro usuario");
        errorPermiso.status = 403;
        throw errorPermiso;
    }
};

const obtenerMarcaDeBaja = () => {
    const ahora = new Date();
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const dia = String(ahora.getDate()).padStart(2, "0");
    const hora = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");

    return `${año}${mes}${dia}${hora}${minutos}`;
};

export const obtenerUsuariosService = async (busqueda = {}) => {
    const usuarios = await Usuario.find(
        { ...busqueda, activo: true },
        "name email phone esAdmin esPremium puedeModerar role publicaciones",
    )
        .populate("role", "nombre");
    return usuarios;
}

export const obtenerUsuarioService = async (id) => {
  if (!isValidObjectId(id)) {
      const errorId = new Error("El id del usuario no es válido");
      errorId.status = 400;
      throw errorId;
  }
  const usuarios = await Usuario.find(
      { _id: id, activo: true },
      "name email phone esAdmin esPremium puedeModerar role publicaciones",
  )
      .populate("role", "nombre");
  const usuario = usuarios[0];
  if (!usuario) {
      const errorNotFound = new Error("Usuario no encontrado");
      errorNotFound.status = 404;
      throw errorNotFound;
  }
  return usuario;
}

export const crearUsuarioService = async (usuarioData) => {
    const rol = await RolesColeccion.findOne({
        nombre: usuarioData.role.trim(),
        activa: true,
    });
    if (!rol) {
        const errorNotFound = new Error("El rol no existe o está inactivo");
        errorNotFound.status = 400;
        throw errorNotFound;
    }

    const nuevoUsuario = new Usuario({
        ...usuarioData,
        role: rol._id,
    });
    await nuevoUsuario.save();
    return nuevoUsuario;
}

export const actualizarUsuarioService = async (id, usuarioData, usuarioSolicitante) => {
    if (!isValidObjectId(id)) {
        const errorId = new Error("El id del usuario no es válido");
        errorId.status = 400;
        throw errorId;
    }

    const usuario = await Usuario.findOne({
        email: usuarioSolicitante?.email,
        activo: true,
    });
    if (!usuario) {
        const errorNotFound = new Error("Usuario no encontrado");
        errorNotFound.status = 404;
        throw errorNotFound;
    }

    if (usuario._id.toString() !== id) {
        const errorPermiso = new Error("No es posible realizar la acción sobre otro usuario");
        errorPermiso.status = 403;
        throw errorPermiso;
    }

    if (usuarioData.role !== undefined) {
        const rol = await RolesColeccion.findOne({
            nombre: usuarioData.role.trim(),
            activa: true,
        });
        if (!rol) {
            const errorNotFound = new Error("El rol no existe o está inactivo");
            errorNotFound.status = 400;
            throw errorNotFound;
        }
        usuarioData = { ...usuarioData, role: rol._id };
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(usuario._id,
        usuarioData, { returnDocument: "after" });
    return usuarioActualizado;
}

export const eliminarUsuarioService = async (id, usuarioSolicitante) => {
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

    validarPermisoSobreUsuario(usuario, usuarioSolicitante);

    const publicacionesActivas = await Publicacion.countDocuments({
        autor: id,
        activa: true,
    });
    if (publicacionesActivas > 0) {
        const errorPublicacionesActivas = new Error(
            "No es posible dar de baja al usuario porque tiene publicaciones activas",
        );
        errorPublicacionesActivas.status = 409;
        throw errorPublicacionesActivas;
    }

    usuario.activo = false;
    usuario.email = `${usuario.email}${obtenerMarcaDeBaja()}`;
    await usuario.save();
    return usuario;
}
