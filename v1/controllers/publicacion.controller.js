import {
  obtenerPublicacionesService,
  obtenerPublicacionService,
  crearPublicacionService,
  actualizarPublicacionService,
  eliminarPublicacionService,
} from "../services/publicacion.services.js";
import cloudinary from "../config/cloudinary.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.util.js";

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

  if (!req.file) {
    return res.status(400).json({ error: "La imagen de la publicación es obligatoria" });
  }

  const resultado = await uploadBufferToCloudinary(
    cloudinary,
    req.file.buffer,
    { resource_type: "auto", folder: "publicaciones" },
  );
  publicacionData.imagenUrl = resultado.secure_url;

  const nuevaPublicacion = await crearPublicacionService(publicacionData);
  res.status(201).json({ nuevaPublicacion });
};

export const actualizarPublicacion = async (req, res) => {
  const { id } = req.params;
  const publicacionData = { ...req.validatedBody };

  if (req.file) {
    const resultado = await uploadBufferToCloudinary(
      cloudinary,
      req.file.buffer,
      { resource_type: "auto", folder: "publicaciones" },
    );
    publicacionData.imagenUrl = resultado.secure_url;
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
