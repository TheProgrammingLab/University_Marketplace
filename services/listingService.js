import ListingRepository from "../repositories/listingRepository.js";

export default class ListingService {
  static async getAllListings(client) {
    return await ListingRepository.getAllListings(client);
  }
}
