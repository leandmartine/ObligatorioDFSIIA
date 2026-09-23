import express from "express";
import { ai } from "../controllers/ai.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { aiSchema } from "../validators/ai.validators.js";

const router = express.Router({mergeParams:true});

router.post("/", validateBodyMiddleware(aiSchema), ai);

export default router;