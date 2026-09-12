<script lang="ts">
  import { onMount } from "svelte";
  import {
    Menu,
    X,
    ChevronDown,
    Phone,
    Mail,
    LogIn,
    ArrowRight,
    Search,
    Rss,
    Clock,
    Sparkles
  } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Logo from "$lib/components/Logo.svelte";
  import LoginModal from "$lib/components/LoginModal.svelte";
  import {
    currentLanguage,
    setLanguage,
    t,
    type SupportedLang,
  } from "$lib/i18n";

  let isMobileOpen = $state(false);
  let isProductsDropdownOpen = $state(false);
  let isAboutDropdownOpen = $state(false);
  let isLoginModalOpen = $state(false);
  let navSearchQuery = $state("");

  // Live WIB clock
  let currentTimeString = $state("");

  onMount(() => {
    function updateClock() {
      const now = new Date();
      currentTimeString = now.toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " WIB";
    }
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  });

  // Mobile collapsible sections
  let mobileProductsOpen = $state(false);
  let mobileAboutOpen = $state(false);

  const languages: Array<{ code: SupportedLang; name: string; flag: string }> = [
    { code: "ID", name: "Indonesia", flag: "/images/others/flags/indonesian.png" },
    { code: "EN", name: "English", flag: "/images/others/flags/usa.png" },
    { code: "AR", name: "العربية", flag: "/images/others/flags/saudi.png" },
  ];

  function toggleMobile() {
    isMobileOpen = !isMobileOpen;
  }

  function handleNavSearch(e: Event) {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      goto(`/aggregator?search=${encodeURIComponent(navSearchQuery.trim())}`);
      isMobileOpen = false;
    }
  }
</script>

<!-- Sticky Navigation Bar Container (Always pinned at the top on scroll) -->
<div class="sticky top-0 z-50 w-full shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
  <!-- Top bar with contact info, live clock, RSS feed & language switcher in authentic Web 2.0 style -->
  <div class="bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-slate-200 text-xs py-1.5 border-b border-[#020617] hidden md:block">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <!-- Left: Contact info & live clock -->
      <div class="flex items-center gap-4 xl:gap-6 min-w-0">
        <a
          href="tel:+622183782337"
          class="flex items-center gap-1.5 text-slate-300 hover:text-[#10b981] transition-colors whitespace-nowrap"
        >
          <Phone class="w-3.5 h-3.5 text-[#10b981] shrink-0" />
          <span class="font-medium">{$t.topbar.phone}</span>
        </a>
        <a
          href="mailto:salam@namia.id"
          class="flex items-center gap-1.5 text-slate-300 hover:text-[#10b981] transition-colors whitespace-nowrap"
        >
          <Mail class="w-3.5 h-3.5 text-[#10b981] shrink-0" />
          <span class="font-medium">{$t.topbar.email}</span>
        </a>

        <!-- Live Clock -->
        {#if currentTimeString}
          <div class="hidden lg:flex items-center gap-1.5 text-slate-400">
            <span class="blink-dot"></span>
            <span class="font-mono text-[11px] text-emerald-300">{currentTimeString}</span>
          </div>
        {/if}

        <!-- Early 2000s RSS 2.0 Badge -->
        <a
          href="/rss.xml"
          target="_blank"
          rel="noopener noreferrer"
          class="rss-badge hidden xl:inline-flex"
          title="Langganan RSS Feed Artikel & Berita Namia"
        >
          <Rss class="w-3 h-3" />
          <span>RSS 2.0</span>
        </a>
      </div>

      <!-- Right: Member login & language switch -->
      <div class="flex items-center gap-3 shrink-0">
        <!-- Member Login Button -->
        <button
          type="button"
          onclick={() => (isLoginModalOpen = true)}
          class="btn btn-mini btn-inverse flex items-center gap-1 cursor-pointer text-[11px]"
        >
          <LogIn class="w-3 h-3 text-emerald-400" />
          <span>{$t.nav.login}</span>
        </button>

        <div class="h-3 w-px bg-slate-700"></div>

        <!-- Segmented Language Switcher -->
        <div class="btn-group">
          {#each languages as lang}
            <button
              type="button"
              onclick={() => setLanguage(lang.code)}
              class="btn btn-mini {$currentLanguage === lang.code ? 'btn-success' : 'btn-inverse'} flex items-center gap-1 text-[11px]"
              title={lang.name}
            >
              <img
                src={lang.flag}
                alt={lang.code}
                class="w-3 h-2 object-cover rounded-2xs"
              />
              <span>{lang.code}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Main Navigation Bar in Iconic Early Twitter Bootstrap 2 navbar-inverse Style -->
  <header class="bg-[#1b1b1b] bg-gradient-to-b from-[#252525] to-[#111111] border-b border-black">
    <!-- Inset Top Highlight -->
    <div class="w-full h-px bg-white/15"></div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-12 sm:h-[48px]">
      <!-- Namia Logo -->
      <a
        href="/"
        class="flex items-center shrink-0 py-1"
        aria-label="Namia Syariah Beranda"
      >
        <Logo size="md" variant="light" showBadge={true} showOjk={false} />
      </a>

      <!-- Desktop Nav Items in Early Bootstrap Menu Tree -->
      <nav class="hidden min-[1024px]:flex items-center gap-1 xl:gap-2 text-[13px] font-bold tracking-wide text-slate-200">
        <!-- Beranda -->
        <a
          href="/"
          class="px-3 py-1.5 rounded-[4px] transition-colors {page.url.pathname === '/'
            ? 'bg-[#0a0a0a] text-white shadow-[inset_0_3px_8px_rgba(0,0,0,0.6)]'
            : 'text-slate-200 hover:text-white hover:bg-white/10'}"
        >
          {$t.nav.home}
        </a>

        <!-- Produk & Layanan Dropdown -->
        <div
          class="relative"
          role="none"
          onmouseenter={() => (isProductsDropdownOpen = true)}
          onmouseleave={() => (isProductsDropdownOpen = false)}
        >
          <button
            type="button"
            class="flex items-center gap-1 px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer {isProductsDropdownOpen ||
            page.url.pathname === '/investor' ||
            page.url.pathname === '/borrower' ||
            page.url.pathname.startsWith('/aggregator') ||
            page.url.pathname.startsWith('/calculators') ||
            page.url.pathname.startsWith('/onboarding')
              ? 'bg-[#0a0a0a] text-white shadow-[inset_0_3px_8px_rgba(0,0,0,0.6)]'
              : 'text-slate-200 hover:text-white hover:bg-white/10'}"
            aria-expanded={isProductsDropdownOpen}
          >
            <span>{$t.nav.products}</span>
            <ChevronDown
              class="w-3.5 h-3.5 transition-transform {isProductsDropdownOpen
                ? 'rotate-180 text-emerald-400'
                : 'text-slate-400'}"
            />
          </button>

          {#if isProductsDropdownOpen}
            <div class="absolute left-0 top-full pt-1 w-56 z-50 animate-in fade-in-50 duration-100">
              <div class="panel !mb-0 shadow-lg border border-slate-300">
                <div class="panel-heading panel-emerald text-xs py-1.5 px-3">
                  <span>Layanan & Portofolio</span>
                </div>
                <div class="py-1 bg-white">
                  <a
                    href="/investor"
                    class="block px-4 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-100"
                  >
                    {$t.nav.funding}
                  </a>
                  <a
                    href="/borrower"
                    class="block px-4 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-100"
                  >
                    {$t.nav.financing}
                  </a>
                  <a
                    href="/aggregator"
                    class="block px-4 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span>{$t.nav.aggregator}</span>
                    <span class="label label-success text-[9px]">Pintar</span>
                  </a>
                  <div class="border-t border-slate-200 my-1"></div>
                  <a
                    href="/calculators"
                    class="block px-4 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-100"
                  >
                    {$t.nav.calculators}
                  </a>
                  <a
                    href="/onboarding"
                    class="block px-4 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-100"
                  >
                    {$t.nav.kyc}
                  </a>
                </div>
              </div>
            </div>
          {/if}
        </div>

        <!-- Aggregator Link -->
        <a
          href="/aggregator"
          class="px-3 py-1.5 rounded-[4px] transition-colors {page.url.pathname.startsWith('/aggregator')
            ? 'bg-[#0a0a0a] text-white shadow-[inset_0_3px_8px_rgba(0,0,0,0.6)]'
            : 'text-slate-200 hover:text-white hover:bg-white/10'}"
        >
          Aggregator
        </a>

        <!-- Kalkulator Link -->
        <a
          href="/calculators"
          class="px-3 py-1.5 rounded-[4px] transition-colors {page.url.pathname.startsWith('/calculators')
            ? 'bg-[#0a0a0a] text-white shadow-[inset_0_3px_8px_rgba(0,0,0,0.6)]'
            : 'text-slate-200 hover:text-white hover:bg-white/10'}"
        >
          Kalkulator
        </a>

        <!-- Tentang Kami Dropdown -->
        <div
          class="relative"
          role="none"
          onmouseenter={() => (isAboutDropdownOpen = true)}
          onmouseleave={() => (isAboutDropdownOpen = false)}
        >
          <button
            type="button"
            class="flex items-center gap-1 px-3 py-1.5 rounded-[4px] transition-colors cursor-pointer {isAboutDropdownOpen ||
            page.url.pathname.startsWith('/about') ||
            page.url.pathname.startsWith('/team') ||
            page.url.pathname.startsWith('/blog') ||
            page.url.pathname.startsWith('/contacts')
              ? 'bg-[#0a0a0a] text-white shadow-[inset_0_3px_8px_rgba(0,0,0,0.6)]'
              : 'text-slate-200 hover:text-white hover:bg-white/10'}"
            aria-expanded={isAboutDropdownOpen}
          >
            <span>{$t.nav.about}</span>
            <ChevronDown
              class="w-3.5 h-3.5 transition-transform {isAboutDropdownOpen
                ? 'rotate-180 text-emerald-400'
                : 'text-slate-400'}"
            />
          </button>

          {#if isAboutDropdownOpen}
            <div class="absolute left-0 top-full pt-1 w-52 z-50 animate-in fade-in-50 duration-100">
              <div class="panel !mb-0 shadow-lg border border-slate-300">
                <div class="panel-heading panel-emerald text-xs py-1.5 px-3">
                  <span>Informasi Korporat</span>
                </div>
                <div class="py-1 bg-white">
                  <a
                    href="/about"
                    class="block px-4 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-100"
                  >
                    {$t.nav.profile}
                  </a>
                  <a
                    href="/team"
                    class="block px-4 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-100"
                  >
                    {$t.nav.team}
                  </a>
                  <div class="border-t border-slate-200 my-1"></div>
                  <a
                    href="/blog"
                    class="block px-4 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-100"
                  >
                    {$t.nav.blog}
                  </a>
                  <a
                    href="/contacts"
                    class="block px-4 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-slate-100"
                  >
                    {$t.nav.faq} & Kontak
                  </a>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </nav>

      <!-- Primary Call to Action on the Right -->
      <div class="hidden sm:flex items-center gap-3 shrink-0">
        <!-- Primary Action Button: Early Bootstrap 2 btn-success with gloss -->
        <a
          href="/borrower"
          class="btn btn-success flex items-center gap-1.5 font-bold"
        >
          <span>{$t.nav.apply}</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>

      <!-- Mobile Hamburger Button -->
      <div class="flex min-[1024px]:hidden">
        <button
          type="button"
          onclick={toggleMobile}
          class="btn btn-inverse p-2"
          aria-label="Toggle Menu"
        >
          {#if isMobileOpen}
            <X class="w-5 h-5" />
          {:else}
            <Menu class="w-5 h-5" />
          {/if}
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Collapsible Menu in Clean Early Bootstrap Style -->
  {#if isMobileOpen}
    <div class="min-[1024px]:hidden border-b border-slate-700 bg-[#1e293b] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
      <!-- Beranda -->
      <a
        href="/"
        onclick={() => (isMobileOpen = false)}
        class="block px-3 py-2 rounded-[4px] text-xs font-bold uppercase tracking-wider {page.url.pathname === '/'
          ? 'bg-[#0f172a] text-emerald-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]'
          : 'text-slate-200 hover:bg-slate-800'}"
      >
        {$t.nav.home}
      </a>

      <!-- Produk & Layanan Collapse -->
      <div class="border-t border-slate-700/60 pt-1">
        <button
          type="button"
          onclick={() => (mobileProductsOpen = !mobileProductsOpen)}
          class="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-slate-800 rounded-[4px]"
        >
          <span>{$t.nav.products}</span>
          <ChevronDown
            class="w-4 h-4 text-slate-400 transition-transform {mobileProductsOpen ? 'rotate-180 text-emerald-400' : ''}"
          />
        </button>

        {#if mobileProductsOpen}
          <div class="px-3 py-1 space-y-0.5 bg-slate-900/60 rounded-md mt-1 border border-slate-700">
            <a
              href="/investor"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-300"
            >
              {$t.nav.funding}
            </a>
            <a
              href="/borrower"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-300"
            >
              {$t.nav.financing}
            </a>
            <a
              href="/aggregator"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-300"
            >
              {$t.nav.aggregator}
            </a>
            <div class="border-t border-slate-800 my-1"></div>
            <a
              href="/calculators"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-300"
            >
              {$t.nav.calculators}
            </a>
            <a
              href="/onboarding"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-300"
            >
              {$t.nav.kyc}
            </a>
          </div>
        {/if}
      </div>

      <!-- Aggregator Direct Link -->
      <a
        href="/aggregator"
        onclick={() => (isMobileOpen = false)}
        class="block px-3 py-2 rounded-[4px] text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-slate-800"
      >
        Aggregator Katalog
      </a>

      <!-- Kalkulator Direct Link -->
      <a
        href="/calculators"
        onclick={() => (isMobileOpen = false)}
        class="block px-3 py-2 rounded-[4px] text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-slate-800"
      >
        Kalkulator Finansial
      </a>

      <!-- Tentang Kami Collapse -->
      <div class="border-t border-slate-700/60 pt-1">
        <button
          type="button"
          onclick={() => (mobileAboutOpen = !mobileAboutOpen)}
          class="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-slate-800 rounded-[4px]"
        >
          <span>{$t.nav.about}</span>
          <ChevronDown
            class="w-4 h-4 text-slate-400 transition-transform {mobileAboutOpen ? 'rotate-180 text-emerald-400' : ''}"
          />
        </button>

        {#if mobileAboutOpen}
          <div class="px-3 py-1 space-y-0.5 bg-slate-900/60 rounded-md mt-1 border border-slate-700">
            <a
              href="/about"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-300"
            >
              {$t.nav.profile}
            </a>
            <a
              href="/team"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-300"
            >
              {$t.nav.team}
            </a>
            <div class="border-t border-slate-800 my-1"></div>
            <a
              href="/blog"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-300"
            >
              {$t.nav.blog}
            </a>
            <a
              href="/contacts"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-emerald-300"
            >
              {$t.nav.faq} & Kontak
            </a>
          </div>
        {/if}
      </div>

      <!-- CMS Studio Mobile Link -->
      <a
        href="/cms"
        onclick={() => (isMobileOpen = false)}
        class="block px-3 py-2 rounded-[4px] text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900"
      >
        ⚡ CMS Studio Admin
      </a>

      <!-- Mobile Language & Login -->
      <div class="pt-3 border-t border-slate-700 flex items-center justify-between px-3">
        <span class="text-xs text-slate-400 font-semibold">Bahasa:</span>
        <div class="btn-group">
          {#each languages as lang}
            <button
              type="button"
              onclick={() => setLanguage(lang.code)}
              class="btn btn-mini {$currentLanguage === lang.code ? 'btn-success' : 'btn-inverse'}"
            >
              {lang.code}
            </button>
          {/each}
        </div>
      </div>

      <div class="pt-2 space-y-2">
        <button
          type="button"
          onclick={() => {
            isMobileOpen = false;
            isLoginModalOpen = true;
          }}
          class="btn btn-inverse w-full py-2 text-xs"
        >
          <LogIn class="w-3.5 h-3.5 text-emerald-400" />
          <span>{$t.nav.login}</span>
        </button>

        <a
          href="/borrower"
          onclick={() => (isMobileOpen = false)}
          class="btn btn-success w-full py-2 text-xs"
        >
          <span>{$t.nav.apply}</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  {/if}
</header>
</div>

<LoginModal bind:isOpen={isLoginModalOpen} />
