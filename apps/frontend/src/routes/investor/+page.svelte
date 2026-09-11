<script lang="ts">
  import { onMount } from "svelte";
  import {
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    TrendingUp,
    Zap,
    Sparkles,
    Play,
    X,
    Calculator,
    Coins,
    Award,
    FileText,
    ChevronRight,
    ChevronDown,
    Info,
    Lock,
    Scale,
    HelpCircle,
    Layers,
    Building2,
    Percent,
    Clock,
    ArrowUpRight,
    Check,
    UserCheck,
    Wallet,
    SearchCheck,
    HandCoins,
  } from "lucide-svelte";
  import InvestmentCalculator from "$lib/components/calculators/InvestmentCalculator.svelte";
  import { cmsStore, fetchCmsContent } from "$lib/cms";

  onMount(() => {
    fetchCmsContent();
  });

  let showCalcModal = $state(false);
  let selectedProduct = $state<{
    title: string;
    contract: string;
    modalImage: string;
    desc?: string;
  } | null>(null);
  let openFaqIndex = $state<number | null>(0);

  // Dynamic values loaded directly from database & API
  let coreValues = $derived($cmsStore.investorInfo?.coreValues || []);
  let investorPillars = $derived($cmsStore.investorInfo?.pillars || []);
  let steps = $derived($cmsStore.investorInfo?.steps || []);

  let products = $derived(
    $cmsStore.products?.length
      ? $cmsStore.products
          .filter(
            (p) =>
              p.targetAudience === "investor" ||
              !p.targetAudience ||
              p.targetAudience === "both",
          )
          .map((p) => ({
            id: String(p.id),
            title: p.name,
            contract: p.contractType,
            tagline: p.description,
            desc: p.description,
            image: p.logo || "/images/products/_1_barang.jpg",
            modalImage: p.logo || "/images/products/p_murabahah.jpg",
            tenor: `${p.minTenorMonths} - ${p.maxTenorMonths} Bulan`,
            targetYield: `${p.interestRateAnnual}% - ${Number(p.interestRateAnnual) + 3}% p.a.`,
            riskLevel: "Terukur & Prudent",
            color: "from-teal-600 to-emerald-700",
          }))
      : [],
  );

  let faqs = $derived(
    $cmsStore.faqs?.length
      ? $cmsStore.faqs
          .filter((f) => f.isInvestor)
          .map((f) => ({ q: f.question || f.q, a: f.answer || f.a }))
      : [],
  );
</script>

<svelte:head>
  <title
    >Pendanaan Syariah & Investor | Namia Syariah — Smart Growth, Halal Impact</title
  >
  <meta
    name="description"
    content="Salurkan dana ke sektor riil produktif dengan imbal hasil bagi hasil menarik hingga 18% p.a. tanpa riba. Berizin OJK dan diawasi DPS DSN-MUI di Namia Syariah. Smart Growth, Halal Impact."
  />
</svelte:head>

<div class="space-y-0 font-sans">
  <!-- HERO JUMBOTRON SECTION -->
  <section
    id="ikhtisar"
    class="bg-[#0f172a] text-white py-16 sm:py-20 border-b border-slate-700"
  >
    <div class="max-w-5xl mx-auto px-4 text-center space-y-7">
      <!-- Trust Badge -->
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] bg-slate-800 border border-slate-600 text-xs font-bold uppercase tracking-wider text-emerald-400"
      >
        <Sparkles class="w-3.5 h-3.5 text-emerald-400" />
        <span>Platform P2P Crowdfunding Syariah Berizin OJK</span>
      </div>

      <!-- Main Headline -->
      <div class="space-y-3">
        <h1
          class="text-3xl sm:text-5xl font-bold tracking-tight uppercase leading-tight text-white"
        >
          Tumbuhkan Aset dengan <br />
          <span class="text-emerald-400"> Imbal Hasil Halal & Berkah </span>
        </h1>

        <p
          class="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base font-normal leading-relaxed"
        >
          Salurkan pendanaan langsung ke proyek UMKM produktif pilihan. Nikmati
          imbal hasil kompetitif hingga
          <strong class="font-bold text-white"> 18% p.a.</strong> dengan transparansi
          akad syariah tanpa riba, diawasi langsung oleh DSN-MUI.
        </p>
      </div>

      <!-- Action Buttons -->
      <div
        class="pt-2 flex flex-wrap items-center justify-center gap-3 font-['Raleway']"
      >
        <a
          href="/aggregator"
          class="button-4-primary text-xs py-3 px-6 rounded-[3px] font-bold uppercase tracking-wider inline-flex items-center gap-2"
        >
          <span>Mulai Pendanaan Sekarang</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>

        <button
          type="button"
          onclick={() => (showCalcModal = true)}
          class="button-4 text-xs py-3 px-5 rounded-[3px] font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
        >
          <Calculator class="w-4 h-4 text-emerald-600" />
          <span>Simulasi Bagi Hasil</span>
        </button>
      </div>

      <!-- Metrics Ribbon inside Hero -->
      <div class="pt-6 max-w-4xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div
            class="bg-slate-800 p-4 rounded-[3px] border border-slate-700 text-center"
          >
            <div class="text-xl sm:text-2xl font-bold text-emerald-400">
              12% - 18%
            </div>
            <div
              class="text-[11px] text-slate-300 font-semibold uppercase tracking-wider mt-0.5"
            >
              Est. Return / Tahun
            </div>
          </div>
          <div
            class="bg-slate-800 p-4 rounded-[3px] border border-slate-700 text-center"
          >
            <div class="text-xl sm:text-2xl font-bold text-white">
              Rp 1 Juta
            </div>
            <div
              class="text-[11px] text-slate-300 font-semibold uppercase tracking-wider mt-0.5"
            >
              Min. Pendanaan
            </div>
          </div>
          <div
            class="bg-slate-800 p-4 rounded-[3px] border border-slate-700 text-center"
          >
            <div class="text-xl sm:text-2xl font-bold text-emerald-400">
              98.4%
            </div>
            <div
              class="text-[11px] text-slate-300 font-semibold uppercase tracking-wider mt-0.5"
            >
              TKB90 Terverifikasi
            </div>
          </div>
          <div
            class="bg-slate-800 p-4 rounded-[3px] border border-slate-700 text-center"
          >
            <div class="text-xl sm:text-2xl font-bold text-white">100% Sah</div>
            <div
              class="text-[11px] text-slate-300 font-semibold uppercase tracking-wider mt-0.5"
            >
              Fatwa DPS DSN-MUI
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 1: KEUNGGULAN UTAMA PENDANAAN NAMIA -->
  <section id="keunggulan" class="py-20 bg-white border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-[#1abc9c] uppercase tracking-widest block font-['Raleway']"
          >Mengapa Memilih Kami</span
        >
        <h2
          class="text-2xl sm:text-3xl font-['Raleway'] font-bold text-[#333333] uppercase"
        >
          Keunggulan Pendanaan di Namia Syariah
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Kombinasi integritas syariah yang ketat berlandaskan An-Namaa',
          teknologi digital modern, dan manajemen risiko terstandar untuk
          memberikan imbal hasil optimal.
        </p>
      </div>

      <!-- 5 Pillars Grid with Authentic Icons -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {#each investorPillars as f}
          <div
            class="bg-slate-50 p-6 border border-slate-300 rounded-[3px] text-center space-y-4 flex flex-col justify-between hover:bg-white hover:border-emerald-600 transition-colors"
          >
            <div class="space-y-3">
              <span
                class="inline-block px-2.5 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300"
              >
                {f.badge}
              </span>
              <div class="h-16 flex items-center justify-center">
                <img
                  src={f.icon}
                  alt={f.title}
                  class="max-h-12 w-auto object-contain"
                />
              </div>
              <h4 class="text-sm font-bold text-slate-800 leading-snug">
                {f.title}
              </h4>
            </div>
            <p
              class="text-xs text-slate-600 leading-relaxed pt-3 border-t border-slate-200 font-normal"
            >
              {f.desc}
            </p>
          </div>
        {/each}
      </div>

      <!-- 5 Core Principles Bar -->
      <div
        class="bg-slate-900 rounded-[3px] p-6 sm:p-8 text-white shadow-xs border border-slate-700"
      >
        <div class="text-center max-w-xl mx-auto mb-6 space-y-1">
          <h3 class="text-lg font-bold text-white uppercase tracking-wider">
            5 Prinsip Fundamental Namia Syariah
          </h3>
          <p class="text-xs text-slate-300">
            Landasan amanah dalam setiap aliran modal yang disalurkan
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {#each coreValues as v}
            <div
              class="bg-slate-800 border border-slate-700 rounded-[3px] p-4 text-center space-y-2 hover:bg-slate-700 transition-colors"
            >
              <div
                class="w-8 h-8 rounded-full bg-emerald-900 text-emerald-300 mx-auto flex items-center justify-center"
              >
                <CheckCircle2 class="w-4 h-4" />
              </div>
              <div class="font-bold text-sm text-white uppercase">
                {v.title}
              </div>
              <div
                class="text-[11px] text-slate-300 font-normal leading-relaxed"
              >
                {v.desc}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 2: 4 PRODUK & SKEMA AKAD SYARIAH -->
  <section id="produk" class="py-20 bg-[#F9F9F9] border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-emerald-700 uppercase tracking-widest block font-['Raleway']"
          >Pilihan Investasi</span
        >
        <h2 class="text-2xl sm:text-3xl font-bold text-[#333333] uppercase">
          Produk & Skema Akad Pendanaan
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Setiap instrumen pendanaan dirancang sesuai kaidah fikih muamalah
          kontemporer untuk membiayai kebutuhan riil UMKM.
        </p>
      </div>

      <!-- Product Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each products as p}
          <div
            class="bg-white rounded-[3px] border border-slate-300 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <!-- Card Header & Image -->
            <div>
              <div class="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={p.image}
                  alt={p.title}
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/50"></div>

                <span
                  class="absolute top-3 left-3 px-2.5 py-1 rounded-[2px] text-[10.5px] font-bold uppercase tracking-wider bg-white text-slate-800 border border-slate-300"
                >
                  Akad {p.contract}
                </span>

                <div class="absolute bottom-3 left-3 right-3 text-left">
                  <h3
                    class="text-lg font-bold text-white uppercase leading-tight"
                  >
                    {p.title}
                  </h3>
                  <div class="text-[11px] text-emerald-300 font-semibold">
                    {p.tagline}
                  </div>
                </div>
              </div>

              <!-- Card Body -->
              <div class="p-5 space-y-4">
                <p class="text-xs text-slate-600 leading-relaxed min-h-[48px]">
                  {p.desc}
                </p>

                <!-- Spec Grid -->
                <div
                  class="bg-slate-50 rounded-[3px] p-3 border border-slate-200 space-y-2 text-xs"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500 flex items-center gap-1.5"
                      ><Clock class="w-3 h-3 text-slate-400" /> Tenor Proyek:</span
                    >
                    <span class="font-bold text-slate-800">{p.tenor}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500 flex items-center gap-1.5"
                      ><TrendingUp class="w-3 h-3 text-emerald-600" /> Target Imbal
                      Hasil:</span
                    >
                    <span class="font-bold text-emerald-700"
                      >{p.targetYield}</span
                    >
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500 flex items-center gap-1.5"
                      ><ShieldCheck class="w-3 h-3 text-slate-400" /> Profil Risiko:</span
                    >
                    <span class="font-semibold text-slate-700"
                      >{p.riskLevel}</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="p-5 pt-0 space-y-2">
              <button
                type="button"
                onclick={() => (selectedProduct = p)}
                class="button-4 w-full py-2 px-3 rounded-[3px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText class="w-3.5 h-3.5 text-emerald-600" />
                <span>Lihat Skema Akad</span>
              </button>

              <a
                href="/aggregator?contract={p.contract.toLowerCase()}"
                class="button-4-primary w-full py-2 px-3 rounded-[3px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <span>Danai Proyek Ini</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SECTION 3: 5 LANGKAH ALUR PENDANAAN (TIMELINE DESIGN) -->
  <section
    id="alur"
    class="py-20 bg-slate-900 text-white border-b border-slate-800"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div
        class="heading-block noborder text-center max-w-3xl mx-auto space-y-2"
      >
        <span
          class="text-xs font-bold text-emerald-400 uppercase tracking-widest block font-['Raleway']"
          >Alur Kerja Praktis</span
        >
        <h2 class="text-2xl sm:text-3xl font-bold text-white uppercase">
          5 Langkah Melakukan Pendanaan
        </h2>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Alur pendanaan sederhana, aman, dan 100% terintegrasi secara digital
          dari pendaftaran hingga imbal hasil.
        </p>
        <div class="w-12 h-0.5 bg-emerald-500 mx-auto mt-4"></div>
      </div>

      <!-- Progressive Connected Step Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {#each steps as st}
          <div
            class="bg-slate-800 rounded-[3px] p-6 border border-slate-700 flex flex-col justify-between relative"
          >
            <div class="space-y-4">
              <!-- Step Number Badge -->
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-slate-500">{st.num}</span>
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>

              <!-- Process Icon -->
              <div class="h-16 flex items-center justify-center">
                <div
                  class="w-12 h-12 rounded-[3px] bg-slate-700 border border-slate-600 flex items-center justify-center text-emerald-400"
                >
                  <UserCheck class="w-6 h-6" />
                </div>
              </div>

              <!-- Step Title -->
              <h4 class="text-base font-bold text-white uppercase">
                {st.title}
              </h4>
            </div>

            <!-- Description -->
            <p
              class="text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-700 mt-3 font-normal"
            >
              {st.desc}
            </p>
          </div>
        {/each}
      </div>

      <!-- Direct CTA after Steps -->
      <div class="text-center pt-4">
        <a
          href="/aggregator"
          class="button-4-primary text-xs py-3 px-8 rounded-[3px] font-bold uppercase tracking-wider inline-flex items-center gap-2"
        >
          <span>Buka Akun & Mulai Danai</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      </div>
    </div>
  </section>

  <!-- SECTION 4: KALKULATOR POTENSI BAGI HASIL -->
  <section id="kalkulator" class="py-20 bg-white border-b border-[#ECECEC]">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-emerald-700 uppercase tracking-widest block font-['Raleway']"
          >Simulasi Finansial</span
        >
        <h2 class="text-2xl sm:text-3xl font-bold text-[#333333] uppercase">
          Hitung Potensi Bagi Hasil Anda
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Gunakan kalkulator simulasi di bawah untuk mengestimasi pertumbuhan
          aset Anda dengan skema bagi hasil syariah.
        </p>
      </div>

      <!-- Calculator Card Wrapper -->
      <div
        class="bg-white rounded-[3px] p-6 sm:p-8 border border-slate-300 shadow-xs space-y-6"
      >
        <InvestmentCalculator />

        <!-- Educational Note -->
        <div
          class="bg-slate-50 border border-slate-200 rounded-[3px] p-4 flex items-start gap-3 text-xs text-slate-600"
        >
          <Info class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p class="leading-relaxed">
            <strong>Catatan Transparansi:</strong> Angka kalkulator di atas merupakan
            simulasi ilustratif berdasarkan rata-rata nisbah bagi hasil historis
            proyek di Namia Syariah. Imbal hasil riil mengikuti kinerja operasional
            masing-masing proyek mitra usaha.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 5: EDUKASI & FAQ PENDANA -->
  <section id="edukasi" class="py-20 bg-[#F9F9F9] border-b border-[#ECECEC]">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-emerald-700 uppercase tracking-widest block font-['Raleway']"
          >Pusat Informasi</span
        >
        <h2 class="text-2xl sm:text-3xl font-bold text-[#333333] uppercase">
          Pertanyaan Umum Seputar Pendanaan
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Pelajari lebih lanjut mengenai mekanisme keamanan, pembagian hasil,
          dan keabsahan syariah di Namia Syariah.
        </p>
      </div>

      <!-- FAQ Accordion List -->
      <div class="space-y-3 font-sans">
        {#each faqs as item, idx}
          <div
            class="bg-white rounded-[3px] border border-slate-300 overflow-hidden shadow-2xs transition-colors"
          >
            <button
              type="button"
              onclick={() => (openFaqIndex = openFaqIndex === idx ? null : idx)}
              class="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-800 hover:text-emerald-700 cursor-pointer"
            >
              <span class="flex items-center gap-3">
                <HelpCircle class="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{item.q}</span>
              </span>
              <ChevronDown
                class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 {openFaqIndex ===
                idx
                  ? 'rotate-180 text-emerald-600'
                  : ''}"
              />
            </button>

            {#if openFaqIndex === idx}
              <div
                class="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed border-t border-slate-200 bg-slate-50"
              >
                {item.a}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- BOTTOM FULL-WIDTH SOLID CTA BANNER -->
  <section
    class="bg-[#059669] py-10 sm:py-12 text-white border-t border-b border-[#047857]"
  >
    <div
      class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
    >
      <div class="space-y-1.5 font-sans">
        <h3
          class="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white"
        >
          Siap Memulai Pendanaan Syariah?
        </h3>
        <p class="text-xs sm:text-sm text-emerald-100 font-sans">
          Buka akun Anda dalam 5 menit dan pilih proyek UMKM produktif dengan
          imbal hasil berkah.
        </p>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <a
          href="/aggregator"
          class="px-6 py-2.5 rounded-[3px] bg-white text-emerald-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors shadow-xs flex items-center gap-2 border border-white"
        >
          <span>Katalog Proyek Aktif</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      </div>
    </div>
  </section>
</div>

<!-- CALCULATOR MODAL -->
{#if showCalcModal}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60"
  >
    <div
      class="bg-white rounded-[3px] max-w-2xl w-full p-5 sm:p-7 space-y-5 shadow-xl border border-slate-300 relative"
    >
      <button
        type="button"
        onclick={() => (showCalcModal = false)}
        class="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-[2px] transition-colors cursor-pointer"
        aria-label="Tutup"
      >
        <X class="w-5 h-5" />
      </button>

      <div class="space-y-1">
        <span
          class="text-xs font-bold text-emerald-700 uppercase tracking-wider block"
          >Simulasi Mandiri</span
        >
        <h3 class="text-xl font-bold text-slate-900">
          Kalkulator Pendanaan Namia Syariah
        </h3>
      </div>

      <InvestmentCalculator />

      <div class="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onclick={() => (showCalcModal = false)}
          class="h-9 px-4 rounded-[3px] border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
        >
          Tutup
        </button>
        <a
          href="/aggregator"
          class="button-4-primary text-xs py-2 px-4 rounded-[3px] font-bold uppercase tracking-wider"
        >
          <span>Mulai Pendanaan</span>
        </a>
      </div>
    </div>
  </div>
{/if}

<!-- PRODUCT SCHEME INFOGRAPHIC MODAL -->
{#if selectedProduct}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60"
  >
    <div
      class="bg-white rounded-[3px] max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-xl border border-slate-300 relative max-h-[90vh] flex flex-col"
    >
      <div
        class="flex items-center justify-between pb-3 border-b border-slate-200"
      >
        <div>
          <span
            class="text-xs font-bold text-emerald-700 uppercase tracking-wider block"
            >Skema Akad Syariah</span
          >
          <h3 class="text-lg font-bold text-slate-900">
            {selectedProduct.title} (Akad {selectedProduct.contract})
          </h3>
        </div>
        <button
          type="button"
          onclick={() => (selectedProduct = null)}
          class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-[2px] transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div
        class="overflow-y-auto flex-1 rounded-[2px] bg-slate-50 p-2 flex items-center justify-center border border-slate-200"
      >
        <img
          src={selectedProduct.modalImage}
          alt="{selectedProduct.title} Skema"
          class="max-w-full h-auto rounded-[2px] object-contain"
        />
      </div>

      <div
        class="flex items-center justify-between pt-2 border-t border-slate-200"
      >
        <span class="text-xs text-slate-500"
          >Diawasi oleh Dewan Pengawas Syariah DSN-MUI</span
        >
        <div class="flex gap-2">
          <button
            type="button"
            onclick={() => (selectedProduct = null)}
            class="h-9 px-4 rounded-[3px] border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
          >
            Tutup
          </button>
          <a
            href="/aggregator?contract={selectedProduct.contract.toLowerCase()}"
            class="button-4-primary text-xs py-2 px-4 rounded-[3px] font-bold uppercase tracking-wider"
          >
            <span>Mulai Danai</span>
          </a>
        </div>
      </div>
    </div>
  </div>
{/if}
