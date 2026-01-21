import pool from "../db/pg";

class ProfileRepository {
  static async createUserProfile(db = pool) {
    const query = `
    INSERT INTO user_profiles ()
    `;
  }
}
