import Joi from "joi";

export const createUsuarioSchema = Joi.object({
  username: Joi.string().required().min(3).max(30).messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre de usuario debe tener al menos {min} caracteres",
    "string.max": "El nombre de usuario no puede tener más de {max} caracteres",
  }),
  email: Joi.string().email().required().unique().messages({
    "string.email": "El email debe ser una dirección de correo válida",
    "string.empty": "El email es obligatorio",
    "any.only": "El email ya está en uso",
  }),
  password: Joi.string().required().min(6).messages({
    "string.empty": "La contraseña es obligatoria",
    "string.min": "La contraseña debe tener al menos {min} caracteres",
  }),
});
