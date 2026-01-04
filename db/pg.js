import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const {
  PG_USER,
  PG_PASS,
  PG_HOST,
  PG_PORT,
  PG_DB,
  ENV,
  SUPABASE_DB_CONNECTION_STR,
  SUPABASE_DB_PASS,
} = process.env;
let pool;
if (ENV === "production") {
  const DB_URL = SUPABASE_DB_CONNECTION_STR.replace("<password>", SUPABASE_DB_PASS);
  pool = new Pool({
    connectionString: DB_URL,
    ssl: { rejectUnauthorized: false }, // required for Supabase
  });
} else {
  pool = new Pool({
    user: PG_USER,
    password: PG_PASS,
    host: PG_HOST,
    port: Number(PG_PORT),
    database: PG_DB,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 5000,
  });
}

(async () => {
  try {
    const client = await pool.connect();
    console.log("Postgres db connected successfully");
    client.release();
  } catch (err) {
    console.log(`pg database connection failed`, err);
    process.exit(1);
  }
})();

pool.on("error", err => {
  console.error("Unexpected PG error", err);
  process.exit(1);
});

// pool
//   .connect()
//   .then(client => {
//     console.log("pg databse connected successfully");
//     client.release();
//   })
//   .catch(err => {
//     console.log(`pg database connection failed`, err);
//     process.exit(1);
//   });

export default pool;
