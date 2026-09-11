<script lang="ts">
  import { onMount } from "svelte";
  import {
    ArrowRight,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Coins,
    Users,
    CheckCircle,
    UserCheck,
    ExternalLink,
    X,
    Play,
    ShieldCheck,
    Award,
    Lock,
    TrendingUp,
    Scale,
    HelpCircle,
    ChevronDown,
    Check,
    Building2,
    Phone,
  } from "lucide-svelte";
  import LoanCalculator from "$lib/components/calculators/LoanCalculator.svelte";
  import InvestmentCalculator from "$lib/components/calculators/InvestmentCalculator.svelte";
  import CreditScoreEstimator from "$lib/components/calculators/CreditScoreEstimator.svelte";
  import SalamModal from "$lib/components/SalamModal.svelte";
  import { cmsStore, fetchCmsContent } from "$lib/cms";

  onMount(() => {
    fetchCmsContent();
  });

  // Calculator Active Tab
  let activeCalcTab = $state<"loan" | "invest" | "score">("loan");

  // FAQ Accordion State
  let openFaq = $state<number | null>(null);
  function toggleFaq(index: number) {
    openFaq = openFaq === index ? null : index;
  }

  // Product Carousel Scroll Container
  let productScrollEl = $state<HTMLElement | null>(null);

  function scrollProducts(direction: "left" | "right") {
    if (productScrollEl) {
      const step = 340;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      productScrollEl.scrollBy({
        left: direction === "left" ? -step : step,
        behavior: reducedMotion ? "instant" : "smooth",
      });
    }
  }

  // Selected Product for Detail Modal
  let selectedProduct = $state<{
    id: number;
    name: string;
    contract: string;
    plafon: string;
    tenor: string;
    skema: string;
    image: string;
    accent: string;
    desc: string;
    features: string[];
  } | null>(null);

  function openProductDetail(p: any) {
    selectedProduct = {
      id: p.id,
      name: p.name,
      contract: p.contractType || p.contract || "Murabahah",
      plafon: p.minAmount
        ? `Rp ${(p.minAmount / 1_000_000).toLocaleString("id-ID")} Jt - Rp ${(p.maxAmount / 1_000_000).toLocaleString("id-ID")} Jt`
        : p.plafon || "Fleksibel",
      tenor: p.minTenorMonths
        ? `${p.minTenorMonths} - ${p.maxTenorMonths} Bulan`
        : p.tenor || "1 - 24 Bulan",
      skema:
        p.interestRateAnnual !== undefined
          ? `Margin ${p.interestRateAnnual}% p.a.`
          : p.skema || "Bagi Hasil Riil",
      image: p.logo || p.image || "/images/products/_1_barang.jpg",
      accent: p.accent || "#047857",
      desc: p.description || p.desc || "",
      features: p.features || [],
    };
  }

  // Dynamic values sourced directly from backend database & CMS API
  let mediaCoverage = $derived($cmsStore.mediaCoverage || []);
  let clients = $derived($cmsStore.clients || []);
  let supervise = $derived($cmsStore.supervise || []);
</script>

<svelte:head>
  <title
    >Namia Syariah — Smart Growth, Halal Impact | P2P Financing Syariah</title
  >
  <meta
    name="description"
    content="Namia Syariah: Smart Growth, Halal Impact. Platform P2P financing syariah terpercaya di Indonesia. Solusi investasi produktif halal tanpa riba dan pembiayaan modal kerja UMKM berlandaskan prinsip An-Namaa'."
  />
  <meta
    name="keywords"
    content="fintech syariah, p2p lending syariah, namia, namia syariah, an-namaa, smart growth halal impact, investasi syariah, pembiayaan modal kerja, tanpa riba, murabahah, musyarakah, dsn mui, ojk"
  />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta
    property="og:title"
    content="Namia Syariah — Smart Growth, Halal Impact"
  />
  <meta
    property="og:description"
    content="Smart Growth, Halal Impact. Investasi halal dan pembiayaan UMKM bebas riba dengan akad muamalah riil (Murabahah, Musyarakah, Ijarah)."
  />
  <meta property="og:image" content="/favicon.svg" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="Namia Syariah — Smart Growth, Halal Impact"
  />
  <meta
    name="twitter:description"
    content="Smart Growth, Halal Impact. Pendanaan dan pembiayaan UMKM dengan akad syariah murni."
  />
  <meta name="twitter:image" content="/favicon.svg" />

  <!-- Structured Data JSON-LD for Search Engines -->
  {@html `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FinancialService",
        "@id": "https://namia.id/#organization",
        name: "Namia Syariah",
        legalName: "PT Namia Finansial Teknologi",
        url: "https://namia.id",
        logo: "https://namia.id/favicon.svg",
        description:
          "Namia Syariah: Smart Growth, Halal Impact. Platform Peer-to-Peer Financing Syariah Terpercaya di Indonesia berlandaskan prinsip An-Namaa' tanpa riba.",
        telephone: "+62-21-83782337",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Menara MTH 10th floor, Jl. MT Haryono Kav 23",
          addressLocality: "Jakarta Selatan",
          addressRegion: "DKI Jakarta",
          postalCode: "12820",
          addressCountry: "ID",
        },
        priceRange: "Rp 100.000 - Rp 2.000.000.000",
      },
      {
        "@type": "FAQPage",
        mainEntity: ($cmsStore.faqs || []).map((f) => ({
          "@type": "Question",
          name: f.question || f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer || f.a,
          },
        })),
      },
    ],
  })}</script>`}
</svelte:head>

<!-- Authentic Salam & Bismillah Welcome Modal from old web -->
<SalamModal />

<div class="homepage space-y-0">
  <!-- HERO JUMBOTRON: CLEAN SOLID WEB 2.0 / EARLY BOOTSTRAP STYLE -->
  <section
    class="relative py-16 sm:py-20 flex items-center justify-center text-white bg-[#0f172a] border-b border-slate-800"
  >
    <div class="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6">
      <!-- Authority / Regulatory Badge -->
      <div
        class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 border border-emerald-700 rounded-[3px] text-xs font-semibold text-emerald-200"
      >
        <Sparkles class="w-3.5 h-3.5 text-emerald-300 shrink-0" />
        <span>{$cmsStore.heroContent.badgeText}</span>
      </div>

      <!-- Main Headline -->
      <div class="space-y-3">
        <h1
          class="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]"
        >
          {$cmsStore.heroContent.title}
        </h1>
        <p
          class="text-sm sm:text-base md:text-lg text-slate-300 font-normal max-w-3xl mx-auto leading-relaxed"
        >
          {$cmsStore.heroContent.subtitle}
        </p>
      </div>

      {#if $cmsStore.heroContent.tickerText}
        <div
          class="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-700 rounded-[3px] text-xs text-emerald-300 font-medium"
        >
          <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          <span>{$cmsStore.heroContent.tickerText}</span>
        </div>
      {/if}

      <!-- DUAL ACTION GATEWAY: CLEAN BOOTSTRAP PANELS -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto pt-2 text-left"
      >
        <!-- Pathway 1: Untuk Pendana / Investor -->
        <div
          class="bg-slate-900 border border-slate-700 hover:border-emerald-600 rounded-[4px] p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-colors"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span
                class="text-xs font-semibold text-emerald-300 uppercase tracking-wider"
                >Bagi Pemodal / Pendana</span
              >
              <span
                class="px-2 py-0.5 text-[11px] font-bold bg-emerald-950 text-emerald-200 border border-emerald-700 rounded-[3px]"
                >Imbal Hasil 12% - 18% p.a.</span
              >
            </div>
            <h3
              class="text-lg sm:text-xl font-bold text-white flex items-center gap-2"
            >
              <Coins class="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Mulai Jadi Pendana</span>
            </h3>
            <p
              class="text-xs sm:text-sm text-slate-300 leading-relaxed font-light"
            >
              Kembangkan dana secara halal melalui proyek riil UMKM
              terverifikasi dengan proteksi agunan, transparansi akad, dan imbal
              hasil kompetitif.
            </p>
          </div>
          <a
            href={$cmsStore.heroContent.primaryCtaUrl || "/investor"}
            class="button-4-primary w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <span
              >{$cmsStore.heroContent.primaryCtaText ||
                "Mulai Mendanai Sekarang"}</span
            >
            <ArrowRight class="w-4 h-4" />
          </a>
        </div>

        <!-- Pathway 2: Untuk Pelaku Usaha / Borrower -->
        <div
          class="bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-[4px] p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-colors"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span
                class="text-xs font-semibold text-slate-400 uppercase tracking-wider"
                >Bagi Pelaku Usaha / UMKM</span
              >
              <span
                class="px-2 py-0.5 text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-600 rounded-[3px]"
                >Plafon s/d Rp 2 Miliar</span
              >
            </div>
            <h3
              class="text-lg sm:text-xl font-bold text-white flex items-center gap-2"
            >
              <Building2 class="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Ajukan Modal Usaha</span>
            </h3>
            <p
              class="text-xs sm:text-sm text-slate-300 leading-relaxed font-light"
            >
              Dapatkan pembiayaan pengadaan barang, modal kerja, atau proyek
              operasional usaha tanpa jeratan bunga riba dengan proses
              verifikasi cepat.
            </p>
          </div>
          <a
            href={$cmsStore.heroContent.secondaryCtaUrl || "/borrower"}
            class="button-4-light w-full py-2.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <span
              >{$cmsStore.heroContent.secondaryCtaText ||
                "Simulasi & Ajukan Modal"}</span
            >
            <ArrowRight class="w-4 h-4" />
          </a>
        </div>
      </div>

      <!-- Trust Badges Under Hero -->
      <div
        class="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-slate-300 pt-2"
      >
        <span class="flex items-center gap-1.5"
          ><CheckCircle2 class="w-4 h-4 text-emerald-400" /> 100% Akad Muamalah Syariah</span
        >
        <span class="hidden sm:inline">&bull;</span>
        <span class="flex items-center gap-1.5"
          ><Lock class="w-4 h-4 text-emerald-400" /> Rekening Escrow Bank Syariah
          Terpisah</span
        >
        <span class="hidden sm:inline">&bull;</span>
        <span class="flex items-center gap-1.5"
          ><Award class="w-4 h-4 text-emerald-400" /> Pengawasan Fatwa DSN-MUI</span
        >
      </div>
    </div>
  </section>

  <!-- STATISTIK KINERJA FINANSIAL & TRANSPARANSI (MODERN METRICS RIBBON) -->
  <section class="bg-white border-b border-slate-200 py-8 sm:py-10 shadow-2xs">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div
        class="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-center gap-6 sm:gap-0"
      >
        {#each $cmsStore.stats.slice(0, 4) as stat}
          <div class="px-4 py-2 space-y-1">
            <div
              class="flex items-center justify-center gap-1.5 text-emerald-600 mb-1"
            >
              <TrendingUp class="w-4 h-4" />
              <span
                class="text-[11px] font-bold uppercase tracking-wider text-slate-500"
                >{stat.title}</span
              >
            </div>
            <div
              class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Raleway']"
            >
              {stat.amount}
              {stat.unit || ""}
            </div>
            {#if stat.subtitle}
              <p class="text-xs text-slate-500 font-normal">{stat.subtitle}</p>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- HADITH QUOTE & 4 PILAR KEPATUHAN SYARIAH -->
  <section class="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <!-- Hadith Quote Banner: Clean Bootstrap Well -->
      <div
        class="bg-white border border-slate-300 rounded-[4px] p-5 sm:p-6 mb-10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-2xs"
      >
        <div
          class="w-12 h-12 rounded-[4px] bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200"
        >
          <Scale class="w-6 h-6" />
        </div>
        <div class="space-y-1 flex-1">
          <p class="text-sm sm:text-base italic text-slate-800 leading-relaxed">
            {$cmsStore.siteSettings.quote ||
              'Rasulullah SAW bersabda: "Berdaganglah kamu sekalian, karena di dalamnya terdapat sembilan dari sepuluh pintu rezeki."'}
          </p>
          <span
            class="inline-block text-xs font-bold text-emerald-800 uppercase tracking-wider"
          >
            {$cmsStore.siteSettings.quoteOrigin || "HR. Ahmad & Thabrani"}
          </span>
        </div>
      </div>

      <!-- 4 Pillars Section Header -->
      <div class="heading-block text-center mb-8">
        <h2>Prinsip & Keunggulan An-Namaa'</h2>
        <span
          >Platform fintech P2P financing syariah terpercaya berlandaskan pilar
          tata kelola syariah</span
        >
      </div>

      <!-- 4 Pilar Cards: Clean Bootstrap Panels -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {#each $cmsStore.philosophies as pil}
          <div
            class="bg-white border border-slate-300 rounded-[4px] p-5 space-y-2.5 shadow-2xs hover:border-slate-400 flex flex-col justify-between transition-colors"
          >
            <div class="space-y-2.5">
              <div class="flex items-center justify-between">
                <div
                  class="w-9 h-9 bg-emerald-50 text-emerald-800 rounded-[3px] flex items-center justify-center font-bold border border-emerald-200"
                >
                  <ShieldCheck class="w-5 h-5" />
                </div>
                <span
                  class="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-[2px] border border-emerald-300 uppercase"
                  >{pil.badge}</span
                >
              </div>
              <span class="text-[11px] font-semibold text-emerald-700 block"
                >{pil.arabicTitle}</span
              >
              <h3
                class="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wide"
              >
                {pil.title}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {pil.description}
              </p>
            </div>
          </div>
        {/each}
      </div>

      <!-- ASSISTANCE CALLOUT: CLEAN SOLID BOOTSTRAP PANEL -->
      <div
        class="assistance-bar mt-8 p-5 sm:p-6 bg-emerald-900 text-white rounded-[4px] border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left"
      >
        <div class="space-y-1.5">
          <span
            class="text-xs uppercase font-bold tracking-wider text-emerald-300"
            >Layanan Pendampingan Ramah</span
          >
          <h4 class="text-base sm:text-xl font-bold text-white">
            Butuh Bantuan atau Belum Terbiasa Transaksi Online?
          </h4>
          <p
            class="text-xs sm:text-sm text-emerald-100 max-w-2xl font-light leading-relaxed"
          >
            Butuh penjelasan sebelum bertransaksi? Lihat informasi layanan pada
            halaman kontak atau hubungi nomor kantor yang tercantum.
          </p>
        </div>
        <div class="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <a
            href="/contacts"
            class="button-4 bg-white text-slate-800 hover:bg-slate-100 font-semibold text-xs sm:text-sm py-2 px-4 rounded-[4px]"
          >
            <span>Hubungi Kami</span>
            <ArrowRight class="w-4 h-4" />
          </a>
          <a
            href="tel:+622183782337"
            class="button-4-light text-xs sm:text-sm py-2 px-3.5 rounded-[4px]"
          >
            <Phone class="w-4 h-4" />
            <span>(021) 8378 2337</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- 5 AUTHENTIC NAMIA PRODUCTS SHOWCASE - HORIZONTAL SCROLL CAROUSEL -->
  <section class="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header with Title & Horizontal Scroll Arrows -->
      <div
        class="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4"
      >
        <div>
          <span
            class="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-1"
            >Katalog Pembiayaan</span
          >
          <h2
            class="text-2xl sm:text-3xl font-['Raleway'] font-extrabold text-slate-900 uppercase tracking-wider"
          >
            Produk Pembiayaan Namia Syariah
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 mt-1">
            Dirancang untuk memenuhi kebutuhan permodalan UMKM dengan akad
            syariah murni dan prinsip An-Namaa'.
          </p>
        </div>

        <!-- Carousel Navigation Buttons (Clean GitHub Style) -->
        <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <span class="text-xs font-medium text-slate-500 mr-1 hidden sm:inline"
            >Geser samping</span
          >
          <button
            type="button"
            onclick={() => scrollProducts("left")}
            class="button-4 w-8 h-8 !p-0 flex items-center justify-center text-slate-700"
            aria-label="Scroll Sebelumnya"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button
            type="button"
            onclick={() => scrollProducts("right")}
            class="button-4 w-8 h-8 !p-0 flex items-center justify-center text-slate-700"
            aria-label="Scroll Selanjutnya"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Horizontal Scrollable Cards List -->
      <div
        bind:this={productScrollEl}
        class="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 px-1"
        style="scroll-behavior: smooth; scroll-padding: 1rem;"
      >
        {#each $cmsStore.products as prod}
          <div
            class="w-[290px] sm:w-[330px] md:w-[350px] shrink-0 snap-start bg-white rounded-[4px] overflow-hidden border border-slate-300 shadow-xs flex flex-col justify-between"
          >
            <!-- Product Real Image -->
            <div
              class="relative h-44 sm:h-48 overflow-hidden bg-slate-100 border-b border-slate-200"
            >
              <img
                src={prod.logo || "/images/products/_1_barang.jpg"}
                alt={prod.name}
                class="w-full h-full object-cover"
              />
              <div class="absolute top-2.5 right-2.5">
                <span
                  class="px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-950 bg-white rounded-[2px] border border-slate-300 shadow-xs"
                >
                  Akad {prod.contractType}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div class="space-y-1.5">
                <h3
                  class="text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-1"
                >
                  {prod.name}
                </h3>
                <p
                  class="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3"
                >
                  {prod.description}
                </p>
              </div>

              <!-- Key Specs Strip (Plafon & Tenor) - Clear & Legible for All Generations -->
              <div
                class="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-[3px] text-xs"
              >
                <div>
                  <span
                    class="text-[11px] uppercase tracking-wider text-slate-500 block font-semibold"
                    >Plafon Pembiayaan</span
                  >
                  <span
                    class="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1"
                  >
                    Rp {(prod.minAmount / 1_000_000).toLocaleString("id-ID")} Jt
                    - {(prod.maxAmount / 1_000_000).toLocaleString("id-ID")} Jt
                  </span>
                </div>
                <div>
                  <span
                    class="text-[11px] uppercase tracking-wider text-slate-500 block font-semibold"
                    >Tenor Waktu</span
                  >
                  <span
                    class="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1"
                    >{prod.minTenorMonths} - {prod.maxTenorMonths} Bulan</span
                  >
                </div>
              </div>

              <!-- Key Features -->
              <div
                class="space-y-1.5 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-600"
              >
                {#each (prod.features || []).slice(0, 3) as feat}
                  <div class="flex items-center gap-2">
                    <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                    <span class="line-clamp-1">{feat}</span>
                  </div>
                {/each}
              </div>

              <!-- Card Action Buttons - Clean GitHub Style -->
              <div
                class="pt-3 flex items-center justify-between gap-2.5 border-t border-slate-100"
              >
                <button
                  type="button"
                  onclick={() => openProductDetail(prod)}
                  class="button-4 button-4-sm rounded-[3px]"
                >
                  Detail & Skema
                </button>
                <a
                  href={prod.applyUrl || "/borrower"}
                  class="button-4-primary button-4-sm inline-flex items-center gap-1.5 rounded-[3px]"
                >
                  <span>Ajukan</span>
                  <ArrowRight class="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        {/each}

        <!-- 6th Card in Horizontal Scroll: Financial Aggregator -->
        <div
          class="w-[290px] sm:w-[330px] md:w-[350px] shrink-0 snap-start bg-slate-900 text-white rounded-[4px] p-6 flex flex-col justify-between border border-slate-800 space-y-5"
        >
          <div class="space-y-2.5">
            <span
              class="text-xs font-bold uppercase tracking-widest text-emerald-400"
              >Layanan Aggregator</span
            >
            <h3 class="text-xl font-bold text-white leading-tight">
              Bandingkan Puluhan Produk Syariah
            </h3>
            <p
              class="text-xs sm:text-sm text-slate-300 leading-relaxed font-light"
            >
              Manfaatkan fitur aggregator pintar Namia untuk membandingkan rate
              margin, tenor, dan plafon produk mitra syariah secara transparan.
            </p>
          </div>
          <div class="space-y-2.5">
            <a
              href="/aggregator"
              class="button-4-primary w-full py-2 flex items-center justify-center gap-2 rounded-[3px]"
            >
              <span>Katalog Produk Lengkap</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
            <a
              href="#kalkulator"
              class="button-4-light w-full py-2 flex items-center justify-center gap-2 rounded-[3px]"
            >
              <span>Simulasi Kalkulator</span>
            </a>
          </div>
        </div>

        <!-- End padding spacer to prevent clipping against container margin -->
        <div class="w-2 shrink-0" aria-hidden="true"></div>
      </div>
    </div>
  </section>

  <!-- INTERACTIVE FINANCIAL CALCULATOR SUITE -->
  <section
    id="kalkulator"
    class="py-16 sm:py-20 bg-white border-b border-slate-200 scroll-mt-24"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <span
          class="text-xs font-bold uppercase tracking-widest text-emerald-700"
          >Simulasi Mandiri</span
        >
        <h2
          class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Raleway']"
        >
          Kalkulator Finansial Syariah
        </h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Hitung simulasi cicilan pembiayaan Murabahah atau estimasi imbal hasil
          investasi Mudharabah secara transparan dan akurat tanpa biaya
          tersembunyi.
        </p>
      </div>

      <!-- Tab Selector - Clean Early Bootstrap Style Segmented Nav -->
      <div class="flex justify-center mb-8">
        <div
          class="inline-flex p-1 bg-slate-100 rounded-[4px] border border-slate-300 max-w-xl w-full"
        >
          <div class="grid grid-cols-3 gap-1 w-full">
            <button
              type="button"
              onclick={() => (activeCalcTab = "loan")}
              class="h-9 px-2 text-xs sm:text-sm font-semibold rounded-[3px] transition-colors cursor-pointer flex items-center justify-center whitespace-nowrap {activeCalcTab ===
              'loan'
                ? 'bg-white text-emerald-800 border border-slate-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'}"
            >
              <span>Pembiayaan</span>
            </button>
            <button
              type="button"
              onclick={() => (activeCalcTab = "invest")}
              class="h-9 px-2 text-xs sm:text-sm font-semibold rounded-[3px] transition-colors cursor-pointer flex items-center justify-center whitespace-nowrap {activeCalcTab ===
              'invest'
                ? 'bg-white text-emerald-800 border border-slate-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'}"
            >
              <span>Pendanaan</span>
            </button>
            <button
              type="button"
              onclick={() => (activeCalcTab = "score")}
              class="h-9 px-2 text-xs sm:text-sm font-semibold rounded-[3px] transition-colors cursor-pointer flex items-center justify-center whitespace-nowrap {activeCalcTab ===
              'score'
                ? 'bg-white text-emerald-800 border border-slate-300 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'}"
            >
              <span>Cek Kelayakan</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Active Calculator Container -->
      <div
        class="max-w-4xl mx-auto bg-white p-4 sm:p-8 rounded-[4px] border border-slate-300 shadow-xs"
      >
        {#if activeCalcTab === "loan"}
          <LoanCalculator />
        {:else if activeCalcTab === "invest"}
          <InvestmentCalculator />
        {:else}
          <CreditScoreEstimator />
        {/if}
      </div>
    </div>
  </section>

  <!-- LIPUTAN MEDIA & OPINI PUBLIK (CLEAN & INTEGRATED TRUST SHOWCASE) -->
  <section class="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="heading-block text-center mb-10">
        <h2>Liputan Media & Opini Publik</h2>
        <span
          >Transparansi opini masyarakat nyata dan publikasi pemberitaan di
          media massa terkemuka</span
        >
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Video Opini Masyarakat (7 cols) -->
        <div class="lg:col-span-7 space-y-4">
          <div
            class="aspect-video overflow-hidden rounded-[4px] border border-slate-300 bg-slate-900 shadow-sm"
          >
            <iframe
              src="https://www.youtube.com/embed/7cBJ5jQckcA"
              title="Opini Masyarakat tentang Namia Syariah"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <div
            class="p-4 bg-white border border-slate-300 rounded-[4px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
          >
            <div>
              <h4 class="text-sm font-bold text-slate-900">
                Wawancara Langsung Masyarakat
              </h4>
              <p class="text-xs text-slate-500">
                Pendapat nyata publik mengenai kemudahan dan keamanan transaksi
                di Namia Syariah.
              </p>
            </div>
            <a
              href="https://www.youtube.com/watch?v=7cBJ5jQckcA"
              target="_blank"
              rel="noopener noreferrer"
              class="button-4 button-4-sm shrink-0 rounded-[3px]"
            >
              <span>Buka YouTube</span>
              <ExternalLink class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <!-- 3 Media Coverage Cards (5 cols) -->
        <div class="lg:col-span-5 space-y-3.5">
          {#each mediaCoverage as media}
            <div
              class="bg-white border border-slate-300 rounded-[4px] p-4.5 space-y-2.5 shadow-xs"
            >
              <div class="h-10 flex items-center justify-start">
                <img
                  src={media.logo}
                  alt={media.name}
                  class="max-h-8 max-w-[150px] object-contain"
                />
              </div>
              <p
                class="text-xs sm:text-sm text-slate-700 italic leading-relaxed"
              >
                "{media.title || media.description}"
              </p>
              <div
                class="pt-2 border-t border-slate-100 text-xs text-slate-500"
              >
                {@html media.meta || media.source || media.name}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- MITRA & KLIEN TERPERCAYA (SEAMLESS AUTO-RUNNING HORIZONTAL MARQUEE) -->
  <section
    class="py-8 sm:py-10 bg-white border-b border-slate-200 overflow-hidden"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="heading-block !mb-4 sm:!mb-5">
        <h2>Mitra & Klien Kami</h2>
        <span
          >Telah dipercaya oleh berbagai institusi dan perusahaan terkemuka</span
        >
      </div>
    </div>

    <!-- Clean Horizontal Runner -->
    <div class="marquee-container py-1">
      <div class="marquee-content">
        <!-- Track 1 -->
        <div class="flex items-center gap-3 sm:gap-4 shrink-0 pr-3 sm:pr-4">
          {#each [...clients, ...clients] as client}
            <div
              class="w-44 sm:w-52 h-20 sm:h-24 px-3 py-2 bg-white border border-slate-300 rounded-[4px] flex items-center justify-center shrink-0 shadow-2xs"
            >
              <img
                src={client.picture || client.logo || (client as any).image}
                alt={client.name}
                class="max-h-14 sm:max-h-16 max-w-[140px] sm:max-w-[170px] w-auto h-auto object-contain"
              />
            </div>
          {/each}
        </div>

        <!-- Track 2 (Exact Duplicate for 100% Seamless Infinite Loop) -->
        <div
          class="flex items-center gap-3 sm:gap-4 shrink-0 pr-3 sm:pr-4"
          aria-hidden="true"
        >
          {#each [...clients, ...clients] as client}
            <div
              class="w-44 sm:w-52 h-20 sm:h-24 px-3 py-2 bg-white border border-slate-300 rounded-[4px] flex items-center justify-center shrink-0 shadow-2xs"
            >
              <img
                src={client.picture || client.logo || (client as any).image}
                alt={client.name}
                class="max-h-14 sm:max-h-16 max-w-[140px] sm:max-w-[170px] w-auto h-auto object-contain"
              />
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- TERDAFTAR DAN DIAWASI OLEH -->
  <section class="py-10 sm:py-12 bg-slate-50 border-b border-slate-200">
    <div class="max-w-5xl mx-auto px-4 text-center space-y-6">
      <div class="heading-block !mb-5">
        <h2>Informasi Kelembagaan</h2>
        <span
          >Hubungi kami untuk informasi legalitas dan hubungan kelembagaan Namia
          Syariah.</span
        >
      </div>

      <div
        class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 items-center justify-center"
      >
        {#each supervise as s}
          <div
            class="p-4 bg-white border border-slate-300 rounded-[4px] flex flex-col items-center justify-center h-28 space-y-2 shadow-2xs"
          >
            <img
              src={s.image || s.logo}
              alt={s.name}
              class="max-h-12 w-auto object-contain"
            />
            <span
              class="text-xs font-bold text-slate-700 uppercase tracking-wider line-clamp-1"
              >{s.name}</span
            >
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- TESTIMONI PENGGUNA TERVERIFIKASI DARI CMS -->
  {#if $cmsStore.testimonials?.length}
    <section class="py-14 sm:py-18 bg-white border-b border-slate-200">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="heading-block text-center mb-10">
          <h2>Kisah Sukses &amp; Testimoni Mitra</h2>
          <span
            >Pengalaman nyata para penerima pembiayaan UMKM dan pendana etis di
            Namia Syariah</span
          >
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {#each $cmsStore.testimonials as t}
            <div
              class="p-6 bg-slate-50 border border-slate-300 rounded-[4px] flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div class="space-y-3">
                <div class="flex items-center gap-1 text-amber-500">
                  {#each Array(t.rating || 5) as _}
                    <span class="text-sm">★</span>
                  {/each}
                </div>
                <p
                  class="text-xs sm:text-sm text-slate-700 italic leading-relaxed"
                >
                  "{t.content}"
                </p>
              </div>
              <div
                class="pt-4 border-t border-slate-200 flex items-center gap-3"
              >
                <img
                  src={t.avatar || "/images/team/p_putri_sq.jpeg"}
                  alt={t.name}
                  class="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0"
                />
                <div class="text-xs">
                  <strong class="text-slate-900 block font-bold"
                    >{t.name}</strong
                  >
                  <span class="text-slate-500 block">{t.businessName}</span>
                  {#if t.fundedAmount}
                    <span
                      class="inline-block mt-0.5 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-[2px] border border-emerald-200"
                      >{t.fundedAmount}</span
                    >
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <!-- PERTANYAAN UMUM / FAQ MUAMALAH (BOOTSTRAP ACCORDION) -->
  <section class="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <div class="heading-block text-center mb-10">
        <h2>Pertanyaan Umum (FAQ)</h2>
        <span
          >Panduan transparansi muamalah, mitigasi risiko, dan tata kelola
          platform Namia Syariah</span
        >
      </div>

      <div class="space-y-2">
        {#each $cmsStore.faqs as faq, i}
          <div
            class="bg-white border border-slate-300 rounded-[4px] overflow-hidden shadow-2xs"
          >
            <button
              type="button"
              onclick={() => toggleFaq(i)}
              class="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
              aria-expanded={openFaq === i}
            >
              <div class="flex items-center gap-3">
                <HelpCircle class="w-4 h-4 text-emerald-700 shrink-0" />
                <span class="text-sm sm:text-base font-bold text-slate-800"
                  >{faq.question || faq.q || ""}</span
                >
              </div>
              <ChevronDown
                class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 {openFaq ===
                i
                  ? 'rotate-180 text-emerald-700'
                  : ''}"
              />
            </button>
            {#if openFaq === i}
              <div
                class="px-5 pb-4 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200 bg-slate-50"
              >
                {faq.answer || faq.a || ""}
              </div>
            {/if}
          </div>
        {/each}
      </div>

      <!-- Quick Assistance Callout -->
      <div
        class="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-[4px] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
      >
        <div class="space-y-0.5">
          <h4 class="text-xs sm:text-sm font-bold text-emerald-950">
            Masih memiliki pertanyaan seputar akad atau investasi?
          </h4>
          <p class="text-xs text-emerald-800 font-normal">
            Tim konsultan syariah dan customer support kami siap melayani Anda.
          </p>
        </div>
        <a
          href="/contacts"
          class="button-4-primary text-xs py-2 px-4 inline-flex items-center gap-2 shrink-0 rounded-[3px]"
        >
          <span>Hubungi Kami</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </section>

  <!-- PRODUCT DETAIL MODAL -->
  {#if selectedProduct}
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60"
    >
      <div
        class="bg-white rounded-[4px] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-xl border border-slate-300 relative"
      >
        <button
          type="button"
          onclick={() => (selectedProduct = null)}
          class="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          aria-label="Tutup Modal"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="flex items-center gap-4">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            class="w-20 h-20 rounded-[4px] object-cover border border-slate-300 shrink-0"
          />
          <div>
            <span
              class="text-xs font-bold text-emerald-800 uppercase tracking-wider block"
              >Akad {selectedProduct.contract}</span
            >
            <h3 class="text-xl font-bold text-slate-900">
              {selectedProduct.name}
            </h3>
          </div>
        </div>

        <!-- Financial Specs Strip in Modal -->
        <div
          class="grid grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-300 rounded-[3px] text-center text-xs"
        >
          <div>
            <span
              class="text-[10px] text-slate-500 uppercase font-semibold block"
              >Plafon</span
            >
            <strong class="text-slate-900">{selectedProduct.plafon}</strong>
          </div>
          <div>
            <span
              class="text-[10px] text-slate-500 uppercase font-semibold block"
              >Tenor</span
            >
            <strong class="text-slate-900">{selectedProduct.tenor}</strong>
          </div>
          <div>
            <span
              class="text-[10px] text-slate-500 uppercase font-semibold block"
              >Skema</span
            >
            <strong class="text-slate-900">{selectedProduct.skema}</strong>
          </div>
        </div>

        <p class="text-sm text-slate-600 leading-relaxed">
          {selectedProduct.desc}
        </p>

        <div
          class="space-y-2 p-4 bg-slate-50 rounded-[3px] border border-slate-300"
        >
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-600">
            Ketentuan & Keunggulan
          </h4>
          <ul class="space-y-1.5 text-xs text-slate-700">
            {#each selectedProduct.features as feat}
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{feat}</span>
              </li>
            {/each}
          </ul>
        </div>

        <div
          class="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200"
        >
          <button
            type="button"
            onclick={() => (selectedProduct = null)}
            class="button-4 text-xs py-1.5 px-4 rounded-[3px]"
          >
            Tutup
          </button>
          <a
            href="/borrower"
            class="button-4-primary text-xs py-1.5 px-4 inline-flex items-center gap-1.5 rounded-[3px]"
          >
            <span>Ajukan Sekarang</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .homepage {
    overflow-wrap: anywhere;
  }

  .homepage :global(:is(a, button, input, select):focus-visible) {
    outline: 2px solid #059669;
    outline-offset: 2px;
  }

  .homepage :global(.fixed > .relative) {
    max-height: calc(100dvh - 2rem);
    overflow-y: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    .homepage :global(*) {
      scroll-behavior: auto !important;
      animation: none !important;
      transition: none !important;
    }
  }
</style>
