import joi from "joi";

export const aiSchema = joi.object({
  prompt: joi.string().trim().required().min(5).max(1000).messages({
    "string.empty": "El prompt es obligatorio",
    "any.required": "El prompt es obligatorio",
    "string.min": "El prompt debe tener al menos {#limit} caracteres",
    "string.max": "El prompt no puede tener más de {#limit} caracteres",
  }),

});