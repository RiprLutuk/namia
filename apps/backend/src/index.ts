import { createApp } from "./app";
import { connectDatabase } from "./config/db";
import { runtimeConfig } from "./config/runtime";
import { RateLimiter } from "./middleware/security";
export type { App } from "./app";

if (import.meta.main) {
  const sql = connectDatabase(process.env.DATABASE_URL || "");
  const [migration] = await sql`SELECT version FROM app_migrations WHERE version = 2`;
  if (!migration)
    throw new Error("Database migration required: run bun run db:migrate before starting the API.");
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
