import type { Database } from "../config/db";
import { encodeFields, leadFields } from "./domain-tables";

export async function importLegacyLeads(sql: Database, leads: Record<string, unknown>[]) {
  return sql.begin(async (tx) => {
    await tx`LOCK TABLE leads IN EXCLUSIVE MODE`;
    const [row] = await tx`SELECT count(*)::integer AS count FROM leads`;
    if (row!.count !== 0)
      throw new Error("Import requires an empty leads table to prevent duplicate imports.");
    for (const lead of leads) {
      if (
        ![lead.fullName, lead.email, lead.phone].every(
          (value) => typeof value === "string" && value.trim(),
        )
      )
        throw new Error("Legacy lead is missing required identity fields. Import rolled back.");
      const createdAt = new Date(String(lead.createdAt));
      if (!Number.isFinite(createdAt.getTime()))
        throw new Error("Legacy lead has an invalid creation date. Import rolled back.");
      const data = {
        ...lead,
        status: "pending",
        kycStep: 1,
        legacyReference: lead.id,
        submittedAt: undefined,
        reviewedAt: undefined,
        reviewedBy: undefined,
        reviewNote: undefined,
      };
      await tx`INSERT INTO leads ${tx({
        ...encodeFields(data, leadFields),
        owner_id: null,
        created_at: createdAt,
        legacy_payload: tx.json(lead as never),
      } as never)}`;
    }
    return leads.length;
  });
}
