import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { updateUsuarioSchema, createUsuarioSchema, altaUsuarioPremiumSchema } from "../validators/usuario.validators.js";
import { obtenerUsuarios, obtenerUsuarioPorId, crearUsuario, actualizarUsuario, altaUsuarioPremium, eliminarUsuario } from "../controllers/usuario.controller.js";
const router = express.Router({mergeParams:true});

router.get("/", obtenerUsuarios);
router.get("/:id", obtenerUsuarioPorId);
router.post("/", validateBodyMiddleware(createUsuarioSchema), crearUsuario);
router.patch("/altaPremium/:id", validateBodyMiddleware(altaUsuarioPremiumSchema), altaUsuarioPremium);
router.patch("/:id", validateBodyMiddleware(updateUsuarioSchema), actualizarUsuario);
router.delete("/:id", eliminarUsuario);

export default router;