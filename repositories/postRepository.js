import pool from "../db/pg.js";

export default class PostRepository {
  static async getAllPosts(db = pool) {
    const query = `
        SELECT * FROM posts
        `;
    const { rows } = await db.query(query);

    return rows;
  }

  static async getPost(postId, db = pool) {
    const query = `
        SELECT * FROM posts WHERE post_id = $1
        `;
    const { rows } = await db.query(query, [postId]);

    return rows[0];
  }

  static async getAllPostMedias(db = pool) {
    const query = `
    SELECT post_id, url, type FROM post_medias
    `;

    const { rows } = await db.query(query);

    return rows;
  }

  static async getPostMedias(postiD, db = pool) {
    const query = `
    SELECT post_id, url, type FROM post_medias WHERE post_id = $1
    `;
    const { rows } = await db.query(query, [postiD]);

    return rows;
  }
}
