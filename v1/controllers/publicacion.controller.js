import {
  obtenerPublicacionesService,
  obtenerPublicacionService,
  crearPublicacionService,
  actualizarPublicacionService,
  eliminarPublicacionService,
  obtenerPublicacionesPendientesService,
  moderarPublicacionService,
} from "../services/publicacion.services.js";
import cloudinary from "../config/cloudinary.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.util.js";
import {
  generarCategoriaConIA,
  generarDescripcionConIA,
} from "../services/ai.services.js";
import { obtenerNombresCategoriasActivasService } from "../services/categoria.services.js";

export const obtenerPublicaciones = async (req, res) => {
  const resultado = await obtenerPublicacionesService(req.query);
  res.status(200).json(resultado);
};

export const obtenerPublicacionPorId = async (req, res) => {
  const { id } = req.params;
  const publicacion = await obtenerPublicacionService(id);
  res.status(200).json({ publicacion });
};

export const obtenerPublicacionesPendientes = async (req, res) => {
  const publicaciones = await obtenerPublicacionesPendientesService(req.user);
  res.status(200).json({ publicaciones });
};

export const moderarPublicacion = async (req, res) => {
  const publicacion = await moderarPublicacionService(
    req.params.id,
    req.validatedBody.decision,
    req.user,
  );
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

  if (publicacionData.usoIA) {
    const categorias = await obtenerNombresCategoriasActivasService();
    if (categorias.length === 0) {
      const error = new Error("No hay categorías activas para clasificar la publicación");
      error.status = 503;
      throw error;
    }

    publicacionData.descripcion = await generarDescripcionConIA(
      publicacionData.titulo,
    );
    publicacionData.categoria = await generarCategoriaConIA(
      publicacionData.titulo,
      categorias,
      publicacionData.categoria,
    );
  }

  delete publicacionData.usoIA;
  const nuevaPublicacion = await crearPublicacionService(
    publicacionData,
    req.user.email,
  );
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
