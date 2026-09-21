import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { updateUsuarioSchema, createUsuarioSchema } from "../validators/usuario.validators.js";
import { obtenerUsuarios, obtenerUsuarioPorId, crearUsuario, actualizarUsuario, eliminarUsuario } from "../controllers/usuario.controller.js";
const router = express.Router({mergeParams:true});

router.get("/", obtenerUsuarios);
router.get("/:id", obtenerUsuarioPorId);
router.post("/", validateBodyMiddleware(createUsuarioSchema), crearUsuario);
router.put("/:id", validateBodyMiddleware(updateUsuarioSchema), actualizarUsuario);
router.delete("/:id", eliminarUsuario);

export default router;