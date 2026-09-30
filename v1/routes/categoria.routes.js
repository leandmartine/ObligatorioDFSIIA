import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { createCategoriaSchema } from "../validators/categorias.validators.js";
import { updateCategoriaSchema } from "../validators/categorias.validators.js";
import { obtenerCategorias, obtenerCategoriaPorId, crearCategoria, actualizarCategoria, eliminarCategoria } from "../controllers/categoria.controller.js";
import { authorizeAdmin } from "../middlewares/authorize.middleware.js";

const router = express.Router({mergeParams:true});

router.get("/", obtenerCategorias);
router.get("/:id", obtenerCategoriaPorId);
router.post("/", authorizeAdmin, validateBodyMiddleware(createCategoriaSchema), crearCategoria);
router.patch("/:id",authorizeAdmin,validateBodyMiddleware(updateCategoriaSchema),actualizarCategoria);
router.delete("/:id", authorizeAdmin, eliminarCategoria);

export default router;
