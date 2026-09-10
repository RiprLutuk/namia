<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { 
    Filter, Search, SlidersHorizontal, Scale, ArrowUpDown, 
    CheckCircle2, Sparkles, Building2, ShieldCheck, ChevronRight
  } from "lucide-svelte";
  import ProductCard, { type Product } from "$lib/components/ProductCard.svelte";
  import CompareDrawer from "$lib/components/CompareDrawer.svelte";

  // Categories list
  const categories = [
    { slug: "all", name: "Semua Kategori" },
    { slug: "p2p-lending", name: "P2P Lending Syariah" },
    { slug: "asuransi-syariah", name: "Asuransi Takaful" },
    { slug: "paylater-syariah", name: "Paylater Syariah" },
    { slug: "reksa-dana-syariah", name: "Sukuk & Reksa Dana" },
    { slug: "pembiayaan-usaha", name: "Pembiayaan UMKM" }
  ];

  const contracts = ["Semua Akad", "Murabahah", "Mudharabah", "Musyarakah", "Wakalah bil Ujrah", "Qardh & Ujrah", "Ta'awun"];

  // Filter & Search State
  let searchQuery = $state("");
  let selectedCategory = $state("all");
  let selectedContract = $state("Semua Akad");
  let maxAmountFilter = $state(100000000);
  let sortBy = $state<"rating" | "amount_asc" | "amount_desc">("rating");

  // Comparison State
  let comparedProducts = $state<Product[]>([]);

  function toggleCompare(prod: Product) {
    const exists = comparedProducts.some(p => p.id === prod.id);
    if (exists) {
      comparedProducts = comparedProducts.filter(p => p.id !== prod.id);
    } else {
      if (comparedProducts.length >= 3) {
        alert("Maksimal perbandingan 3 produk secara bersamaan.");
        return;
      }
      comparedProducts = [...comparedProducts, prod];
    }
  }

  function removeCompared(id: string) {
    comparedProducts = comparedProducts.filter(p => p.id !== id);
  }

  function clearAllCompared() {
    comparedProducts = [];
  }

  // Master product dataset (synced with mock data)
  let allProducts = $state<Product[]>([
    {
      id: "p2p-syarfi-umkm",
      name: "Pembiayaan Modal Kerja Syariah",
      institution: "Syarfi P2P Finansial",
      categorySlug: "p2p-lending",
      islamicContract: "Murabahah",
      minAmount: 5000000,
      maxAmount: 50000000,
      interestRateOrMargin: "8.5% p.a (Margin Flat)",
      tenorMinMonths: 6,
      tenorMaxMonths: 24,
      approvalSpeed: "1-2 Hari Kerja",
      rating: 4.9,
      reviewCount: 342,
      features: ["Tanpa Agunan BPKB/Sertifikat", "Pencairan Langsung ke Rekening Mitra", "Akad Jual Beli Halal"],
      ojkRegulated: true,
      dpsSupervised: true,
      applyUrl: "/onboarding?product=p2p-syarfi-umkm"
    },
    {
      id: "p2p-invoice-syarfi",
      name: "Invoice Financing Syariah",
      institution: "Syarfi Capital Partner",
      categorySlug: "p2p-lending",
      islamicContract: "Wakalah bil Ujrah",
      minAmount: 20000000,
      maxAmount: 500000000,
      interestRateOrMargin: "10% p.a (Bagi Hasil)",
      tenorMinMonths: 3,
      tenorMaxMonths: 12,
      approvalSpeed: "3 Hari Kerja",
      rating: 4.8,
      reviewCount: 156,
      features: ["Talangan Tagihan SPK/PO BUMN & Swasta", "Plafon hingga Rp 500 Juta", "Legalitas Terverifikasi Notaris"],
      ojkRegulated: true,
      dpsSupervised: true,
      applyUrl: "/onboarding?product=p2p-invoice-syarfi"
    },
    {
      id: "asuransi-takaful-jiwa",
      name: "Takaful Proteksi Keluarga Berkah",
      institution: "Takaful Ikhlas Indonesia",
      categorySlug: "asuransi-syariah",
      islamicContract: "Ta'awun",
      minAmount: 100000,
      maxAmount: 500000000,
      interestRateOrMargin: "Iuran Tabarru' Mulai Rp 100rb/bln",
      tenorMinMonths: 12,
      tenorMaxMonths: 60,
      approvalSpeed: "Instant Digital",
      rating: 4.9,
      reviewCount: 420,
      features: ["Dana Tolong Menolong Halal", "Santunan Meninggal & Kecelakaan", "Bebas Unsur Riba & Gharar"],
      ojkRegulated: true,
      dpsSupervised: true,
      applyUrl: "/onboarding?product=asuransi-takaful-jiwa"
    },
    {
      id: "paylater-al-qardh",
      name: "Syarfi Flexi Halal Paylater",
      institution: "Syarfi Pay Partner",
      categorySlug: "paylater-syariah",
      islamicContract: "Qardh & Ujrah",
      minAmount: 500000,
      maxAmount: 15000000,
      interestRateOrMargin: "0% Bunga (Biaya Admin Flat)",
      tenorMinMonths: 1,
      tenorMaxMonths: 12,
      approvalSpeed: "5 Menit (E-KYC)",
      rating: 4.7,
      reviewCount: 512,
      features: ["Bebas Denda Bunga Menumpuk", "Scan QRIS di 10.000+ Merchant", "E-KYC Dukcapil 5 Menit"],
      ojkRegulated: true,
      dpsSupervised: true,
      applyUrl: "/onboarding?product=paylater-al-qardh"
    },
    {
      id: "sukuk-infrastruktur-air",
      name: "Sukuk Wakalah Air Minum Desa",
      institution: "Syarfi Sukuk Crowdfunding",
      categorySlug: "reksa-dana-syariah",
      islamicContract: "Wakalah bil Ujrah",
      minAmount: 1000000,
      maxAmount: 100000000,
      interestRateOrMargin: "11.2% p.a (Estimasi Imbal)",
      tenorMinMonths: 12,
      tenorMaxMonths: 36,
      approvalSpeed: "Instant",
      rating: 4.8,
      reviewCount: 189,
      features: ["Underlying Asset Riil & Halal", "Pembagian Imbal Hasil Setiap Bulan", "Didukung Pemerintah Daerah"],
      ojkRegulated: true,
      dpsSupervised: true,
      applyUrl: "/onboarding?product=sukuk-infrastruktur-air"
    },
    {
      id: "modal-usaha-pertanian",
      name: "Pembiayaan Musyarakah Tani Berkah",
      institution: "Syarfi Agro Mitra",
      categorySlug: "pembiayaan-usaha",
      islamicContract: "Musyarakah",
      minAmount: 10000000,
      maxAmount: 150000000,
      interestRateOrMargin: "Bagi Hasil 60:40 Petani & Investor",
      tenorMinMonths: 6,
      tenorMaxMonths: 18,
      approvalSpeed: "2-3 Hari",
      rating: 4.8,
      reviewCount: 94,
      features: ["Didampingi Agronom Bersertifikat", "Jaminan Pembelian Offtaker Pasti", "Pendampingan Pasca Panen"],
      ojkRegulated: true,
      dpsSupervised: true,
      applyUrl: "/onboarding?product=modal-usaha-pertanian"
    }
  ]);

  // Read URL query params on mount
  onMount(() => {
    const cat = page.url.searchParams.get("category");
    if (cat && categories.some(c => c.slug === cat)) {
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
      .filter(p => {
        // Category
        if (selectedCategory !== "all" && p.categorySlug !== selectedCategory) {
          return false;
        }
        // Sharia Contract
        if (selectedContract !== "Semua Akad" && p.islamicContract !== selectedContract) {
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
          const matchFeat = p.features.some(f => f.toLowerCase().includes(q));
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
  <title>Katalog Fintech Aggregator Syariah — Syarfi</title>
  <meta name="description" content="Katalog produk pembiayaan syariah, sukuk, takaful, dan paylater terlengkap dengan komparasi transparan tanpa riba." />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
  
  <!-- Page Header -->
  <div class="space-y-3">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold">
      <Sparkles class="w-3.5 h-3.5 text-emerald-600" />
      <span>Aggregator Keuangan Syariah</span>
    </div>
    <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
      Eksplorasi & Bandingkan Produk Syariah
    </h1>
    <p class="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
      Temukan instrumen keuangan yang paling cocok untuk kebutuhan modal usaha, proteksi takaful, atau tabungan investasi Anda dengan kepatuhan syariah terjamin.
    </p>
  </div>

  <!-- Filter & Search Controls Bar -->
  <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-5">
    
    <!-- Search Bar & Sort Dropdown -->
    <div class="flex flex-col sm:flex-row items-center gap-4">
      <div class="relative flex-1 w-full">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari nama produk, penyedia (e.g. Syarfi, Takaful), atau kata kunci..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden transition-all"
        />
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto shrink-0">
        <ArrowUpDown class="w-4 h-4 text-slate-400 shrink-0" />
        <select
          bind:value={sortBy}
          class="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-emerald-500"
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
          onclick={() => selectedCategory = cat.slug}
          class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all {selectedCategory === cat.slug ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'}"
        >
          {cat.name}
        </button>
      {/each}
    </div>

    <!-- Secondary Filters: Sharia Contract & Max Amount Slider -->
    <div class="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      
      <!-- Akad Filter -->
      <div>
        <label for="sharia-contract-select" class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Pilihan Akad Syariah</label>
        <select
          id="sharia-contract-select"
          bind:value={selectedContract}
          class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500"
        >
          {#each contracts as c}
            <option value={c}>{c}</option>
          {/each}
        </select>
      </div>

      <!-- Max Amount Slider -->
      <div>
        <div class="flex justify-between items-center mb-1.5">
          <label for="max-amount-slider" class="text-xs font-semibold uppercase tracking-wider text-slate-500">Maksimal Modal Awal Dibutuhkan</label>
          <span class="text-xs font-bold text-emerald-700 font-mono">{formatRupiah(maxAmountFilter)}</span>
        </div>
        <input
          id="max-amount-slider"
          type="range"
          min="1000000"
          max="100000000"
          step="1000000"
          bind:value={maxAmountFilter}
          class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
      </div>

    </div>

  </div>

  <!-- Results Count & Active Tags -->
  <div class="flex items-center justify-between text-xs text-slate-500">
    <span>Menampilkan <strong class="text-slate-900">{filteredProducts.length}</strong> produk finansial syariah</span>
    {#if selectedCategory !== "all" || selectedContract !== "Semua Akad" || searchQuery}
      <button
        type="button"
        onclick={() => { selectedCategory = "all"; selectedContract = "Semua Akad"; searchQuery = ""; maxAmountFilter = 100000000; }}
        class="text-emerald-600 hover:text-emerald-700 font-medium underline"
      >
        Reset Filter
      </button>
    {/if}
  </div>

  <!-- Product Grid -->
  {#if filteredProducts.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredProducts as prod}
        <ProductCard
          product={prod}
          isCompared={comparedProducts.some(p => p.id === prod.id)}
          onToggleCompare={toggleCompare}
        />
      {/each}
    </div>
  {:else}
    <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
      <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
        <Filter class="w-6 h-6" />
      </div>
      <h3 class="text-base font-bold text-slate-800">Tidak ada produk yang cocok</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto">
        Coba ubah kriteria pencarian, turunkan batasan akad, atau reset filter untuk melihat semua opsi yang tersedia.
      </p>
      <button
        type="button"
        onclick={() => { selectedCategory = "all"; selectedContract = "Semua Akad"; searchQuery = ""; maxAmountFilter = 100000000; }}
        class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
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
