import UserService from "../services/userService.js";

export default class UserController {
  static async getUserProfile(req, res, next) {
    const profile = await UserService.getUserProfile(req.user.id);

    res.status(200).json({
      status: "sucess",
      profile,
    });
  }
}
