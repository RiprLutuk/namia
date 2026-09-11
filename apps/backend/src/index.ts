import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import * as dotenv from "dotenv";
import { aggregatorController } from "./controllers/aggregator";
import { leadController } from "./controllers/lead";
import { calculatorController } from "./controllers/calculator";
import { contentController } from "./controllers/content";
import { checkRateLimit, getClientIp, validateApiAccess, NAMIA_API_KEY } from "./middleware/security";

dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT must be provided in .env");
}

export const app = new Elysia()
  .use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"]
  }))
  .use(swagger({
    path: "/swagger",
    documentation: {
      info: {
        title: "Namia Syariah Fintech Monorepo API",
        version: "2.1.0",
        description: "Hardened high-performance ElysiaJS API with Rate Limiting, API Key Security, and Error Interception."
      },
      tags: [
        { name: "Aggregator", description: "Product filtering, search, and comparison engine" },
        { name: "Calculator", description: "Murabahah loan, investment ROI, and credit score estimators" },
        { name: "Leads & KYC", description: "Customer lead capture and multi-step onboarding simulator" },
        { name: "Content & Info", description: "Company profile, personnel, FAQs, and educational articles" }
      ]
    }
  }))
  // Security, Rate Limiting & Access Control Middleware
  .onRequest(({ request, set }) => {
    const url = new URL(request.url);

    // Bypass options preflight, root, health, and swagger docs
    if (
      request.method === "OPTIONS" ||
      url.pathname === "/" ||
      url.pathname === "/health" ||
      url.pathname.startsWith("/swagger")
    ) {
      return;
    }

    // 1. IP-based Sliding Window Rate Limiter
    const clientIp = getClientIp(request.headers);
    const isMutation = request.method !== "GET" && request.method !== "HEAD";
    const requestLimit = isMutation ? 40 : 120; // 40 req/min for mutations, 120 req/min for reads
    const rateStatus = checkRateLimit(clientIp, requestLimit, 60000);

    set.headers["x-ratelimit-limit"] = String(rateStatus.limit);
    set.headers["x-ratelimit-remaining"] = String(rateStatus.remaining);
    set.headers["x-ratelimit-reset"] = String(Math.ceil(rateStatus.resetTime / 1000));

    if (!rateStatus.allowed) {
      set.status = 429;
      set.headers["retry-after"] = "60";
      return {
        success: false,
        error: "RATE_LIMIT_EXCEEDED",
        message: "Batas frekuensi permintaan terlampaui. Silakan tunggu beberapa saat sebelum mencoba kembali."
      };
    }

    // 2. Strict Access Control for API routes
    if (url.pathname.startsWith("/api/")) {
      const isAuthorized = validateApiAccess(request.headers);
      if (!isAuthorized) {
        set.status = 401;
        return {
          success: false,
          error: "UNAUTHORIZED",
          message: "Akses API ditolak. Harap sertakan header 'x-api-key' atau kredensial otorisasi yang valid."
        };
      }
    }
  })
  // Global Error Interceptor to prevent unhandled 500 crashes
  .onError(({ code, error, set }) => {
    console.error(`[API Error] Code: ${code} -`, error instanceof Error ? error.message : error);

    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        success: false,
        error: "NOT_FOUND",
        message: "Endpoint atau data yang diminta tidak ditemukan"
      };
    }

    if (code === "VALIDATION") {
      set.status = 422;
      return {
        success: false,
        error: "VALIDATION_ERROR",
        message: "Parameter atau data payload tidak memenuhi skema validasi",
        details: error instanceof Error ? error.message : String(error)
      };
    }

    if (code === "PARSE") {
      set.status = 400;
      return {
        success: false,
        error: "BAD_REQUEST",
        message: "Format JSON payload tidak valid"
      };
    }

    // Catch-all prevents unhandled 500 error crash
    set.status = 500;
    return {
      success: false,
      error: "INTERNAL_SERVER_ERROR",
      message: "Terjadi kendala pada pemrosesan server. Sistem telah mengalihkan permintaan ke penanganan aman."
    };
  })
  .get("/", () => ({
    status: "online",
    message: "Namia Syariah Global Fintech API (ElysiaJS + Bun)",
    documentation: "/swagger",
    security: "Protected with Rate Limiting & API Key validation",
    timestamp: new Date().toISOString()
  }))
  .get("/health", () => ({
    status: "healthy",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    engine: "Bun " + Bun.version
  }))
  .use(aggregatorController)
  .use(leadController)
  .use(calculatorController)
  .use(contentController)
  .listen(parseInt(process.env.PORT!, 10));

console.log(`🦊 Elysia API is running at http://${app.server?.hostname}:${app.server?.port}`);
console.log(`📚 Swagger documentation available at http://${app.server?.hostname}:${app.server?.port}/swagger`);

export { NAMIA_API_KEY };
export type App = typeof app;

