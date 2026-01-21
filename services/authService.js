import bcrypt from "bcrypt";
import AuthRepository from "../repositories/authRepository.js";
import { AppError } from "../utilities/AppError.js";
import SessionService from "./sessionService.js";
import TokenService from "../services/tokenService.js";
import pool from "../db/pg.js";
import OtpService from "./otpService.js";
import PasswordUtil from "../utilities/password.js";
import VerificationRepository from "../repositories/verificationRepository.js";

//Documentation later here too, lol.

class AuthService {
  static async register(data) {
    const client = await pool.connect();
    let user, accessToken, refreshToken;

    try {
      await client.query("BEGIN");

      const passwordHash = await PasswordUtil.hashPassword(data.password);

      user = await AuthRepository.createUser({ ...data, password: passwordHash }, client);

      accessToken = TokenService.generateAccessToken({ id: user.id, role: user.role });
      refreshToken = TokenService.generateRefreshToken();

      const tokenData = { userId: user.id, refreshToken, userAgent: data.userAgent };
      await SessionService.logTokenSession(tokenData, client);

      // const { otp, otp_hash } = await OtpService.generateOTP();
      // await new EmailService(user).sendMail(otp);
      await OtpService.sendOtp(user, client);

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      console.log(err);
      throw err;
    } finally {
      client.release();
    }

    return { user, accessToken, refreshToken };
  }

  static async login({ loginId, password, userAgent }) {
    const client = await pool.connect();
    const user = await AuthRepository.findUserByLoginId(loginId);

    if (!user) {
      throw new AppError(401, "Invalid login credentials");
    }

    const isValid = await PasswordUtil.comparePassword(password, user.password);
    if (!isValid) {
      throw new AppError(401, "Invalid login credentials");
    }

    const accessToken = TokenService.generateAccessToken({
      id: user.id,
      role: user.role,
    });
    const refreshToken = TokenService.generateRefreshToken();

    const tokenData = { userId: user.id, refreshToken, userAgent };
    try {
      await SessionService.logTokenSession(tokenData, client);
      console.log("Token session loggged");
    } catch (err) {
      console.log("Failed to log token session");
      console.log("Error: ", err);
      throw new AppError(500, "Login failed. Please try again later");
    }

    return { user, accessToken, refreshToken };
  }

  static async verifyUser(user_id, client) {
    try {
      await AuthRepository.updateUserVerified(user_id, client);
    } catch (err) {
      console.log("Error: ", err);
      throw new AppError(500, "Failed to update user verification status");
    }
  }

  static async resetPassword({ token, password }) {
    const client = await pool.connect();
    const tokenHash = TokenService.hashToken(token);
    const verificationToken = await VerificationRepository.findTokenByHash(tokenHash);

    if (!verificationToken) {
      throw new AppError(400, "Invalid token");
    }

    if (verificationToken.used) {
      throw new AppError(400, "Verfication link used");
    }

    if (verificationToken.expires_at < Date.now()) {
      throw new AppError(400, "Verification link has expired.");
    }

    const user = await AuthRepository.findUserId(verificationToken.user_id);
    if (!user) {
      throw new AppError(404, "Cannot find user with this verification token");
    }

    //
    const passwordHash = await PasswordUtil.hashPassword(password);
    try {
      await client.query("BEGIN");
      await AuthRepository.updateUserPassword(
        { user_id: user.id, password: passwordHash },
        client
      );
      await VerificationRepository.updateUsedToken(
        { user_id: user.id, token_hash: verificationToken.token_hash },
        client
      );

      await client.query("COMMIT");
    } catch (err) {
      console.log("Error reseting user password: ", err);
      await client.query("ROLLBACK");
      throw new AppError(500, "Failed to reset password. Please try again");
    } finally {
      await client.release();
    }
  }
}

export default AuthService;
