import type { Database } from "../config/db";
import type { Lead, LeadInput } from "../domain/lead";
import type { User } from "../domain/auth";
import { assertLeadOwner } from "../domain/lead";

type LeadRow = {
  id: number;
  owner_id: string | null;
  data: Omit<Lead, "id" | "ownerId" | "createdAt">;
  created_at: Date;
};
const toLead = (row: LeadRow): Lead => ({
  ...row.data,
  id: row.id,
  ownerId: row.owner_id,
  createdAt: row.created_at.toISOString(),
});
export class LeadRepository {
  constructor(private readonly sql: Database) {}
  async create(input: LeadInput, user: User): Promise<Lead> {
    const data = { ...input, email: user.email, status: "pending", kycStep: 1 };
    const [row] = await this.sql<
      LeadRow[]
    >`INSERT INTO app_leads (owner_id,data) VALUES (${user.id}, ${this.sql.json(data)}) RETURNING *`;
    return toLead(row!);
  }
  async list(user: User, page: number) {
    const rows =
      user.role === "admin"
        ? await this.sql<
            LeadRow[]
          >`SELECT * FROM app_leads ORDER BY id DESC LIMIT 50 OFFSET ${(page - 1) * 50}`
        : await this.sql<
            LeadRow[]
          >`SELECT * FROM app_leads WHERE owner_id = ${user.id} ORDER BY id DESC LIMIT 50 OFFSET ${(page - 1) * 50}`;
    // Lists exclude identity and income data; details enforce the same ownership policy.
    return rows.map((row) => {
      const { nik, monthlyIncome, notes, ...summary } = toLead(row);
      return summary;
    });
  }
  async get(id: number, user: User) {
    const [row] = await this.sql<LeadRow[]>`SELECT * FROM app_leads WHERE id = ${id}`;
    const lead = row ? toLead(row) : undefined;
    assertLeadOwner(lead, user);
    return lead;
  }
  async update(id: number, user: User, action: string, operation: (lead: Lead) => Lead) {
    const result = await this.sql.begin(async (tx) => {
      const [row] = await tx<LeadRow[]>`SELECT * FROM app_leads WHERE id = ${id} FOR UPDATE`;
      const lead = row ? toLead(row) : undefined;
      assertLeadOwner(lead, user);
      const updated = operation(lead);
      const { id: _, ownerId: __, createdAt: ___, ...data } = updated;
      await tx`UPDATE app_leads SET data = ${tx.json(JSON.parse(JSON.stringify(data)))} WHERE id = ${id}`;
      await tx`INSERT INTO app_audit_events (actor_id,action,resource_id) VALUES (${user.id},${action},${String(id)})`;
      return { value: updated };
    });
    return (result as { value: Lead }).value;
  }
  async contacts(page: number) {
    const rows = await this
      .sql`SELECT id, data, created_at FROM app_contacts ORDER BY created_at DESC, id LIMIT 50 OFFSET ${(page - 1) * 50}`;
    return rows.map((row) => ({
      ...row.data,
      id: row.id,
      createdAt: row.created_at.toISOString(),
    }));
  }
  async contact(data: Omit<LeadInput, "phone"> & { phone?: string }) {
    const reference = crypto.randomUUID();
    await this
      .sql`INSERT INTO app_contacts (id,data) VALUES (${reference},${this.sql.json({ ...data })})`;
    return reference;
  }
}
