import type { Handle } from "@sveltejs/kit";
export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const path = event.url.pathname;
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "same-origin");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (event.url.protocol === "https:")
    response.headers.set("Strict-Transport-Security", "max-age=31536000");
  if (
    path.startsWith("/auth/") ||
    path.startsWith("/backoffice/") ||
    path.startsWith("/cms") ||
    path.startsWith("/onboarding")
  ) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    response.headers.set("Cache-Control", "no-store");
  }
  return response;
};
export const handleError = () => ({ message: "Terjadi kendala pada sistem. Silakan coba lagi." });
