import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./v1/config/db.config.js";
import { notFoundMiddleware } from "./v1/middlewares/notFound.middleware.js";
import v1 from "./v1/v1.routes.js";
import { errorMiddleware } from "./v1/middlewares/error.middleware.js";


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

export default app;