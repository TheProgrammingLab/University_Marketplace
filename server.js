import app from "./app.js";
import dotenv from "dotenv";
import pool from "./db/pg.js";

dotenv.config();

const { HOST, PORT, NODE_ENV } = process.env;

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running port: ${PORT} in ${NODE_ENV}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(1);
  });
});
