import type { Database } from "../config/db";
import type { TransactionSql } from "postgres";
import { ContentState } from "./content-state";
export type Connection = Database | TransactionSql;
export const contentTables = [
  {
    key: "categories",
    table: "categories",
    fields: ["slug", "name", "description", "icon"],
    jsonFields: [],
  },
  {
    key: "faqCategories",
    table: "faq_categories",
    fields: ["name", "description", "isInvestor"],
    jsonFields: [],
  },
  {
    key: "products",
    table: "products",
    fields: [
      "categoryId",
      "categorySlug",
      "name",
      "provider",
      "logo",
      "description",
      "minAmount",
      "maxAmount",
      "minTenorMonths",
      "maxTenorMonths",
      "interestRateAnnual",
      "adminFee",
      "rating",
      "shariaAccredited",
      "contractType",
      "features",
      "applyUrl",
      "isFeatured",
      "targetAudience",
    ],
    jsonFields: ["features"],
  },
  {
    key: "faqs",
    table: "faqs",
    fields: ["categoryId", "categoryName", "isInvestor", "question", "answer"],
    jsonFields: [],
  },
  {
    key: "blogPosts",
    table: "blog_posts",
    fields: [
      "slug",
      "title",
      "content",
      "excerpt",
      "photo",
      "author",
      "authorRole",
      "category",
      "publishedAt",
      "date",
      "readTimeMinutes",
      "readTime",
      "featured",
      "summary",
      "takeaway",
    ],
    jsonFields: ["content"],
  },
  {
    key: "personil",
    table: "personil",
    fields: ["fullName", "jobLevel", "jobTitle", "biography", "photo", "department", "education"],
    jsonFields: [],
  },
  {
    key: "stats",
    table: "stats",
    fields: ["title", "amount", "unit", "icon", "subtitle"],
    jsonFields: [],
  },
] as const;
export const leadFields = [
  "fullName",
  "email",
  "phone",
  "needCategory",
  "targetAmount",
  "targetTenorMonths",
  "notes",
  "nik",
  "employmentType",
  "monthlyIncome",
  "status",
  "kycStep",
  "submittedAt",
  "reviewedAt",
  "reviewedBy",
  "reviewNote",
  "dateOfBirth",
  "address",
  "legacyReference",
];
export const columnName = (field: string) => field.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
export function decodeFields(row: Record<string, unknown>, fields: readonly string[]) {
  return Object.fromEntries(
    fields
      .filter((f) => row[columnName(f)] !== null && row[columnName(f)] !== undefined)
      .map((f) => [f, row[columnName(f)]]),
  );
}
export function encodeFields(data: Record<string, unknown>, fields: readonly string[]) {
  return Object.fromEntries(fields.map((f) => [columnName(f), data[f] ?? null]));
}
export async function readContent(tx: Connection, data: Record<string, unknown>) {
  const state = new ContentState(data);
  for (const definition of contentTables) {
    const rows = await tx`SELECT * FROM ${tx(definition.table)} ORDER BY position, id`;
    Object.assign(state, {
      [definition.key]: rows.map((row) => ({
        ...row.extra,
        id: row.id,
        ...decodeFields(row, definition.fields),
      })),
    });
  }
  return state;
}
export async function writeContent(tx: Connection, state: ContentState, previous?: ContentState) {
  // Parent/child constraints are deferred so a reset can replace collections atomically.
  for (const definition of contentTables) {
    const items = state[definition.key] as unknown as Record<string, unknown>[];
    const before = previous?.[definition.key] as unknown as Record<string, unknown>[] | undefined;
    const old = new Map(before?.map((item, position) => [item.id, { item, position }]));
    const ids = items.map((item) => item.id as number);
    if (ids.length) await tx`DELETE FROM ${tx(definition.table)} WHERE id NOT IN ${tx(ids)}`;
    else await tx`DELETE FROM ${tx(definition.table)}`;
    for (const [position, item] of items.entries()) {
      const existing = old.get(item.id);
      if (existing?.position === position && JSON.stringify(existing.item) === JSON.stringify(item))
        continue;
      const fields = encodeFields(item, definition.fields);
      for (const field of definition.jsonFields)
        fields[columnName(field)] = item[field] == null ? null : tx.json(item[field] as never);
      const extra = Object.fromEntries(
        Object.entries(item).filter(
          ([key]) => key !== "id" && !(definition.fields as readonly string[]).includes(key),
        ),
      );
      const record = { id: item.id, position, ...fields, extra: tx.json(extra as never) };
      await tx`INSERT INTO ${tx(definition.table)} ${tx(record as never)} ON CONFLICT (id) DO UPDATE SET ${tx({ ...fields, position, extra: tx.json(extra as never) } as never)}`;
    }
  }
  const settings = JSON.parse(JSON.stringify(state));
  for (const { key } of contentTables) delete settings[key];
  await tx`UPDATE app_content SET data = ${tx.json(settings)} WHERE id = 1`;
}
