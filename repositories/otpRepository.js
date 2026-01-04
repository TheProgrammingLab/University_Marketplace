import pool from "../db/pg.js";

export default class OtpRepository {
  static async createOTP({ user_id, otp_hash, expiresAt }, db = pool) {
    const query = `
    INSERT INTO otps (user_id, otp_hash, expires_at)
    VALUES ($1, $2, $3)
    `;
    await db.query(query, [user_id, otp_hash, expiresAt]);
  }

  static async findOtpById({ user_id, otp_hash }, db = pool) {
    const query = `
    SELECT * FROM otps WHERE user_id = $1 AND otp_hash = $2
    `;

    const { rows } = await db.query(query, [user_id, otp_hash]);
    return rows[0] || null;
  }

  static async updateOtpStatus({ user_id, otp_hash }, db = pool) {
    const query = `
    UPDATE otps
    SET used = TRUE
    WHERE user_id = $1 AND otp_hash = $2
    `;

    await db.query(query, [user_id, otp_hash]);
  }
}
