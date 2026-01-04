import pool from "../db/pg.js";
import VerificationRepository from "../repositories/verificationRepository";
import EmailService from "./emailService";
import TokenService from "./tokenService.js";

export default class verificationService {
  static async sendVerificationLink({ user, type }) {
    const client = await pool.connect();

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const token = TokenService.generateVerificationToken();
    const tokenHash = TokenService.hashToken(token);

    try {
      const url = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/auth/reset-password/${token}`;

      await new EmailService(user).sendPasswordResetMail(url);

      await client.query("BEGIN");
      await VerificationRepository.createVerificationLink(
        { user_id: user.id, token_hash: tokenHash, type, expires_at: expiresAt },
        client
      );

      await client.query("COMMIT");
    } catch (err) {
      console.log("Error verifying link: ", err);
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}
