import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { createCategoriaSchema } from "../validators/categorias.validators.js";
import { obtenerCategorias, obtenerCategoriaPorId, crearCategoria, eliminarCategoria } from "../controllers/categoria.controller.js";

const router = express.Router({mergeParams:true});

router.get("/", obtenerCategorias);
router.get("/:id", obtenerCategoriaPorId);
router.post("/", validateBodyMiddleware(createCategoriaSchema), crearCategoria);
router.delete("/:id", eliminarCategoria);

export default router;