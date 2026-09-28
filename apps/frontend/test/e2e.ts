import { chromium } from "playwright";
import { strict as assert } from "node:assert";
import { temporaryDatabase, freePort } from "../../backend/test/database";
import { connectDatabase } from "../../backend/src/config/db";
import { migrateDatabase } from "../../backend/src/db/migrate";
import { IdentityRepository } from "../../backend/src/repositories/identity";

const database = await temporaryDatabase();
const sql = connectDatabase(database.url);
const backendPort = await freePort(),
  frontendPort = await freePort();
const origin = `http://127.0.0.1:${frontendPort}`;
const password = "Browser-test-password-2026!";
const processes: ReturnType<typeof Bun.spawn>[] = [];
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
async function ready(url: string) {
  for (let n = 0; n < 100; n++) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Server did not start: ${url}`);
}
try {
  await migrateDatabase(sql);
  await new IdentityRepository(sql).createAccount(
    "admin@example.invalid",
    "Browser Admin",
    await Bun.password.hash(password),
    "admin",
  );
  // Simulate pre-existing legacy content. Rendering must remain inert even before editors resave it.
  const [row] = await sql`SELECT data FROM app_content WHERE id = 1`;
  row!.data.faqs = [
    {
      id: 1,
      categoryId: 1,
      categoryName: "Audit",
      isInvestor: 0,
      question: "Browser security test",
      answer: '<img src=x onerror="window.__xss=1">Safe text',
    },
  ];
  await sql`UPDATE app_content SET data = ${sql.json(row!.data)} WHERE id = 1`;
  processes.push(
    Bun.spawn([process.execPath, "src/index.ts"], {
      cwd: new URL("../../backend/", import.meta.url).pathname,
      env: {
        ...process.env,
        DATABASE_URL: database.url,
        PORT: String(backendPort),
        HOST: "127.0.0.1",
        APP_ORIGIN: origin,
        NODE_ENV: "test",
        TRUSTED_PROXY_IPS: "127.0.0.1",
      },
      stdout: "ignore",
      stderr: "inherit",
    }),
  );
  processes.push(
    Bun.spawn(["node", "build/index.js"], {
      cwd: new URL("../", import.meta.url).pathname,
      env: {
        ...process.env,
        PORT: String(frontendPort),
        HOST: "127.0.0.1",
        ORIGIN: origin,
        BACKEND_URL: `http://127.0.0.1:${backendPort}`,
        NODE_ENV: "production",
      },
      stdout: "ignore",
      stderr: "inherit",
    }),
  );
  await ready(`http://127.0.0.1:${backendPort}/health`);
  await ready(origin);
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (msg) => {
    if (msg.type() === "error" && msg.text().includes("Content Security Policy"))
      errors.push(msg.text());
  });

  const cms = await page.goto(`${origin}/cms`);
  assert.ok(cms?.headers()["content-security-policy"]?.includes("script-src"));
  await page.getByRole("heading", { name: "Masuk administrator" }).waitFor();
  assert.equal(await page.getByText("CMS Studio", { exact: true }).count(), 0);

  await page.goto(`${origin}/auth/cms/borrower`);
  await page.getByRole("button", { name: "Belum punya akun? Daftar" }).click();
  await page.getByLabel("Nama lengkap", { exact: true }).fill("Browser Applicant");
  await page.getByLabel("Email", { exact: true }).fill("browser@example.invalid");
  await page.getByLabel("Kata sandi", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Daftar", exact: true }).click();
  await page.getByRole("heading", { name: "Pengajuan saya" }).waitFor();
  const cookies = await context.cookies();
  assert.equal(cookies.find((cookie) => cookie.name === "namia_session")?.httpOnly, true);

  await page.getByRole("link", { name: "Buat pengajuan pembiayaan" }).click();
  await page.locator("#fullName").fill("Browser Applicant");
  await page.locator("#nik").fill("1234567890123456");
  await page.locator("#phone").fill("081234567890");
  await page.getByRole("button", { name: /Lanjut/ }).click();
  await page.getByRole("button", { name: /Lanjut/ }).click();
  await page.locator("#employmentType").selectOption("permanent_employee");
  await page.locator("#companyName").fill("Synthetic Test Company");
  await page.getByRole("button", { name: /Lanjut/ }).click();
  for (const checkbox of await page.locator('input[type="checkbox"]').all()) await checkbox.check();
  await page.getByRole("button", { name: /Kirim pengajuan/i }).click();
  await page.getByRole("heading", { name: /Terima kasih/ }).waitFor();
  const [lead] = await sql`SELECT data FROM app_leads`;
  assert.equal(lead!.data.status, "submitted");
  assert.equal(lead!.data.employmentType, "permanent_employee");
  await page.getByRole("button", { name: "Keluar", exact: true }).click();
  await page.waitForURL(origin + "/");

  await page.goto(`${origin}/backoffice/auth`);
  await page.getByLabel("Email", { exact: true }).fill("admin@example.invalid");
  await page.getByLabel("Kata sandi", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Masuk", exact: true }).click();
  await page.getByRole("button", { name: "Lihat", exact: true }).click();
  await page
    .getByLabel("Catatan pemeriksaan")
    .fill("Synthetic identity reviewed for end-to-end testing");
  await page.getByRole("button", { name: "Tandai terverifikasi" }).click();
  await page.getByRole("cell", { name: "verified", exact: true }).waitFor();

  await page.goto(`${origin}/cms?tab=branding`);
  await page.getByLabel("Tagline Resmi").fill("Browser verified CMS update");
  const saved = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/content/site-settings") &&
      response.request().method() === "PUT",
  );
  await page.getByRole("button", { name: "Simpan Perubahan Branding" }).click();
  const savedResponse = await saved;
  assert.equal(savedResponse.status(), 200);
  assert.equal((await savedResponse.json()).data.tagline, "Browser verified CMS update");
  await page.reload();
  await page.getByLabel("Tagline Resmi").waitFor();
  await page.waitForFunction(
    () =>
      (document.querySelector("#tagline") as HTMLInputElement)?.value ===
      "Browser verified CMS update",
  );

  await page.goto(`${origin}/cms?tab=faqs`);
  await page.getByRole("button", { name: "Tambah FAQ Baru", exact: true }).click();
  await page.getByLabel("Pertanyaan", { exact: true }).fill("Browser created FAQ");
  await page.getByLabel("Jawaban Lengkap").fill("A safe plain-text answer");
  const faqSaved = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/content/faqs") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Tambahkan FAQ", exact: true }).click();
  assert.equal((await faqSaved).status(), 200);

  await page.goto(`${origin}/contacts`);
  await page.getByRole("button", { name: "Browser security test" }).click();
  assert.equal(await page.locator(".faq-answer img").count(), 0);
  assert.equal(
    await page.evaluate(() => (window as unknown as { __xss?: number }).__xss),
    undefined,
  );
  await page.getByLabel("Nama lengkap *", { exact: true }).fill("Browser Contact");
  await page.getByLabel("Email *", { exact: true }).fill("contact@example.invalid");
  await page.getByLabel("Nomor telepon / WhatsApp *", { exact: true }).fill("081234567890");
  await page.getByLabel("Pesan *", { exact: true }).fill("Synthetic support request");
  await page.getByRole("button", { name: /Kirim pesan/i }).click();
  await page.getByRole("heading", { name: "Pesan Anda telah diterima." }).waitFor();
  await page.goto(`${origin}/backoffice/auth`);
  await page.getByText("Browser Contact", { exact: false }).waitFor();
  await page.getByText("Browser Contact", { exact: false }).click();
  await page.getByText("Synthetic support request", { exact: true }).waitFor();
  assert.deepEqual(errors, [], "No hydration or CSP errors");
  console.log(
    "Browser E2E passed: CMS guard, registration/session, onboarding, admin review, CMS save/reload, inert legacy HTML, contact submission, CSP.",
  );
} finally {
  await browser?.close();
  for (const process of processes) process.kill();
  await Promise.all(processes.map((process) => process.exited));
  await sql.end();
  await database.close();
}
