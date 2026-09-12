<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import {
    Filter,
    Search,
    SlidersHorizontal,
    Scale,
    ArrowUpDown,
    CheckCircle2,
    Sparkles,
    Building2,
    ShieldCheck,
    ChevronRight,
    LayoutGrid,
    Table as TableIcon,
    Clock,
    Star,
    Check
  } from "lucide-svelte";
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

  function toggleCompare(prod: Product) {
    const exists = comparedProducts.some((p) => p.id === prod.id);
    if (exists) {
      comparedProducts = comparedProducts.filter((p) => p.id !== prod.id);
    } else {
      if (comparedProducts.length >= 3) {
        alert("Maksimal perbandingan 3 produk secara bersamaan.");
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

  async function loadAggregatorData() {
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
            interestRateOrMargin: `${p.interestRateAnnual}% p.a (Bagi Hasil/Margin)`,
            tenorMinMonths: p.minTenorMonths,
            tenorMaxMonths: p.maxTenorMonths,
            approvalSpeed: p.minTenorMonths <= 1 ? "Instant Digital" : "1-3 Hari Kerja",
            rating: p.rating || 4.9,
            reviewCount: 120 + p.id * 18,
            features: p.features || [],
            ojkRegulated: p.shariaAccredited !== false,
            dpsSupervised: p.shariaAccredited !== false,
            applyUrl: p.applyUrl || `/onboarding?productId=${p.id}&name=${encodeURIComponent(p.name)}`,
            isFeatured: p.isFeatured || false
          }));
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
        interestRateOrMargin: `${p.interestRateAnnual}% p.a (Bagi Hasil/Margin)`,
        tenorMinMonths: p.minTenorMonths,
        tenorMaxMonths: p.maxTenorMonths,
        approvalSpeed: "1-3 Hari Kerja",
        rating: p.rating || 4.9,
        reviewCount: 150,
        features: p.features || [],
        ojkRegulated: p.shariaAccredited !== false,
        dpsSupervised: p.shariaAccredited !== false,
        applyUrl: p.applyUrl || `/onboarding?productId=${p.id}&name=${encodeURIComponent(p.name)}`,
        isFeatured: false
      }));
    }
  }

  onMount(async () => {
    fetchCmsContent();
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
    if (maxAmt) {
      maxAmountFilter = Math.max(1000000, Number(maxAmt));
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
  <title>Katalog Fintech Aggregator Syariah — Namia Syariah</title>
  <meta
    name="description"
    content="Katalog komparasi produk fintech syariah terlengkap: P2P lending, pembiayaan UMKM, sukuk, asuransi takaful, dan paylater halal tanpa riba di Indonesia."
  />
</svelte:head>

<div class="aggregator-page space-y-0 font-sans">
  <!-- PAGE HEADER WITH AUTHENTIC EARLY BOOTSTRAP 2.0 SUBHEAD JUMBOTRON -->
  <section class="jumbotron-subhead">
    <div class="container px-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1.5">
          <div class="flex items-center gap-2">
            <span class="badge badge-success text-[10px] uppercase font-bold">
              Katalog Finansial Terverifikasi
            </span>
            <span class="badge badge-inverse text-[10px] uppercase font-bold">
              100% Sah DPS DSN-MUI
            </span>
          </div>
          <h1>Fintech Aggregator Syariah</h1>
          <p>
            Bandingkan margin, tenor, dan plafon produk mitra syariah secara transparan tanpa riba
          </p>
        </div>

        <!-- Early Bootstrap Breadcrumb -->
        <ul class="breadcrumb mb-0 text-slate-800 self-start md:self-auto">
          <li><a href="/">Beranda</a> <span class="divider">/</span></li>
          <li class="active">Aggregator</li>
        </ul>
      </div>
    </div>
  </section>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Search & Filter Controls Panel in Early Bootstrap Style -->
    <div class="panel shadow-xs !mb-0">
      <div class="panel-heading flex items-center justify-between !py-2.5 !px-4">
        <div class="flex items-center gap-2">
          <Filter class="w-4 h-4 text-emerald-700" />
          <span class="text-xs font-bold text-slate-800 uppercase">Filter & Pencarian Pintar</span>
        </div>
        <span class="badge badge-inverse">{filteredProducts.length} Produk Ditemukan</span>
      </div>

      <div class="panel-body !p-4 bg-slate-50/50 space-y-4">
        <!-- Search Input & Quick Controls -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div class="md:col-span-6 relative">
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Cari nama produk, mitra penyedia, atau kriteria..."
              class="w-full text-xs py-2 pl-8 pr-3 bg-white border border-slate-300 rounded-[4px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 shadow-2xs"
            />
            <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <!-- Akad Filter Dropdown -->
          <div class="md:col-span-3">
            <select
              bind:value={selectedContract}
              class="w-full text-xs p-2 bg-white border border-slate-300 rounded-[4px] text-slate-800 focus:outline-none focus:border-emerald-600 shadow-2xs"
            >
              {#each contracts as c}
                <option value={c}>{c}</option>
              {/each}
            </select>
          </div>

          <!-- Sort Order Dropdown -->
          <div class="md:col-span-3">
            <select
              bind:value={sortBy}
              class="w-full text-xs p-2 bg-white border border-slate-300 rounded-[4px] text-slate-800 focus:outline-none focus:border-emerald-600 shadow-2xs"
            >
              <option value="rating">Urutkan: Rating Tertinggi</option>
              <option value="amount_asc">Plafon: Terendah ke Tertinggi</option>
              <option value="amount_desc">Plafon: Tertinggi ke Terendah</option>
            </select>
          </div>
        </div>

        <!-- Category Pills (Early Bootstrap .nav-pills Style) -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <div class="nav-pills flex flex-wrap !bg-transparent !p-0 !border-0 gap-1.5">
            {#each categories as cat}
              <button
                type="button"
                onclick={() => (selectedCategory = cat.slug)}
                class="btn btn-mini {selectedCategory === cat.slug ? 'btn-success' : 'btn-default'}"
              >
                {cat.name}
              </button>
            {/each}
          </div>

          <!-- View Mode Toggle (Grid vs Table) in Early Bootstrap .btn-group -->
          <div class="btn-group shrink-0">
            <button
              type="button"
              onclick={() => (viewMode = "grid")}
              class="btn btn-mini {viewMode === 'grid' ? 'btn-inverse' : 'btn-default'} flex items-center gap-1"
              title="Tampilan Grid Kartu"
            >
              <LayoutGrid class="w-3 h-3" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onclick={() => (viewMode = "table")}
              class="btn btn-mini {viewMode === 'table' ? 'btn-inverse' : 'btn-default'} flex items-center gap-1"
              title="Tampilan Tabel Komparasi"
            >
              <TableIcon class="w-3 h-3" />
              <span>Tabel</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Filter Badges Bar -->
    <div class="flex flex-wrap items-center justify-between text-xs text-slate-600 bg-white p-3 rounded-[4px] border border-slate-300 shadow-2xs">
      <div class="flex flex-wrap items-center gap-2">
        <span class="font-bold text-slate-700">Filter Aktif:</span>
        <span class="badge badge-success">
          Kategori: {categories.find((c) => c.slug === selectedCategory)?.name || "Semua"}
        </span>
        {#if selectedContract !== "Semua Akad"}
          <span class="badge badge-info">Akad: {selectedContract}</span>
        {/if}
        {#if searchQuery.trim()}
          <span class="badge badge-warning">Kata kunci: "{searchQuery}"</span>
        {/if}
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          onclick={() => {
            selectedCategory = "all";
            selectedContract = "Semua Akad";
            searchQuery = "";
            maxAmountFilter = 2000000000;
          }}
          class="text-xs text-slate-500 hover:text-emerald-800 underline cursor-pointer"
        >
          Reset Filter
        </button>
      </div>
    </div>

    <!-- PRODUCT DISPLAY AREA -->
    {#if filteredProducts.length === 0}
      <div class="well well-large text-center py-12 space-y-3 bg-white">
        <SlidersHorizontal class="w-10 h-10 text-slate-400 mx-auto" />
        <h3 class="text-base font-bold text-slate-800">Tidak ada produk yang cocok dengan filter</h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto">
          Coba atur ulang kata kunci pencarian atau pilih kategori lain untuk melihat pilihan produk finansial syariah lainnya.
        </p>
        <button
          type="button"
          onclick={() => {
            selectedCategory = "all";
            selectedContract = "Semua Akad";
            searchQuery = "";
          }}
          class="btn btn-success btn-small font-bold mt-2"
        >
          Tampilkan Semua Produk
        </button>
      </div>
    {:else if viewMode === "grid"}
      <!-- GRID VIEW -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredProducts as product (product.id)}
          <ProductCard
            {product}
            isCompared={comparedProducts.some((p) => p.id === product.id)}
            onToggleCompare={toggleCompare}
          />
        {/each}
      </div>
    {:else}
      <!-- EARLY BOOTSTRAP TABLE VIEW (.table-striped .table-bordered) -->
      <div class="panel shadow-xs !mb-0 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="table table-bordered table-striped table-hover !mb-0 text-xs">
            <thead>
              <tr>
                <th class="w-1/4">Nama Produk & Institusi</th>
                <th>Akad Syariah</th>
                <th>Plafon Pembiayaan</th>
                <th>Margin / Bagi Hasil</th>
                <th>Tenor</th>
                <th>Rating</th>
                <th class="text-center w-36">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {#each filteredProducts as p (p.id)}
                <tr>
                  <td>
                    <div class="font-bold text-slate-900 text-sm">{p.name}</div>
                    <div class="text-[11px] text-slate-500 uppercase">{p.institution}</div>
                    {#if p.ojkRegulated}
                      <span class="label label-inverse text-[9px] mt-1 inline-block">OJK Regulated</span>
                    {/if}
                  </td>
                  <td>
                    <span class="label label-success">Akad {p.islamicContract}</span>
                  </td>
                  <td class="font-mono font-bold text-slate-900">
                    {formatRupiah(p.minAmount)} - {formatRupiah(p.maxAmount)}
                  </td>
                  <td class="font-mono font-bold text-emerald-800">
                    {p.interestRateOrMargin}
                  </td>
                  <td class="font-semibold text-slate-800">
                    {p.tenorMinMonths} - {p.tenorMaxMonths} Bln
                  </td>
                  <td>
                    <div class="flex items-center gap-1 font-bold text-slate-900">
                      <Star class="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>{p.rating}</span>
                      <span class="text-[10px] text-slate-500">({p.reviewCount})</span>
                    </div>
                  </td>
                  <td class="text-center">
                    <div class="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onclick={() => toggleCompare(p)}
                        class="btn btn-mini {comparedProducts.some((c) => c.id === p.id) ? 'btn-success' : 'btn-default'}"
                        title="Bandingkan"
                      >
                        <Scale class="w-3 h-3" />
                      </button>
                      <a
                        href="/onboarding?productId={p.id}&name={encodeURIComponent(p.name)}"
                        class="btn btn-mini btn-success font-bold"
                      >
                        Ajukan
                      </a>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}
  </div>
</div>

<!-- Floating Compare Drawer Component -->
<CompareDrawer
  {comparedProducts}
  onRemoveProduct={removeCompared}
  onClearAll={clearAllCompared}
/>
