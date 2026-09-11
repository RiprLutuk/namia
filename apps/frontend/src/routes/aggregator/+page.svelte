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
  } from "lucide-svelte";
  import ProductCard, {
    type Product,
  } from "$lib/components/ProductCard.svelte";
  import CompareDrawer from "$lib/components/CompareDrawer.svelte";
  import { API_BASE_URL } from "$lib/api";
  import { cmsStore, fetchCmsContent } from "$lib/cms";

  // Categories list (dynamically populated from API)
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
  let maxAmountFilter = $state(100000000);
  let sortBy = $state<"rating" | "amount_asc" | "amount_desc">("rating");

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
      const [catRes, prodRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/aggregator/categories`),
        fetch(`${API_BASE_URL}/api/aggregator/products`),
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
            interestRateOrMargin: `${p.interestRateAnnual}% p.a (Margin/Bagi Hasil)`,
            tenorMinMonths: p.minTenorMonths,
            tenorMaxMonths: p.maxTenorMonths,
            approvalSpeed:
              p.minTenorMonths <= 1 ? "Instant Digital" : "1-3 Hari Kerja",
            rating: p.rating || 4.9,
            reviewCount: 120 + p.id * 18,
            features: p.features || [],
            ojkRegulated: p.shariaAccredited !== false,
            dpsSupervised: p.shariaAccredited !== false,
            applyUrl: p.applyUrl || `/onboarding?product=${p.id}`,
          }));
          return;
        }
      }
    } catch (e) {
      console.warn(
        "Could not fetch aggregator from API, using store fallback",
        e,
      );
    }

    // Fallback to cmsStore.products if API network call fails
    if ($cmsStore.products && $cmsStore.products.length > 0) {
      allProducts = $cmsStore.products.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        institution: p.provider || "PT Namia Finansial Teknologi",
        categorySlug: p.categorySlug || "p2p-lending",
        islamicContract: p.contractType || "Murabahah",
        minAmount: p.minAmount,
        maxAmount: p.maxAmount,
        interestRateOrMargin: `${p.interestRateAnnual}% p.a (Margin/Bagi Hasil)`,
        tenorMinMonths: p.minTenorMonths,
        tenorMaxMonths: p.maxTenorMonths,
        approvalSpeed: "1-3 Hari Kerja",
        rating: p.rating || 4.9,
        reviewCount: 150,
        features: p.features || [],
        ojkRegulated: p.shariaAccredited !== false,
        dpsSupervised: p.shariaAccredited !== false,
        applyUrl: p.applyUrl || `/onboarding?product=${p.id}`,
      }));
    }
  }

  // Read URL query params and load data on mount
  onMount(async () => {
    fetchCmsContent();
    await loadAggregatorData();

    const cat = page.url.searchParams.get("category");
    if (cat && categories.some((c) => c.slug === cat)) {
      selectedCategory = cat;
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
    return `Rp ${(num / 1000000).toLocaleString("id-ID")} Jt`;
  }
</script>

<svelte:head>
  <title>Katalog Fintech Aggregator Syariah — Namia Syariah</title>
  <meta
    name="description"
    content="Katalog produk pembiayaan syariah, sukuk, takaful, dan paylater terlengkap dengan komparasi transparan tanpa riba di Namia Syariah."
  />
</svelte:head>

<div class="space-y-0 font-sans">
  <!-- PAGE TITLE BAR -->
  <section class="bg-[#0f172a] py-12 text-white border-b border-slate-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1
            class="text-3xl font-extrabold text-white uppercase tracking-tight"
          >
            Fintech Aggregator
          </h1>
          <p class="text-sm text-slate-300 mt-1 font-normal">
            Eksplorasi & Bandingkan Produk Pembiayaan Syariah Terpercaya
          </p>
        </div>
        <nav
          class="flex text-xs font-semibold text-slate-400 gap-2 items-center"
        >
          <a href="/" class="hover:text-white transition-colors">Beranda</a>
          <span>/</span>
          <span class="text-emerald-400">Aggregator</span>
        </nav>
      </div>
    </div>
  </section>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
    <!-- Filter & Search Controls Bar -->
    <div
      class="bg-white rounded-[3px] border border-slate-300 shadow-xs p-6 space-y-5"
    >
      <!-- Search Bar & Sort Dropdown -->
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <div class="relative flex-1 w-full">
          <Search
            class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
          />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari nama produk, institusi (e.g. Namia, Takaful), atau kata kunci..."
            class="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-[2px] text-sm text-slate-900 focus:border-emerald-600 outline-hidden"
          />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <ArrowUpDown class="w-4 h-4 text-slate-500 shrink-0" />
          <select
            bind:value={sortBy}
            class="w-full sm:w-auto bg-white border border-slate-300 rounded-[2px] px-3 py-2 text-xs font-semibold text-slate-700 focus:border-emerald-600"
          >
            <option value="rating">Urutkan: Rating Tertinggi</option>
            <option value="amount_desc">Urutkan: Plafon Terbesar</option>
            <option value="amount_asc">Urutkan: Plafon Terkecil</option>
          </select>
        </div>
      </div>

      <!-- Category Pill Filter Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
        {#each categories as cat}
          <button
            type="button"
            onclick={() => (selectedCategory = cat.slug)}
            class="px-4 py-2 rounded-[2px] text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-none cursor-pointer {selectedCategory ===
            cat.slug
              ? 'bg-[#059669] text-white border border-[#047857]'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'}"
          >
            {cat.name}
          </button>
        {/each}
      </div>

      <!-- Secondary Filters: Sharia Contract & Max Amount Slider -->
      <div
        class="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
      >
        <!-- Akad Filter -->
        <div>
          <label
            for="sharia-contract-select"
            class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >Pilihan Akad Syariah</label
          >
          <select
            id="sharia-contract-select"
            bind:value={selectedContract}
            class="w-full bg-white border border-slate-300 rounded-[2px] px-3 py-2 text-xs font-medium text-slate-800 focus:border-emerald-600"
          >
            {#each contracts as c}
              <option value={c}>{c}</option>
            {/each}
          </select>
        </div>

        <!-- Max Amount Slider -->
        <div>
          <div class="flex justify-between items-center mb-1.5">
            <label
              for="max-amount-slider"
              class="text-xs font-bold uppercase tracking-wider text-slate-700"
              >Maksimal Modal Dibutuhkan</label
            >
            <span class="text-xs font-bold text-emerald-800 font-mono"
              >{formatRupiah(maxAmountFilter)}</span
            >
          </div>
          <input
            id="max-amount-slider"
            type="range"
            min="1000000"
            max="100000000"
            step="1000000"
            bind:value={maxAmountFilter}
            class="w-full h-1.5 bg-slate-200 rounded-[2px] appearance-none cursor-pointer accent-emerald-600"
          />
        </div>
      </div>
    </div>

    <!-- Results Count & Active Tags -->
    <div class="flex items-center justify-between text-xs text-slate-600">
      <span
        >Menampilkan <strong class="text-slate-900 font-bold"
          >{filteredProducts.length}</strong
        > produk finansial syariah</span
      >
      {#if selectedCategory !== "all" || selectedContract !== "Semua Akad" || searchQuery}
        <button
          type="button"
          onclick={() => {
            selectedCategory = "all";
            selectedContract = "Semua Akad";
            searchQuery = "";
            maxAmountFilter = 100000000;
          }}
          class="text-emerald-700 hover:text-emerald-900 font-bold uppercase tracking-wider cursor-pointer"
        >
          Reset Filter &times;
        </button>
      {/if}
    </div>

    <!-- Product Grid -->
    {#if filteredProducts.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredProducts as prod}
          <ProductCard
            product={prod}
            isCompared={comparedProducts.some((p) => p.id === prod.id)}
            onToggleCompare={toggleCompare}
          />
        {/each}
      </div>
    {:else}
      <div
        class="bg-white rounded-[3px] border border-slate-300 p-12 text-center space-y-3"
      >
        <div
          class="w-12 h-12 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center mx-auto text-slate-500"
        >
          <Filter class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-slate-900 uppercase">
          Tidak ada produk yang cocok
        </h3>
        <p class="text-xs text-slate-600 max-w-sm mx-auto">
          Coba ubah kriteria pencarian, turunkan batasan akad, atau reset filter
          untuk melihat semua opsi yang tersedia.
        </p>
        <button
          type="button"
          onclick={() => {
            selectedCategory = "all";
            selectedContract = "Semua Akad";
            searchQuery = "";
            maxAmountFilter = 100000000;
          }}
          class="button-4-primary text-xs py-2 px-6 rounded-[3px] font-bold uppercase tracking-wider cursor-pointer"
        >
          Tampilkan Semua Produk
        </button>
      </div>
    {/if}

    <!-- Integrated Floating Comparison Bar -->
    <CompareDrawer
      {comparedProducts}
      onRemoveProduct={removeCompared}
      onClearAll={clearAllCompared}
    />
  </div>
</div>
