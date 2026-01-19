import pool from "../db/pg.js";

export default class TokenRepository {
  static async createTokenSession({ userId, token, expiresAt }, db = pool) {
    const query = `
        INSERT INTO refresh_tokens (user_id, token, expires_at) 
        VALUES ($1, $2, $3)
        `;
    await db.query(query, [userId, token, expiresAt]);
  }

  static async findToken(refreshToken, db = pool) {
    const query = `
    SELECT * FROM refresh_tokens WHERE token = $1
    `;

    const { rows } = await db.query(query, [refreshToken]);

    return rows[0] || null;
  }

  static async deleteRefreshToken(refreshToken, db = pool) {
    const query = `
    SELECT * FROM refresh_tokens WHERE token = $1
    `;

    await db.query(query, [refreshToken]);
  }

  static async revokeRefreshToken(refreshToken, db = pool) {
    const query = `
    UPDATE refresh_tokens
    SET revoked = TRUE
    WHERE token = $1
    `;

    const result = await db.query(query, [refreshToken]);
    return result.rowCount;
  }
}
