import bcrypt from "bcrypt";
import AuthRepository from "../repositories/authRepository.js";
import { AppError } from "../utilities/AppError.js";
import TokenService from "./tokenService.js";
import pool from "../db/pg.js";
import OtpService from "./otpService.js";

//Documentation later here too, lol.

class AuthService {
  static async register(data) {
    const client = await pool.connect();
    let user, accessToken, refreshToken;

    try {
      await client.query("BEGIN");
      user = await AuthRepository.createUser(data, client);

      accessToken = TokenService.generateAccessToken({ id: user.id, role: user.role });
      refreshToken = TokenService.generateRefreshToken();

      const tokenData = { userId: user.id, token: refreshToken };
      await TokenService.logTokenSession(tokenData, client);

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

  static async login({ loginId, password }) {
    const client = await pool.connect();
    const user = await AuthRepository.findUserByLoginId(loginId);

    // console.log(user, "user", { loginId, password });
    if (!user) {
      throw new AppError(401, "Invalid login credentials");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AppError(401, "Invalid login credentials");
    }

    const accessToken = TokenService.generateAccessToken({
      id: user.id,
      role: user.role,
    });
    const refreshToken = TokenService.generateRefreshToken();

    const tokenData = { userId: user.id, token: refreshToken };
    try {
      await TokenService.logTokenSession(tokenData, client);
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
}

export default AuthService;
