import { treaty } from "@elysiajs/eden";
import type { App } from "backend";

const API_BASE_URL = typeof window !== "undefined"
  ? (window.location.hostname === "localhost" ? "http://localhost:3000" : window.location.origin)
  : "http://localhost:3000";

// End-to-end typed API client backed by Elysia & Eden Treaty
export const api = (treaty as unknown as <T>(url: string) => any)<App>(API_BASE_URL);
export { API_BASE_URL };


