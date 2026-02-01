import MarketplaceService from "../services/marketplaceService.js";
import { filterPostMedia, filterListingImages } from "../utilities/helpers.js";

export default class MarketPlaceController {
  static async getAllPostsAndListings(req, res, next) {
    const { posts, listings } = await MarketplaceService.getMarketPlacePostsAndListings();

    const { allPosts, allPostMedias } = posts;
    const { allListings, allListingImages } = listings;

    const labeledPosts = allPosts.map(post => {
      return {
        type: "post",
        data: { ...post, media: filterPostMedia(allPostMedias, post.id) },
      };
    });

    const labeledListings = allListings.map(listing => {
      return {
        type: "listing",
        data: {
          ...listing,
          images: filterListingImages(allListingImages, listing.id),
        },
      };
    });

    const marketPlaceData = [...labeledPosts, ...labeledListings];

    //algorithm for sorting later

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
