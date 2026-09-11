import { treaty } from "@elysiajs/eden";
import type { App } from "backend";
import { PUBLIC_API_URL, PUBLIC_NAMIA_API_KEY } from "$env/static/public";

export const NAMIA_API_KEY = PUBLIC_NAMIA_API_KEY;
export const API_BASE_URL = PUBLIC_API_URL;

// End-to-end typed API client backed by Elysia & Eden Treaty with internal security headers
export const api = (treaty as unknown as <T>(url: string, options?: any) => any)<App>(API_BASE_URL, {
  headers: {
    "x-api-key": NAMIA_API_KEY
  }
});



