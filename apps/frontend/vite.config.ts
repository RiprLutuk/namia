import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		proxy: {
			'/api': 'http://localhost:3000'
		}
	},
	plugins: [
		tailwindcss(),
		sveltekit()
	],
	optimizeDeps: {
		exclude: ['svelte', 'svelte/*', 'lucide-svelte']
	}
});
