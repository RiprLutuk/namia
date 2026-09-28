import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { createApp } from "../src/app";
import { connectDatabase } from "../src/config/db";
import { migrateDatabase } from "../src/db/migrate";
import { IdentityRepository } from "../src/repositories/identity";
import { ContentRepository } from "../src/repositories/content";
import { clientIp, RateLimiter } from "../src/middleware/security";
import { sessionCookie } from "../src/services/auth";

if (!process.env.TEST_DATABASE_URL)
  throw new Error(
    "Use bun run test: tests require an isolated TEST_DATABASE_URL, never DATABASE_URL.",
  );
const sql = connectDatabase(process.env.TEST_DATABASE_URL);
const config = { origin: "http://localhost:5173", secureCookies: false, trustedProxies: [] };
const app = createApp(sql, config);
const password = "Audit-test-password-2026!";
let borrower = "",
  other = "",
  lender = "",
  admin = "",
  leadId = 0;
type TestResponse = Omit<Response, "json"> & { json(): Promise<any> };
async function request(
  path: string,
  method = "GET",
  body?: unknown,
  cookie?: string,
  extra: Record<string, string> = {},
): Promise<TestResponse> {
  return (await app.handle(
    new Request(`http://localhost${path}`, {
      method,
      headers: {
        ...(method !== "GET" ? { origin: config.origin, "content-type": "application/json" } : {}),
        ...(cookie ? { cookie } : {}),
        ...extra,
      },
      body: method !== "GET" ? JSON.stringify(body ?? {}) : undefined,
    }),
  )) as TestResponse;
}
async function register(email: string, role: "borrower" | "lender") {
  const response = await request("/api/auth/register", "POST", {
    fullName: "Audit User",
    email,
    password,
    role,
  });
  expect(response.status).toBe(201);
  return response.headers.get("set-cookie")!.split(";")[0]!;
}
beforeAll(async () => {
  await migrateDatabase(sql);
  borrower = await register("borrower@example.invalid", "borrower");
  other = await register("other@example.invalid", "borrower");
  lender = await register("lender@example.invalid", "lender");
  await new IdentityRepository(sql).createAccount(
    "admin@example.invalid",
    "Audit Admin",
    await Bun.password.hash(password),
    "admin",
  );
  const response = await request("/api/auth/login", "POST", {
    email: "admin@example.invalid",
    password,
  });
  admin = response.headers.get("set-cookie")!.split(";")[0]!;
});
afterAll(async () => {
  await sql.end();
});
const leadInput = {
  fullName: "Audit Applicant",
  email: "borrower@example.invalid",
  phone: "081234567890",
  targetAmount: 25000000,
  targetTenorMonths: 12,
};
const kyc = {
  nik: "1234567890123456",
  employmentType: "entrepreneur",
  monthlyIncome: 10000000,
  consent: true,
};

describe("Authentication and access boundaries", () => {
  it("returns no secrets from health and public content", async () => {
    expect(await (await request("/health")).json()).toEqual({ status: "healthy" });
    const data = await (await request("/api/content/all")).json();
    expect(data.data.products.length).toBeGreaterThan(0);
    expect(data.data.leads).toBeUndefined();
  });
  it("stores password hashes and session token digests", async () => {
    const [user] = await sql`SELECT password_hash FROM app_users LIMIT 1`;
    expect(user!.password_hash.startsWith("$argon2id$")).toBe(true);
    const [session] = await sql`SELECT token_hash FROM app_sessions LIMIT 1`;
    expect(session!.token_hash).not.toBe(borrower.split("=")[1]);
    expect(sessionCookie("test", true)).toContain("HttpOnly; SameSite=Lax");
    expect(sessionCookie("test", true)).toContain("Secure");
  });
  it("does not grant admin by registration", async () => {
    expect(
      (
        await request("/api/auth/register", "POST", {
          fullName: "Bad Admin",
          email: "bad@example.invalid",
          password,
          role: "admin",
        })
      ).status,
    ).toBe(422);
  });
  it("rejects wrong passwords without leaking validator input", async () => {
    const response = await request("/api/auth/login", "POST", {
      email: "admin@example.invalid",
      password: "wrong-password-2026",
    });
    expect(response.status).toBe(401);
    expect(await response.text()).not.toContain(password);
  });
  it("rejects missing, forged, and substring origins", async () => {
    for (const origin of [
      "",
      "https://namia.id.attacker.invalid",
      "http://localhost:5173.attacker.invalid",
    ]) {
      expect(
        (
          await request("/api/content/site-settings", "PUT", { tagline: "unauthorized" }, admin, {
            origin,
          })
        ).status,
      ).toBe(403);
    }
  });
  it("rejects anonymous CMS writes including former key and UA bypasses", async () => {
    for (const headers of [
      {},
      { "user-agent": "Bun" },
      { "x-api-key": "namia-secure-internal-api-key-2026" },
    ] as Record<string, string>[]) {
      expect(
        (await request("/api/content/site-settings", "PUT", { tagline: "bad" }, undefined, headers))
          .status,
      ).toBe(401);
    }
  });
  it("denies borrower CMS changes and reset", async () => {
    expect((await request("/api/content/hero", "PUT", { title: "bad" }, borrower)).status).toBe(
      403,
    );
    expect((await request("/api/content/reset", "POST", {}, borrower)).status).toBe(403);
  });
  it("accepts admin changes and reads the committed result", async () => {
    expect(
      (await request("/api/content/site-settings", "PUT", { tagline: "Approved content" }, admin))
        .status,
    ).toBe(200);
    expect((await (await request("/api/content/site-settings")).json()).data.tagline).toBe(
      "Approved content",
    );
  });
  it("rejects anonymous private reads and lead creation", async () => {
    expect((await request("/api/leads")).status).toBe(401);
    expect((await request("/api/leads/1")).status).toBe(401);
    expect((await request("/api/leads", "POST", leadInput)).status).toBe(401);
  });
});

describe("Lead ownership and KYC workflow", () => {
  it("creates an owned lead with a database-generated ID", async () => {
    const response = await request("/api/leads", "POST", leadInput, borrower);
    expect(response.status).toBe(201);
    leadId = (await response.json()).data.id;
    expect(leadId).toBeGreaterThan(0);
  });
  it("prevents another user from reading or updating the lead", async () => {
    expect((await request(`/api/leads/${leadId}`, "GET", undefined, other)).status).toBe(404);
    expect((await request(`/api/leads/${leadId}/kyc`, "PATCH", kyc, other)).status).toBe(404);
    expect((await (await request("/api/leads", "GET", undefined, other)).json()).data).toHaveLength(
      0,
    );
  });
  it("rejects lender access to borrower data", async () => {
    expect((await request("/api/leads", "GET", undefined, lender)).status).toBe(403);
  });
  it("rejects step-only verification and incomplete identity", async () => {
    expect((await request(`/api/leads/${leadId}/kyc`, "PATCH", { step: 4 }, borrower)).status).toBe(
      422,
    );
    expect(
      (
        await request(
          `/api/leads/${leadId}/kyc`,
          "PATCH",
          { ...kyc, nik: "abcdefghijklmnop" },
          borrower,
        )
      ).status,
    ).toBe(422);
  });
  it("submits complete KYC without marking it verified", async () => {
    const response = await request(`/api/leads/${leadId}/kyc`, "PATCH", kyc, borrower);
    expect(response.status).toBe(200);
    expect((await response.json()).data.status).toBe("submitted");
  });
  it("requires an admin and a review note for verification", async () => {
    const body = { decision: "verified", note: "Identity independently reviewed" };
    expect((await request(`/api/leads/${leadId}/review`, "POST", body, borrower)).status).toBe(403);
    expect(
      (
        await request(
          `/api/leads/${leadId}/review`,
          "POST",
          { decision: "verified", note: "" },
          admin,
        )
      ).status,
    ).toBe(422);
    expect((await request(`/api/leads/${leadId}/review`, "POST", body, admin)).status).toBe(200);
    const [event] = await sql`SELECT * FROM app_audit_events WHERE action = 'kyc.verified'`;
    expect(event!.resource_id).toBe(String(leadId));
  });
  it("prevents changes after verification and hides PII in lists", async () => {
    expect((await request(`/api/leads/${leadId}/kyc`, "PATCH", kyc, borrower)).status).toBe(409);
    const data = (await (await request("/api/leads", "GET", undefined, admin)).json()).data;
    expect(data[0].nik).toBeUndefined();
    expect(data[0].monthlyIncome).toBeUndefined();
  });
  it("keeps contacts separate from authenticated applications", async () => {
    const response = await request("/api/contacts", "POST", {
      fullName: "Contact Sender",
      email: "contact@example.invalid",
      notes: "Contact message",
    });
    expect(response.status).toBe(201);
    expect((await response.json()).data.reference).toBeString();
    expect((await (await request("/api/leads", "GET", undefined, admin)).json()).data).toHaveLength(
      1,
    );
  });
  it("keeps the contact inbox private to admins", async () => {
    expect((await request("/api/contacts")).status).toBe(401);
    expect((await request("/api/contacts", "GET", undefined, borrower)).status).toBe(403);
    const response = await request("/api/contacts", "GET", undefined, admin);
    expect(response.status).toBe(200);
    expect((await response.json()).data[0].notes).toBe("Contact message");
  });
  it("allocates distinct IDs across new app instances", async () => {
    const fresh = createApp(sql, config);
    const response = (await fresh.handle(
      new Request("http://localhost/api/leads", {
        method: "POST",
        headers: { origin: config.origin, "content-type": "application/json", cookie: borrower },
        body: JSON.stringify(leadInput),
      }),
    )) as TestResponse;
    expect(response.status).toBe(201);
    expect((await response.json()).data.id).toBeGreaterThan(leadId);
  });
});

describe("Persistence, rate limiting and public features", () => {
  it("rolls back a content mutation when an operation fails", async () => {
    const repository = new ContentRepository(sql);
    await expect(
      repository.write((state) => {
        state.siteSettings.tagline = "Must roll back";
        throw new Error("Failed write");
      }),
    ).rejects.toThrow();
    expect(await repository.read((state) => state.siteSettings.tagline)).toBe("Approved content");
  });
  it("serializes concurrent writes and preserves IDs after restart", async () => {
    const a = new ContentRepository(sql),
      b = new ContentRepository(sql);
    const ids = await Promise.all(
      [a, b].map((repository) =>
        repository.write((state) => {
          const id = state.nextId("stats");
          state.stats.push({ id, title: "Audit", amount: "0", unit: "", icon: "" });
          return id;
        }),
      ),
    );
    expect(new Set(ids).size).toBe(2);
    expect(
      await new ContentRepository(sql).write((state) => state.nextId("stats")),
    ).toBeGreaterThan(Math.max(...ids));
  });
  it("preserves intentionally empty collections", async () => {
    await new ContentRepository(sql).write((state) => {
      state.testimonials = [];
    });
    expect(await new ContentRepository(sql).read((state) => state.testimonials)).toHaveLength(0);
  });
  it("does not trust forwarded IPs from an untrusted peer", () => {
    const headers = new Headers({ "x-forwarded-for": "8.8.8.8", "x-real-ip": "9.9.9.9" });
    expect(clientIp("127.0.0.2", headers, [])).toBe("127.0.0.2");
    expect(clientIp("127.0.0.1", headers, ["127.0.0.1"])).toBe("9.9.9.9");
  });
  it("shares atomic rate limits across instances", async () => {
    const key = crypto.randomUUID();
    expect((await new RateLimiter(sql).consume(key, 1)).allowed).toBe(true);
    expect((await new RateLimiter(sql).consume(key, 1)).allowed).toBe(false);
  });
  it("serves honest unavailable metrics", async () => {
    const data = (await (await request("/api/content/live-stats")).json()).data;
    expect(data.status).toBe("UNAVAILABLE");
    expect(data.totalDisbursed).toBeUndefined();
  });
  it("preserves public aggregator and calculator behavior", async () => {
    const products = (await (await request("/api/aggregator/products?search=murabahah")).json())
      .data;
    expect(products.length).toBeGreaterThan(0);
    const loan = await (
      await request("/api/calculator/loan", "POST", {
        amount: 12000000,
        tenorMonths: 12,
        marginAnnualPercent: 10,
        contractType: "Murabahah",
      })
    ).json();
    expect(loan.data.monthlyInstallment).toBe(1100000);
  });
  it("rejects stored XSS and executable CMS URLs", async () => {
    const response = await request(
      "/api/content/faqs",
      "POST",
      {
        categoryId: 1,
        categoryName: "Audit",
        isInvestor: 0,
        question: "Test",
        answer: '<img src=x onerror="alert(1)">',
      },
      admin,
    );
    expect(response.status).toBe(422);
    expect(
      (await request("/api/content/hero", "PUT", { primaryCtaUrl: "javascript:alert(1)" }, admin))
        .status,
    ).toBe(422);
  });
  it("reports failed database writes and preserves the previous state", async () => {
    await sql.unsafe(`CREATE FUNCTION reject_content_write() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'simulated disk failure'; END; $$;
      CREATE TRIGGER reject_content_write BEFORE UPDATE ON app_content FOR EACH ROW EXECUTE FUNCTION reject_content_write()`);
    try {
      const response = await request(
        "/api/content/site-settings",
        "PUT",
        { tagline: "Must not commit" },
        admin,
      );
      expect(response.status).toBe(503);
      expect(await response.text()).not.toContain("simulated disk failure");
      expect(await new ContentRepository(sql).read((state) => state.siteSettings.tagline)).toBe(
        "Approved content",
      );
    } finally {
      await sql.unsafe(
        "DROP TRIGGER reject_content_write ON app_content; DROP FUNCTION reject_content_write()",
      );
    }
  });
  it("rejects unsafe investor content shape", async () => {
    expect(
      (await request("/api/content/investor", "PUT", { pillars: "invalid" }, admin)).status,
    ).toBe(422);
  });
  it("revokes sessions on logout", async () => {
    expect((await request("/api/auth/logout", "POST", {}, lender)).status).toBe(200);
    expect((await request("/api/auth/me", "GET", undefined, lender)).status).toBe(401);
  });
  it("does not accept expired sessions", async () => {
    await sql`UPDATE app_sessions SET expires_at = now() - interval '1 second'`;
    expect((await request("/api/auth/me", "GET", undefined, borrower)).status).toBe(401);
  });
});
