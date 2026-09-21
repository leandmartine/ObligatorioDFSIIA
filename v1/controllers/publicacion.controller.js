import { obtenerPublicacionesService, obtenerPublicacionService, crearPublicacionService, actualizarPublicacionService, eliminarPublicacionService } from "../services/publicacion.services.js";

export const obtenerPublicaciones = async (req, res) => {
    const busqueda = req.query; //{activa:true}
    const publicaciones = await obtenerPublicacionesService(busqueda);
    res.status(200).json({ publicaciones });
}

export const obtenerPublicacionPorId = async (req, res) => {
    const { id } = req.params;
    const publicacion = await obtenerPublicacionService(id);
    res.status(200).json({ publicacion });
}

export const crearPublicacion = async (req, res) => {
    const publicacionData = req.validatedBody;
    const nuevaPublicacion = await crearPublicacionService(publicacionData);
    res.status(201).json({ nuevaPublicacion });
}

export const actualizarPublicacion = async (req, res) => {
    const { id } = req.params;
    const publicacionData = req.validatedBody;
    const publicacionActualizada = await actualizarPublicacionService(id, publicacionData);
    res.status(200).json({ publicacionActualizada });
}

export const eliminarPublicacion = async (req, res) => {
    const { id } = req.params;
    await eliminarPublicacionService(id);
    res.status(200).json({ message: "Publicación eliminada" });
}
