import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import handleUndefinedRoutes from "./middlewares/handleUndefinedRoutes.js";
import globalErrHandler from "./middlewares/globalErrHandler.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import marketPlaceRouter from "./routes/marketPlaceRoutes.js";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true); // allow this origin
      } else {
        callback(new Error("Not allowed by CORS")); // block others
      }
    },
    credentials: true,
  }),
);

app.use("/api/v1/auth/", authRouter);
app.use("/api/v1/user/", userRouter);
app.use("/api/v1/post/", postRouter);
app.use("/api/v1/marketplace/", marketPlaceRouter);

app.use(handleUndefinedRoutes);
app.use(globalErrHandler);
export default app;
