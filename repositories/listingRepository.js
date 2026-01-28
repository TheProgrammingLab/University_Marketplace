import pool from "../db/pg.js";

export default class ListingRepository {
  static async getAllListings(db = pool) {
    const query = `
        SELECT * FROM listings
        `;

    const { rows } = await db.query(query);

    return rows;
  }

  static async getListingImages(db = pool) {}
}
