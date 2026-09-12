// 1. Guaranteed static export constants (zero-dependency, always instantly evaluated)
export const NAMIA_API_KEY: string = "namia-secure-internal-api-key-2026";
export const API_BASE_URL: string = "http://localhost:3000";

// 2. Typed API client backed by Elysia & Eden Treaty
import { treaty } from "@elysiajs/eden";
import type { App } from "backend";

export const api = (treaty as unknown as <T>(url: string, options?: any) => any)<App>(API_BASE_URL, {
  headers: {
    "x-api-key": NAMIA_API_KEY
  }
});

export default api;



