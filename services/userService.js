import ProfileRepository from "../repositories/profileRepository.js";
import SettingRepository from "../repositories/settingsRepository.js";
import { AppError } from "../utilities/AppError.js";

export default class UserService {
  static async createUserProfile(userId, client) {
    try {
      await ProfileRepository.createProfile(userId, client);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async createUserSettings(userId, client) {
    try {
      await SettingRepository.createSettings(userId, client);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  static async getUserProfile(userId) {
    try {
      return await ProfileRepository.getUserProfile(userId);
    } catch (err) {
      console.log(err);
      throw new AppError(500, "Failed to fetch user profile.");
    }
  }
}
