import ListingService from "../services/listingService.js";

export default class ListingController {
  static async getAllListings(req, res, next) {
    const listings = await ListingService.getAllListings();
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
