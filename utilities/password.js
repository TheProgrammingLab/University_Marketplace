// 3. Optional: hash password (backend only!)
import bcrypt from "bcrypt";

export default class PasswordUtil {
  // 1. Validate password strength
  static validatePassword(password) {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }

  // 2. Check if all rules are passed
  static isPasswordValid(password) {
    const rules = PasswordUtil.validatePassword(password);
    return Object.values(rules).every(Boolean);
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}
