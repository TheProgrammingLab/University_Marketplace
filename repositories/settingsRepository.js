import pool from "../db/pg.js";

export default class SettingRepository {
  static async createSettings(userId, db = pool) {
    const query = `
    INSERT INTO user_settings (user_id)
    VALUES ($1)
    `;

    await db.query(query, [userId]);
  }
}
