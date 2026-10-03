<script lang="ts">
  import type { Snippet } from "svelte";
  import { goto } from "$app/navigation";
  import { Menu, X, ExternalLink, RefreshCw, RotateCcw, ArrowLeft } from "lucide-svelte";
  import Logo from "$lib/components/Logo.svelte";
  import { cmsNavigation, type CmsTab } from "./navigation";
  let {
    activeTab = $bindable<CmsTab>("overview"),
    onrefresh,
    onreset,
    children,
  }: {
    activeTab: CmsTab;
    onrefresh: () => void;
    onreset: () => void;
    children: Snippet;
  } = $props();
  let mobileOpen = $state(false);
  const title = $derived(
    cmsNavigation.flatMap((group) => [...group.items]).find((item) => item.id === activeTab)?.label,
  );
  async function select(tab: CmsTab) {
    activeTab = tab;
    mobileOpen = false;
    await goto(`/cms?tab=${tab}`, { replaceState: true, noScroll: true, keepFocus: true });
  }
</script>

<svelte:window
  onkeydown={(event) => {
    if (event.key === "Escape") mobileOpen = false;
  }}
/>
<div class="cms-workspace">
  {#if mobileOpen}<button
      class="cms-backdrop"
      aria-label="Tutup navigasi"
      onclick={() => (mobileOpen = false)}
    ></button>{/if}
  <aside class:open={mobileOpen}>
    <a href="/cms" class="cms-brand"
      ><Logo size="md" showBadge={false} showOjk={false} /><span>RUANG EDITOR</span></a
    >
    <button class="cms-close" onclick={() => (mobileOpen = false)} aria-label="Tutup menu"
      ><X size={20} /></button
    >
    <nav aria-label="Navigasi CMS">
      {#each cmsNavigation as group}<div class="cms-nav-group">
          <p>{group.label}</p>
          {#each group.items as item}<button
              aria-current={activeTab === item.id ? "page" : undefined}
              onclick={() => select(item.id)}><item.icon size={17} />{item.label}</button
            >{/each}
        </div>{/each}
    </nav>
    <div class="cms-side-footer">
      <a href="/backoffice/auth"><ArrowLeft size={16} />Pengajuan & pesan</a><button
        onclick={onreset}><RotateCcw size={15} />Pulihkan konten awal</button
      >
    </div>
  </aside>
  <div class="cms-body">
    <header class="cms-topbar">
      <div>
        <button
          class="cms-menu"
          aria-label="Buka navigasi CMS"
          aria-expanded={mobileOpen}
          onclick={() => (mobileOpen = true)}><Menu size={20} /></button
        ><span>Konten website</span><strong>{title}</strong>
      </div>
      <div>
        <button aria-label="Segarkan konten" title="Segarkan konten" onclick={onrefresh}
          ><RefreshCw size={17} /></button
        ><a href="/" target="_blank" rel="noopener">Lihat website<ExternalLink size={15} /></a>
      </div>
    </header>
    <main id="cms-content">{@render children()}</main>
  </div>
</div>

<style>
  .cms-workspace {
    --cms-ink: #183f35;
    --cms-line: #dce5df;
    display: flex;
    min-height: 100vh;
    background: #f4f7f5;
    color: #203b32;
    font-family: Arial, sans-serif;
  }
  aside {
    width: 246px;
    flex-shrink: 0;
    background: #fff;
    border-right: 1px solid var(--cms-line);
    padding: 28px 16px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    position: sticky;
    top: 0;
    height: 100dvh;
    overflow: auto;
  }
  .cms-brand {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0 12px;
  }
  .cms-brand span {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #698077;
  }
  .cms-nav-group {
    margin-bottom: 24px;
  }
  .cms-nav-group p {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.1px;
    color: #71847b;
    margin: 0 12px 10px;
  }
  nav button {
    display: flex;
    align-items: center;
    gap: 11px;
    text-align: left;
    padding: 12px;
    width: 100%;
    font-size: 12px;
    font-weight: 600;
    color: #52675d;
    border-radius: 6px;
    margin-bottom: 3px;
    cursor: pointer;
  }
  nav button:hover {
    background: #f0f5f1;
  }
  nav button[aria-current] {
    background: #e7f1eb;
    color: #165a42;
    box-shadow: inset 3px 0 #217553;
  }
  .cms-side-footer {
    margin-top: auto;
    border-top: 1px solid var(--cms-line);
    padding: 16px 10px 0;
    display: grid;
    gap: 18px;
  }
  .cms-side-footer a,
  .cms-side-footer button {
    display: flex;
    gap: 9px;
    align-items: center;
    font-size: 11px;
    color: #64796e;
    text-align: left;
    cursor: pointer;
  }
  .cms-body {
    flex: 1;
    min-width: 0;
  }
  .cms-topbar {
    height: 76px;
    background: #ffffffed;
    border-bottom: 1px solid var(--cms-line);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 36px;
    position: sticky;
    top: 0;
    z-index: 15;
    gap: 14px;
  }
  .cms-topbar > div {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .cms-topbar span {
    font-size: 11px;
    color: #7c8b83;
  }
  .cms-topbar strong {
    font-size: 12px;
  }
  .cms-topbar button {
    padding: 9px;
    cursor: pointer;
  }
  .cms-topbar a {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--cms-line);
    border-radius: 5px;
    padding: 9px 12px;
    font-size: 11px;
    font-weight: 600;
  }
  main {
    padding: 36px;
    max-width: 1360px;
    margin: auto;
  }
  .cms-menu,
  .cms-close,
  .cms-backdrop {
    display: none;
  }
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid #27845e;
    outline-offset: 3px;
  }
  @media (max-width: 900px) {
    aside {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 50;
      display: none;
    }
    aside.open {
      display: flex;
    }
    .cms-backdrop {
      display: block;
      position: fixed;
      inset: 0;
      background: #10251c66;
      z-index: 45;
    }
    .cms-close {
      display: block;
      position: absolute;
      right: 14px;
      top: 24px;
    }
    .cms-menu {
      display: block;
    }
    .cms-topbar {
      padding: 0 16px;
      height: 64px;
    }
    .cms-topbar span {
      display: none;
    }
    main {
      padding: 24px 16px;
    }
    .cms-topbar > div {
      gap: 6px;
    }
    .cms-topbar a {
      font-size: 10px;
      padding: 8px;
    }
  }
</style>
