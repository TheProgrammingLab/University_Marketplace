import PostRepository from "../repositories/postRepository.js";

export default class PostService {
  static async getAllPosts(client) {
    return await PostRepository.getAllPosts(client);
  }
}
