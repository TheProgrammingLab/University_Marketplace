import pool from "../db/pg.js";

export default class PostRepository {
  static async getAllPosts(db = pool) {
    const query = `
        SELECT * FROM posts
        `;

    const { rows } = await db.query(query);

    return rows;
  }

  static async getPostMedias(db = pool) {}
}
