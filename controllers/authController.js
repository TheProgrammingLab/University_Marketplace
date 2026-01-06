import AuthRepository from "../repositories/authRepository.js";
import AuthService from "../services/authService.js";
import OtpService from "../services/otpService.js";
import TokenService from "../services/tokenService.js";
import verificationService from "../services/verificationService.js";
import { AppError } from "../utilities/AppError.js";
import PasswordUtil from "../utilities/password.js";

//Documentation ooooooooooooo

const cookieOptions = {
  httpOnly: true, // JS cannot access (XSS protection)
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "strict", // Prevent CSRF (use "lax" if cross-site auth)
  maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
  path: "/auth/refresh",
};

class AuthController {
  static async register(req, res, next) {
    const {
      email,
      username = null,
      password,
      first_name,
      last_name,
      role = "",
    } = req.body ?? {};

    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new AppError(400, "Request body is required"));
    }

    if (!email || !password || !first_name || !last_name || !role) {
      return next(
        new AppError(
          400,
          "Missing some or all required fields: [email, password, first_name, last_name, role]"
        )
      );
    }

    const { validatePassword, isPasswordValid } = PasswordUtil;
    const passwordValDetails = validatePassword(password);
    const isPassValid = isPasswordValid(password);

    const passErrStr = JSON.stringify(passwordValDetails);

    if (!isPassValid) {
      return next(new AppError(400, "Password validation failed: " + passErrStr));
    }

    //Handles invalid role being passed.
    if (!["MERCHANT", "USER"].includes(role)) {
      return next(new AppError(400, "Invalid role data, must be 'MERCHANT' or 'USER' "));
    }

    // Handle password length.

    const { user, accessToken, refreshToken } = await AuthService.register({
      email,
      username,
      password,
      first_name,
      last_name,
      role,
    });

    res
      .status(201)
      .cookie("refresh_token", refreshToken, cookieOptions)
      .json({ status: "success", data: { user, token: accessToken } });
  }

  static async login(req, res, next) {
    const { loginId, password } = req.body ?? {};

    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new AppError(400, "Request body is required"));
    }

    if (!loginId || !password) {
      return next(new AppError(400, "Missing loginId or password"));
    }

    const { user, accessToken, refreshToken } = await AuthService.login({
      loginId,
      password,
    });

    const { password: userPass, ...userData } = user;

    res
      .status(200)
      .cookie("refresh_token", refreshToken, cookieOptions)
      .json({ status: "success", data: { user: userData, token: accessToken } });
  }

  static async logout(req, res, next) {}

  static async sendVerificationOtp(req, res, next) {
    const user = await AuthRepository.findUserId(req.user.id);

    if (!user) {
      return next(new AppError(400, "Cannot find user"));
    }

    try {
      await OtpService.sendOtp(user);
    } catch (err) {
      console.log(err);
      return next(new AppError(500, "Failed to resend OTP. Please try again."));
    }

    res
      .status(200)
      .json({ status: "success", message: "OTP has been resend successfully" });
  }

  static async verifyOtp(req, res, next) {
    if (!req.body || Object.keys(req.body).length === 0 || !req.body.otp) {
      return next(new AppError(400, "Missing otp code."));
    }

    try {
      const user = await AuthRepository.findUserId(req.user.id);
      if (user.is_verified) {
        return next(new AppError(400, "OTP already verified."));
      }
    } catch (err) {
      console.log("Error fetching user: ", err);
    }

    //Handle already veridied user

    await OtpService.verifyOtp(req.user.id, req.body.otp.toString());

    res.status(200).json({
      status: "success",
      message: "OTP veriied successfully",
    });
  }

  static async forgotPassword(req, res, next) {
    if (!req.body || Object.keys(req.body).length === 0 || !req.body.email) {
      return next(new AppError(400, "Please provide your email."));
    }

    const user = await AuthRepository.findUserByLoginId(req.body.email);

    if (!user) {
      return next(new AppError(404, "User with that email cannot be found."));
    }

    try {
      await verificationService.sendVerificationLink({
        user,
        type: "FORGOT_PASSWORD",
        req,
      });
    } catch (err) {
      console.log("Error sending verification liink: ", err);
      return next(new AppError(500, "Failed to send verification email"));
    }

    res.status(200).json({
      status: "sucess",
      message: "Verification link has been sent to your email.",
    });
  }

  static async resetPassword(req, res, next) {
    if (!req.params.token) {
      return next(new AppError(400, "Missing verification token."));
    }

    if (!req.body || !req.body.password) {
      return next(new AppError(400, "Missing new password."));
    }
    const token = req.params.token;
    const password = req.body.password;

    const { validatePassword, isPasswordValid } = PasswordUtil;
    const passwordValDetails = validatePassword(password);
    const isPassValid = isPasswordValid(password);

    const passErrStr = JSON.stringify(passwordValDetails);

    if (!isPassValid) {
      return next(new AppError(400, "Password validation failed: " + passErrStr));
    }

    await AuthService.resetPassword({ token, password });

    res.status(200).json({
      status: "success",
      message: "Password reset successful",
    });
  }

  static async protect(req, res, next) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new AppError(401, "No authorization header, please log in to get access")
      );
    }

    const { id, role, exp } = TokenService.verifyAccessToken(token);

    req.user = { id, role };
    next();
  }
}

export default AuthController;
