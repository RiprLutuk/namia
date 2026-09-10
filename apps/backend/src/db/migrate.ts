import { migrate } from "drizzle-orm/postgres-js/migrator";
import { client, db } from "../config/db";
import * as path from "path";

export async function runMigration() {
  console.log("🚀 Starting PostgreSQL schema migration via Drizzle...");
  if (!db || !client) {
    console.error("❌ Cannot migrate: Database connection is not configured.");
    process.exit(1);
  }

  try {
    const migrationsFolder = path.resolve(__dirname, "../../drizzle");
    console.log(`📁 Applying SQL migrations from: ${migrationsFolder}`);
    await migrate(db, { migrationsFolder });
    console.log("✅ Database schema migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (import.meta.main) {
  runMigration();
}
