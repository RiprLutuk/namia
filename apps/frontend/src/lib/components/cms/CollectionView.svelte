<script lang="ts" generics="T extends { id: number }">
  import type { Snippet } from "svelte";
  import { Plus, Search } from "lucide-svelte";
  let {
    title,
    description,
    items,
    searchText,
    oncreate,
    createLabel,
    row,
    filters,
  }: {
    title: string;
    description: string;
    items: T[];
    searchText: (item: T) => string;
    oncreate: () => void;
    createLabel: string;
    row: Snippet<[T]>;
    filters?: Snippet;
  } = $props();
  let query = $state("");
  const filtered = $derived(
    items.filter((item) =>
      searchText(item).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
    ),
  );
</script>

<section class="collection">
  <header>
    <div>
      <p class="eyebrow">KATALOG & PUBLIKASI</p>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
    <button class="create" onclick={oncreate}><Plus size={16} />{createLabel}</button>
  </header>
  <div class="collection-panel">
    <div class="toolbar">
      <label
        ><Search size={17} /><input
          type="search"
          placeholder={`Cari ${title.toLowerCase()}…`}
          aria-label={`Cari ${title.toLowerCase()}`}
          bind:value={query}
        /></label
      ><span>{filtered.length} dari {items.length} entri</span>
    </div>
    {#if filters}<div class="filters">{@render filters()}</div>{/if}
    <div class="collection-rows">
      {#each filtered as item (item.id)}<article class="collection-row">
          {@render row(item)}
        </article>{:else}<div class="empty">
          <h2>{query ? "Tidak ada hasil yang cocok" : "Belum ada konten"}</h2>
          <p>
            {query
              ? "Coba kata kunci lain atau hapus pencarian."
              : "Tambahkan konten pertama untuk bagian ini."}
          </p>
          {#if query}<button onclick={() => (query = "")}>Hapus pencarian</button>{/if}
        </div>{/each}
    </div>
  </div>
</section>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 28px;
  }
  h1 {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.8px;
    color: #183f35;
    margin: 8px 0;
  }
  header p {
    font-size: 12px;
    color: #73837a;
    line-height: 1.7;
  }
  .eyebrow {
    font-size: 10px;
    letter-spacing: 1.6px;
    color: #39765b;
    font-weight: 700;
  }
  .create {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: #185d45;
    color: #fff;
    border-radius: 5px;
    padding: 12px 16px;
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
  }
  .collection-panel {
    background: white;
    border: 1px solid #dce5df;
    border-radius: 8px;
    overflow: hidden;
  }
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 22px;
    border-bottom: 1px solid #e7ece8;
    gap: 12px;
  }
  .toolbar label {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #829288;
    flex: 1;
  }
  .toolbar input {
    outline: none;
    font-size: 12px;
    min-width: 0;
    width: 100%;
    padding: 6px;
    background: transparent;
  }
  .toolbar span {
    font-size: 11px;
    color: #73837a;
    white-space: nowrap;
  }
  .filters {
    padding: 14px 22px;
    border-bottom: 1px solid #e7ece8;
  }
  .collection-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 22px;
    border-bottom: 1px solid #edf1ee;
  }
  .collection-row:last-child {
    border: 0;
  }
  .collection-row:hover {
    background: #fafcfb;
  }
  .collection-row :global(.entry-copy) {
    flex: 1;
    min-width: 0;
  }
  .collection-row :global(h2) {
    font-size: 14px;
    font-weight: 600;
    color: #254a3b;
    margin: 0 0 6px;
  }
  .collection-row :global(p) {
    font-size: 12px;
    color: #6e8175;
    line-height: 1.6;
    margin: 0;
    overflow-wrap: anywhere;
  }
  .collection-row :global(.entry-meta) {
    font-size: 10px;
    color: #6c8274;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .collection-row :global(.entry-actions) {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
  }
  .collection-row :global(button) {
    font-size: 11px;
    border: 1px solid #d9e3dc;
    border-radius: 4px;
    padding: 8px 11px;
    color: #285943;
    cursor: pointer;
    background: white;
  }
  .collection-row :global(button.danger) {
    color: #a44444;
  }
  .empty {
    text-align: center;
    padding: 56px 20px;
  }
  .empty h2 {
    font-size: 16px;
  }
  .empty p {
    font-size: 12px;
    margin-top: 10px;
    color: #748379;
  }
  .empty button {
    margin-top: 18px;
    color: #185d45;
    text-decoration: underline;
  }
  input:focus-visible,
  button:focus-visible {
    outline: 2px solid #27845e;
    outline-offset: 3px;
  }
  @media (max-width: 600px) {
    header {
      align-items: flex-start;
      flex-direction: column;
    }
    h1 {
      font-size: 24px;
    }
    .collection-row {
      padding: 18px 16px;
      flex-wrap: wrap;
    }
    .toolbar {
      padding: 12px;
    }
    .collection-row :global(.entry-copy) {
      flex-basis: 100%;
    }
    .create {
      width: 100%;
    }
  }
</style>
