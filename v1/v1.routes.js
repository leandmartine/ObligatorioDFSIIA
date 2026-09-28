import express from "express";
import authRouter from "./routes/auth.router.js";
import { authenticateToken } from "./middlewares/authorzation.middleware.js";
import usuariosRouter from "./routes/usuario.routes.js";
import publicacionRouter from "./routes/publicacion.routes.js";
import categoriaRouter from "./routes/categoria.routes.js";
import aiRouter from "./routes/ai.routes.js";

const router = express.Router({mergeParams:true});

router.use("/auth", authRouter);

router.use(authenticateToken);

router.use("/usuarios", usuariosRouter);
router.use("/publicacion", publicacionRouter);
router.use("/categoria", categoriaRouter);
router.use("/ai", aiRouter);

export default router;
