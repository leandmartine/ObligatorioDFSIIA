import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { createUsuarioSchema, loginUsuarioSchema } from "../validators/usuario.validators.js";

const router = express.Router({mergeParams:true});

router.post("/login", validateBodyMiddleware(loginUsuarioSchema), login);
router.post("/register", validateBodyMiddleware(createUsuarioSchema), register);

export default router;