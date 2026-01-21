import SessionRepository from "../repositories/sessionRepository.js";

export default class SessionService {
  static async logTokenSession({ userId, refreshToken, userAgent }, client) {
    const tokenExp = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const data = { userId, refreshToken, expiresAt: tokenExp, userAgent };

    await SessionRepository.createTokenSession(data, client);
  }

  static async verifyRefreshToken(refreshToken) {
    const session = await SessionRepository.findRefreshToken(refreshToken);

    if (!session || new Date() > session.expires_at) {
      return null;
    }

    return session;
  }

  static async logoutUserSession(refreshToken) {
    return await SessionRepository.revokeRefreshToken(refreshToken);
  }
}
