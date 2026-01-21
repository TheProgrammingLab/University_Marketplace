import pool from "../db/pg.js";

export default class SessionRepository {
  static async createTokenSession(
    { userId, refreshToken, expiresAt, userAgent },
    db = pool
  ) {
    const query = `
        INSERT INTO sessions (user_id, refresh_token, expires_at, user_agent) 
        VALUES ($1, $2, $3, $4)
        `;
    await db.query(query, [userId, refreshToken, expiresAt, userAgent]);
  }

  static async findRefreshToken(refreshToken, db = pool) {
    const query = `
    SELECT * FROM sessions WHERE refresh_token = $1
    `;

    const { rows } = await db.query(query, [refreshToken]);

    return rows[0] || null;
  }

  static async deleteRefreshToken(refreshToken, db = pool) {
    const query = `
    SELECT * FROM sessions WHERE refresh_token = $1
    `;

    await db.query(query, [refreshToken]);
  }

  static async revokeRefreshToken(refreshToken, db = pool) {
    const query = `
    UPDATE sessions
    SET revoked_at = now()
    WHERE refresh_token = $1
    `;

    const result = await db.query(query, [refreshToken]);
    return result.rowCount;
  }
}
