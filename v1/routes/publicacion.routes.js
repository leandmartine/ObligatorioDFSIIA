import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createPublicacionSchema,
  updatePublicacionSchema,
} from "../validators/publicaciones.validators.js";
import { obtenerPublicaciones, obtenerPublicacionPorId, crearPublicacion, actualizarPublicacion, eliminarPublicacion } from "../controllers/publicacion.controller.js";

const router = express.Router({mergeParams:true});

router.get("/", obtenerPublicaciones);
router.get("/:id", obtenerPublicacionPorId);
router.post("/", upload.single("imagen"), validateBodyMiddleware(createPublicacionSchema), crearPublicacion);
router.put("/:id", upload.single("imagen"), validateBodyMiddleware(updatePublicacionSchema), actualizarPublicacion);
router.delete("/:id", eliminarPublicacion);


export default router;