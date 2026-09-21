import express from "express";
import authRouter from "./routes/auth.router.js";
import { authenticateToken } from "./middlewares/authorzation.middleware.js";
import usuariosRouter from "./routes/usuario.routes.js";
import publicacionRouter from "./routes/publicacion.routes.js";
import categoriaRouter from "./routes/categoria.routes.js";

const router = express.Router({mergeParams:true});

router.use("/auth", authRouter);


router.use(authenticateToken);

router.get("/usuarios", usuariosRouter);
router.get("/publicacion", publicacionRouter);
router.get("/categoria", categoriaRouter);

export default router;
