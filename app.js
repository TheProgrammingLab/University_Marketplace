import express from "express";
import cors from "cors";

import globalErrHandler from "./middlewares/globalErrorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(globalErrHandler);
export default app;
