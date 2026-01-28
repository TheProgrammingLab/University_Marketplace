import PostService from "../services/postService.js";

export default class PostController {
  static async getAllPosts(req, res, next) {
    const posts = await PostService.getAllPosts();

    res.status(200).json({
      status: "success",
      data: posts,
      meta: {
        page: 0,
        hasNext: false,
      },
    });
  }
}
