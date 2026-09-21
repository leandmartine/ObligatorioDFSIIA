import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { createPublicacionSchema } from "../validators/publicaciones.validators.js";
import { obtenerPublicaciones, obtenerPublicacionPorId, crearPublicacion, actualizarPublicacion, eliminarPublicacion } from "../controllers/publicacion.controller.js";

const router = express.Router({mergeParams:true});

router.get("/", obtenerPublicaciones);
router.get("/:id", obtenerPublicacionPorId);
router.post("/", validateBodyMiddleware(createPublicacionSchema), crearPublicacion);
router.put("/:id", validateBodyMiddleware(createPublicacionSchema), actualizarPublicacion);
router.delete("/:id", eliminarPublicacion);


export default router;