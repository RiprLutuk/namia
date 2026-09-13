<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { Search, LayoutGrid, Table as TableIcon, Scale, ArrowRight } from "lucide-svelte";
  import ProductCard, {
    type Product,
  } from "$lib/components/ProductCard.svelte";
  import CompareDrawer from "$lib/components/CompareDrawer.svelte";
  import { API_BASE_URL, NAMIA_API_KEY } from "$lib/api";
  import { cmsStore, fetchCmsContent } from "$lib/cms";

  // Categories list
  let categories = $state([
    { slug: "all", name: "Semua Kategori" },
    { slug: "p2p-lending", name: "P2P Lending Syariah" },
    { slug: "asuransi-syariah", name: "Asuransi Takaful" },
    { slug: "paylater-syariah", name: "Paylater Syariah" },
    { slug: "reksa-dana-syariah", name: "Sukuk & Reksa Dana" },
    { slug: "pembiayaan-usaha", name: "Pembiayaan UMKM" },
  ]);

  const contracts = [
    "Semua Akad",
    "Murabahah",
    "Mudharabah",
    "Musyarakah",
    "Wakalah bil Ujrah",
    "Qardh & Ujrah",
    "Ta'awun",
  ];

  // Filter & Search State
  let searchQuery = $state("");
  let selectedCategory = $state("all");
  let selectedContract = $state("Semua Akad");
  let maxAmountFilter = $state(2000000000);
  let sortBy = $state<"rating" | "amount_asc" | "amount_desc">("rating");
  let viewMode = $state<"grid" | "table">("grid");

  // Comparison State
  let comparedProducts = $state<Product[]>([]);
  let compareMessage = $state("");
  let isLoading = $state(true);
  let loadingError = $state(false);

  function toggleCompare(prod: Product) {
    compareMessage = "";
    const exists = comparedProducts.some((p) => p.id === prod.id);
    if (exists) {
      comparedProducts = comparedProducts.filter((p) => p.id !== prod.id);
    } else {
      if (comparedProducts.length >= 3) {
        compareMessage = "Anda sudah memilih 3 produk. Hapus satu untuk membandingkan pilihan lainnya.";
        return;
      }
      comparedProducts = [...comparedProducts, prod];
    }
  }

  function removeCompared(id: string) {
    comparedProducts = comparedProducts.filter((p) => p.id !== id);
  }

  function clearAllCompared() {
    comparedProducts = [];
  }

  // Master product dataset loaded dynamically from API
  let allProducts = $state<Product[]>([]);

  function applicationUrl(p: any): string {
    if (p.targetAudience === "investor" || p.categorySlug === "reksa-dana-syariah") return "/auth/cms/lender";
    if (p.applyUrl && !p.applyUrl.startsWith("/onboarding") && !p.applyUrl.startsWith("/borrower")) return p.applyUrl;
    return `/onboarding?productId=${p.id}&name=${encodeURIComponent(p.name)}&category=${encodeURIComponent(p.categorySlug || "p2p-lending")}`;
  }

  function resetFilters() {
    selectedCategory = "all";
    selectedContract = "Semua Akad";
    searchQuery = "";
    maxAmountFilter = 2000000000;
  }

  async function loadAggregatorData() {
    isLoading = true;
    loadingError = false;
    try {
      const headers = { "x-api-key": NAMIA_API_KEY };
      const [catRes, prodRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/aggregator/categories`, { headers }),
        fetch(`${API_BASE_URL}/api/aggregator/products`, { headers }),
      ]);

      if (catRes.ok) {
        const catJson = await catRes.json();
        if (catJson.success && Array.isArray(catJson.data)) {
          categories = [
            { slug: "all", name: "Semua Kategori" },
            ...catJson.data.map((c: any) => ({
              slug: c.slug,
              name: c.name,
            })),
          ];
        }
      }

      if (prodRes.ok) {
        const prodJson = await prodRes.json();
        if (prodJson.success && Array.isArray(prodJson.data)) {
          allProducts = prodJson.data.map((p: any) => ({
            id: String(p.id),
            name: p.name,
            institution: p.provider || "PT Namia Finansial Teknologi",
            categorySlug: p.categorySlug || "p2p-lending",
            islamicContract: p.contractType || "Murabahah",
            minAmount: p.minAmount,
            maxAmount: p.maxAmount,
            interestRateOrMargin: `${p.interestRateAnnual}% per tahun`,
            tenorMinMonths: p.minTenorMonths,
            tenorMaxMonths: p.maxTenorMonths,
            approvalSpeed: p.minTenorMonths <= 1 ? "Instant Digital" : "1-3 Hari Kerja",
            rating: p.rating || 0,
            reviewCount: 0,
            features: p.features || [],
            ojkRegulated: p.ojkRegulated === true,
            dpsSupervised: p.shariaAccredited === true,
            applyUrl: applicationUrl(p),
            description: p.description,
            targetAudience: p.targetAudience || (p.categorySlug === "reksa-dana-syariah" ? "investor" : "borrower"),
            isFeatured: p.isFeatured || false
          }));
          isLoading = false;
          return;
        }
      }
    } catch (e) {
      console.warn("Using fallback from cms store", e);
    }

    if ($cmsStore.products && $cmsStore.products.length > 0) {
      allProducts = $cmsStore.products.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        institution: p.provider || "PT Namia Finansial Teknologi",
        categorySlug: p.categorySlug || "p2p-lending",
        islamicContract: p.contractType || "Murabahah",
        minAmount: p.minAmount,
        maxAmount: p.maxAmount,
        interestRateOrMargin: `${p.interestRateAnnual}% per tahun`,
        tenorMinMonths: p.minTenorMonths,
        tenorMaxMonths: p.maxTenorMonths,
        approvalSpeed: "1-3 Hari Kerja",
        rating: p.rating || 0,
        reviewCount: 0,
        features: p.features || [],
        ojkRegulated: p.ojkRegulated === true,
        dpsSupervised: p.shariaAccredited === true,
        applyUrl: applicationUrl(p),
            description: p.description,
            targetAudience: p.targetAudience || (p.categorySlug === "reksa-dana-syariah" ? "investor" : "borrower"),
        isFeatured: false
      }));
    }
    isLoading = false;
    loadingError = allProducts.length === 0;
  }

  onMount(async () => {
    await fetchCmsContent();
    await loadAggregatorData();

    const cat = page.url.searchParams.get("category");
    if (cat && categories.some((c) => c.slug === cat)) {
      selectedCategory = cat;
    }
    const q = page.url.searchParams.get("search");
    if (q) {
      searchQuery = q;
    }
    const maxAmt = page.url.searchParams.get("maxAmount");
    if (maxAmt && Number.isFinite(Number(maxAmt))) {
      maxAmountFilter = Math.min(2000000000, Math.max(1000000, Number(maxAmt)));
    }
  });

  // Filter and Sort derivation
  let filteredProducts = $derived.by(() => {
    return allProducts
      .filter((p) => {
        // Category
        if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) {
          return false;
        }
        // Sharia Contract
        if (
          selectedContract !== "Semua Akad" &&
          p.islamicContract !== selectedContract
        ) {
          return false;
        }
        // Min Amount filter
        if (p.minAmount > maxAmountFilter) {
          return false;
        }
        // Search Query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchInst = p.institution.toLowerCase().includes(q);
          const matchFeat = p.features.some((f) => f.toLowerCase().includes(q));
          if (!matchName && !matchInst && !matchFeat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "amount_asc") return a.minAmount - b.minAmount;
        if (sortBy === "amount_desc") return b.maxAmount - a.maxAmount;
        return 0;
      });
  });

  function formatRupiah(num: number): string {
    if (num >= 1000000000) {
      return `Rp ${(num / 1000000000).toLocaleString("id-ID")} M`;
    }
    return `Rp ${(num / 1000000).toLocaleString("id-ID")} Jt`;
  }
</script>

<svelte:head>
  <title>Katalog produk — Namia Syariah</title>
  <meta name="description" content="Temukan dan bandingkan pilihan pembiayaan serta pendanaan syariah berdasarkan akad, jumlah dana, dan jangka waktu." />
</svelte:head>

<div class="portal-page catalogue-page">
  <div class="portal-container">
    <header class="catalogue-heading">
      <div><p class="portal-kicker">Katalog produk</p><h1 class="portal-heading">Pilihan yang cocok,<br />keputusan yang tenang.</h1><p>Cari kebutuhan Anda. Bandingkan ketentuannya. Lanjutkan saat sudah yakin.</p></div>
      <a class="calculator-link" href="/calculators">Hitung kemampuan Anda dulu <ArrowRight size={15} /></a>
    </header>
    <div class="catalogue-layout">
      <aside class="filters portal-panel" aria-label="Filter produk">
        <div class="filter-heading"><h2>Sesuaikan pilihan</h2><button type="button" onclick={resetFilters}>Reset</button></div>
        <label for="product-search">Cari produk atau penyedia</label>
        <div class="search-input"><Search size={16} /><input id="product-search" type="search" bind:value={searchQuery} placeholder="Nama, mitra, kebutuhan..." /></div>
        <fieldset><legend>Kategori</legend><div class="category-options">{#each categories as category}<button type="button" class:active={selectedCategory === category.slug} aria-pressed={selectedCategory === category.slug} onclick={() => selectedCategory = category.slug}>{category.name}<span>{allProducts.filter(p => category.slug === 'all' || p.categorySlug === category.slug).length}</span></button>{/each}</div></fieldset>
        <label for="contract-filter">Akad</label><select id="contract-filter" bind:value={selectedContract}>{#each contracts as contract}<option value={contract}>{contract}</option>{/each}</select>
        <label for="amount-filter">Dana yang disiapkan / dibutuhkan</label><select id="amount-filter" bind:value={maxAmountFilter}><option value={2000000000}>Semua nominal</option><option value={5000000}>Hingga Rp 5 juta</option><option value={25000000}>Hingga Rp 25 juta</option><option value={100000000}>Hingga Rp 100 juta</option><option value={500000000}>Hingga Rp 500 juta</option>{#if ![2000000000,5000000,25000000,100000000,500000000].includes(maxAmountFilter)}<option value={maxAmountFilter}>Hingga {formatRupiah(maxAmountFilter)}</option>{/if}</select>
        <p class="filter-note">Menampilkan produk dengan dana minimum yang sesuai pilihan Anda.</p>
      </aside>
      <section class="catalogue-results" aria-label="Hasil pencarian produk">
        <div class="results-toolbar"><p aria-live="polite"><strong>{filteredProducts.length}</strong> pilihan tersedia</p><div class="view-controls"><label class="sr-only" for="product-sort">Urutkan produk</label><select id="product-sort" bind:value={sortBy}><option value="rating">Rating tertinggi</option><option value="amount_asc">Dana minimum terendah</option><option value="amount_desc">Dana maksimum tertinggi</option></select><button type="button" class:active={viewMode === 'grid'} aria-label="Tampilan kartu" aria-pressed={viewMode === 'grid'} onclick={() => viewMode = 'grid'}><LayoutGrid size={16} /></button><button type="button" class:active={viewMode === 'table'} aria-label="Tampilan tabel" aria-pressed={viewMode === 'table'} onclick={() => viewMode = 'table'}><TableIcon size={16} /></button></div></div>
        {#if compareMessage}<p class="compare-notice" role="status">{compareMessage}</p>{/if}
        {#if isLoading}<div class="empty-state portal-panel" role="status"><h2>Menyiapkan pilihan produk...</h2><p>Katalog Anda akan segera tampil.</p></div>
        {:else if loadingError}<div class="empty-state portal-panel" role="alert"><h2>Katalog belum dapat dimuat.</h2><p>Coba muat kembali untuk melihat pilihan produk.</p><button class="portal-button" type="button" onclick={loadAggregatorData}>Muat kembali</button></div>
        {:else if filteredProducts.length === 0}<div class="empty-state portal-panel"><Search size={27} /><h2>Belum ada pilihan yang cocok.</h2><p>Coba kata kunci lebih singkat atau longgarkan filter Anda.</p><button class="portal-button-secondary" type="button" onclick={resetFilters}>Tampilkan semua produk</button></div>
        {:else if viewMode === 'grid'}<div class="product-grid">{#each filteredProducts as product (product.id)}<ProductCard {product} isCompared={comparedProducts.some(p => p.id === product.id)} onToggleCompare={toggleCompare} />{/each}</div>
        {:else}<div class="table-scroll portal-panel"><table><thead><tr><th scope="col">Produk</th><th scope="col">Rentang dana</th><th scope="col">Margin / bagi hasil</th><th scope="col">Jangka waktu</th><th scope="col">Pilihan Anda</th></tr></thead><tbody>{#each filteredProducts as product (product.id)}<tr><td><small>{product.institution}</small><strong>{product.name}</strong><span>{product.islamicContract}</span><details><summary>Rincian produk</summary><p>{product.description}</p><ul>{#each product.features as feature}<li>{feature}</li>{/each}</ul></details></td><td>{formatRupiah(product.minAmount)} – {formatRupiah(product.maxAmount)}</td><td>{product.interestRateOrMargin}</td><td>{product.tenorMinMonths}–{product.tenorMaxMonths} bulan</td><td><div class="table-actions"><button type="button" class:active={comparedProducts.some(p => p.id === product.id)} aria-pressed={comparedProducts.some(p => p.id === product.id)} aria-label="Bandingkan {product.name}" onclick={() => toggleCompare(product)}><Scale size={15} /></button><a class="portal-button" href={product.applyUrl}>Lanjutkan</a></div></td></tr>{/each}</tbody></table></div>{/if}
        <p class="catalogue-footnote">Informasi produk dapat berubah. Periksa rincian biaya dan ketentuan pada penyedia pilihan Anda.</p>
      </section>
    </div>
  </div>
</div>
<CompareDrawer {comparedProducts} onRemoveProduct={removeCompared} onClearAll={clearAllCompared} />

<style>
  .catalogue-page{padding-bottom:120px}.catalogue-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:25px;padding:40px 0 32px}.catalogue-heading>div>p:last-child{font-size:14px;color:#65736e;max-width:500px;line-height:1.7;margin-top:14px}.calculator-link{display:flex;align-items:center;gap:7px;color:#165b45;text-decoration:underline;text-underline-offset:4px;font-size:12px;margin-bottom:6px}
  .catalogue-layout{display:grid;grid-template-columns:245px minmax(0,1fr);gap:26px;align-items:start}.filters{padding:20px;background:white}.filter-heading{display:flex;justify-content:space-between;align-items:center;margin-bottom:21px}.filter-heading h2{font:700 14px Tahoma,Arial,sans-serif;margin:0}.filter-heading button{border:0;background:none;font-size:11px;text-decoration:underline;color:#65736e;cursor:pointer}.filters>label,.filters legend{display:block;font-size:11px;font-weight:700;color:#233b35;margin-bottom:8px}.search-input{position:relative;margin-bottom:24px}.search-input :global(svg){position:absolute;left:10px;top:11px;color:#65736e}.search-input input{padding-left:32px!important}.filters input,.filters select{width:100%;padding:10px;border:1px solid #bfcebd;border-radius:4px;background:#fff;font-size:12px;color:#233b35;min-width:0}.filters>select{margin-bottom:22px}.filters fieldset{padding:0;border:0;margin:0 0 23px}.category-options{display:grid;gap:3px}.category-options button{display:flex;justify-content:space-between;text-align:left;gap:5px;padding:9px 10px;border:1px solid transparent;border-radius:4px;background:transparent;color:#65736e;font-size:12px;cursor:pointer}.category-options button.active{background:#eaf1dc;border-color:#d4e0bf;color:#165b45;font-weight:700}.category-options span{font-size:11px}.filter-note{font-size:11px;line-height:1.7;color:#65736e;margin-top:-11px}
  .results-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:17px;min-height:35px}.results-toolbar p{font-size:12px;color:#65736e;margin:0}.results-toolbar strong{color:#233b35}.view-controls{display:flex;align-items:center;gap:5px}.view-controls select{border:0;background:transparent;font-size:11px;color:#65736e;max-width:190px}.view-controls button,.table-actions button{padding:8px;border:1px solid #cdd8ce;border-radius:4px;background:linear-gradient(#fff,#f0f3ed);color:#65736e;cursor:pointer}.view-controls button.active,.table-actions button.active{background:#dfecb9;border-color:#a1bb73;color:#165b45}.product-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:19px}.empty-state{padding:55px 25px;background:white;text-align:center}.empty-state :global(svg){color:#65736e;margin:0 auto 17px}.empty-state h2{font:24px Georgia,serif}.empty-state p{font-size:13px;color:#65736e;line-height:1.7;margin:12px 0 22px}.catalogue-footnote{font-size:11px;color:#65736e;line-height:1.7;margin-top:20px}.compare-notice{padding:12px;background:#dfecb9;border:1px solid #b8ca98;border-radius:4px;font-size:12px;margin-bottom:15px}
  .table-scroll{overflow-x:auto;background:white}table{border-collapse:collapse;width:100%;font-size:12px}th,td{text-align:left;padding:16px;border-bottom:1px solid #e1e7de;vertical-align:top;min-width:130px}th{background:#edf2e7;font-size:11px;font-weight:700}td:first-child{min-width:220px}td small,td strong,td>span{display:block}td small{color:#65736e;font-size:10px;margin-bottom:5px}td strong{font-size:14px;margin-bottom:6px}td>span{font-size:11px;color:#165b45}.table-actions{display:flex;align-items:center;gap:6px}.table-actions a{font-size:12px;padding:8px}details{font-size:11px;line-height:1.65;margin-top:10px}summary{color:#165b45;text-decoration:underline;cursor:pointer}details ul{padding-left:14px}.table-actions .portal-button{white-space:nowrap}button:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible,summary:focus-visible{outline:3px solid #a1bb73;outline-offset:3px}
  @media(min-width:1400px){.catalogue-layout{grid-template-columns:245px minmax(0,1fr)}}@media(max-width:900px){.catalogue-layout{grid-template-columns:210px minmax(0,1fr);gap:18px}.filters{padding:15px}.product-grid{grid-template-columns:1fr}.catalogue-heading{align-items:flex-start;flex-direction:column;gap:12px}}
  @media(max-width:650px){.catalogue-heading{padding-top:26px}.catalogue-layout{grid-template-columns:1fr}.filters{padding:17px}.filters fieldset{margin-bottom:17px}.category-options{display:flex;flex-wrap:wrap;gap:5px}.category-options button{border-color:#d6dfcf;padding:7px;font-size:11px}.category-options span{display:none}.search-input{margin-bottom:17px}.filters>select{margin-bottom:17px}.results-toolbar{flex-wrap:wrap}.product-grid{grid-template-columns:1fr}.view-controls select{max-width:170px}}
</style>
