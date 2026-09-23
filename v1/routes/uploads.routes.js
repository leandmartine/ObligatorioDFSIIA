import express from "express";
import { subirImagen } from "../controllers/uploads.controller.js";
import { authenticateToken } from "../middlewares/authorzation.middleware.js";

const router = express.Router({mergeParams:true});

router.use(authenticateToken);

router.post("/imagen", subirImagen);

export default router;