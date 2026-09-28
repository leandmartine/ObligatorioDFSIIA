import {
  obtenerPublicacionesService,
  obtenerPublicacionService,
  crearPublicacionService,
  actualizarPublicacionService,
  eliminarPublicacionService,
} from "../services/publicacion.services.js";
import { cloudinary } from "../config/cloudinary.js";

export const obtenerPublicaciones = async (req, res) => {
  const busqueda = req.query;
  const publicaciones = await obtenerPublicacionesService(busqueda);
  res.status(200).json({ publicaciones });
};

export const obtenerPublicacionPorId = async (req, res) => {
  const { id } = req.params;
  const publicacion = await obtenerPublicacionService(id);
  res.status(200).json({ publicacion });
};

export const crearPublicacion = async (req, res) => {
  const publicacionData = { ...req.validatedBody };

  if (publicacionData.imagen) {
    const resultado = await cloudinary.uploader.upload(publicacionData.imagen);
    publicacionData.imagen = resultado.secure_url;
  }

  const nuevaPublicacion = await crearPublicacionService(publicacionData);
  res.status(201).json({ nuevaPublicacion });
};

export const actualizarPublicacion = async (req, res) => {
  const { id } = req.params;
  const publicacionData = { ...req.validatedBody };

  if (publicacionData.imagen) {
    const resultado = await cloudinary.uploader.upload(publicacionData.imagen);
    publicacionData.imagen = resultado.secure_url;
  }

  const publicacionActualizada = await actualizarPublicacionService(
    id,
    publicacionData,
    req.user,
  );
  res.status(200).json({ publicacionActualizada });
};

export const eliminarPublicacion = async (req, res) => {
  const { id } = req.params;
  const publicacionEliminada = await eliminarPublicacionService(id, req.user);
  res.status(200).json({ publicacionEliminada });
};
