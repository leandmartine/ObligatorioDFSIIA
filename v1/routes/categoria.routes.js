import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { createCategoriaSchema } from "../validators/categoria.validators.js";

const router = express.Router({mergeParams:true});

export default router;