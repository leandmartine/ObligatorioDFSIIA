import mongoose from "mongoose";
import Categoria from "../models/categoria.model.js";
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
  const categoria = await Categoria.findById(id);
  if (!categoria) {
    const errorNotFound = new Error("Categoría no encontrada");
    errorNotFound.status = 404;
    throw errorNotFound;
  }
  return categoria;
};

export const crearCategoriaService = async (categoriaData) => {
  const nuevaCategoria = new Categoria(categoriaData);
  await nuevaCategoria.save();
  return nuevaCategoria;
};

export const eliminarCategoriaService = async (id) => {
  if (!isValidObjectId(id)) {
    const errorId = new Error("El id de la categoría no es válido");
    errorId.status = 400;
    throw errorId;
  }
};
