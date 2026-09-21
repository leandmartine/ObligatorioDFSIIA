import express from "express";
import authRouter from "./routes/auth.router.js";
import { authenticateToken } from "./middlewares/authorzation.middleware.js";

const router = express.Router({mergeParams:true});

router.use("/auth", authRouter);

router.use(authenticateToken);

export default router;
