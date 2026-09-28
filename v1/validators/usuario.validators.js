import Joi from "joi";

export const createUsuarioSchema = Joi.object({
  name: Joi.string().trim().required().min(3).max(30).messages({
    "string.empty": "El nombre es obligatorio",
    "any.required": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos {#limit} caracteres",
    "string.max": "El nombre no puede tener más de {#limit} caracteres",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "El email debe ser una dirección de correo válida",
    "string.empty": "El email es obligatorio",
    "any.only": "El email ya está en uso",
  }),
  password: Joi.string().required().min(6).messages({
    "string.empty": "La contraseña es obligatoria",
    "string.min": "La contraseña debe tener al menos {#limit} caracteres",
  }),
  esAdmin: Joi.boolean().required().messages({
    "boolean.base": "El campo esAdmin debe ser un valor booleano",
    "any.required": "El campo esAdmin es obligatorio",
  }),
  role: Joi.string().trim().min(2).max(50).required().messages({
    "any.required": "El rol es obligatorio",
    "string.empty": "El rol es obligatorio",
    "string.min": "El rol debe tener al menos {#limit} caracteres",
    "string.max": "El rol no puede tener más de {#limit} caracteres",
  }),
  phone: Joi.number().required().messages({
    "number.base": "El teléfono debe ser un número",
    "any.required": "El teléfono es obligatorio",
  }),
  esPremium: Joi.boolean().messages({
    "boolean.base": "El campo esPremium debe ser un valor booleano",
  }),
  puedeModerar: Joi.boolean().messages({
    "boolean.base": "El campo puedeModerar debe ser un valor booleano",
  }),
});

export const updateUsuarioSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).messages({
    "string.min": "El nombre debe tener al menos {#limit} caracteres",
    "string.max": "El nombre no puede tener más de {#limit} caracteres",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "El email debe ser una dirección de correo válida",
    "string.empty": "El email es obligatorio",
    "any.required": "El email es obligatorio",
  }),
  password: Joi.string().min(6).messages({
    "string.min": "La contraseña debe tener al menos {#limit} caracteres",
  }),
  esAdmin: Joi.boolean().messages({
    "boolean.base": "El campo esAdmin debe ser un valor booleano",
  }),
  role: Joi.string().trim().min(2).max(50).messages({
    "string.min": "El rol debe tener al menos {#limit} caracteres",
    "string.max": "El rol no puede tener más de {#limit} caracteres",
  }),
  esPremium: Joi.boolean().messages({
    "boolean.base": "El campo esPremium debe ser un valor booleano",
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

export const altaUsuarioPremiumSchema = Joi.object({
  esPremium: Joi.boolean().required().messages({
    "boolean.base": "El campo 'esPremium' debe ser un valor booleano",
    "any.required": "El campo 'esPremium' es obligatorio",
  }),
});
