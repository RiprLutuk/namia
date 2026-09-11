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
    Briefcase,
    BadgeCheck,
    FileSpreadsheet,
    UserCheck,
    FileUp,
    ClipboardCheck,
    LayoutGrid,
    HandCoins,
  } from "lucide-svelte";
  import LoanCalculator from "$lib/components/calculators/LoanCalculator.svelte";
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

  // Dynamic borrower values from database & API
  let coreValues = $derived($cmsStore.borrowerInfo?.coreValues || []);
  let features = $derived($cmsStore.borrowerInfo?.features || []);
  let steps = $derived($cmsStore.borrowerInfo?.steps || []);
  let requirements = $derived($cmsStore.borrowerInfo?.requirements || []);

  let products = $derived(
    $cmsStore.products?.length
      ? $cmsStore.products
          .filter(
            (p) =>
              p.targetAudience === "borrower" ||
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
            plafon: `Rp ${(p.minAmount / 1_000_000).toLocaleString("id-ID")} Jt - Rp ${(p.maxAmount / 1_000_000).toLocaleString("id-ID")} Jt`,
            tenor: `${p.minTenorMonths} - ${p.maxTenorMonths} Bulan`,
            margin: `Mulai ${p.interestRateAnnual}% p.a.`,
            color: "from-teal-600 to-emerald-700",
          }))
      : [],
  );

  let faqs = $derived(
    $cmsStore.faqs?.length
      ? $cmsStore.faqs
          .filter((f) => !f.isInvestor)
          .map((f) => ({ q: f.question || f.q, a: f.answer || f.a }))
      : [],
  );
</script>

<svelte:head>
  <title>Penerima Pembiayaan (Borrower) | Namia Syariah</title>
  <meta
    name="description"
    content="Ajukan pembiayaan modal kerja syariah tanpa riba hingga Rp 2 Miliar dengan margin transparan, proses cepat, dan diawasi DSN-MUI di Namia Syariah. Smart Growth, Halal Impact."
  />
</svelte:head>

<div class="space-y-0 font-sans">
  <!-- HERO SECTION WITH REFINED METRICS -->
  <section
    id="ikhtisar"
    class="relative min-h-[500px] flex items-center justify-center text-white bg-[#0f172a] border-b border-slate-800"
  >
    <div
      class="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center space-y-6"
    >
      <!-- Trust Badge -->
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] bg-slate-900 border border-slate-700 text-xs font-bold uppercase tracking-wider text-emerald-300"
      >
        <Sparkles class="w-3.5 h-3.5 text-emerald-300" />
        <span
          >Solusi Permodalan Usaha Produktif Tanpa Riba &bull; Berizin OJK</span
        >
      </div>

      <!-- Main Headline -->
      <div class="space-y-3">
        <h1
          class="text-3xl sm:text-5xl font-bold tracking-tight uppercase leading-tight text-white"
        >
          Akselerasi Bisnis dengan <br />
          <span class="text-emerald-400"> Pembiayaan Syariah Terpercaya </span>
        </h1>

        <p
          class="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base font-normal leading-relaxed"
        >
          Dapatkan akses modal kerja, pengadaan barang, dan sewa jasa produktif
          hingga
          <strong class="font-bold text-white"> Rp 2 Miliar</strong> dengan margin
          keuntungan tetap transparan, skema cicilan fleksibel, dan diawasi langsung
          oleh Dewan Pengawas Syariah DSN-MUI.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
        <a
          href="/onboarding"
          class="button-4-primary text-xs uppercase tracking-wider py-2.5 px-5 rounded-[4px] flex items-center gap-2 font-bold"
        >
          <span>Ajukan Pembiayaan Sekarang</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>

        <button
          type="button"
          onclick={() => (showCalcModal = true)}
          class="button-4-light text-xs py-2.5 px-5 rounded-[4px] flex items-center gap-2 font-bold uppercase tracking-wider cursor-pointer"
        >
          <Calculator class="w-4 h-4 text-slate-700" />
          <span>Simulasi Angsuran</span>
        </button>
      </div>

      <!-- Floating Metrics Ribbon inside Hero -->
      <div class="pt-8 max-w-4xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div
            class="bg-slate-900 p-4 rounded-[4px] border border-slate-700 text-center"
          >
            <div class="text-xl sm:text-2xl font-bold text-emerald-400">
              s/d Rp 2 Miliar
            </div>
            <div
              class="text-[11px] text-slate-300 font-medium uppercase tracking-wider mt-0.5"
            >
              Plafon Pembiayaan
            </div>
          </div>
          <div
            class="bg-slate-900 p-4 rounded-[4px] border border-slate-700 text-center"
          >
            <div
              class="text-xl sm:text-2xl font-bold font-['Raleway'] text-white"
            >
              Mulai 0.8% / bln
            </div>
            <div
              class="text-[11px] text-slate-300 font-medium uppercase tracking-wider mt-0.5"
            >
              Margin / Ujrah Flat
            </div>
          </div>
          <div
            class="bg-slate-900 p-4 rounded-[4px] border border-slate-700 text-center"
          >
            <div
              class="text-xl sm:text-2xl font-bold font-['Raleway'] text-emerald-400"
            >
              1 - 24 Bulan
            </div>
            <div
              class="text-[11px] text-slate-300 font-medium uppercase tracking-wider mt-0.5"
            >
              Pilihan Tenor
            </div>
          </div>
          <div
            class="bg-slate-900 p-4 rounded-[4px] border border-slate-700 text-center"
          >
            <div
              class="text-xl sm:text-2xl font-bold font-['Raleway'] text-white"
            >
              100% Halal
            </div>
            <div
              class="text-[11px] text-slate-300 font-medium uppercase tracking-wider mt-0.5"
            >
              Bebas Riba & Denda Bunga
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 1: KEUNGGULAN UTAMA PEMBIAYAAN NAMIA -->
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
          Keunggulan Pembiayaan di Namia Syariah
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Dirancang khusus untuk mendukung pertumbuhan UMKM nasional dengan
          proses transparan, adil, dan bernilai ibadah berlandaskan An-Namaa'.
        </p>
      </div>

      <!-- 5 Features Grid with Authentic Icons -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {#each features as f}
          <div
            class="bg-slate-50/70 p-6 border border-[#E9ECEF] rounded-[4px] text-center space-y-4 flex flex-col justify-between hover:border-[#1abc9c] hover:bg-white hover:shadow-md transition-all group"
          >
            <div class="space-y-3">
              <span
                class="inline-block px-2.5 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200/50"
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
              <h4
                class="text-sm font-['Raleway'] font-bold text-[#333333] leading-snug"
              >
                {f.title}
              </h4>
            </div>
            <p
              class="text-xs text-[#666666] leading-relaxed pt-3 border-t border-slate-200/60 font-normal"
            >
              {f.desc}
            </p>
          </div>
        {/each}
      </div>

      <!-- 5 Core Principles Bar -->
      <div
        class="bg-slate-900 rounded-[4px] p-6 sm:p-8 text-white shadow-xs border border-slate-700"
      >
        <div class="text-center max-w-xl mx-auto mb-6 space-y-1">
          <h3 class="text-lg font-bold text-white uppercase tracking-wider">
            5 Prinsip Fundamental Namia Syariah
          </h3>
          <p class="text-xs text-slate-300">
            Komitmen kami dalam mengedepankan amanah dan kemitraan maslahat
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

  <!-- SECTION 2: 4 PRODUK PEMBIAYAAN & AKAD SYARIAH -->
  <section id="produk" class="py-20 bg-[#F9F9F9] border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-emerald-700 uppercase tracking-widest block font-['Raleway']"
          >Solusi Modal Usaha</span
        >
        <h2 class="text-2xl sm:text-3xl font-bold text-[#333333] uppercase">
          Produk & Skema Akad Pembiayaan
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Pilih skema pembiayaan yang tepat sesuai peruntukan modal usaha Anda
          dengan akad resmi Dewan Pengawas Syariah.
        </p>
      </div>

      <!-- Modern Product Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each products as p}
          <div
            class="bg-white rounded-[4px] border border-slate-300 overflow-hidden shadow-xs flex flex-col justify-between"
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
                  class="bg-slate-50 rounded-[3px] p-3 border border-slate-100 space-y-2 text-xs"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500 flex items-center gap-1.5"
                      ><Building2 class="w-3 h-3 text-slate-400" /> Plafon:</span
                    >
                    <span class="font-bold text-slate-800">{p.plafon}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500 flex items-center gap-1.5"
                      ><Clock class="w-3 h-3 text-slate-400" /> Tenor:</span
                    >
                    <span class="font-bold text-[#1abc9c]">{p.tenor}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500 flex items-center gap-1.5"
                      ><Percent class="w-3 h-3 text-emerald-500" /> Skema:</span
                    >
                    <span class="font-semibold text-slate-700">{p.margin}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Actions -->
            <div class="p-5 pt-0 space-y-2">
              <button
                type="button"
                onclick={() => (selectedProduct = p)}
                class="w-full py-2.5 px-3 rounded-[3px] border border-slate-200 hover:border-[#1abc9c] text-slate-700 hover:text-[#1abc9c] hover:bg-teal-50/50 text-xs font-bold uppercase tracking-wider font-['Raleway'] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText class="w-3.5 h-3.5 text-[#1abc9c]" />
                <span>Lihat Skema Akad</span>
              </button>

              <a
                href="/onboarding?product={p.contract.toLowerCase()}"
                class="w-full py-2.5 px-3 rounded-[3px] bg-slate-900 hover:bg-[#1abc9c] text-white text-xs font-bold uppercase tracking-wider font-['Raleway'] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Ajukan Produk Ini</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SECTION 3: 6 LANGKAH ALUR MENGAJUKAN PEMBIAYAAN -->
  <section id="alur" class="py-20 bg-slate-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div
        class="heading-block noborder text-center max-w-3xl mx-auto space-y-2"
      >
        <span
          class="text-xs font-bold text-[#1abc9c] uppercase tracking-widest block font-['Raleway']"
          >Alur Pengajuan Praktis</span
        >
        <h2
          class="text-2xl sm:text-3xl font-['Raleway'] font-bold text-white uppercase"
        >
          6 Langkah Mengajukan Pembiayaan
        </h2>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Proses permohonan modal kerja yang ringkas, transparan, dan terstandar
          dari pendaftaran hingga pencairan.
        </p>
        <div class="w-12 h-0.5 bg-[#1abc9c] mx-auto mt-4"></div>
      </div>

      <!-- Progressive Connected Step Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each steps as st}
          <div
            class="bg-slate-800/80 rounded-[4px] p-6 border border-slate-700/80 hover:border-[#1abc9c] transition-all flex flex-col justify-between relative group"
          >
            <div class="space-y-4">
              <!-- Step Number Badge -->
              <div class="flex items-center justify-between">
                <span
                  class="text-2xl font-black font-['Raleway'] text-slate-600 group-hover:text-[#1abc9c] transition-colors"
                  >{st.num}</span
                >
                <span
                  class="w-2.5 h-2.5 rounded-full bg-[#1abc9c]/40 group-hover:bg-[#1abc9c] transition-colors"
                ></span>
              </div>

              <!-- Process Icon -->
              <div class="h-16 flex items-center justify-center">
                <div
                  class="w-14 h-14 rounded-[3px] bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400"
                >
                  <UserCheck class="w-7 h-7" />
                </div>
              </div>

              <!-- Step Title -->
              <h4
                class="text-base font-['Raleway'] font-bold text-white uppercase"
              >
                {st.title}
              </h4>
            </div>

            <!-- Description -->
            <p
              class="text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-700 mt-3 font-light"
            >
              {st.desc}
            </p>
          </div>
        {/each}
      </div>

      <!-- Direct CTA after Steps -->
      <div class="text-center pt-4">
        <a
          href="/onboarding"
          class="btn-canvas btn-canvas-teal text-xs py-3 px-8 !rounded-[4px] font-['Raleway'] font-bold uppercase tracking-wider inline-flex items-center gap-2"
        >
          <span>Daftar & Ajukan Sekarang</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      </div>
    </div>
  </section>

  <!-- SECTION 4: KALKULATOR SIMULASI ANGSURAN PEMBIAYAAN -->
  <section id="kalkulator" class="py-20 bg-white border-b border-[#ECECEC]">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-[#1abc9c] uppercase tracking-widest block font-['Raleway']"
          >Simulasi Pembiayaan</span
        >
        <h2
          class="text-2xl sm:text-3xl font-['Raleway'] font-bold text-[#333333] uppercase"
        >
          Hitung Estimasi Angsuran Usaha Anda
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Gunakan kalkulator simulasi di bawah untuk mengestimasi besaran
          angsuran bulanan yang sesuai dengan kapasitas arus kas bisnis Anda.
        </p>
      </div>

      <!-- Calculator Card Wrapper -->
      <div
        class="bg-white rounded-[4px] p-6 sm:p-10 border border-[#E9ECEF] shadow-lg space-y-6"
      >
        <LoanCalculator />

        <!-- Educational Note -->
        <div
          class="bg-slate-50 border border-slate-200/80 rounded-[3px] p-4 flex items-start gap-3 text-xs text-slate-600"
        >
          <Info class="w-4 h-4 text-[#1abc9c] shrink-0 mt-0.5" />
          <p class="leading-relaxed">
            <strong>Catatan Transparansi:</strong> Simulasi di atas merupakan perkiraan
            cicilan flat berdasarkan rata-rata margin historis. Besaran margin riil,
            ujrah sewa, atau nisbah bagi hasil akan disesuaikan setelah penilaian
            risiko (credit scoring) terhadap profil usaha Anda.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 5: PERSYARATAN & FAQ PEMBIAYAAN -->
  <section id="edukasi" class="py-20 bg-[#F9F9F9] border-b border-[#ECECEC]">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
      <!-- Syarat & Dokumen Section -->
      <div class="space-y-6">
        <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
          <span
            class="text-xs font-bold text-[#1abc9c] uppercase tracking-widest block font-['Raleway']"
            >Kualifikasi Penerima Pembiayaan</span
          >
          <h2
            class="text-2xl sm:text-3xl font-['Raleway'] font-bold text-[#333333] uppercase"
          >
            Syarat & Dokumen Pengajuan
          </h2>
          <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
            Pastikan usaha Anda memenuhi kualifikasi dasar di bawah ini sebelum
            mengajukan permohonan modal.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#each requirements as req}
            <div
              class="bg-white rounded-[4px] p-6 border border-slate-200 shadow-xs space-y-4"
            >
              <div
                class="flex items-center gap-2.5 pb-3 border-b border-slate-100"
              >
                <Briefcase class="w-5 h-5 text-[#1abc9c]" />
                <h3
                  class="font-['Raleway'] font-bold text-base text-slate-800 uppercase tracking-wide"
                >
                  {req.category}
                </h3>
              </div>
              <ul class="space-y-3">
                {#each req.items as item}
                  <li
                    class="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed"
                  >
                    <Check class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      </div>

      <!-- FAQ Accordion List -->
      <div class="space-y-6 pt-6">
        <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
          <span
            class="text-xs font-bold text-[#1abc9c] uppercase tracking-widest block font-['Raleway']"
            >Pusat Informasi</span
          >
          <h2
            class="text-2xl sm:text-3xl font-['Raleway'] font-bold text-[#333333] uppercase"
          >
            Pertanyaan Umum Seputar Pembiayaan
          </h2>
        </div>

        <div class="space-y-3 font-['Raleway']">
          {#each faqs as item, idx}
            <div
              class="bg-white rounded-[4px] border border-slate-200 overflow-hidden shadow-2xs transition-colors"
            >
              <button
                type="button"
                onclick={() =>
                  (openFaqIndex = openFaqIndex === idx ? null : idx)}
                class="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-800 hover:text-[#1abc9c] cursor-pointer"
              >
                <span class="flex items-center gap-3">
                  <HelpCircle class="w-4 h-4 text-[#1abc9c] shrink-0" />
                  <span>{item.q}</span>
                </span>
                <ChevronDown
                  class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 {openFaqIndex ===
                  idx
                    ? 'rotate-180 text-[#1abc9c]'
                    : ''}"
                />
              </button>

              {#if openFaqIndex === idx}
                <div
                  class="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 font-sans leading-relaxed border-t border-slate-100 bg-slate-50/50"
                >
                  {item.a}
                </div>
              {/if}
            </div>
          {/each}
        </div>
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
      <div class="space-y-1.5">
        <h3
          class="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white"
        >
          Siap Mengembangkan Bisnis Anda?
        </h3>
        <p class="text-xs sm:text-sm text-emerald-100">
          Ajukan pembiayaan modal kerja syariah sekarang dan dapatkan solusi
          modal tanpa riba.
        </p>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <a
          href="/onboarding"
          class="px-6 py-2.5 rounded-[4px] bg-white text-emerald-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors shadow-xs flex items-center gap-2 border border-white"
        >
          <span>Mulai Pengajuan Modal</span>
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
      class="bg-white rounded-[4px] max-w-2xl w-full p-5 sm:p-7 space-y-5 shadow-xl border border-slate-300 relative"
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
        <h3 class="text-xl font-bold font-['Raleway'] text-slate-900">
          Kalkulator Pembiayaan Namia Syariah
        </h3>
      </div>

      <LoanCalculator />

      <div class="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onclick={() => (showCalcModal = false)}
          class="h-10 px-5 rounded-[3px] border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
        >
          Tutup
        </button>
        <a href="/onboarding" class="btn-canvas btn-canvas-teal text-xs">
          <span>Lanjut Pengajuan</span>
        </a>
      </div>
    </div>
  </div>
{/if}

<!-- PRODUCT SCHEME INFOGRAPHIC MODAL -->
{#if selectedProduct}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
  >
    <div
      class="bg-white rounded-[4px] max-w-2xl w-full p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-300 relative max-h-[90vh] flex flex-col"
    >
      <div
        class="flex items-center justify-between pb-3 border-b border-slate-100"
      >
        <div>
          <span
            class="text-xs font-bold text-emerald-700 uppercase tracking-wider block"
            >Skema Akad Syariah</span
          >
          <h3 class="text-lg font-bold font-['Raleway'] text-slate-900">
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
        class="overflow-y-auto flex-1 rounded-[2px] bg-slate-50 p-2 flex items-center justify-center"
      >
        <img
          src={selectedProduct.modalImage}
          alt="{selectedProduct.title} Skema"
          class="max-w-full h-auto rounded-[2px] shadow-2xs object-contain"
        />
      </div>

      <div
        class="flex items-center justify-between pt-2 border-t border-slate-100"
      >
        <span class="text-xs text-slate-500"
          >Diawasi oleh Dewan Pengawas Syariah DSN-MUI</span
        >
        <div class="flex gap-2">
          <button
            type="button"
            onclick={() => (selectedProduct = null)}
            class="h-10 px-4 rounded-[3px] border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
          >
            Tutup
          </button>
          <a
            href="/onboarding?product={selectedProduct.contract.toLowerCase()}"
            class="btn-canvas btn-canvas-teal text-xs"
          >
            <span>Ajukan Pembiayaan</span>
          </a>
        </div>
      </div>
    </div>
  </div>
{/if}
