import { Router } from "express";
import handleAsyncError from "../utilities/handleAsyncErr.js";
import AuthController from "../controllers/authController.js";
import ListingController from "../controllers/listingController.js";

const router = Router();

router.get(
  "/",
  handleAsyncError(AuthController.protect),
  handleAsyncError(ListingController.getAllListings),
);

export default router;
