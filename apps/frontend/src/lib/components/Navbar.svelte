<script lang="ts">
  import { Menu, X, ArrowRight, ShieldCheck, Sparkles } from "lucide-svelte";
  import { page } from "$app/state";

  let isMobileOpen = $state(false);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/aggregator", label: "Aggregator Produk" },
    { href: "/calculators", label: "Kalkulator Finansial" },
    { href: "/borrower", label: "Peminjam" },
    { href: "/investor", label: "Investor" },
    { href: "/blog", label: "Edu-Hub" },
    { href: "/about", label: "Tentang Kami" },
    { href: "/contacts", label: "Kontak" }
  ];

  function toggleMobile() {
    isMobileOpen = !isMobileOpen;
  }
</script>

<header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-20">
      
      <!-- Brand Logo -->
      <a href="/" class="flex items-center gap-3 group">
        <div class="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
          <ShieldCheck class="w-6 h-6" />
        </div>
        <div class="flex flex-col">
          <span class="text-2xl font-bold tracking-tight text-slate-900 leading-none">
            Syarfi<span class="text-emerald-600">.</span>
          </span>
          <span class="text-[11px] font-medium tracking-wide uppercase text-slate-500 mt-1">
            Islamic Crowdfunding
          </span>
        </div>
      </a>

      <!-- Desktop Nav Items -->
      <nav class="hidden lg:flex items-center gap-1">
        {#each navLinks as link}
          {@const isActive = page.url.pathname === link.href || (link.href !== '/' && page.url.pathname.startsWith(link.href))}
          <a
            href={link.href}
            class="px-3.5 py-2 text-sm font-medium rounded-lg transition-colors {isActive ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'}"
          >
            {link.label}
          </a>
        {/each}
      </nav>

      <!-- CTA Button -->
      <div class="hidden sm:flex items-center gap-3">
        <a
          href="/onboarding"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all active:scale-98"
        >
          <Sparkles class="w-4 h-4" />
          <span>Ajukan Pembiayaan</span>
        </a>
      </div>

      <!-- Mobile Hamburger Button -->
      <div class="flex lg:hidden">
        <button
          type="button"
          onclick={toggleMobile}
          class="p-2.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Menu"
        >
          {#if isMobileOpen}
            <X class="w-6 h-6" />
          {:else}
            <Menu class="w-6 h-6" />
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Dropdown Menu -->
  {#if isMobileOpen}
    <div class="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
      {#each navLinks as link}
        <a
          href={link.href}
          onclick={() => isMobileOpen = false}
          class="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
        >
          {link.label}
        </a>
      {/each}
      <div class="pt-4 border-t border-slate-100">
        <a
          href="/onboarding"
          onclick={() => isMobileOpen = false}
          class="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <span>Ajukan Pembiayaan Sekarang</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      </div>
    </div>
  {/if}
</header>
