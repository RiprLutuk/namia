<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Syarfi — Crowdfunding & Aggregator Finansial Syariah Terpercaya</title>
	<meta name="description" content="Platform fintech syariah terpercaya untuk pembiayaan modal usaha UMKM, P2P lending syariah, investasi sukuk, dan kalkulator cicilan tanpa riba berbasis syariah." />
</svelte:head>

<div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
	<Navbar />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>

