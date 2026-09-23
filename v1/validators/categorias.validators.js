import Joi from "joi";

export const createCategoriaSchema = Joi.object({
  nombre: Joi.string().required().min(2).max(100).messages({
    "string.empty": "El nombre de la categoría es obligatorio",
    "string.min": "El nombre de la categoría debe tener al menos {min} caracteres",
    "string.max": "El nombre de la categoría no puede tener más de {max} caracteres",
  }),
  descripcion: Joi.string().optional(),
  rolesPermitidos: Joi.string().required().messages({
    "any.only": "El alcance debe ser 'estudiante', 'profesor', 'trabajador' o 'graduado'",
    "string.empty": "El alcance es obligatorio",
  }),
});