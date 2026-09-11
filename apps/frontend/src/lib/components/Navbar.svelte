<script lang="ts">
  import {
    Menu,
    X,
    ChevronDown,
    Phone,
    Mail,
    LogIn,
    ArrowRight,
  } from "lucide-svelte";
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

  // Mobile collapsible sections
  let mobileProductsOpen = $state(false);
  let mobileAboutOpen = $state(false);

  const languages: Array<{ code: SupportedLang; name: string; flag: string }> =
    [
      {
        code: "ID",
        name: "Indonesia",
        flag: "/images/others/flags/indonesian.png",
      },
      { code: "EN", name: "English", flag: "/images/others/flags/usa.png" },
      { code: "AR", name: "العربية", flag: "/images/others/flags/saudi.png" },
    ];

  function toggleMobile() {
    isMobileOpen = !isMobileOpen;
  }
</script>

<!-- Top bar with contact info & authentic group language switcher -->
<div
  class="bg-[#2c3e50] text-slate-200 text-xs py-2 border-b border-[#1a252f] hidden md:block"
>
  <div
    class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
  >
    <div class="flex items-center gap-4 xl:gap-6 min-w-0">
      <a
        href="tel:+622183782337"
        class="flex items-center gap-2 text-slate-200 hover:text-[#1abc9c] transition-colors whitespace-nowrap"
      >
        <Phone class="w-3.5 h-3.5 text-[#1abc9c] shrink-0" />
        <span class="font-medium">{$t.topbar.phone}</span>
      </a>
      <a
        href="mailto:salam@namia.id"
        class="flex items-center gap-2 text-slate-200 hover:text-[#1abc9c] transition-colors whitespace-nowrap"
      >
        <Mail class="w-3.5 h-3.5 text-[#1abc9c] shrink-0" />
        <span class="font-medium">{$t.topbar.email}</span>
      </a>
      <span class="text-slate-500 hidden xl:inline">|</span>
      <span class="text-slate-300 font-normal hidden xl:inline truncate"
        >{$t.topbar.address}</span
      >
    </div>

    <div class="flex items-center gap-4 shrink-0">
      <div class="flex items-center gap-3 text-slate-300">
        <a
          href="https://www.facebook.com/namia.id/"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-[#1abc9c] transition-colors"
          aria-label="Facebook"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"
            ><path
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            /></svg
          >
        </a>
        <a
          href="https://twitter.com/namia_id"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-[#1abc9c] transition-colors"
          aria-label="Twitter"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"
            ><path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            /></svg
          >
        </a>
        <a
          href="https://www.instagram.com/namia.id/"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-[#1abc9c] transition-colors"
          aria-label="Instagram"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"
            ><path
              d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
            /></svg
          >
        </a>
      </div>

      <div class="h-3 w-px bg-slate-600"></div>

      <!-- Login Link in Topbar -->
      <button
        type="button"
        onclick={() => (isLoginModalOpen = true)}
        class="flex items-center gap-1.5 text-slate-200 hover:text-[#1abc9c] transition-colors cursor-pointer text-xs font-medium"
      >
        <LogIn class="w-3.5 h-3.5 text-[#1abc9c]" />
        <span>{$t.nav.login}</span>
      </button>

      <div class="h-3 w-px bg-slate-600"></div>

      <!-- Clean Segmented Group Menu for Language Selection -->
      <div
        class="inline-flex items-center p-0.5 rounded-[3px] bg-slate-800/80 border border-slate-700 shadow-xs"
      >
        {#each languages as lang}
          <button
            type="button"
            onclick={() => setLanguage(lang.code)}
            class="flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[11px] font-semibold transition-all cursor-pointer focus:outline-none select-none {$currentLanguage ===
            lang.code
              ? 'bg-[#1abc9c] text-white shadow-xs'
              : 'text-slate-300 hover:text-white'}"
            title={lang.name}
          >
            <img
              src={lang.flag}
              alt={lang.code}
              class="w-3.5 h-2.5 object-cover rounded-2xs"
            />
            <span>{lang.code}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>
</div>

<!-- Main Navigation Bar in Clean Web 2.0 / Early Bootstrap Corporate Style -->
<header class="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-20">
      <!-- Namia Syariah Modern Logo with OJK Badge -->
      <a
        href="/"
        class="flex items-center shrink-0 py-1"
        aria-label="Namia Syariah Beranda"
      >
        <Logo size="md" showBadge={true} showOjk={true} />
      </a>

      <!-- Desktop Nav Items: Classic Group Menu Tree with Generous Breathing Room -->
      <nav
        class="hidden min-[992px]:flex items-center gap-2 xl:gap-4 text-[13px] uppercase tracking-wider font-bold whitespace-nowrap"
      >
        <!-- Beranda -->
        <a
          href="/"
          class="px-2.5 py-2 whitespace-nowrap transition-colors {page.url
            .pathname === '/'
            ? 'text-emerald-700'
            : 'text-slate-700 hover:text-emerald-700'}"
        >
          {$t.nav.home}
        </a>

        <!-- Produk & Layanan (Vertical Dropdown List) -->
        <div
          class="relative"
          role="none"
          onmouseenter={() => (isProductsDropdownOpen = true)}
          onmouseleave={() => (isProductsDropdownOpen = false)}
        >
          <button
            type="button"
            class="flex items-center gap-1 px-2.5 py-2 whitespace-nowrap transition-colors cursor-pointer {isProductsDropdownOpen ||
            page.url.pathname === '/investor' ||
            page.url.pathname === '/borrower' ||
            page.url.pathname.startsWith('/aggregator') ||
            page.url.pathname.startsWith('/calculators') ||
            page.url.pathname.startsWith('/onboarding')
              ? 'text-emerald-700'
              : 'text-slate-700 hover:text-emerald-700'}"
            aria-expanded={isProductsDropdownOpen}
          >
            <span class="whitespace-nowrap">{$t.nav.products}</span>
            <ChevronDown
              class="w-3.5 h-3.5 {isProductsDropdownOpen
                ? 'rotate-180 text-emerald-700'
                : 'text-slate-400'}"
            />
          </button>

          {#if isProductsDropdownOpen}
            <div class="absolute left-0 top-full pt-1 w-56 z-50">
              <div
                class="bg-white rounded-[4px] shadow-md border border-slate-300 border-t-2 border-t-emerald-600 py-1"
              >
                <a
                  href="/investor"
                  class="block px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 uppercase tracking-wider"
                >
                  {$t.nav.funding}
                </a>
                <a
                  href="/borrower"
                  class="block px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 uppercase tracking-wider"
                >
                  {$t.nav.financing}
                </a>
                <a
                  href="/aggregator"
                  class="block px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 uppercase tracking-wider"
                >
                  {$t.nav.aggregator}
                </a>
                <div class="border-t border-slate-200 my-1"></div>
                <a
                  href="/calculators"
                  class="block px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 uppercase tracking-wider"
                >
                  {$t.nav.calculators}
                </a>
                <a
                  href="/onboarding"
                  class="block px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 uppercase tracking-wider"
                >
                  {$t.nav.kyc}
                </a>
              </div>
            </div>
          {/if}
        </div>

        <!-- Tentang Kami (Vertical Dropdown List) -->
        <div
          class="relative"
          role="none"
          onmouseenter={() => (isAboutDropdownOpen = true)}
          onmouseleave={() => (isAboutDropdownOpen = false)}
        >
          <button
            type="button"
            class="flex items-center gap-1 px-2.5 py-2 whitespace-nowrap transition-colors cursor-pointer {isAboutDropdownOpen ||
            page.url.pathname.startsWith('/about') ||
            page.url.pathname.startsWith('/team') ||
            page.url.pathname.startsWith('/blog')
              ? 'text-emerald-700'
              : 'text-slate-700 hover:text-emerald-700'}"
            aria-expanded={isAboutDropdownOpen}
          >
            <span class="whitespace-nowrap">{$t.nav.about}</span>
            <ChevronDown
              class="w-3.5 h-3.5 {isAboutDropdownOpen
                ? 'rotate-180 text-emerald-700'
                : 'text-slate-400'}"
            />
          </button>

          {#if isAboutDropdownOpen}
            <div class="absolute left-0 top-full pt-1 w-52 z-50">
              <div
                class="bg-white rounded-[4px] shadow-md border border-slate-300 border-t-2 border-t-emerald-600 py-1"
              >
                <a
                  href="/about"
                  class="block px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 uppercase tracking-wider"
                >
                  {$t.nav.profile}
                </a>
                <a
                  href="/team"
                  class="block px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 uppercase tracking-wider"
                >
                  {$t.nav.team}
                </a>
                <div class="border-t border-slate-200 my-1"></div>
                <a
                  href="/blog"
                  class="block px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 uppercase tracking-wider"
                >
                  {$t.nav.blog}
                </a>
                <a
                  href="/contacts"
                  class="block px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 hover:bg-slate-100 uppercase tracking-wider"
                >
                  {$t.nav.faq}
                </a>
              </div>
            </div>
          {/if}
        </div>

        <!-- FAQ & Kontak -->
        <a
          href="/contacts"
          class="px-2.5 py-2 whitespace-nowrap transition-colors {page.url
            .pathname === '/contacts'
            ? 'text-emerald-700'
            : 'text-slate-700 hover:text-emerald-700'}"
        >
          {$t.nav.faq}
        </a>

        <!-- CMS Studio Portal -->
        <a
          href="/cms"
          class="px-2.5 py-1.5 rounded-[3px] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 {page
            .url.pathname === '/cms'
            ? 'bg-emerald-700 text-white'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'}"
          title="Kelola Konten Platform Dinamis"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>CMS Studio</span>
        </a>
      </nav>

      <!-- Single Primary Solid Bootstrap Button -->
      <div class="hidden sm:flex items-center shrink-0">
        <a
          href="/borrower"
          class="bg-[#059669] hover:bg-[#047857] active:bg-[#065f46] text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-[4px] border border-[#047857] flex items-center gap-2 whitespace-nowrap cursor-pointer transition-colors shadow-xs"
        >
          <span>{$t.nav.apply}</span>
          <ArrowRight class="w-3.5 h-3.5 text-white" />
        </a>
      </div>

      <!-- Mobile Hamburger Button -->
      <div class="flex min-[992px]:hidden">
        <button
          type="button"
          onclick={toggleMobile}
          class="p-2 rounded-[3px] text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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

  <!-- Mobile Collapsible Menu in Clean Bootstrap Style with Group Tree Structure -->
  {#if isMobileOpen}
    <div
      class="min-[992px]:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200 font-['Raleway']"
    >
      <!-- Beranda -->
      <a
        href="/"
        onclick={() => (isMobileOpen = false)}
        class="block px-3 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider {page
          .url.pathname === '/'
          ? 'text-[#1abc9c] bg-slate-50'
          : 'text-slate-700 hover:bg-slate-50'}"
      >
        {$t.nav.home}
      </a>

      <!-- Produk & Layanan Collapse -->
      <div class="border-t border-slate-100 pt-1">
        <button
          type="button"
          onclick={() => (mobileProductsOpen = !mobileProductsOpen)}
          class="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-50 rounded-[3px]"
        >
          <span>{$t.nav.products}</span>
          <ChevronDown
            class="w-4 h-4 text-slate-400 transition-transform {mobileProductsOpen
              ? 'rotate-180 text-[#1abc9c]'
              : ''}"
          />
        </button>

        {#if mobileProductsOpen}
          <div
            class="px-3 py-1 space-y-0.5 bg-slate-50 rounded-sm mt-1 border border-slate-100"
          >
            <a
              href="/investor"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#1abc9c]"
            >
              {$t.nav.funding}
            </a>
            <a
              href="/borrower"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#1abc9c]"
            >
              {$t.nav.financing}
            </a>
            <a
              href="/aggregator"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#1abc9c]"
            >
              {$t.nav.aggregator}
            </a>
            <div class="border-t border-slate-200/60 my-1"></div>
            <a
              href="/calculators"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#1abc9c]"
            >
              {$t.nav.calculators}
            </a>
            <a
              href="/onboarding"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#1abc9c]"
            >
              {$t.nav.kyc}
            </a>
          </div>
        {/if}
      </div>

      <!-- Tentang Kami Collapse -->
      <div class="border-t border-slate-100 pt-1">
        <button
          type="button"
          onclick={() => (mobileAboutOpen = !mobileAboutOpen)}
          class="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-50 rounded-[3px]"
        >
          <span>{$t.nav.about}</span>
          <ChevronDown
            class="w-4 h-4 text-slate-400 transition-transform {mobileAboutOpen
              ? 'rotate-180 text-[#1abc9c]'
              : ''}"
          />
        </button>

        {#if mobileAboutOpen}
          <div
            class="px-3 py-1 space-y-0.5 bg-slate-50 rounded-sm mt-1 border border-slate-100"
          >
            <a
              href="/about"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#1abc9c]"
            >
              {$t.nav.profile}
            </a>
            <a
              href="/team"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#1abc9c]"
            >
              {$t.nav.team}
            </a>
            <div class="border-t border-slate-200/60 my-1"></div>
            <a
              href="/blog"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#1abc9c]"
            >
              {$t.nav.blog}
            </a>
            <a
              href="/contacts"
              onclick={() => (isMobileOpen = false)}
              class="block px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-[#1abc9c]"
            >
              {$t.nav.faq}
            </a>
          </div>
        {/if}
      </div>

      <!-- FAQ & Kontak -->
      <a
        href="/contacts"
        onclick={() => (isMobileOpen = false)}
        class="block px-3 py-2 rounded-[3px] text-xs font-bold uppercase tracking-wider {page
          .url.pathname === '/contacts'
          ? 'text-[#1abc9c] bg-slate-50'
          : 'text-slate-700 hover:bg-slate-50'}"
      >
        {$t.nav.faq}
      </a>

      <!-- CMS Studio Mobile Link -->
      <a
        href="/cms"
        onclick={() => (isMobileOpen = false)}
        class="block px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
      >
        ⚡ CMS Studio Admin
      </a>

      <!-- Mobile Language Switcher -->
      <div
        class="pt-3 border-t border-slate-100 flex items-center justify-between px-3"
      >
        <span class="text-xs text-slate-500 font-bold uppercase tracking-wider"
          >Bahasa:</span
        >
        <div
          class="inline-flex items-center p-0.5 rounded-[4px] bg-slate-100 border border-slate-200"
        >
          {#each languages as lang}
            <button
              type="button"
              onclick={() => setLanguage(lang.code)}
              class="px-2.5 py-1 text-xs rounded-[3px] font-bold uppercase transition-all {$currentLanguage ===
              lang.code
                ? 'bg-[#1abc9c] text-white shadow-xs'
                : 'text-slate-600'}"
            >
              {lang.code}
            </button>
          {/each}
        </div>
      </div>

      <div class="pt-3 border-t border-slate-100 space-y-2">
        <button
          type="button"
          onclick={() => {
            isMobileOpen = false;
            isLoginModalOpen = true;
          }}
          class="w-full py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-[4px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
        >
          <LogIn class="w-3.5 h-3.5 text-slate-600" />
          <span>{$t.nav.login}</span>
        </button>

        <a
          href="/borrower"
          onclick={() => (isMobileOpen = false)}
          class="bg-[#059669] hover:bg-[#047857] text-white w-full py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 rounded-[4px] border border-[#047857] transition-colors"
        >
          <span>{$t.nav.apply}</span>
          <ArrowRight class="w-3.5 h-3.5 text-white" />
        </a>
      </div>
    </div>
  {/if}
</header>

<LoginModal bind:isOpen={isLoginModalOpen} />
