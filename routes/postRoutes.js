import { Router } from "express";
import AuthController from "../controllers/authController.js";
import handleAsyncError from "../utilities/handleAsyncErr.js";
import PostController from "../controllers/postController.js";

const router = Router();

router.get(
  "/",
  handleAsyncError(AuthController.protect),
  handleAsyncError(PostController.getAllPosts),
);

export default router;
