import pool from "../db/pg.js";
import ListingRepository from "../repositories/listingRepository.js";

export default class ListingService {
  static async getAllListings() {
    return await ListingRepository.getAllListings();
  }

  static async getListings(listingId) {
    return await ListingRepository.getListing(listingId);
  }

  static async getAllListingImages() {
    return await ListingRepository.getAllListingImages();
  }

  static async getListingImages(listingId) {
    return await ListingRepository.getListingImages(listingId);
  }

  static async getAllListingData() {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const allListings = await ListingService.getAllListings(client);
      const allListingImages = await ListingService.getAllListingImages(client);

      return { allListings, allListingImages };
    } catch (err) {
      await client.query("ROLLBACK");

      console.log("Cannot fetch posts data");
      throw err;
    } finally {
      client.release();
    }
  }

  static async getListingData(listingId) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const listing = await ListingService.getListings(listingId, client);
      const listingImages = await ListingService.getAllListingImages(listingId, client);

      return { listing, listingImages };
    } catch (err) {
      await client.query("ROLLBACK");

      console.log("Cannot fetch posts data");
      throw err;
    } finally {
      client.release();
    }
  }
}
