import express from "express";
import cors from "cors";

import globalErrHandler from "./middlewares/globalErrorHandler.js";
import authRouter from "./routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use(globalErrHandler);
export default app;
