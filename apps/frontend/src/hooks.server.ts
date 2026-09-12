import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const response = await resolve(event);
  const pathname = event.url.pathname;

  // Strict anti-crawler protection for non-public auth and CMS backoffice pages
  if (
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/backoffice/") ||
    pathname.startsWith("/cms")
  ) {
    response.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive, nosnippet, noimageindex"
    );
  }

  return response;
};

export const handleError = ({ error, event }: { error: unknown; event: any }) => {
  console.error(`[SvelteKit SSR Error at ${event.url.pathname}]:`, error);
  return {
    message: error instanceof Error ? error.message : "Terjadi kendala pada sistem server"
  };
};
