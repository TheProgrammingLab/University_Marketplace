import ProfileRepository from "../repositories/profileRepository.js";
import SettingRepository from "../repositories/settingsRepository.js";

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
}
