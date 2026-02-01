import pool from "../db/pg.js";
import PostRepository from "../repositories/postRepository.js";

export default class PostService {
  static async getAllPosts() {
    return await PostRepository.getAllPosts();
  }

  static async getPost(postId) {
    return await PostRepository.getPost(postId);
  }

  static async getAllPostMedias() {
    return await PostRepository.getAllPostMedias();
  }

  static async getPostMedias(postId) {
    return await PostRepository.getPostMedias(postId);
  }

  static async getAllPostsData() {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const allPosts = await PostService.getAllPosts(client);
      const allPostMedias = await PostService.getAllPostMedias(client);

      return { allPosts, allPostMedias };
    } catch (err) {
      await client.query("ROLLBACK");

      console.log("Cannot fetch posts data");
      throw err;
    } finally {
      client.release();
    }
  }

  static async getPostData(postId) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const post = await PostService.getPost(postId, client);
      const postMedias = await PostService.getPostMedias(postId, client);

      return { post, postMedias };
    } catch (err) {
      await client.query("ROLLBACK");

      console.log("Cannot fetch post data");
      throw err;
    } finally {
      client.release();
    }
  }
}
