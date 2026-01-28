import ListingService from "./listingService.js";
import PostService from "./postService.js";

export default class MarketplaceService {
  static async getMarketPlacePostsAndListings() {
    const posts = await PostService.getAllPosts();
    const listings = await ListingService.getAllListings();

    return { posts, listings };
  }
}
