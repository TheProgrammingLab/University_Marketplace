import crypto from "crypto";
import jwt from "jsonwebtoken";

const { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES } = process.env;

export default class TokenService {
  static generateAccessToken(payload) {
    return jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRES,
    });
  }

  static generateRefreshToken() {
    return crypto.randomBytes(64).toString("hex");
  }

  static verifyAccessToken(token) {
    return jwt.verify(token, JWT_ACCESS_SECRET);
  }

  static generateVerificationToken() {
    return crypto.randomBytes(64).toString("hex");
  }

  static hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}
