import { connectDatabase, type Database } from "../config/db";
import seed from "./content-seed.json";
import { ContentState } from "./content-state";
import { encodeFields, leadFields, writeContent } from "./domain-tables";

export async function migrateDatabase(sql: Database) {
  const initial = await Bun.file(
    new URL("../../migrations/001_secure_storage.sql", import.meta.url),
  ).text();
  const domains = await Bun.file(
    new URL("../../migrations/002_domain_tables.sql", import.meta.url),
  ).text();
  await sql.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(78132591)`;
    await tx`CREATE TABLE IF NOT EXISTS app_migrations (version integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`;
    const applied = await tx`SELECT version FROM app_migrations`;
    const versions = new Set(applied.map((row) => row.version));
    if (!versions.has(1)) {
      await tx.unsafe(initial);
      await tx`INSERT INTO app_content (id, data) VALUES (1, ${tx.json(JSON.parse(JSON.stringify(new ContentState(seed))))}) ON CONFLICT DO NOTHING`;
      await tx`INSERT INTO app_migrations (version) VALUES (1)`;
    }
    if (!versions.has(2)) {
      // Fail on conflicting tables instead of silently overwriting another schema.
      await tx.unsafe(domains);
      const [row] = await tx`SELECT data FROM app_content WHERE id = 1 FOR UPDATE`;
      await writeContent(tx, new ContentState(row!.data));
      const leads = await tx`SELECT id, data FROM leads`;
      for (const lead of leads) {
        await tx`UPDATE leads SET ${tx(encodeFields(lead.data, leadFields) as never)} WHERE id = ${lead.id}`;
        await tx`UPDATE leads SET legacy_payload = ${tx.json(lead.data)} WHERE id = ${lead.id}`;
      }
      await tx`ALTER TABLE leads DROP COLUMN data`;
      await tx`ALTER TABLE leads ADD CONSTRAINT leads_status CHECK (status IN ('pending','submitted','verified','rejected'))`;
      await tx`ALTER TABLE leads ALTER COLUMN status SET NOT NULL`;
      await tx`ALTER TABLE leads ALTER COLUMN full_name SET NOT NULL`;
      await tx`ALTER TABLE leads ALTER COLUMN email SET NOT NULL`;
      await tx`ALTER TABLE leads ALTER COLUMN phone SET NOT NULL`;
      await tx`INSERT INTO app_migrations (version) VALUES (2)`;
    }
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
