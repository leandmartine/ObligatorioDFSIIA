import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Usuario from "../models/usuario.model.js";
import RolesColeccion from "../models/roles.model.js";
import { sendWelcomeEmail } from "../services/email.services.js";

export const login = async (req, res, next) => {
  const { email, password } = req.validatedBody;
  const userFound = await Usuario.findOne(
    { email, activo: true },
    "email esAdmin puedeModerar role +password",
  );
  if (!userFound) {
    return res
      .status(401)
      .json({ message: "Usuario y/o contraseña incorrectos" });
  }
  const valid = bcrypt.compareSync(password, userFound.password);
  if (!valid) {
    return res
      .status(401)
      .json({ message: "Usuario y/o contraseña incorrectos" });
  }

  const token = jwt.sign(
    {
      email,
      esAdmin: userFound.esAdmin,
      puedeModerar: userFound.puedeModerar ?? false,
      role: userFound.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "12h" },
  );
  return res.json({ message: "Login exitoso", token });
};

export const register = async (req, res) => {
  const { name, phone, email, password, esAdmin, puedeModerar, role } =
    req.validatedBody;
  const userFound = await Usuario.findOne({ email, activo: true });
  if (userFound) {
    return res.status(409).json({ message: "El email ya está en uso" });
  }

  const roleFound = await RolesColeccion.findOne({
    nombre: role,
    activa: true,
  });
  if (!roleFound) {
    return res
      .status(400)
      .json({ message: "El rol no existe o está inactivo" });
  }

  const hashedPassword = bcrypt.hashSync(
    password,
    Number(process.env.SALTING_ROUNDS),
  );
  const usuarioCreado = await Usuario.create({
    name,
    email,
    phone,
    password: hashedPassword,
    esAdmin,
    puedeModerar: puedeModerar ?? false,
    role: roleFound._id,
  });
  await sendWelcomeEmail({ name: usuarioCreado.name, email: usuarioCreado.email });

  const token = jwt.sign(
    {
      email,
      esAdmin,
      puedeModerar: puedeModerar ?? false,
      role: roleFound._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "12h" },
  );
  return res.status(201)
    .json({ message: "Usuario registrado exitosamente", token });
};
