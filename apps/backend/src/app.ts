import { Elysia } from "elysia";
import type { Database } from "./config/db";
import type { RuntimeConfig } from "./config/runtime";
import { createAggregatorController } from "./controllers/aggregator";
import { createContentController } from "./controllers/content";
import { calculatorController } from "./controllers/calculator";
import { createLeadController } from "./controllers/lead";
import { createAuthController } from "./controllers/auth";
import { ContentRepository } from "./repositories/content";
import { IdentityRepository } from "./repositories/identity";
import { LeadRepository } from "./repositories/leads";
import { AuthService } from "./services/auth";
import { HttpError } from "./domain/errors";
import { RateLimiter, checkRequestOrigin, clientIp, isMutation } from "./middleware/security";

export function createApp(sql: Database, config: RuntimeConfig) {
  const auth = new AuthService(new IdentityRepository(sql), config.secureCookies);
  const content = new ContentRepository(sql);
  const limiter = new RateLimiter(sql);
  return new Elysia({ serve: { maxRequestBodySize: 256 * 1024 } })
    .onRequest(async ({ request, server, set }) => {
      const path = new URL(request.url).pathname;
      set.headers["x-content-type-options"] = "nosniff";
      set.headers["referrer-policy"] = "same-origin";
      set.headers["cache-control"] = "no-store";
      if (!path.startsWith("/api/")) return;
      checkRequestOrigin(request, config.origin);
      const ip = clientIp(
        server?.requestIP(request)?.address,
        request.headers,
        config.trustedProxies,
      );
      const authPath = path.startsWith("/api/auth/") && isMutation(request.method);
      const limit = authPath ? 10 : isMutation(request.method) ? 60 : 300;
      const rate = await limiter.consume(
        `${authPath ? "auth" : isMutation(request.method) ? "write" : "read"}:${ip}`,
        limit,
      );
      set.headers["x-ratelimit-limit"] = String(limit);
      set.headers["x-ratelimit-remaining"] = String(rate.remaining);
      if (!rate.allowed) {
        set.headers["retry-after"] = String(
          Math.max(1, Math.ceil((rate.resetAt.getTime() - Date.now()) / 1000)),
        );
        throw new HttpError(429, "Terlalu banyak permintaan. Silakan coba lagi nanti.");
      }
    })
    .onError(({ code, error, set }) => {
      if (error instanceof HttpError) {
        set.status = error.status;
        return { success: false, message: error.message };
      }
      const status =
        code === "NOT_FOUND" ? 404 : code === "VALIDATION" ? 422 : code === "PARSE" ? 400 : 503;
      set.status = status;
      if (status === 503) console.error("API request failed", { code });
      return {
        success: false,
        message:
          status === 422
            ? "Data tidak memenuhi ketentuan validasi."
            : status === 404
              ? "Tidak ditemukan."
              : "Permintaan tidak dapat diproses. Silakan coba lagi.",
      };
    })
    .get("/", () => ({ status: "online" }))
    .get("/health", async () => {
      await sql`SELECT 1`;
      return { status: "healthy" };
    })
    .use(createAuthController(auth, config.secureCookies, limiter))
    .use(createAggregatorController(content))
    .use(calculatorController)
    .use(createContentController(content, auth))
    .use(createLeadController(new LeadRepository(sql), auth));
}
export type App = ReturnType<typeof createApp>;
