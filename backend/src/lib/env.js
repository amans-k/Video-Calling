import dotenv from "dotenv";

dotenv.config(); // ✅ Loads all environment variables from .env

export const ENV = {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL, // ✅ Added this line
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL,
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_SECRET_KEY: process.env.STREAM_SECRET_KEY,
};
