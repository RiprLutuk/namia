// Explicit, one-time import. Legacy ownership is unknown and is never inferred from email.
import { connectDatabase } from "../config/db";
const path = process.argv[2];
if (!path) throw new Error("Provide the path to a private legacy CMS backup.");
const legacy = await Bun.file(path).json();
if (!Array.isArray(legacy.leads)) throw new Error("Backup has no leads array");
const sql = connectDatabase(process.env.DATABASE_URL || "");
try {
  await sql.begin(async (tx) => {
    await tx`LOCK TABLE app_leads IN EXCLUSIVE MODE`;
    const [row] = await tx`SELECT count(*)::integer AS count FROM app_leads`;
    if (row!.count !== 0)
      throw new Error("Import requires an empty leads table to prevent duplicate imports.");
    for (const lead of legacy.leads) {
      // Never import an old automatic verification as a trusted verification.
      const data = {
        fullName: lead.fullName,
        email: lead.email,
        phone: lead.phone,
        needCategory: lead.needCategory,
        targetAmount: lead.targetAmount,
        targetTenorMonths: lead.targetTenorMonths,
        notes: lead.notes,
        nik: lead.nik,
        employmentType: lead.employmentType,
        monthlyIncome: lead.monthlyIncome,
        status: "pending",
        kycStep: 1,
        legacyReference: lead.id,
      };
      await tx`INSERT INTO app_leads (owner_id,data) VALUES (NULL,${tx.json(JSON.parse(JSON.stringify(data)))})`;
    }
  });
  console.log("Legacy leads imported with new IDs, no assigned owner, and pending review.");
} finally {
  await sql.end();
}
