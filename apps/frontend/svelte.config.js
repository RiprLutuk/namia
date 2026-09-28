import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    csp: {
      mode: "auto",
      directives: {
        "default-src": ["self"],
        "script-src": ["self"],
        "style-src": ["self", "unsafe-inline", "https://fonts.googleapis.com"],
        "img-src": ["self", "data:", "https:"],
        "font-src": ["self", "https://fonts.gstatic.com"],
        "connect-src": ["self"],
        "object-src": ["none"],
        "base-uri": ["self"],
        "frame-ancestors": ["none"],
        "form-action": ["self"],
      },
    },
  },
};

export default config;
