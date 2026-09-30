import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authorizeModerator } from "../middlewares/authorize.middleware.js";
import {
  createPublicacionSchema,
  updatePublicacionSchema,
  moderarPublicacionSchema,
} from "../validators/publicaciones.validators.js";
import {
  obtenerPublicaciones,
  obtenerPublicacionPorId,
  obtenerPublicacionesPendientes,
  moderarPublicacion,
  crearPublicacion,
  actualizarPublicacion,
  eliminarPublicacion,
} from "../controllers/publicacion.controller.js";

const router = express.Router({mergeParams:true});

router.get("/", obtenerPublicaciones);
router.get("/revision", authorizeModerator, obtenerPublicacionesPendientes);
router.patch(
  "/revision/:id",
  authorizeModerator,
  validateBodyMiddleware(moderarPublicacionSchema),
  moderarPublicacion,
);
router.get("/:id", obtenerPublicacionPorId);
router.post("/", upload.single("imagen"), validateBodyMiddleware(createPublicacionSchema), crearPublicacion);
router.patch("/:id", upload.single("imagen"), validateBodyMiddleware(updatePublicacionSchema), actualizarPublicacion);
router.delete("/:id", eliminarPublicacion);


export default router;