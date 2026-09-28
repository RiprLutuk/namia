import { createApp } from "./app";
import { connectDatabase } from "./config/db";
import { runtimeConfig } from "./config/runtime";
import { RateLimiter } from "./middleware/security";
export type { App } from "./app";

if (import.meta.main) {
  const sql = connectDatabase(process.env.DATABASE_URL || "");
  await sql`SELECT id FROM app_content WHERE id = 1`;
  const app = createApp(sql, runtimeConfig()).listen({
    hostname: process.env.HOST || "127.0.0.1",
    port: Number(process.env.PORT || 3000),
  });
  const maintenance = setInterval(() => {
    new RateLimiter(sql).cleanup().catch(() => console.error("Rate limit cleanup failed"));
  }, 60_000);
  console.log(`API listening on port ${app.server?.port}`);
  async function shutdown() {
    clearInterval(maintenance);
    await app.stop();
    await sql.end();
    process.exit(0);
  }
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}
