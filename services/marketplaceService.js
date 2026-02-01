import ListingService from "./listingService.js";
import PostService from "./postService.js";

export default class MarketplaceService {
  static async getMarketPlacePostsAndListings() {
    const posts = await PostService.getAllPostsData();
    const listings = await ListingService.getAllListingData();

    return { posts, listings };
  }
}
