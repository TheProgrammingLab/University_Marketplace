import crypto from "crypto";
import jwt from "jsonwebtoken";
import TokenRepository from "../repositories/tokenRepository.js";
import { AppError } from "../utilities/AppError.js";

const { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES } = process.env;

export default class TokenService {
  static async logTokenSession({ userId, token }, client) {
    const tokenExp = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const data = { userId, token, expiresAt: tokenExp };

    await TokenRepository.createTokenSession(data, client);
  }

  static async verifyRefreshToken({ userId, refreshToken }) {
    const session = await TokenRepository.findTokenByUserIdAndToken({
      userId,
      token: refreshToken,
    });

    if (!session || new Date() > session.expires_at) {
      return null;
    }

    return session;
  }

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
