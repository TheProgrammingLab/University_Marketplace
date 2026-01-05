import crypto from "crypto";
import OtpRepository from "../repositories/otpRepository.js";
import EmailService from "./emailService.js";
import pool from "../db/pg.js";
import { AppError } from "../utilities/AppError.js";
import AuthService from "./authService.js";

//Documents steps later(Sighs....)

export default class OtpService {
  static async sendOtp(user, authClient) {
    const client = pool.connect();
    const otpExp = new Date(Date.now() + 15 * 60 * 1000);

    const otp = OtpService.generateOTP();
    const otpHash = OtpService.hashOTP(otp);

    const data = { user_id: user.id, otp_hash: otpHash, expiresAt: otpExp };

    await OtpRepository.createOTP(data, authClient);
    await new EmailService(user).sendOtpMail(otp);
  }

  static async verifyOtp(user_id, otp) {
    const client = await pool.connect();
    const otpHash = this.hashOTP(otp);

    try {
      await client.query("BEGIN");
      const userOtp = await OtpRepository.findOtpById(
        { user_id, otp_hash: otpHash },
        client
      );

      if (!userOtp || userOtp.used) {
        throw new AppError(400, "OTP is invalid or already used.");
      }

      if (userOtp.expires_at < new Date(Date.now())) {
        throw new AppError(400, "OTP code has expired.");
      }

      await OtpRepository.updateOtpStatus({ user_id, otp_hash: otpHash });
      await AuthService.verifyUser(user_id, client);

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      await client.release();
    }
  }

  static generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  static hashOTP(otp) {
    return crypto.createHash("sha256").update(otp).digest("hex");
  }
}
