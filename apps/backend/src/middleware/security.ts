import { isIP } from "node:net";
import { createHash } from "node:crypto";
import type { Database } from "../config/db";
import { HttpError } from "../domain/errors";

export function clientIp(peer: string | undefined, headers: Headers, trustedProxies: string[]) {
  if (peer && trustedProxies.includes(peer)) {
    // Proxy must overwrite this header; never trust a client-supplied forwarding chain.
    const forwarded = headers.get("x-real-ip");
    if (forwarded && isIP(forwarded)) return forwarded;
  }
  return peer || "unknown-peer";
}
export const isMutation = (method: string) => !["GET", "HEAD", "OPTIONS"].includes(method);
export function checkRequestOrigin(request: Request, origin: string) {
  if (!isMutation(request.method)) return;
  if (
    request.headers.get("origin") !== origin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    throw new HttpError(403, "Origin permintaan tidak diizinkan.");
  }
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json")
    throw new HttpError(415, "Gunakan application/json.");
}
export class RateLimiter {
  constructor(private readonly sql: Database) {}
  async consume(key: string, limit: number, windowSeconds = 60) {
    const hash = createHash("sha256").update(key).digest("hex");
    const [row] = await this.sql`INSERT INTO app_rate_limits (key,count,reset_at)
      VALUES (${hash},1,now() + ${windowSeconds} * interval '1 second')
      ON CONFLICT (key) DO UPDATE SET
        count = CASE WHEN app_rate_limits.reset_at <= now() THEN 1 ELSE app_rate_limits.count + 1 END,
        reset_at = CASE WHEN app_rate_limits.reset_at <= now() THEN EXCLUDED.reset_at ELSE app_rate_limits.reset_at END
      RETURNING count, reset_at`;
    return {
      allowed: row!.count <= limit,
      remaining: Math.max(0, limit - row!.count),
      resetAt: new Date(row!.reset_at),
    };
  }
  async cleanup() {
    await this.sql`DELETE FROM app_rate_limits WHERE reset_at < now() - interval '1 hour'`;
  }
}
