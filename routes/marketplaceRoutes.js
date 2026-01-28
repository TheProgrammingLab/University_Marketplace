import { Router } from "express";
import AuthController from "../controllers/authController.js";
import handleAsyncError from "../utilities/handleAsyncErr.js";
import MarketPlaceController from "../controllers/marketplaceController.js";

const router = Router();

router.get(
  "/",
  handleAsyncError(AuthController.protect),
  MarketPlaceController.getAllPostsAndListings,
);

export default router;
