import Joi from "joi";

export const createCategoriaSchema = Joi.object({
  nombre: Joi.string().trim().required().min(2).max(100).messages({
    "string.empty": "El nombre de la categoría es obligatorio",
    "any.required": "El nombre de la categoría es obligatorio",
    "string.min": "El nombre de la categoría debe tener al menos {min} caracteres",
    "string.max": "El nombre de la categoría no puede tener más de {max} caracteres",
  }),
  descripcion: Joi.string().trim().max(500).allow("").optional().messages({
    "string.max": "La descripción no puede tener más de {#limit} caracteres",
  }),
  rolesPermitidos: Joi.array().items(
    Joi.string().trim().min(2).max(50).messages({
      "string.empty": "Cada rol permitido es obligatorio",
      "string.min": "Cada rol permitido debe tener al menos {#limit} caracteres",
      "string.max": "Cada rol permitido no puede tener más de {#limit} caracteres",
    }),
  ).min(1).required().messages({
    "array.base": "Los roles permitidos deben ser un arreglo de nombres",
    "array.min": "Debe indicar al menos un rol permitido",
    "any.required": "Los roles permitidos son obligatorios",
  }),
});

export const updateCategoriaSchema = Joi.object({
  nombre: Joi.string().trim().min(2).max(100).messages({
    "string.empty": "El nombre de la categoría no puede estar vacío",
    "string.min": "El nombre de la categoría debe tener al menos {#limit} caracteres",
    "string.max": "El nombre de la categoría no puede tener más de {#limit} caracteres",  
  }),
  descripcion: Joi.string().trim().max(500).allow("").optional().messages({
    "string.max": "La descripción no puede tener más de {#limit} caracteres",
  }),
  rolesPermitidos: Joi.array().items(
    Joi.string().trim().min(2).max(50).messages({
      "string.empty": "Cada rol permitido es obligatorio",
      "string.min": "Cada rol permitido debe tener al menos {#limit} caracteres",
      "string.max": "Cada rol permitido no puede tener más de {#limit} caracteres",
    }),
  ).min(1).messages({
    "array.base": "Los roles permitidos deben ser un arreglo de nombres",
    "array.min": "Debe indicar al menos un rol permitido",
  }),
});