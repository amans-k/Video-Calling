import dotenv from "dotenv";

dotenv.config(); // ✅ Loads all environment variables from .env

export const ENV = {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL, // ✅ Added this line
  NODE_ENV: process.env.NODE_ENV || "development",
};
