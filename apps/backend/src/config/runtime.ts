export interface RuntimeConfig {
  origin: string;
  secureCookies: boolean;
  trustedProxies: string[];
}
export function runtimeConfig(): RuntimeConfig {
  const production = process.env.NODE_ENV === "production";
  const origin = process.env.APP_ORIGIN || (production ? "" : "http://localhost:5173");
  if (
    !origin ||
    new URL(origin).origin !== origin ||
    (production && !origin.startsWith("https://"))
  )
    throw new Error("APP_ORIGIN must be an exact origin (HTTPS in production)");
  return {
    origin,
    secureCookies: production,
    trustedProxies: (process.env.TRUSTED_PROXY_IPS || "").split(",").filter(Boolean),
  };
}
