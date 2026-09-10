<script lang="ts">
  import { onMount } from "svelte";
  import { 
    ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, 
    Calculator, TrendingUp, Award, Layers, Sparkles, Star, Users, Briefcase, Building2
  } from "lucide-svelte";
  import LoanCalculator from "$lib/components/calculators/LoanCalculator.svelte";
  import InvestmentCalculator from "$lib/components/calculators/InvestmentCalculator.svelte";
  import CreditScoreEstimator from "$lib/components/calculators/CreditScoreEstimator.svelte";
  import ProductCard, { type Product } from "$lib/components/ProductCard.svelte";
  import CompareDrawer from "$lib/components/CompareDrawer.svelte";

  // Calculator Active Tab
  let activeCalcTab = $state<"loan" | "invest" | "score">("loan");

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

  // Initial Featured Products (Hydrated immediately, can fetch updates)
  let featuredProducts = $state<Product[]>([
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
    }
  ]);

  // Statistics Counter
  const stats = [
    { label: "Total Pembiayaan Disalurkan", value: "Rp 28.5 Miliar+", sub: "Ke 1,240+ UMKM di 14 Provinsi" },
    { label: "Tingkat Keberhasilan 90 (TKB90)", value: "99.2%", sub: "Kualitas portofolio sehat & terjaga" },
    { label: "Komunitas Investor Halal", value: "4,820+ Pemberi Dana", sub: "Membantu perputaran ekonomi umat" },
    { label: "Kepatuhan Syariah & Regulasi", value: "100%", sub: "Diawasi DPS DSN-MUI & Berizin OJK" }
  ];

  // Testimonials from Database
  const testimonials = [
    {
      name: "Dwi Ariyanti",
      role: "Founder Batik Trusmi Cirebon",
      image: "/images/testimonials/2.jpg",
      quote: "Alhamdulillah, melalui Syarfi usaha batik kami mendapatkan tambahan modal kerja Rp 40 juta tanpa rasa cemas akan riba. Proses akad Murabahah sangat jelas dan transparan sedari awal."
    },
    {
      name: "Hendra Kusuma",
      role: "CEO Solusi Pangan Nusantara",
      image: "/images/testimonials/3.jpg",
      quote: "Syarfi memberikan fleksibilitas pembiayaan invoice project kami. Tenor pas dan tim penilai sangat mengedepankan asas kekeluargaan dan musyawarah syariah."
    },
    {
      name: "Siti Rahmawati",
      role: "Investor / Pendana Retail",
      image: "/images/testimonials/1.jpg",
      quote: "Sebagai investor muslim, ketenangan batin adalah prioritas utama. Di Syarfi saya bisa menyalurkan dana ke sektor riil yang berkah dengan imbal hasil bagi hasil yang kompetitif."
    }
  ];

  // Try fetching dynamic updates on client mount
  onMount(async () => {
    try {
      const res = await fetch("http://localhost:3000/api/aggregator/featured");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          featuredProducts = data;
        }
      }
    } catch {
      // Graceful fallback to static data
    }
  });
</script>

<div class="space-y-20 pb-20">
  
  <!-- HERO SECTION -->
  <section class="relative pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-slate-50 border-b border-slate-200/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center max-w-3xl mx-auto space-y-6">
        
        <!-- Trust Pill -->
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-300 text-emerald-800 text-xs font-semibold tracking-wide shadow-xs">
          <Sparkles class="w-4 h-4 text-emerald-600" />
          <span>Fintech Crowdfunding & Aggregator Syariah Terpercaya di Indonesia</span>
        </div>

        <!-- Headline -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Solusi Keuangan Halal, <br />
          <span class="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
            Berkah Tanpa Riba.
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Temukan, bandingkan, dan ajukan produk pembiayaan syariah, sukuk ritel, serta proteksi takaful terbaik dengan transparansi penuh berlandaskan Fatwa DSN-MUI & izin OJK.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="/aggregator"
            class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Eksplorasi Produk Syariah</span>
            <ArrowRight class="w-4 h-4" />
          </a>

          <a
            href="#kalkulator"
            class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Calculator class="w-4 h-4 text-emerald-600" />
            <span>Simulasi Cicilan</span>
          </a>
        </div>

        <!-- Trust Badges Row -->
        <div class="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div class="flex items-center gap-1.5">
            <CheckCircle2 class="w-4 h-4 text-emerald-600" />
            <span>Terdaftar & Berizin OJK</span>
          </div>
          <div class="flex items-center gap-1.5">
            <CheckCircle2 class="w-4 h-4 text-emerald-600" />
            <span>Pengawasan Dewan Pengawas Syariah</span>
          </div>
          <div class="flex items-center gap-1.5">
            <CheckCircle2 class="w-4 h-4 text-emerald-600" />
            <span>Akad Sesuai DSN-MUI</span>
          </div>
          <div class="flex items-center gap-1.5">
            <CheckCircle2 class="w-4 h-4 text-emerald-600" />
            <span>Enkripsi Data Standar ISO 27001</span>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- STATS COUNTER BAR -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 relative z-20">
    <div class="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
      {#each stats as s}
        <div class="pt-4 sm:pt-0 sm:px-4 first:pt-0 first:px-0 space-y-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 block">{s.label}</span>
          <div class="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tracking-tight">{s.value}</div>
          <p class="text-xs text-slate-500">{s.sub}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- 3 PILARS OF ISLAMIC FINANCE -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-2xl mx-auto mb-12 space-y-2">
      <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Prinsip Muamalah Kami</span>
      <h2 class="text-3xl font-extrabold text-slate-900">Menjaga Keberkahan di Setiap Transaksi</h2>
      <p class="text-sm text-slate-600">
        Fondasi keuangan syariah menjamin keadilan, kejelasan, serta perlindungan hak kedua belah pihak secara berimbang.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      <div class="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:border-emerald-500/40 transition-all space-y-3">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg font-serif">
          01
        </div>
        <h3 class="text-lg font-bold text-slate-900">Bebas Riba (Bunga Jahiliyah)</h3>
        <p class="text-sm text-slate-600 leading-relaxed">
          Seluruh skema pembiayaan menggunakan margin keuntungan pasti (Murabahah) atau bagi hasil riil (Mudharabah/Musyarakah). Tanpa bunga berbunga.
        </p>
      </div>

      <div class="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:border-emerald-500/40 transition-all space-y-3">
        <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg font-serif">
          02
        </div>
        <h3 class="text-lg font-bold text-slate-900">Bebas Gharar (Ketidakjelasan)</h3>
        <p class="text-sm text-slate-600 leading-relaxed">
          Transparansi harga pokok, biaya administrasi, hak, dan kewajiban disepakati tuntas di awal akad. Tidak ada biaya tersembunyi yang menjebak.
        </p>
      </div>

      <div class="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs hover:border-emerald-500/40 transition-all space-y-3">
        <div class="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-lg font-serif">
          03
        </div>
        <h3 class="text-lg font-bold text-slate-900">Bebas Maisir (Spekulasi/Judi)</h3>
        <p class="text-sm text-slate-600 leading-relaxed">
          Pendanaan wajib dialokasikan ke objek riil halal yang produktif dan bermanfaat bagi masyarakat, bukan instrumen derivatif spekulatif.
        </p>
      </div>

    </div>
  </section>

  <!-- FEATURED PRODUCTS / AGGREGATOR TEASER -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Fintech Aggregator</span>
        <h2 class="text-3xl font-extrabold text-slate-900">Produk Unggulan Pilihan</h2>
        <p class="text-sm text-slate-600 mt-1">Bandingkan rate margin, tenor, dan plafon pembiayaan secara transparan.</p>
      </div>

      <a
        href="/aggregator"
        class="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
      >
        <span>Lihat Semua Kategori ({featuredProducts.length}+)</span>
        <ChevronRight class="w-4 h-4" />
      </a>
    </div>

    <!-- Product Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each featuredProducts as prod}
        <ProductCard
          product={prod}
          isCompared={comparedProducts.some(p => p.id === prod.id)}
          onToggleCompare={toggleCompare}
        />
      {/each}
    </div>
  </section>

  <!-- INTERACTIVE CALCULATOR SUITE SECTION -->
  <section id="kalkulator" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
    <div class="text-center max-w-2xl mx-auto mb-8 space-y-2">
      <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Simulasi Finansial Mandiri</span>
      <h2 class="text-3xl font-extrabold text-slate-900">Kalkulator Finansial Syariah Cerdas</h2>
      <p class="text-sm text-slate-600">
        Rencanakan angsuran, proyeksi bagi hasil investasi, atau cek skor kelayakan kredit Anda dalam hitungan detik.
      </p>
    </div>

    <!-- Tab Selector -->
    <div class="flex justify-center mb-8">
      <div class="inline-flex p-1.5 bg-slate-200/80 rounded-2xl gap-1">
        <button
          type="button"
          onclick={() => activeCalcTab = "loan"}
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all {activeCalcTab === 'loan' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
        >
          <Calculator class="w-4 h-4" />
          <span>Pembiayaan (Murabahah)</span>
        </button>

        <button
          type="button"
          onclick={() => activeCalcTab = "invest"}
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all {activeCalcTab === 'invest' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
        >
          <TrendingUp class="w-4 h-4" />
          <span>Investasi (Mudharabah)</span>
        </button>

        <button
          type="button"
          onclick={() => activeCalcTab = "score"}
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all {activeCalcTab === 'score' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
        >
          <Award class="w-4 h-4" />
          <span>Skor Finansial (DSR)</span>
        </button>
      </div>
    </div>

    <!-- Active Calculator Display -->
    {#if activeCalcTab === "loan"}
      <LoanCalculator />
    {:else if activeCalcTab === "invest"}
      <InvestmentCalculator />
    {:else}
      <CreditScoreEstimator />
    {/if}
  </section>

  <!-- TESTIMONIALS SECTION -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-2xl mx-auto mb-12 space-y-2">
      <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Kisah Nyata Mitra</span>
      <h2 class="text-3xl font-extrabold text-slate-900">Dipercaya Ribuan Wirausaha & Investor</h2>
      <p class="text-sm text-slate-600">Pengalaman nyata tumbuh bersama ekosistem pendanaan syariah Syarfi.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each testimonials as t}
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div class="space-y-3">
            <div class="flex text-amber-400 gap-1">
              {#each Array(5) as _}
                <Star class="w-4 h-4 fill-amber-400" />
              {/each}
            </div>
            <p class="text-sm text-slate-700 italic leading-relaxed">
              "{t.quote}"
            </p>
          </div>

          <div class="flex items-center gap-3 pt-4 border-t border-slate-100">
            <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
              {t.name[0]}
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900">{t.name}</h4>
              <p class="text-xs text-slate-500">{t.role}</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- CALL TO ACTION BANNER -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="space-y-3 max-w-xl text-center md:text-left">
        <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Siap Mewujudkan Pembiayaan Berkah Tanpa Riba?
        </h2>
        <p class="text-emerald-100 text-sm leading-relaxed">
          Ajukan permohonan pembiayaan usaha UMKM Anda atau mulailah mendanai proyek riil menguntungkan hari ini dengan proses 100% online.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
        <a
          href="/onboarding"
          class="px-6 py-3.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-sm text-center shadow-sm transition-all"
        >
          Ajukan Pembiayaan
        </a>
        <a
          href="/investor"
          class="px-6 py-3.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 text-white font-bold text-sm text-center border border-emerald-500/40 transition-all"
        >
          Mulai Jadi Pendana
        </a>
      </div>
    </div>
  </section>

  <!-- Compare Drawer Floating -->
  <CompareDrawer
    {comparedProducts}
    onRemoveProduct={removeCompared}
    onClearAll={clearAllCompared}
  />

</div>

