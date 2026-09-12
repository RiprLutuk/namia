<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Chatbot from '$lib/components/Chatbot.svelte';
	import { onMount } from 'svelte';
	import { fetchCmsContent, cmsStore } from '$lib/cms';
	import { page } from '$app/state';

	let { children } = $props();

	let isStandalonePortal = $derived(
		page.url.pathname.startsWith('/cms') ||
		page.url.pathname.startsWith('/auth') ||
		page.url.pathname.startsWith('/backoffice')
	);

	onMount(() => {
		fetchCmsContent();
	});
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={favicon} />
	<title>Namia Syariah — Smart Growth, Halal Impact | P2P Financing Syariah</title>
	<meta name="description" content="Namia Syariah: Smart Growth, Halal Impact. Platform P2P financing & investasi produktif syariah terpercaya berizin & diawasi OJK. Berlandaskan prinsip An-Namaa' tanpa riba dengan akad Murabahah, Musyarakah, dan Ijarah." />
	<!-- Auto-discovery for RSS 2.0 and Sitemap -->
	<link rel="alternate" type="application/rss+xml" title="Namia Syariah — Sindikasi RSS 2.0" href="/rss.xml" />
	<link rel="sitemap" type="application/xml" title="Sitemap XML" href="/sitemap.xml" />
</svelte:head>

{#if isStandalonePortal}
	<!-- STANDALONE SECURE PORTALS (Borrower, Lender, Backoffice, CMS Studio) -->
	<div class="min-h-screen antialiased">
		{@render children()}
	</div>
{:else}
	<!-- WEBSITE PUBLIK: Navbar, Content, Footer, Chatbot -->
	<div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white relative">
		<Navbar />
		<main class="flex-1">
			{@render children()}
		</main>
		<Footer />
		<Chatbot />
	</div>
{/if}

