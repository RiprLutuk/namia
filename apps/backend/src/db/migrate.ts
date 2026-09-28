import { connectDatabase, type Database } from "../config/db";
import seed from "./content-seed.json";
import { ContentState } from "./content-state";

export async function migrateDatabase(sql: Database) {
  const migration = await Bun.file(
    new URL("../../migrations/001_secure_storage.sql", import.meta.url),
  ).text();
  await sql.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(78132591)`;
    await tx.unsafe(migration);
    await tx`INSERT INTO app_content (id, data) VALUES (1, ${tx.json(JSON.parse(JSON.stringify(new ContentState(seed))))}) ON CONFLICT DO NOTHING`;
  });
}
if (import.meta.main) {
  const sql = connectDatabase(process.env.DATABASE_URL || "");
  try {
    await migrateDatabase(sql);
    console.log("Database migration complete.");
  } finally {
    await sql.end();
  }
}
