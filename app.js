import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./v1/config/db.config.js";
import { notFoundMiddleware } from "./v1/middlewares/notFound.middleware.js";
import v1 from "./v1/v1.routes.js";
import { errorMiddleware } from "./v1/middlewares/error.middleware.js";
import rateLimit from 'express-rate-limit';


connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) => {
    res.send("Nueva respuesta desde el servidor");
})

app.use("/v1", v1 );

app.use(notFoundMiddleware);

app.use(errorMiddleware);

app.use(express.json());
// Limite global de requests
const limiter = rateLimit({
 windowMs: 1 * 60 * 1000, // 1 minuto
 max: 500, // máximo 500 requests por IP
 message: 'Demasiadas solicitudes desde esta IP, intenta más tarde',
});
app.use(limiter);

export default app;