import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { aggregatorController } from "./controllers/aggregator";
import { leadController } from "./controllers/lead";
import { calculatorController } from "./controllers/calculator";
import { contentController } from "./controllers/content";

export const app = new Elysia()
  .use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }))
  .use(swagger({
    path: "/swagger",
    documentation: {
      info: {
        title: "Syarfi Fintech Monorepo API",
        version: "2.0.0",
        description: "High-performance ElysiaJS API for Global Fintech Aggregator, Calculators, KYC Onboarding, and Educational CMS."
      },
      tags: [
        { name: "Aggregator", description: "Product filtering, search, and comparison engine" },
        { name: "Calculator", description: "Murabahah loan, investment ROI, and credit score estimators" },
        { name: "Leads & KYC", description: "Customer lead capture and multi-step onboarding simulator" },
        { name: "Content & Info", description: "Company profile, personnel, FAQs, and educational articles" }
      ]
    }
  }))
  .get("/", () => ({
    status: "online",
    message: "Syarfi Global Fintech API (ElysiaJS + Bun)",
    documentation: "/swagger",
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
  .listen(3000);

console.log(`🦊 Elysia API is running at http://${app.server?.hostname}:${app.server?.port}`);
console.log(`📚 Swagger documentation available at http://${app.server?.hostname}:${app.server?.port}/swagger`);

// Export type for Eden Treaty end-to-end type safety in SvelteKit
export type App = typeof app;
