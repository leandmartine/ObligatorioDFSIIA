import Joi from "joi";

export const createUsuarioSchema = Joi.object({
  username: Joi.string().required().min(3).max(30).messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre de usuario debe tener al menos {#limit} caracteres",
    "string.max": "El nombre de usuario no puede tener más de {#limit} caracteres",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "El email debe ser una dirección de correo válida",
    "string.empty": "El email es obligatorio",
    "any.only": "El email ya está en uso",
  }),
  password: Joi.string().required().min(6).messages({
    "string.empty": "La contraseña es obligatoria",
    "string.min": "La contraseña debe tener al menos {min} caracteres",
  }),
  role: Joi.string().hex().length(24).required().messages({
    "any.required": "El rol es obligatorio",
    "string.hex": "El rol debe ser un ObjectId válido",
    "string.length": "El rol debe ser un ObjectId válido",
  }),
});

export const updateUsuarioSchema = Joi.object({
  username: Joi.string().min(3).max(30).messages({
    "string.min": "El nombre de usuario debe tener al menos {min} caracteres",
    "string.max": "El nombre de usuario no puede tener más de {max} caracteres",
  }),
  email: Joi.string().email().messages({
    "string.email": "El email debe ser una dirección de correo válida",
  }),
  password: Joi.string().min(6).messages({
    "string.min": "La contraseña debe tener al menos {min} caracteres",
  }),
  esAdmin: Joi.boolean().messages({
    "boolean.base": "El campo esAdmin debe ser un valor booleano",
  }),
  rolComunidad: Joi.string().required().messages({
    "any.only": "El rol de la comunidad debe ser 'estudiante', 'profesor', 'trabajador' o 'graduado'",
  }),
  esPremium: Joi.boolean().valid("plus", "premium").messages({
    "any.only": "El plan debe ser 'plus' o 'premium'",
  }),
  puedeModerar: Joi.boolean().messages({
    "boolean.base": "El campo puedeModerar debe ser un valor booleano",
  }),
  activo: Joi.boolean().messages({
    "boolean.base": "El campo activo debe ser un valor booleano",
  }),
});

  export const loginUsuarioSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "El email debe ser una dirección de correo válida",
    "string.empty": "El email es obligatorio",
  }),
  password: Joi.string().required().messages({
    "string.empty": "La contraseña es obligatoria",
  }),
}); 
