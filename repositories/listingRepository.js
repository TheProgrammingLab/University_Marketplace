import pool from "../db/pg.js";

export default class ListingRepository {
  static async getAllListings(db = pool) {
    const query = `
        SELECT * FROM listings
        `;

    const { rows } = await db.query(query);

    return rows;
  }
  static async getListing(listingId, db = pool) {
    const query = `
        SELECT * FROM listings WHERE id = $1
        `;

    const { rows } = await db.query(query, [listingId]);

    return rows[0];
  }

  static async getAllListingImages(db = pool) {
    const query = `
    SELECT listing_id, url FROM listing_images
    `;

    const { rows } = await db.query(query);

    return rows;
  }

  static async getListingImages(listingId, db = pool) {
    const query = `
    SELECT listing_id, url FROM listing_images WHERE list_id = $1
    `;

    const { rows } = await db.query(query, [listingId]);

    return rows;
  }
}
