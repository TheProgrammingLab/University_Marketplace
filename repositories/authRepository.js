import pool from "../db/pg.js";
import bcrypt from "bcrypt";

// const exclude = ['password', 'secret_token'];
// const allColumns = ['id','email','username','password','secret_token','created_at'];
// const columns = allColumns.filter(c => !exclude.includes(c)).join(', ');

class AuthRepository {
  static async createUser(
    { email, username, password, first_name, last_name, role },
    db = pool
  ) {
    const query = `
        INSERT INTO users (email, username, password, first_name, last_name, role)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email, username, first_name, last_name, role, is_verified, created_at
        `;
    const values = [email, username, password, first_name, last_name, role];
    const { rows } = await db.query(query, values);

    return rows[0];
  }

  static async findUserByLoginId(loginId, db = pool) {
    const query = `
    SELECT id, email, username, first_name, last_name, role, is_verified, created_at, password FROM users WHERE email = $1 OR username = $1 
    `;
    // console.log(loginId, "loginId");
    const { rows } = await db.query(query, [loginId]);
    return rows[0] || null;
  }

  static async findUserId(user_id, db = pool) {
    const query = `
    SELECT id, email, username, first_name, last_name, role, is_verified, created_at FROM users WHERE id = $1 
    `;
    const { rows } = await db.query(query, [user_id]);
    return rows[0] || null;
  }

  static async updateUserVerified(user_id, db = pool) {
    const query = ` 
    UPDATE users
    SET is_verified = TRUE
    WHERE id = $1
    `;
    await db.query(query, [user_id]);
  }

  static async updateUserPassword({ user_id, password }, db = pool) {
    const query = ` 
    UPDATE users
    SET password = $1
    WHERE id = $2
    `;
    await db.query(query, [password, user_id]);
  }
}

export default AuthRepository;
