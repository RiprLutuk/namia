import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be provided in .env");
}

const connectionString = process.env.DATABASE_URL;

let clientInstance: postgres.Sql | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;
let isConnected = false;

try {
  clientInstance = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 3,
    onnotice: () => {}
  });
  dbInstance = drizzle(clientInstance);
} catch (err) {
  console.warn("PostgreSQL connection initialized in offline/fallback mode:", err);
}

export const client = clientInstance;
export const db = dbInstance;
export const isDbConnected = () => isConnected;
export const setDbConnected = (val: boolean) => { isConnected = val; };
