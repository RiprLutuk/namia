import { test, expect } from "bun:test";
import { temporaryDatabase } from "./database";
import { connectDatabase } from "../src/config/db";
import { migrateDatabase } from "../src/db/migrate";
import { ContentState } from "../src/db/content-state";
import { ContentRepository } from "../src/repositories/content";
import { importLegacyLeads } from "../src/db/import-legacy";

test("upgrade preserves every content field and existing lead, is repeatable, and rolls back invalid relationships", async () => {
  const database = await temporaryDatabase();
  const sql = connectDatabase(database.url);
  try {
    await sql.unsafe(
      await Bun.file(new URL("../migrations/001_secure_storage.sql", import.meta.url)).text(),
    );
    const state = JSON.parse(JSON.stringify(new ContentState()));
    state.products[0].customLegacyField = "preserved";
    state.blogPosts[0].content = ["paragraph one", "paragraph two"];
    await sql`INSERT INTO app_content VALUES (1, ${sql.json(state)})`;
    await sql`INSERT INTO app_leads (data) VALUES (${sql.json({ fullName: "Migration Person", email: "migration@example.invalid", phone: "0800000000", status: "submitted", kycStep: 3, nik: "0000000000000000" })})`;
    await migrateDatabase(sql);
    const repository = new ContentRepository(sql);
    expect(JSON.parse(JSON.stringify(await repository.read((s) => s)))).toEqual(state);
    expect((await sql`SELECT status, nik FROM leads`)[0]).toEqual({
      status: "submitted",
      nik: "0000000000000000",
    });
    await repository.write((s) => {
      s.products[0]!.name = "Persisted domain edit";
    });
    await migrateDatabase(sql);
    expect((await sql`SELECT name FROM products ORDER BY position LIMIT 1`)[0]!.name).toBe(
      "Persisted domain edit",
    );
    const [settings] = await sql`SELECT data FROM app_content`;
    expect(settings!.data.products).toBeUndefined();
    await expect(
      repository.write((s) => {
        s.products[0]!.categoryId = 999999;
      }),
    ).rejects.toThrow();
    expect(await repository.read((s) => s.products[0]!.categoryId)).toBe(
      state.products[0].categoryId,
    );
    await repository.write((s) => {
      s.blogPosts = [];
    });
    expect(await repository.read((s) => s.blogPosts)).toEqual([]);
  } finally {
    await sql.end();
    await database.close();
  }
}, 20000);

test("legacy import is atomic, retains original data and dates, removes trusted verification, and refuses repeat import", async () => {
  const database = await temporaryDatabase();
  const sql = connectDatabase(database.url);
  const lead = {
    id: 99,
    fullName: "Legacy Person",
    email: "legacy@example.invalid",
    phone: "0800000000",
    createdAt: "2025-01-01T00:00:00.000Z",
    status: "verified",
    kycStep: 4,
    address: "Synthetic address",
    dateOfBirth: "1990-01-01",
  };
  try {
    await migrateDatabase(sql);
    await expect(importLegacyLeads(sql, [lead, { ...lead, phone: "" }])).rejects.toThrow();
    expect((await sql`SELECT count(*)::int AS count FROM leads`)[0]!.count).toBe(0);
    await importLegacyLeads(sql, [lead]);
    const [row] = await sql`SELECT * FROM leads`;
    expect(row!.owner_id).toBeNull();
    expect(row!.status).toBe("pending");
    expect(row!.kyc_step).toBe(1);
    expect(row!.legacy_payload).toEqual(lead);
    expect(row!.created_at.toISOString()).toBe(lead.createdAt);
    await expect(importLegacyLeads(sql, [lead])).rejects.toThrow();
  } finally {
    await sql.end();
    await database.close();
  }
}, 20000);
