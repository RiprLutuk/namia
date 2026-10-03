<script lang="ts">
  import { tick } from "svelte";
  import { Menu, X, Search, ArrowUpRight, LogIn, ChevronDown } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Logo from "$lib/components/Logo.svelte";
  import { currentLanguage, setLanguage, t, type SupportedLang } from "$lib/i18n";

  let header: HTMLElement;
  let mobileOpen = $state(false);
  let openMenu = $state<string | null>(null);
  let search = $state("");
  let scrollY = $state(0);
  let utilityHeight = $state(50);
  const compact = $derived(scrollY >= utilityHeight);
  const currentPath = $derived(page.url.pathname);
  const languages: SupportedLang[] = ["ID", "EN", "AR"];
  const labels = $derived(
    {
      ID: { services: "Layanan", guides: "Panduan", company: "Tentang Namia", help: "Bantuan" },
      EN: { services: "Services", guides: "Resources", company: "About Namia", help: "Help" },
      AR: { services: "الخدمات", guides: "الدليل", company: "عن ناميا", help: "المساعدة" },
    }[$currentLanguage],
  );
  const groups = $derived([
    {
      id: "services",
      label: labels.services,
      links: [
        { href: "/borrower", label: $t.nav.financing },
        { href: "/investor", label: $t.nav.funding },
        {
          href: "/aggregator",
          label: $currentLanguage === "ID" ? "Katalog produk" : $t.nav.aggregator,
        },
      ],
    },
    {
      id: "guides",
      label: labels.guides,
      links: [
        { href: "/calculators", label: $t.nav.calculators },
        { href: "/blog", label: $t.nav.blog },
        { href: "/contacts", label: $t.nav.faq },
      ],
    },
    {
      id: "company",
      label: labels.company,
      links: [
        { href: "/about", label: $t.nav.profile },
        { href: "/team", label: $t.nav.team },
      ],
    },
  ]);

  function closeMenus() {
    openMenu = null;
    mobileOpen = false;
  }
  function toggleMenu(id: string) {
    openMenu = openMenu === id ? null : id;
  }
  $effect(() => {
    currentPath;
    closeMenus();
  });
  $effect(() => {
    if (compact && openMenu === "account") openMenu = null;
  });

  async function submitSearch(event: SubmitEvent) {
    event.preventDefault();
    const query = search.trim();
    if (!query) return;
    closeMenus();
    await goto(`/aggregator?search=${encodeURIComponent(query)}`);
  }
  function handleEscape(event: KeyboardEvent) {
    if (event.key !== "Escape") return;
    if (openMenu) {
      header.querySelector<HTMLButtonElement>(`#nav-trigger-${openMenu}`)?.focus();
      openMenu = null;
    } else if (mobileOpen) {
      mobileOpen = false;
      header.querySelector<HTMLButtonElement>(".mobile-toggle")?.focus();
    }
  }
  async function openWithKeyboard(event: KeyboardEvent, id: string) {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    openMenu = id;
    await tick();
    header.querySelector<HTMLAnchorElement>(`#nav-panel-${id} a`)?.focus();
  }
  function handleOutsidePointer(event: PointerEvent) {
    if (event.target instanceof Node && !header?.contains(event.target)) closeMenus();
  }
  function handleFocusOut(event: FocusEvent) {
    if (event.relatedTarget instanceof Node && !header.contains(event.relatedTarget)) closeMenus();
  }
</script>

<svelte:window bind:scrollY onkeydown={handleEscape} onpointerdown={handleOutsidePointer} />
<header
  class="site-header"
  class:compact
  bind:this={header}
  style:--utility-height={`${utilityHeight}px`}
  onfocusout={handleFocusOut}
>
  <!-- The utility row scrolls naturally away; only the logo/navigation row stays pinned. -->
  <div class="utility-bar" bind:clientHeight={utilityHeight} inert={compact} aria-hidden={compact}>
    <div class="portal-container utility-inner">
      <form class="nav-search" role="search" onsubmit={submitSearch}>
        <label class="sr-only" for="nav-search">Cari produk atau akad</label>
        <Search size={15} aria-hidden="true" />
        <input
          id="nav-search"
          type="search"
          placeholder="Cari produk atau akad…"
          bind:value={search}
        />
        <button type="submit" aria-label="Cari produk"><ArrowUpRight size={16} /></button>
      </form>
      <div class="utility-links">
        <div class="account-area">
          <button
            id="nav-trigger-account"
            class="account-button"
            type="button"
            aria-expanded={openMenu === "account"}
            aria-controls="nav-panel-account"
            onclick={() => toggleMenu("account")}
            onkeydown={(event) => openWithKeyboard(event, "account")}
          >
            <LogIn size={15} /><span>{$t.nav.login}</span><ChevronDown
              size={12}
              class={openMenu === "account" ? "chevron-open" : ""}
            />
          </button>
          {#if openMenu === "account"}
            <div class="dropdown account-dropdown" id="nav-panel-account">
              <span class="dropdown-label">Pilih akun Anda</span>
              <a href="/auth/cms/borrower">Akun pembiayaan <ArrowUpRight size={14} /></a>
              <a href="/auth/cms/lender">Akun pendana <ArrowUpRight size={14} /></a>
            </div>
          {/if}
        </div>
        <a href="/contacts">{labels.help}</a>
        <a href="/rss.xml">RSS</a>
        <label class="language-label"
          ><span class="sr-only">Bahasa navigasi</span><select
            value={$currentLanguage}
            onchange={(event) => setLanguage(event.currentTarget.value as SupportedLang)}
            >{#each languages as language}<option value={language}>{language}</option
              >{/each}</select
          ></label
        >
      </div>
    </div>
  </div>
  <div class="main-bar">
    <div class="portal-container brand-row">
      <a href="/" aria-label="Namia Syariah — Beranda" class="brand-link"
        ><Logo size="md" showBadge={true} showOjk={false} /></a
      >
      <button
        type="button"
        class="mobile-toggle"
        aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
        aria-expanded={mobileOpen}
        aria-controls="main-navigation"
        onclick={() => {
          mobileOpen = !mobileOpen;
          openMenu = null;
        }}
        >{#if mobileOpen}<X size={22} />{:else}<Menu size={22} />{/if}</button
      >
      <nav id="main-navigation" aria-label="Navigasi utama" class:mobile-open={mobileOpen}>
        {#each groups as group (group.id)}
          <div class="nav-group">
            <button
              id={`nav-trigger-${group.id}`}
              class="nav-link"
              class:active={group.links.some((link) => link.href === currentPath)}
              type="button"
              aria-expanded={openMenu === group.id}
              aria-controls={`nav-panel-${group.id}`}
              onclick={() => toggleMenu(group.id)}
              onkeydown={(event) => openWithKeyboard(event, group.id)}
            >
              {group.label}<ChevronDown
                size={13}
                class={openMenu === group.id ? "chevron-open" : ""}
              />
            </button>
            {#if openMenu === group.id}
              <div class="dropdown" id={`nav-panel-${group.id}`}>
                {#each group.links as link (link.href)}<a
                    href={link.href}
                    aria-current={currentPath === link.href ? "page" : undefined}
                    >{link.label}<ArrowUpRight size={13} aria-hidden="true" /></a
                  >{/each}
              </div>
            {/if}
          </div>
        {/each}
        <a class="apply-link" href="/onboarding">{$t.nav.apply}<ArrowUpRight size={15} /></a>
      </nav>
    </div>
  </div>
</header>

<style>
  .site-header {
    position: sticky;
    top: calc(-1 * var(--utility-height));
    z-index: 40;
    background: white;
  }
  .utility-bar {
    background: #edf2e8;
    color: #52645a;
  }
  .utility-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    min-height: 50px;
    padding-block: 6px;
  }
  .utility-links {
    display: flex;
    align-items: center;
    gap: 22px;
    font-size: 11px;
    white-space: nowrap;
  }
  .utility-links > a {
    display: flex;
    align-items: center;
    min-height: 34px;
  }
  .utility-links > a:hover {
    color: #165b45;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .language-label select {
    min-height: 34px !important;
    padding: 0 6px;
    border: 0;
    background: transparent;
    font-size: 11px;
    font-weight: 700;
    color: #165b45;
    cursor: pointer;
  }
  .nav-search {
    display: flex;
    align-items: center;
    gap: 9px;
    width: 320px;
    min-width: 0;
    padding: 0 10px;
    border: 1px solid #cfdbc8;
    border-radius: 4px;
    color: #65736e;
    background: #f9fbf7;
  }
  .nav-search input {
    width: 100%;
    min-width: 0;
    min-height: 34px !important;
    border: 0;
    outline: 0;
    background: transparent;
    font-size: 11px;
  }
  .nav-search:focus-within {
    outline: 2px solid #517c23;
    outline-offset: 2px;
  }
  .nav-search button {
    display: flex;
    padding: 7px 0 7px 7px;
    color: #165b45;
    cursor: pointer;
  }
  .account-area,
  .nav-group {
    position: relative;
  }
  .account-button {
    display: flex;
    align-items: center;
    gap: 7px;
    min-height: 34px;
    padding: 0 20px 0 0;
    border-right: 1px solid #cbd7c5;
    color: #165b45;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }
  .main-bar {
    position: relative;
    border-block: 1px solid #d5dfd0;
    box-shadow: 0 2px 3px #1b392708;
    background: linear-gradient(#fff, #fafcf8);
  }
  .compact .main-bar {
    box-shadow: 0 3px 12px #1b392710;
  }
  .brand-row {
    display: flex;
    align-items: center;
    gap: 36px;
    min-height: 76px;
  }
  .brand-link {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  nav {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 4px;
    min-width: 0;
  }
  .nav-link {
    display: flex;
    align-items: center;
    gap: 7px;
    min-height: 40px;
    padding: 0 12px;
    border-radius: 0;
    color: #52645a;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
  }
  .nav-link:hover,
  .nav-link.active {
    color: #165b45;
  }
  .nav-link.active {
    box-shadow: inset 0 -2px #527d35;
  }
  .apply-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    margin-left: auto;
    padding: 10px 13px;
    border: 1px solid #bccbb8;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
    color: #165b45;
    white-space: nowrap;
  }
  .apply-link:hover {
    background: #eaf1e4;
    border-color: #7f9d70;
  }
  .dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    z-index: 45;
    min-width: 240px;
    padding: 7px;
    border: 1px solid #c5d2c1;
    border-radius: 6px;
    background: white;
    box-shadow: 0 8px 24px #233b3520;
    animation: reveal 140ms ease-out;
  }
  .dropdown a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 12px;
    border-radius: 3px;
    color: #233b35;
    font-size: 12px;
  }
  .dropdown a:hover,
  .dropdown a[aria-current="page"] {
    color: #165b45;
  }
  .dropdown a[aria-current="page"] {
    border-radius: 0;
    box-shadow: inset 0 -2px #527d35;
  }
  .dropdown-label {
    display: block;
    padding: 7px 12px;
    margin-bottom: 4px;
    border-bottom: 1px solid #e1e8dd;
    font-size: 10px;
    color: #65736e;
  }
  .account-dropdown {
    top: calc(100% + 7px);
  }
  .mobile-toggle {
    display: none;
  }
  button :global(svg) {
    transition: transform 140ms ease;
  }
  :global(.chevron-open) {
    transform: rotate(180deg);
  }
  a:focus-visible,
  button:focus-visible,
  select:focus-visible {
    outline: 2px solid #517c23;
    outline-offset: 3px;
  }
  @keyframes reveal {
    from {
      opacity: 0;
      transform: translateY(-3px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @media (max-width: 1050px) {
    .brand-row {
      gap: 22px;
    }
    .nav-link {
      padding-inline: 9px;
      font-size: 11px;
    }
    .apply-link {
      padding-inline: 9px;
      font-size: 10px;
    }
  }
  @media (max-width: 860px) {
    .brand-row {
      min-height: 68px;
      justify-content: space-between;
    }
    .mobile-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      color: #165b45;
      cursor: pointer;
    }
    nav {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      max-height: calc(100dvh - 70px);
      overflow-y: auto;
      padding: 12px 20px 20px;
      background: white;
      border-bottom: 1px solid #c5d2c1;
      box-shadow: 0 8px 20px #233b3518;
    }
    nav.mobile-open {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 5px;
    }
    .nav-link {
      min-height: 44px;
      width: 100%;
      justify-content: space-between;
      font-size: 13px;
    }
    .nav-group .dropdown {
      position: static;
      min-width: 0;
      margin: 5px 0 7px 12px;
      border: 0;
      border-left: 2px solid #d5e2ce;
      border-radius: 0;
      box-shadow: none;
    }
    .apply-link {
      margin: 10px 0 0;
      min-height: 44px;
      font-size: 12px;
    }
  }
  @media (max-width: 560px) {
    .utility-inner {
      flex-direction: column;
      gap: 3px;
      padding-block: 8px 4px;
    }
    .nav-search {
      width: 100%;
    }
    .utility-links {
      width: 100%;
      justify-content: space-between;
      gap: 12px;
    }
    .utility-links > a,
    .account-button,
    .language-label select {
      min-height: 40px !important;
    }
    .account-button {
      padding-right: 14px;
    }
    .dropdown {
      min-width: 220px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .dropdown {
      animation: none;
    }
    button :global(svg) {
      transition: none;
    }
  }
</style>
