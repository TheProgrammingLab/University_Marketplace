import pool from "../db/pg.js";

export default class TokenRepository {
  static async createTokenSession({ userId, token, expiresAt }, db = pool) {
    const query = `
        INSERT INTO refresh_tokens (user_id, token, expires_at) 
        VALUES ($1, $2, $3)
        `;
    await db.query(query, [userId, token, expiresAt]);
  }

  static async findTokenByUserIdAndToken({ userId, token }, db = pool) {
    const query = `
    SELECT * FROM refresh_tokens WHERE user_id = $1 AND refresh_token = $2
    `;

    const { rows } = await db.query(query, [userId, token]);

    return rows[0] || null;
  }
}
