import pool from "../db/pg.js";

export default class VerificationRepository {
  static async createVerificationLink(
    { user_id, token_hash, type, expires_at },
    db = pool
  ) {
    const query = `
    INSERT INTO verification_links (user_id, token_hash, type, expires_at) 
    VALUES ($1, $2, $3, $4)
    `;

    await db.query(query, [user_id, token_hash, type, expires_at]);
  }

  static async findTokenByHash(token_hash, db = pool) {
    const query = `
    SELECT * FROM verification_links
    WHERE token_hash = $1
    `;

    const { rows } = await db.query(query, [token_hash]);
    return rows[0] || null;
  }
}
