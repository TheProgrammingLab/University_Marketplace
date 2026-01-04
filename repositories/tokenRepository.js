import pool from "../db/pg.js";

export default class tokenRepository {
  static async createTokenSession({ userId, token, expiresAt }, db = pool) {
    const query = `
        INSERT INTO refresh_tokens (user_id, token, expires_at) 
        VALUES ($1, $2, $3)
        `;
    await db.query(query, [userId, token, expiresAt]);
  }

  // static async createToken(token)
}
