import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be provided in .env");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schemas/*.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL
  }
});
