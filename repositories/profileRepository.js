import pool from "../db/pg.js";

export default class ProfileRepository {
  static async createProfile(userId, db = pool) {
    const query = `
    INSERT INTO user_profiles (user_id)
    VALUES ($1)
    `;

    await db.query(query, [userId]);
  }
}
