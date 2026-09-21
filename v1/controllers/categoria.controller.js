import { obtenerCategoriasService, obtenerCategoriaService, crearCategoriaService, eliminarCategoriaService } from "../services/categoria.services.js";

export const obtenerCategorias = async (req, res) => {
    const busqueda = req.query; //{activa:true}
    const categorias = await obtenerCategoriasService(busqueda);
    res.status(200).json({ categorias });
}

export const obtenerCategoriaPorId = async (req, res) => {
    const { id } = req.params;
    const categoria = await obtenerCategoriaService(id);
    res.status(200).json({ categoria });
}

export const crearCategoria = async (req, res) => {
    const categoriaData = req.validatedBody;
    const nuevaCategoria = await crearCategoriaService(categoriaData);
    res.status(201).json({ nuevaCategoria });
}

export const eliminarCategoria = async (req, res) => {
    const { id } = req.params;
    await eliminarCategoriaService(id);
    res.status(200).json({ message: "Categoría eliminada" });
}