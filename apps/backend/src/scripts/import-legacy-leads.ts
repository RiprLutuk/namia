// Legacy ownership is unknown and is never inferred from email.
import { connectDatabase } from "../config/db";
import { importLegacyLeads } from "../db/import-legacy";
const path = process.argv[2];
if (!path) throw new Error("Provide the path to a private legacy CMS backup.");
const legacy = await Bun.file(path).json();
if (!Array.isArray(legacy.leads)) throw new Error("Backup has no leads array");
const sql = connectDatabase(process.env.DATABASE_URL || "");
try {
  const count = await importLegacyLeads(sql, legacy.leads);
  console.log(
    `${count} legacy leads imported with new IDs, original timestamps, no assigned owner, and pending review.`,
  );
} finally {
  await sql.end();
}
