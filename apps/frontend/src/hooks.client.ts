import type { HandleClientError } from "@sveltejs/kit";

export const handleError: HandleClientError = ({ error, event }) => {
  console.error(`[SvelteKit Client Error at ${event.url.pathname}]:`, error);
  return {
    message: error instanceof Error ? error.message : "Terjadi kendala pada antarmuka"
  };
};
