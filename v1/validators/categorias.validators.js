import Joi from "joi";

export const createCategoriaSchema = Joi.object({
  nombre: Joi.string().required().min(2).max(100).messages({
    "string.empty": "El nombre de la categoría es obligatorio",
    "string.min": "El nombre de la categoría debe tener al menos {min} caracteres",
    "string.max": "El nombre de la categoría no puede tener más de {max} caracteres",
  }),
  descripcion: Joi.string().optional(),
  rolesPermitidos: Joi.array().items(Joi.string().valid("estudiante", "profesor", "trabajador", "graduado")).optional(),
});