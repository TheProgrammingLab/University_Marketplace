import { Router } from "express";
import AuthController from "../controllers/authController.js";
import handleAsyncError from "../utilities/handleAsyncErr.js";
const router = Router();

router.post("/register", handleAsyncError(AuthController.register));
router.post("/login", handleAsyncError(AuthController.login));
router.patch(
  "/verify-otp",
  handleAsyncError(AuthController.protect),
  handleAsyncError(AuthController.verifyOtp)
);
router.post(
  "/resend-otp",
  handleAsyncError(AuthController.protect),
  handleAsyncError(AuthController.sendVerificationOtp)
);

router.post("/forgot-password", handleAsyncError(AuthController.forgotPassword));
router.patch("/reset-password/:token", handleAsyncError(AuthController.resetPassword));

router.get(
  "/refresh",
  handleAsyncError(AuthController.protect),
  handleAsyncError(AuthController.RefreshAcessToken)
);

export default router;
