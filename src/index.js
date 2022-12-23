import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import urlRouter from "./routes/urlRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(urlRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("Server running in port: " + port));
