// Safe initialization: existing content is never overwritten.
import { connectDatabase } from "../config/db";
import { migrateDatabase } from "./migrate";
if (import.meta.main) {
  const sql = connectDatabase(process.env.DATABASE_URL || "");
  try {
    await migrateDatabase(sql);
  } finally {
    await sql.end();
  }
}
