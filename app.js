import express from "express";
import cors from "cors";
import morgan from "morgan";

import handleUndefinedRoutes from "./middlewares/handleUndefinedRoutes.js";
import globalErrHandler from "./middlewares/globalErrHandler.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/user/", userRouter);

app.use(handleUndefinedRoutes);
app.use(globalErrHandler);
export default app;
