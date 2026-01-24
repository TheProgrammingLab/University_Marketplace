import pool from "../db/pg.js";

export default class ProfileRepository {
  static async createProfile(userId, db = pool) {
    const query = `
    INSERT INTO user_profiles (user_id)
    VALUES ($1)
    `;

    await db.query(query, [userId]);
  }

  static async getUserProfile(userId, db = pool) {
    const query = `
    SELECT u.id, u.first_name, u.last_name, u.username, u.email, p.avatar_url, p.phone
    FROM users u
    INNER JOIN user_profiles p ON p.user_id = u.id
    WHERE u.id = $1
    `;

    const { rows } = await db.query(query, [userId]);
    return rows[0] || null;
  }
}
