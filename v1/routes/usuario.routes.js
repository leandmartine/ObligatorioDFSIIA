import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { authorizeAdmin } from "../middlewares/authorize.middleware.js";
import { updateUsuarioSchema, createUsuarioSchema, altaUsuarioPremiumSchema } from "../validators/usuario.validators.js";
import { obtenerUsuarios, obtenerUsuarioPorId, obtenerPublicacionesDelUsuario, crearUsuario, actualizarUsuario, altaUsuarioPremium, eliminarUsuario } from "../controllers/usuario.controller.js";
const router = express.Router({mergeParams:true});

router.get("/", authorizeAdmin, obtenerUsuarios);
router.get("/publicaciones", obtenerPublicacionesDelUsuario);
router.get("/:id", obtenerUsuarioPorId);
router.post("/", authorizeAdmin, validateBodyMiddleware(createUsuarioSchema), crearUsuario);
router.patch("/altaPremium/:id", validateBodyMiddleware(altaUsuarioPremiumSchema), altaUsuarioPremium);
router.patch("/:id", validateBodyMiddleware(updateUsuarioSchema), actualizarUsuario);
router.delete("/:id", eliminarUsuario);

export default router;