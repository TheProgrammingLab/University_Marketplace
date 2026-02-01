import PostService from "../services/postService.js";
import { filterPostMedia } from "../utilities/helpers.js";

export default class PostController {
  static async getAllPosts(req, res, next) {
    const { allPosts, allPostMedias } = await PostService.getAllPostsData();

    const posts = allPosts.map(post => {
      return { ...post, media: filterPostMedia(allPostMedias, post.id) };
    });

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
