import MarketplaceService from "../services/marketplaceService.js";

export default class MarketPlaceController {
  static async getAllPostsAndListings(req, res, next) {
    const { posts, listings } = await MarketplaceService.getMarketPlacePostsAndListings();

    const labeledPosts = posts.map(post => {
      return { type: "post", data: post };
    });

    const labeledListings = listings.map(listing => {
      return { type: "listing", data: listing };
    });

    const marketPlaceData = [...labeledPosts, ...labeledListings];

    //algorithm for sorting

    res.status(200).json({
      status: "success",
      data: marketPlaceData,
      meta: {
        page: 0,
        hasNext: false,
      },
    });
  }
}
