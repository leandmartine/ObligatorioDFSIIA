import Categoria from "../models/categoria.model.js";
import Publicacion from "../models/publicacion.model.js";
import RolesColeccion from "../models/roles.model.js";
import { isValidObjectId } from "mongoose";

export const obtenerCategoriasService = async (busqueda = {}) => {
  const categorias = await Categoria.find({ ...busqueda, activa: true });
  return categorias;
};

export const obtenerCategoriaService = async (id) => {
  if (!isValidObjectId(id)) {
    const errorId = new Error("El id de la categoría no es válido");
    errorId.status = 400;
    throw errorId;
  }
  const categorias = await Categoria.find({ _id: id, activa: true });
  const categoria = categorias[0];
  if (!categoria) {
    const errorNotFound = new Error("Categoría no encontrada");
    errorNotFound.status = 404;
    throw errorNotFound;
  }
  return categoria;
};

export const crearCategoriaService = async (categoriaData) => {
  const rolesPermitidos = [];

  for (const nombreRol of categoriaData.rolesPermitidos) {
    const rol = await RolesColeccion.findOne({
      nombre: nombreRol.trim(),
      activo: true,
    });

    if (!rol) {
      const error = new Error(`El rol "${nombreRol}" no existe o está inactivo`);
      error.status = 400;
      throw error;
    }

    rolesPermitidos.push(rol._id);
  }

  const nuevaCategoria = new Categoria({
    ...categoriaData,
    rolesPermitidos,
  });
  await nuevaCategoria.save();
  return nuevaCategoria;
};

export const actualizarCategoriaService = async (id, categoriaData) => {
  if (!isValidObjectId(id)) {
    const errorId = new Error("El id de la categoría no es válido");
    errorId.status = 400;
    throw errorId;
  }

  const datosActualizados = { ...categoriaData };

  if (datosActualizados.rolesPermitidos !== undefined) {
    const rolesPermitidos = [];
    for (const nombreRol of datosActualizados.rolesPermitidos) {
      const rol = await RolesColeccion.findOne({
        nombre: nombreRol.trim(),
        activo: true,
      });

      if (!rol) {
        const error = new Error(`El rol "${nombreRol}" no existe o está inactivo`);
        error.status = 400;
        throw error;
      }

      rolesPermitidos.push(rol._id);
    }
    datosActualizados.rolesPermitidos = rolesPermitidos;
  }

  const categoriaActualizada = await Categoria.findOneAndUpdate(
    { _id: id, activa: true },
    datosActualizados,
    { new: true, runValidators: true },
  );

  if (!categoriaActualizada) {
    const errorNotFound = new Error("Categoría no encontrada");
    errorNotFound.status = 404;
    throw errorNotFound;
  }

  return categoriaActualizada;
};

export const eliminarCategoriaService = async (id) => {
  if (!isValidObjectId(id)) {
    const errorId = new Error("El id de la categoría no es válido");
    errorId.status = 400;
    throw errorId;
  }

  const categoria = await Categoria.findOne({ _id: id, activa: true });
  if (!categoria) {
    const errorNotFound = new Error("Categoría no encontrada");
    errorNotFound.status = 404;
    throw errorNotFound;
  }

  const productosActivos = await Publicacion.countDocuments({
    categoria: id,
    activa: true,
  });

  if (productosActivos > 0) {
    const error = new Error(
      "No se puede dar de baja una categoría asociada a productos activos",
    );
    error.status = 409;
    throw error;
  }

  await Categoria.findByIdAndUpdate(id, { activa: false });
};
