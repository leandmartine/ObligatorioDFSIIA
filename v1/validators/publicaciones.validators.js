import Joi from "joi";

export const createPublicacionSchema = Joi.object({
  usoIA: Joi.boolean().optional().default(false).messages({
    "boolean.base": "El campo 'usoIA' debe ser un valor booleano",
  }),
  titulo: Joi.string().trim().required().min(5).max(100).messages({
    "string.empty": "El título de la publicación es obligatorio",
    "any.required": "El título de la publicación es obligatorio",
    "string.min": "El título de la publicación debe tener al menos {#limit} caracteres",
    "string.max": "El título de la publicación no puede tener más de {#limit} caracteres",
  }),
  descripcion: Joi.when("usoIA", {
    is: true,
    then: Joi.any().optional(),
    otherwise: Joi.string().trim().required().min(10).max(2000),
  }).messages({
    "string.empty": "La descripción de la publicación es obligatoria",
    "any.required": "La descripción de la publicación es obligatoria",
    "string.min": "La descripción de la publicación debe tener al menos {#limit} caracteres",
    "string.max": "La descripción no puede tener más de {#limit} caracteres",
  }),
  aceptaPermuta: Joi.boolean().required().messages({
    "boolean.base": "El campo 'aceptaPermuta' debe ser un valor booleano",
    "any.required": "El campo 'aceptaPermuta' es obligatorio",
  }),
  precio: Joi.number().required().min(0).messages({
    "number.base": "El precio debe ser un número",
    "number.min": "El precio no puede ser negativo",
    "any.required": "El precio es obligatorio",
  }),
  pesosUy: Joi.boolean().required().messages({
    "boolean.base": "El campo 'pesosUy' debe ser un valor booleano",
    "any.required": "El campo 'pesosUy' es obligatorio",
  }),
  alcance: Joi.array().items(
    Joi.string().trim().min(2).max(50).messages({
      "string.empty": "Cada alcance es obligatorio",
      "string.min": "Cada alcance debe tener al menos {#limit} caracteres",
      "string.max": "Cada alcance no puede tener más de {#limit} caracteres",
    }),
  ).unique().min(1).required().messages({
    "array.base": "El alcance debe ser un arreglo de nombres",
    "array.unique": "No se puede repetir un rol en el alcance",
    "array.min": "Debe indicar al menos un alcance",
    "any.required": "El alcance es obligatorio",
  }),
  cantidad: Joi.number().integer().required().min(1).messages({
    "number.base": "La cantidad debe ser un número",
    "number.min": "La cantidad debe ser al menos {#limit}",
    "any.required": "La cantidad es obligatoria",
  }),
  nuevo: Joi.boolean().required().messages({
    "boolean.base": "El campo 'nuevo' debe ser un valor booleano",
    "any.required": "El campo 'nuevo' es obligatorio",
  }),
  categoria: Joi.when("usoIA", {
    is: true,
    then: Joi.any().optional(),
    otherwise: Joi.string().trim().min(2).max(100).required(),
  }).messages({
    "string.empty": "La categoría es obligatoria",
    "any.required": "La categoría es obligatoria",
  }),
  imagenUrl: Joi.string().uri().optional().messages({
    "string.uri": "La URL de la imagen debe ser una URL válida",
  }),
});

export const updatePublicacionSchema = Joi.object({
  titulo: Joi.string().trim().min(5).max(100).messages({
    "string.min": "El título de la publicación debe tener al menos {#limit} caracteres",
    "string.max": "El título de la publicación no puede tener más de {#limit} caracteres",
  }),
  descripcion: Joi.string().trim().min(10).max(2000).messages({
    "string.min": "La descripción de la publicación debe tener al menos {#limit} caracteres",
    "string.max": "La descripción no puede tener más de {#limit} caracteres",
  }),
  aceptaPermuta: Joi.boolean().messages({
    "boolean.base": "El campo 'aceptaPermuta' debe ser un valor booleano",
  }),
  precio: Joi.number().min(0).messages({
    "number.base": "El precio debe ser un número",
    "number.min": "El precio no puede ser negativo",
  }),
  pesosUy: Joi.boolean().messages({
    "boolean.base": "El campo 'pesosUy' debe ser un valor booleano",
  }),
  alcance: Joi.array().items(
    Joi.string().trim().min(2).max(50).messages({
      "string.empty": "Cada alcance es obligatorio",
      "string.min": "Cada alcance debe tener al menos {#limit} caracteres",
      "string.max": "Cada alcance no puede tener más de {#limit} caracteres",
    }),
  ).unique().min(1).messages({
    "array.base": "El alcance debe ser un arreglo de nombres",
    "array.unique": "No se puede repetir un rol en el alcance",
    "array.min": "Debe indicar al menos un alcance",
  }),
  cantidad: Joi.number().integer().min(1).messages({
    "number.base": "La cantidad debe ser un número",
    "number.min": "La cantidad debe ser al menos {#limit}",
  }),
  nuevo: Joi.boolean().messages({
    "boolean.base": "El campo 'nuevo' debe ser un valor booleano",
  }),
  categoria: Joi.string().trim().min(2).max(100).messages({
    "string.min": "La categoría debe tener al menos {#limit} caracteres",
    "string.max": "La categoría no puede tener más de {#limit} caracteres",
  }),
  imagenUrl: Joi.string().uri().optional().messages({
    "string.uri": "La URL de la imagen debe ser una URL válida",
  }),
});

export const moderarPublicacionSchema = Joi.object({
  decision: Joi.string().valid("aprobar", "rechazar").required().messages({
    "any.only": "La decisión debe ser aprobar o rechazar",
    "any.required": "La decisión de moderación es obligatoria",
  }),
});
