import { describe, expect, it } from "bun:test";
import { app, NAMIA_API_KEY } from "../src/index";

describe("Namia Syariah Global Fintech Elysia API", () => {
  it("GET / returns status online", async () => {
    const res = await app.handle(new Request("http://localhost:3000/"));
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.status).toBe("online");
  });

  it("GET /health returns healthy status", async () => {
    const res = await app.handle(new Request("http://localhost:3000/health"));
    expect(res.status).toBe(200);
    const json = (await res.json()) as any;
    expect(json.status).toBe("healthy");
  });

  describe("Aggregator Engine", () => {
    it("GET /api/aggregator/categories returns categories", async () => {
      const res = await app.handle(new Request("http://localhost:3000/api/aggregator/categories"));
      expect(res.status).toBe(200);
      const json = (await res.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data.length).toBeGreaterThanOrEqual(4);
    });

    it("GET /api/aggregator/products filters by search and category", async () => {
      const res = await app.handle(new Request("http://localhost:3000/api/aggregator/products?category=p2p-lending&search=namia"));
      expect(res.status).toBe(200);
      const json = (await res.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
      expect(json.data[0].categorySlug).toBe("p2p-lending");
    });

    it("POST /api/aggregator/compare compares selected products", async () => {
      const res = await app.handle(new Request("http://localhost:3000/api/aggregator/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [1, 2] })
      }));
      expect(res.status).toBe(200);
      const json = (await res.json()) as any;
      expect(json.success).toBe(true);
      expect(json.comparedCount).toBe(2);
    });
  });

  describe("Financial Calculators", () => {
    it("POST /api/calculator/loan calculates Murabahah installments accurately", async () => {
      const res = await app.handle(new Request("http://localhost:3000/api/calculator/loan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 12000000,
          tenorMonths: 12,
          marginAnnualPercent: 10,
          contractType: "Murabahah"
        })
      }));
      expect(res.status).toBe(200);
      const json = (await res.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data.principal).toBe(12000000);
      expect(json.data.totalMargin).toBe(1200000);
      expect(json.data.totalPayable).toBe(13200000);
      expect(json.data.monthlyInstallment).toBe(1100000);
    });

    it("POST /api/calculator/investment projects Mudharabah compound yield", async () => {
      const res = await app.handle(new Request("http://localhost:3000/api/calculator/investment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          initialAmount: 10000000,
          monthlyContribution: 500000,
          projectedAnnualYieldPercent: 10,
          durationYears: 3,
          nisbahInvestorPercent: 70
        })
      }));
      expect(res.status).toBe(200);
      const json = (await res.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data.finalPortfolioValue).toBeGreaterThan(json.data.totalInvested);
    });

    it("POST /api/calculator/credit-score assesses creditworthiness", async () => {
      const res = await app.handle(new Request("http://localhost:3000/api/calculator/credit-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          monthlyIncome: 15000000,
          monthlyExpenses: 6000000,
          existingLoanInstallment: 2000000,
          employmentType: "permanent_employee",
          employmentDurationYears: 4,
          creditHistory: "good"
        })
      }));
      expect(res.status).toBe(200);
      const json = (await res.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data.score).toBeGreaterThanOrEqual(650);
      expect(json.data.tier).toBeDefined();
    });
  });

  describe("Lead Intake & KYC Wizard", () => {
    it("POST /api/leads creates a new prospect record", async () => {
      const res = await app.handle(new Request("http://localhost:3000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Ahmad Dahlan",
          email: "ahmad.dahlan@example.com",
          phone: "081234567890",
          needCategory: "p2p-lending",
          targetAmount: 25000000,
          targetTenorMonths: 12
        })
      }));
      expect(res.status).toBe(200);
      const json = (await res.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data.id).toBeDefined();
      expect(json.data.kycStep).toBe(1);

      // Test updating KYC step
      const patchRes = await app.handle(new Request(`http://localhost:3000/api/leads/${json.data.id}/kyc`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 2,
          nik: "3201234567890001",
          dateOfBirth: "1990-05-12",
          address: "Jl. Sudirman No 10, Jakarta",
          employmentType: "permanent_employee"
        })
      }));
      expect(patchRes.status).toBe(200);
      const patchJson = (await patchRes.json()) as any;
      expect(patchJson.data.kycStep).toBe(2);
      expect(patchJson.data.nik).toBe("3201234567890001");
    });
  });

  describe("Content & Educational CMS", () => {
    it("GET /api/content/stats returns company statistics", async () => {
      const res = await app.handle(new Request("http://localhost:3000/api/content/stats"));
      expect(res.status).toBe(200);
      const json = (await res.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
    });

    it("GET /api/content/team returns structured personnel", async () => {
      const res = await app.handle(new Request("http://localhost:3000/api/content/team"));
      expect(res.status).toBe(200);
      const json = (await res.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data.shariaBoard.length).toBeGreaterThan(0);
      expect(json.data.directors.length).toBeGreaterThan(0);
    });

    it("GET /api/content/faqs returns borrower and investor FAQs", async () => {
      const res = await app.handle(new Request("http://localhost:3000/api/content/faqs?isInvestor=0"));
      expect(res.status).toBe(200);
      const json = (await res.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
    });

    it("GET /api/content/blogs returns articles", async () => {
      const res = await app.handle(new Request("http://localhost:3000/api/content/blogs"));
      expect(res.status).toBe(200);
      const json = (await res.json()) as any;
      expect(json.success).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
    });
  });

  describe("Performance Target (<15ms latency)", () => {
    it("responds to aggregator search query in < 15ms", async () => {
      const start = performance.now();
      const res = await app.handle(new Request("http://localhost:3000/api/aggregator/products?search=murabahah"));
      const duration = performance.now() - start;
      expect(res.status).toBe(200);
      expect(duration).toBeLessThan(15);
    });
  });

  describe("API Security, Rate Limiting & Error Protection", () => {
    it("includes rate limiting headers on responses", async () => {
      const res = await app.handle(new Request("http://localhost:3000/api/aggregator/categories", {
        headers: { "x-api-key": NAMIA_API_KEY }
      }));
      expect(res.status).toBe(200);
      expect(res.headers.get("x-ratelimit-limit")).toBeDefined();
      expect(res.headers.get("x-ratelimit-remaining")).toBeDefined();
    });

    it("rejects unauthorized external requests missing api-key and origin", async () => {
      const res = await app.handle(new Request("http://localhost:3000/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "origin": "https://malicious-scraper-bot.com",
          "user-agent": "Mozilla/5.0 Scraper"
        },
        body: JSON.stringify({ fullName: "Bot" })
      }));
      expect(res.status).toBe(401);
      const json = (await res.json()) as any;
      expect(json.success).toBe(false);
      expect(json.error).toBe("UNAUTHORIZED");
    });

    it("accepts requests with valid x-api-key header", async () => {
      const res = await app.handle(new Request("http://localhost:3000/api/aggregator/categories", {
        headers: {
          "x-api-key": NAMIA_API_KEY,
          "origin": "https://malicious-scraper-bot.com"
        }
      }));
      expect(res.status).toBe(200);
      const json = (await res.json()) as any;
      expect(json.success).toBe(true);
    });

    it("returns friendly JSON error on invalid routes (404)", async () => {
      const res = await app.handle(new Request("http://localhost:3000/api/non-existent-route", {
        headers: { "x-api-key": NAMIA_API_KEY }
      }));
      expect(res.status).toBe(404);
      const json = (await res.json()) as any;
      expect(json.success).toBe(false);
      expect(json.error).toBe("NOT_FOUND");
    });
  });
});
