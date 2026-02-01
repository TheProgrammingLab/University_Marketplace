import ListingService from "../services/listingService.js";
import { filterListingImages } from "../utilities/helpers.js";

export default class ListingController {
  static async getAllListings(req, res, next) {
    const { allListings, allListingImages } = await ListingService.getAllListingData();
    console.log(allListingImages);

    const listings = allListings.map(listing => {
      return { ...listing, images: filterListingImages(allListingImages, listing.id) };
    });

    res.status(200).json({
      status: "success",
      data: listings,
      meta: {
        page: 0,
        hasNext: false,
      },
    });
  }
}
