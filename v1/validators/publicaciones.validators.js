import Joi from "joi";

export const createPublicacionSchema = Joi.object({
  titulo: Joi.string().required().min(5).max(100).messages({
    "string.empty": "El título de la publicación es obligatorio",
    "string.min": "El título de la publicación debe tener al menos {min} caracteres",
    "string.max": "El título de la publicación no puede tener más de {max} caracteres",
  }),
  descripcion: Joi.string().required().min(10).messages({
    "string.empty": "La descripción de la publicación es obligatoria",
    "string.min": "La descripción de la publicación debe tener al menos {min} caracteres",
  }),
  tipoOferta: Joi.string().valid("venta", "permuta", "gratis").required().messages({
    "any.only": "El tipo de oferta debe ser 'venta', 'permuta' o 'gratis'",
    "string.empty": "El tipo de oferta es obligatorio",
  }),
  precio: Joi.number().required().min(0).messages({
    "number.base": "El precio debe ser un número",
    "number.min": "El precio no puede ser negativo",
    "any.required": "El precio es obligatorio",
  }),
  moneda: Joi.string().valid("USD", "UYU").required().messages({
    "any.only": "La moneda debe ser 'USD' o 'UYU'",
    "string.empty": "La moneda es obligatoria",
  }),
  alcance: Joi.string().valid("estudiante", "profesor", "trabajador", "graduado").required().messages({
    "any.only": "El alcance debe ser 'estudiante', 'profesor', 'trabajador' o 'graduado'",
    "string.empty": "El alcance es obligatorio",
  }),
  cantidad: Joi.number().required().min(1).messages({
    "number.base": "La cantidad debe ser un número",
    "number.min": "La cantidad debe ser al menos {min}",
    "any.required": "La cantidad es obligatoria",
  }),
  estadoItem: Joi.string().valid("nuevo", "usado", "como_nuevo").required().messages({
    "any.only": "El estado del ítem debe ser 'nuevo', 'usado' o 'como_nuevo'",
    "string.empty": "El estado del ítem es obligatorio",
  }),
  estadoPublicacion: Joi.string().valid("pendiente", "publicada", "rechazada", "vendida").required().messages({
    "any.only": "El estado de la publicación debe ser 'pendiente', 'publicada', 'rechazada' o 'vendida'",
    "string.empty": "El estado de la publicación es obligatorio",
  }),
  categoria: Joi.string().required().messages({
    "string.empty": "La categoría es obligatoria",
  }),
  imagenUrl: Joi.string().uri().optional().messages({
    "string.uri": "La URL de la imagen debe ser una URL válida",
  }),
  autor: Joi.string().required().messages({
    "string.empty": "El autor es obligatorio",
  }),
});