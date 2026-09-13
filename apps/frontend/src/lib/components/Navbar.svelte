<script lang="ts">
  import { Menu, X, Search, ArrowUpRight, LogIn, ChevronDown } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Logo from "$lib/components/Logo.svelte";
  import { currentLanguage, setLanguage, t, type SupportedLang } from "$lib/i18n";
  let mobileOpen = $state(false);
  let moreOpen = $state(false);
  let accountOpen = $state(false);
  let search = $state("");
  let currentPath = $derived(page.url.pathname);
  $effect(() => { currentPath; mobileOpen = false; moreOpen = false; accountOpen = false; });
  const languages: SupportedLang[] = ["ID", "EN", "AR"];
  function submitSearch(event: SubmitEvent) {
    event.preventDefault();
    if (search.trim()) { goto(`/aggregator?search=${encodeURIComponent(search.trim())}`); mobileOpen = false; }
  }
  function closeMenus(event: KeyboardEvent) {
    if (event.key === "Escape") { mobileOpen = false; moreOpen = false; accountOpen = false; }
  }
</script>

<svelte:window onkeydown={closeMenus} />
<header class="site-header">
  <div class="utility-bar"><div class="portal-container utility-inner"><span>Ruang untuk tumbuh bersama.</span><div><a href="/contacts">Bantuan</a><a href="/rss.xml">RSS</a><label class="language-label"><span class="sr-only">Bahasa navigasi</span><select aria-label="Bahasa navigasi" value={$currentLanguage} onchange={(event) => setLanguage(event.currentTarget.value as SupportedLang)}>{#each languages as language}<option value={language}>{language}</option>{/each}</select></label></div></div></div>
  <div class="portal-container brand-row">
    <a href="/" aria-label="Namia Syariah — Beranda" class="brand-link"><Logo size="md" showBadge={true} showOjk={false} /><span class="brand-tagline">Pendanaan & pembiayaan usaha</span></a>
    <form class="nav-search" role="search" onsubmit={submitSearch}><label class="sr-only" for="nav-search">Cari produk atau akad</label><Search size={16} /><input id="nav-search" type="search" placeholder="Cari produk atau akad…" bind:value={search} /><button type="submit" aria-label="Cari produk"><ArrowUpRight size={17} /></button></form>
    <div class="account-area"><button class="account-button" type="button" aria-expanded={accountOpen} aria-controls="account-menu" onclick={() => { accountOpen = !accountOpen; moreOpen = false; }}><LogIn size={16} /><span>{$t.nav.login}</span><ChevronDown size={13} /></button>{#if accountOpen}<div class="dropdown account-dropdown" id="account-menu"><span class="dropdown-label">Pilih akun Anda</span><a href="/auth/cms/borrower">Akun pembiayaan <ArrowUpRight size={14}/></a><a href="/auth/cms/lender">Akun pendana <ArrowUpRight size={14}/></a></div>{/if}</div>
    <button type="button" class="mobile-toggle" aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={mobileOpen} aria-controls="main-navigation" onclick={() => mobileOpen = !mobileOpen}>{#if mobileOpen}<X size={23}/>{:else}<Menu size={23}/>{/if}</button>
  </div>
  <div class="navigation-bar"><div class="portal-container navigation-inner"><nav id="main-navigation" aria-label="Navigasi utama" class:mobile-open={mobileOpen}>
    <a href="/" class:active={currentPath === '/'} aria-current={currentPath === '/' ? 'page' : undefined}>{$t.nav.home}</a>
    <a href="/borrower" class:active={currentPath === '/borrower'} aria-current={currentPath === '/borrower' ? 'page' : undefined}>{$t.nav.financing}</a>
    <a href="/investor" class:active={currentPath === '/investor'} aria-current={currentPath === '/investor' ? 'page' : undefined}>{$t.nav.funding}</a>
    <a href="/aggregator" class:active={currentPath === '/aggregator'} aria-current={currentPath === '/aggregator' ? 'page' : undefined}>{$currentLanguage === 'ID' ? 'Katalog produk' : $t.nav.aggregator}</a>
    <a href="/calculators" class:active={currentPath === '/calculators'} aria-current={currentPath === '/calculators' ? 'page' : undefined}>{$currentLanguage === 'ID' ? 'Simulasi' : $t.nav.calculators}</a>
    <div class="more-area"><button type="button" aria-expanded={moreOpen} aria-controls="about-navigation" class:active={['/about','/team','/blog','/contacts'].includes(currentPath)} onclick={() => { moreOpen = !moreOpen; accountOpen = false; }}>{$t.nav.about}<ChevronDown size={13}/></button>{#if moreOpen}<div class="dropdown more-dropdown" id="about-navigation"><a href="/about">{$t.nav.profile}</a><a href="/team">{$t.nav.team}</a><a href="/blog">{$t.nav.blog}</a><a href="/contacts">{$t.nav.faq}</a></div>{/if}</div>
    <form class="mobile-search" role="search" onsubmit={submitSearch}><label class="sr-only" for="mobile-search">Cari produk</label><input id="mobile-search" type="search" placeholder="Cari produk atau akad…" bind:value={search}/><button type="submit" aria-label="Cari produk"><Search size={18}/></button></form>
  </nav><a class="apply-link" href="/onboarding">{$t.nav.apply}<ArrowUpRight size={15}/></a></div></div>
</header>

<style>
  .site-header{position:sticky;top:0;z-index:40;background:white;border-bottom:1px solid #b9c8b6;box-shadow:0 2px 3px #1b392708}
  .utility-bar{background:#edf2e8;border-bottom:1px solid #e0e7dc;color:#65736e;font-size:10px}
  .utility-inner{display:flex;align-items:center;justify-content:space-between;min-height:28px}
  .utility-inner>div{display:flex;align-items:center;gap:17px}.utility-inner a:hover{text-decoration:underline}
  .language-label select{min-height:24px!important;font-size:10px;padding:0 4px;background:transparent;border:0;color:#165b45;cursor:pointer}
  .brand-row{display:flex;align-items:center;gap:25px;min-height:77px}.brand-link{display:flex;align-items:center;gap:19px;flex:1}.brand-tagline{border-left:1px solid #d2dccf;padding-left:19px;font-size:10px;max-width:140px;color:#65736e;line-height:1.6}
  .nav-search{display:flex;align-items:center;gap:9px;background:#f6f8f3;border:1px solid #d2dccf;border-radius:4px;padding:0 10px;color:#65736e;width:255px}
  .nav-search input{width:100%;min-width:0;background:transparent;min-height:35px!important;font-size:11px;border:0;outline:0}.nav-search:focus-within{outline:2px solid #517c23;outline-offset:2px}.nav-search button{padding:5px;cursor:pointer;color:#165b45}
  .account-area{position:relative}.account-button{display:flex;align-items:center;gap:8px;min-height:36px;background:linear-gradient(white,#f0f4ea);border:1px solid #bccbb8;border-radius:4px;padding:7px 12px;font-size:11px;font-weight:700;color:#165b45;cursor:pointer}
  .navigation-bar{background:linear-gradient(#fff,#f0f4eb);border-top:1px solid #e1e8dc}.navigation-inner{display:flex;justify-content:space-between;align-items:center;gap:14px}nav{display:flex;align-items:stretch;gap:6px}nav>a,.more-area>button{min-height:44px;display:flex;align-items:center;gap:6px;padding:0 15px;font-size:12px;color:#52645a;font-weight:600;border-bottom:3px solid transparent;margin-bottom:-1px;cursor:pointer}nav>a:hover,.more-area>button:hover{background:#e9f0e2;color:#165b45}nav .active{color:#165b45;border-bottom-color:#165b45;background:#e8f0e0}
  .apply-link{display:flex;align-items:center;gap:6px;font-size:11px;color:#165b45;font-weight:700;white-space:nowrap}.apply-link:hover{text-decoration:underline}
  .more-area{position:relative}.dropdown{position:absolute;z-index:45;top:calc(100% + 5px);background:white;border:1px solid #c5d2c1;box-shadow:0 7px 18px #233b3518;border-radius:4px;padding:7px;min-width:230px}.dropdown a{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:11px;font-size:12px;color:#233b35}.dropdown a:hover{background:#edf3e6;color:#165b45}.account-dropdown{right:0}.dropdown-label{display:block;color:#65736e;font-size:10px;padding:6px 11px;border-bottom:1px solid #e1e8dd;margin-bottom:3px}.mobile-toggle,.mobile-search{display:none}
  @media(max-width:1023px){.brand-tagline{display:none}.brand-row{gap:16px}nav>a,.more-area>button{padding:0 10px;font-size:11px}.nav-search{width:220px}.apply-link{font-size:10px}}
  @media(max-width:760px){.brand-row{min-height:70px;gap:12px}.nav-search{display:none}.account-button{padding:8px}.account-button>span{display:none}.mobile-toggle{display:flex;color:#165b45;padding:7px;cursor:pointer}.navigation-inner{display:block}.navigation-inner>nav{display:none;padding:10px 0 17px}.navigation-inner>nav.mobile-open{display:flex;flex-direction:column;gap:3px}nav>a,.more-area>button{min-height:42px;font-size:13px;border-bottom:0;border-left:3px solid transparent;width:100%;justify-content:flex-start}.more-area>button.active,nav>a.active{border-left-color:#165b45}.more-dropdown{position:static;box-shadow:none;margin-top:4px;margin-left:12px;min-width:0}.apply-link{justify-content:center;min-height:35px;font-size:11px}.mobile-search{display:flex;border:1px solid #d2dccf;background:white;margin-top:8px;border-radius:4px}.mobile-search input{width:100%;min-width:0;padding:8px 12px;background:transparent}.mobile-search button{padding:8px 12px}.utility-inner{font-size:9px}.utility-inner>div{gap:12px}.account-dropdown{right:-45px}}
</style>
