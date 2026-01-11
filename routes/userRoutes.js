import { Router } from "express";

import AuthController from "../controllers/authController.js";
import handleAsyncError from "../utilities/handleAsyncErr.js";
import UserController from "../controllers/userController.js";

const router = Router();

router.get(
  "/profile",
  handleAsyncError(AuthController.protect),
  handleAsyncError(UserController.getUserProfile)
);

export default router;
