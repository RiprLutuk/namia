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
    Pause,
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
    Activity,
    Rss,
    Calculator,
    Clock,
    Star,
    Search,
    MessageSquare,
    FileText
  } from "lucide-svelte";
  import LoanCalculator from "$lib/components/calculators/LoanCalculator.svelte";
  import InvestmentCalculator from "$lib/components/calculators/InvestmentCalculator.svelte";
  import CreditScoreEstimator from "$lib/components/calculators/CreditScoreEstimator.svelte";
  import SalamModal from "$lib/components/SalamModal.svelte";
  import LiveStatsStrip from "$lib/components/LiveStatsStrip.svelte";
  import TrustEcosystem from "$lib/components/TrustEcosystem.svelte";
  import { cmsStore, fetchCmsContent } from "$lib/cms";
  import { API_BASE_URL, NAMIA_API_KEY } from "$lib/api";

  // Calculator Active Tab
  let activeCalcTab = $state<"loan" | "invest" | "score">("loan");

  // Proof / Media Center Tab State (Persisted on Reload via URL param & localStorage)
  let activeProofTab = $state<"media" | "testimonials">("media");

  $effect(() => {
    if (typeof window !== "undefined") {
      try {
        const params = new URLSearchParams(window.location.search);
        const urlTab = params.get("proofTab") || params.get("tab");
        const localTab = localStorage.getItem("namia_proof_tab") as "media" | "testimonials" | null;

        if (urlTab === "media" || urlTab === "testimonials") {
          activeProofTab = urlTab;
        } else if (localTab === "media" || localTab === "testimonials") {
          activeProofTab = localTab;
        }
      } catch (e) {
        // ignore storage access errors
      }
    }
  });

  let isVideoPlaying = $state(false);

  function setProofTab(tab: "media" | "testimonials") {
    activeProofTab = tab;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("namia_proof_tab", tab);
        const url = new URL(window.location.href);
        url.searchParams.set("proofTab", tab);
        window.history.replaceState({}, "", url.toString());
      } catch (e) {
        // ignore
      }
    }
  }

  // Testimonial Carousel Scroll Container & Navigation State (Last 20 Opinions)
  let testimonialScrollEl = $state<HTMLElement | null>(null);
  let canScrollTestimonialLeft = $state(false);
  let canScrollTestimonialRight = $state(true);
  let activeTestimonialFilter = $state<"all" | "borrower" | "investor">("all");

  let latestTestimonials = $derived.by(() => {
    return ($cmsStore.testimonials || []).slice(0, 20);
  });

  let filteredTestimonials = $derived.by(() => {
    const list = latestTestimonials;
    if (activeTestimonialFilter === "borrower") {
      return list.filter((t) => t.type === "borrower");
    }
    if (activeTestimonialFilter === "investor") {
      return list.filter((t) => t.type === "investor");
    }
    return list;
  });

  function updateTestimonialScrollState() {
    if (testimonialScrollEl) {
      canScrollTestimonialLeft = testimonialScrollEl.scrollLeft > 10;
      canScrollTestimonialRight =
        testimonialScrollEl.scrollLeft <
        testimonialScrollEl.scrollWidth - testimonialScrollEl.clientWidth - 15;
    }
  }

  function scrollTestimonials(direction: "left" | "right") {
    if (testimonialScrollEl) {
      const step = 380;
      const reducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      testimonialScrollEl.scrollBy({
        left: direction === "left" ? -step : step,
        behavior: reducedMotion ? "instant" : "smooth",
      });
      setTimeout(updateTestimonialScrollState, 350);
    }
  }

  function setTestimonialFilter(filter: "all" | "borrower" | "investor") {
    activeTestimonialFilter = filter;
    if (testimonialScrollEl) {
      testimonialScrollEl.scrollTo({ left: 0, behavior: "smooth" });
      setTimeout(updateTestimonialScrollState, 350);
    }
  }

  // FAQ Filtering, Search & Accordion State
  let openFaq = $state<number | null>(0);
  let faqSearchQuery = $state("");
  let activeFaqCategory = $state<"all" | "borrower" | "investor" | "syariah">("all");
  let showAllFaqs = $state(false);

  function toggleFaq(index: number) {
    openFaq = openFaq === index ? null : index;
  }

  let filteredFaqs = $derived.by(() => {
    let list = $cmsStore.faqs || [];
    if (activeFaqCategory === "borrower") {
      list = list.filter((f) => f.isInvestor === 0);
    } else if (activeFaqCategory === "investor") {
      list = list.filter((f) => f.isInvestor === 1);
    } else if (activeFaqCategory === "syariah") {
      list = list.filter((f) => {
        const text = (f.question + " " + f.answer).toLowerCase();
        return (
          text.includes("syariah") ||
          text.includes("akad") ||
          text.includes("riba") ||
          text.includes("murabahah") ||
          text.includes("musyarakah")
        );
      });
    }

    if (faqSearchQuery.trim()) {
      const q = faqSearchQuery.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.question?.toLowerCase().includes(q) ||
          f.answer?.toLowerCase().includes(q) ||
          f.categoryName?.toLowerCase().includes(q),
      );
    }
    return list;
  });

  let visibleFaqs = $derived(
    showAllFaqs ? filteredFaqs : filteredFaqs.slice(0, 6),
  );

  // Live Stats State from Backend
  let liveStats = $state<{
    totalDisbursedFormatted: string;
    activeBorrowers: number;
    activeLenders: number;
    npfRate: string;
    tkb90: string;
    serverUptime: string;
    status: string;
    lastAkadTime: string;
  }>({
    totalDisbursedFormatted: "Rp 142.8 Miliar",
    activeBorrowers: 1420,
    activeLenders: 5890,
    npfRate: "0.00%",
    tkb90: "100%",
    serverUptime: "99.98%",
    status: "OPERATIONAL",
    lastAkadTime: "14:30 WIB"
  });

  // Hero Quick Estimator State
  let heroSimMode = $state<"borrower" | "investor">("borrower");
  let heroBorrowerAmount = $state<number>(50_000_000);
  let heroBorrowerTenor = $state<number>(12);
  let heroInvestorAmount = $state<number>(10_000_000);
  let heroInvestorTenor = $state<number>(12);

  let heroBorrowerMonthlyInstallment = $derived.by(() => {
    const margin = heroBorrowerAmount * 0.12 * (heroBorrowerTenor / 12);
    return Math.round((heroBorrowerAmount + margin) / heroBorrowerTenor);
  });

  let heroBorrowerTotalPayable = $derived.by(() => {
    const margin = heroBorrowerAmount * 0.12 * (heroBorrowerTenor / 12);
    return Math.round(heroBorrowerAmount + margin);
  });

  let heroInvestorProjectedYield = $derived.by(() => {
    return Math.round(heroInvestorAmount * 0.15 * (heroInvestorTenor / 12));
  });

  let heroInvestorTotalReturn = $derived.by(() => {
    return heroInvestorAmount + heroInvestorProjectedYield;
  });

  onMount(async () => {
    fetchCmsContent();
    try {
      const res = await fetch(`${API_BASE_URL}/api/content/live-stats`, {
        headers: { "x-api-key": NAMIA_API_KEY }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          liveStats = json.data;
        }
      }
    } catch (e) {
      // Fallback to default simulated stats
    }
  });

  // Product Filter & Reactive Listing (Mirroring the Hero Dual Focus)
  let activeProductCategory = $state<string>("all");
  let filteredProducts = $derived.by(() => {
    const prods = $cmsStore.products || [];
    if (activeProductCategory === "all") return prods;
    if (activeProductCategory === "borrower") {
      return prods.filter(p => p.targetAudience === "borrower" || p.targetAudience === "both");
    }
    if (activeProductCategory === "investor") {
      return prods.filter(p => p.targetAudience === "investor" || p.targetAudience === "both");
    }
    if (activeProductCategory === "modal") {
      return prods.filter(p => p.contractType === "Murabahah" || p.contractType === "Musyarakah");
    }
    if (activeProductCategory === "invoice") {
      return prods.filter(p => p.contractType.includes("Wakalah") || p.categorySlug === "invoice-financing");
    }
    return prods;
  });

  // Product Carousel Scroll Container & Auto-Scroll State
  let productScrollEl = $state<HTMLElement | null>(null);
  let isCarouselPaused = $state(false);
  let canScrollLeft = $state(false);
  let canScrollRight = $state(true);

  function updateProductScrollState() {
    if (productScrollEl) {
      canScrollLeft = productScrollEl.scrollLeft > 10;
      canScrollRight =
        productScrollEl.scrollLeft <
        productScrollEl.scrollWidth - productScrollEl.clientWidth - 15;
    }
  }

  function scrollProducts(direction: "left" | "right") {
    if (!productScrollEl) return;
    const step = productScrollEl.clientWidth < 640 ? productScrollEl.clientWidth * 0.88 : 360;
    const maxScroll = productScrollEl.scrollWidth - productScrollEl.clientWidth;

    if (direction === "right") {
      if (productScrollEl.scrollLeft >= maxScroll - 20) {
        productScrollEl.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        productScrollEl.scrollBy({ left: step, behavior: "smooth" });
      }
    } else {
      if (productScrollEl.scrollLeft <= 20) {
        productScrollEl.scrollTo({ left: maxScroll, behavior: "smooth" });
      } else {
        productScrollEl.scrollBy({ left: -step, behavior: "smooth" });
      }
    }
    setTimeout(updateProductScrollState, 350);
  }

  function setProductCategory(cat: string) {
    activeProductCategory = cat;
    if (productScrollEl) {
      productScrollEl.scrollTo({ left: 0, behavior: "smooth" });
      setTimeout(updateProductScrollState, 350);
    }
  }

  // Automatic Smooth Carousel Auto-Scroll (Every 3.5s, pause on hover/touch)
  $effect(() => {
    if (typeof window === "undefined") return;

    const interval = setInterval(() => {
      if (!isCarouselPaused && productScrollEl) {
        const maxScroll = productScrollEl.scrollWidth - productScrollEl.clientWidth;
        if (maxScroll > 15) {
          if (productScrollEl.scrollLeft >= maxScroll - 20) {
            productScrollEl.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            const step = productScrollEl.clientWidth < 640 ? productScrollEl.clientWidth * 0.88 : 360;
            productScrollEl.scrollBy({ left: step, behavior: "smooth" });
          }
          setTimeout(updateProductScrollState, 400);
        }
      }
    }, 3500);

    return () => {
      clearInterval(interval);
    };
  });

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
      image: p.logo || p.image || "/images/products/namia_murabahah_goods.jpg",
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
  <title>Namia Syariah — Smart Growth, Halal Impact | P2P Financing Syariah</title>
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
  <meta property="og:title" content="Namia Syariah — Smart Growth, Halal Impact" />
  <meta
    property="og:description"
    content="Smart Growth, Halal Impact. Investasi halal dan pembiayaan UMKM bebas riba dengan akad muamalah riil (Murabahah, Musyarakah, Ijarah)."
  />
  <meta property="og:image" content="/favicon.svg" />

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
      }
    ],
  })}</script>`}
</svelte:head>

<!-- Salam & Bismillah Welcome Modal -->
<SalamModal />

<div class="homepage space-y-0">
  <!-- HERO UNIT: ICONIC EARLY TWITTER BOOTSTRAP 2 / WEB 2.0 JUMBOTRON MASTHEAD -->
  <section class="jumbotron-masthead !text-left relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <!-- Authentic Web 2.0 Corner Ribbon anchored to Content Container -->
      <div class="ribbon-corner-container hidden md:block">
        <div class="ribbon-web20">100% Syariah</div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- LEFT COLUMN: VALUE PROPOSITION & ACTION (7 cols) -->
        <div class="lg:col-span-7 space-y-6 text-left">
          <!-- Regulatory & Trust Badges -->
          <div class="inline-flex flex-wrap items-center gap-2">
            <span class="badge badge-inverse text-xs py-1 px-3 font-bold inline-flex items-center gap-1.5 shadow-xs">
              <Award class="w-3.5 h-3.5 text-amber-400 inline" />
              FATWA DSN-MUI NO. 117
            </span>
            <span class="badge badge-info hidden sm:inline-flex text-xs py-1 px-3 font-bold shadow-xs">
              ISO 27001 SECURE
            </span>
          </div>

          <!-- Headline & Subtitle -->
          <div class="space-y-3">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              {$cmsStore.heroContent.title || "Smart Growth, Halal Impact"}
            </h1>
            <p class="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-none">
              {$cmsStore.heroContent.subtitle || "Platform P2P financing syariah terpercaya di Indonesia berlandaskan filosofi An-Namaa'. Menghubungkan ribuan UMKM tangguh dengan komunitas pendana tanpa riba, gharar, dan maisir."}
            </p>
          </div>

          <!-- 3-Item Feature Highlight Cards in Clean Style -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div class="p-3 bg-white border border-slate-200 rounded-md shadow-2xs">
              <div class="text-[11px] font-bold uppercase tracking-wide text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Plafon UMKM</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 mt-1 font-mono">s/d Rp 2 Miliar</div>
              <div class="text-[11px] text-slate-600 font-medium">Proses kilat 3 hari kerja</div>
            </div>
            <div class="p-3 bg-white border border-slate-200 rounded-md shadow-2xs">
              <div class="text-[11px] font-bold uppercase tracking-wide text-emerald-700 flex items-center gap-1.5">
                <TrendingUp class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Imbal Hasil</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 mt-1 font-mono">12% - 18% p.a.</div>
              <div class="text-[11px] text-slate-600 font-medium">Bagi hasil riil proyek riil</div>
            </div>
            <div class="p-3 bg-white border border-slate-200 rounded-md shadow-2xs">
              <div class="text-[11px] font-bold uppercase tracking-wide text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Kelancaran TKB90</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-emerald-800 mt-1 font-mono">{liveStats.tkb90}</div>
              <div class="text-[11px] text-slate-600 font-medium">NPF Rendah {liveStats.npfRate}</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
            <a
              href="/borrower"
              class="btn btn-success btn-large font-bold inline-flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
            >
              <span>Ajukan Modal Usaha UMKM</span>
              <ArrowRight class="w-4 h-4" />
            </a>
            <a
              href="/investor"
              class="btn btn-primary btn-large font-bold inline-flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
            >
              <span>Mulai Danai UMKM</span>
              <ArrowRight class="w-4 h-4" />
            </a>
          </div>

          <!-- Trust Badges Under Hero -->
          <div class="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs text-slate-600 pt-2 border-t border-slate-300">
            <span class="inline-flex items-center gap-1.5 text-slate-700 font-medium">
              <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Akad Muamalah Riil</span>
            </span>
            <span class="inline-flex items-center gap-1.5 text-slate-700 font-medium">
              <Lock class="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Rekening Escrow Bank Syariah</span>
            </span>
            <span class="inline-flex items-center gap-1.5 text-slate-700 font-medium">
              <Award class="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Diawasi DPS DSN-MUI</span>
            </span>
          </div>
        </div>

        <!-- RIGHT COLUMN: INTERACTIVE QUICK ESTIMATOR WIDGET (5 cols) -->
        <div class="lg:col-span-5 text-left">
          <div class="panel !mb-0 shadow-lg border border-slate-300 rounded-lg overflow-hidden bg-white text-slate-800">
            <!-- Early Bootstrap 2 Nav Tabs Sitting On Top of Card -->
            <div class="bg-slate-100 border-b border-slate-300 pt-2 px-3">
              <ul class="nav-tabs !mb-0">
                <li class="flex-1 text-center">
                  <button
                    type="button"
                    class="w-full text-center text-xs sm:text-sm font-bold {heroSimMode === 'borrower' ? 'active !text-emerald-800' : 'text-slate-600'}"
                    onclick={() => heroSimMode = 'borrower'}
                  >
                    Butuh Modal Usaha
                  </button>
                </li>
                <li class="flex-1 text-center">
                  <button
                    type="button"
                    class="w-full text-center text-xs sm:text-sm font-bold {heroSimMode === 'investor' ? 'active !text-blue-800' : 'text-slate-600'}"
                    onclick={() => heroSimMode = 'investor'}
                  >
                    Ingin Mendanai
                  </button>
                </li>
              </ul>
            </div>

            <div class="panel-body !p-5 space-y-4 text-slate-800 bg-white">
              {#if heroSimMode === 'borrower'}
                <!-- Borrower / UMKM Simulator -->
                <div class="space-y-3.5">
                  <div>
                    <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                      <span>Kebutuhan Pembiayaan:</span>
                      <span class="font-bold text-emerald-700 font-mono text-sm">
                        Rp {heroBorrowerAmount.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5000000"
                      max="500000000"
                      step="5000000"
                      bind:value={heroBorrowerAmount}
                      class="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded"
                    />
                    <div class="flex justify-between text-[10px] text-slate-600 font-mono font-medium">
                      <span>Rp 5 Jt</span>
                      <span>Rp 250 Jt</span>
                      <span>Rp 500 Jt</span>
                    </div>
                  </div>

                  <div>
                    <span class="block text-xs font-semibold text-slate-700 mb-1">Pilihan Tenor:</span>
                    <div class="grid grid-cols-4 gap-1.5">
                      {#each [3, 6, 12, 24] as t}
                        <button
                          type="button"
                          class="btn btn-small font-bold text-xs {heroBorrowerTenor === t ? 'btn-success active' : 'btn-default'}"
                          onclick={() => heroBorrowerTenor = t}
                        >
                          {t} Bln
                        </button>
                      {/each}
                    </div>
                  </div>

                  <!-- Inset Result Box -->
                  <div class="well well-small well-emerald !p-3 !mb-0 text-slate-800 space-y-1.5 border border-emerald-300">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-slate-600 font-medium">Estimasi Angsuran / Bln:</span>
                      <strong class="text-base text-emerald-800 font-mono font-extrabold">
                        Rp {heroBorrowerMonthlyInstallment.toLocaleString("id-ID")}
                      </strong>
                    </div>
                    <div class="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-emerald-200">
                      <span>Akad: <strong class="text-slate-800">Murabahah / Musyarakah</strong></span>
                      <span>Total: <strong class="font-mono text-slate-800">Rp {heroBorrowerTotalPayable.toLocaleString("id-ID")}</strong></span>
                    </div>
                  </div>

                  <a
                    href="/borrower"
                    class="btn btn-success btn-large w-full font-bold flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Ajukan Pembiayaan Online</span>
                    <ArrowRight class="w-4 h-4" />
                  </a>
                </div>
              {:else}
                <!-- Investor / Pendana Simulator -->
                <div class="space-y-3.5">
                  <div>
                    <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                      <span>Nominal Pendanaan:</span>
                      <span class="font-bold text-blue-700 font-mono text-sm">
                        Rp {heroInvestorAmount.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1000000"
                      max="100000000"
                      step="1000000"
                      bind:value={heroInvestorAmount}
                      class="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded"
                    />
                    <div class="flex justify-between text-[10px] text-slate-600 font-mono font-medium">
                      <span>Rp 1 Jt</span>
                      <span>Rp 50 Jt</span>
                      <span>Rp 100 Jt</span>
                    </div>
                  </div>

                  <div>
                    <span class="block text-xs font-semibold text-slate-700 mb-1">Jangka Waktu Pendanaan:</span>
                    <div class="grid grid-cols-3 gap-1.5">
                      {#each [3, 6, 12] as t}
                        <button
                          type="button"
                          class="btn btn-small font-bold text-xs {heroInvestorTenor === t ? 'btn-info active' : 'btn-default'}"
                          onclick={() => heroInvestorTenor = t}
                        >
                          {t} Bln
                        </button>
                      {/each}
                    </div>
                  </div>

                  <!-- Inset Result Box -->
                  <div class="well well-small well-white !p-3 !mb-0 text-slate-800 space-y-1.5 border border-sky-300">
                    <div class="flex items-center justify-between text-xs">
                      <span class="text-slate-600 font-medium">Estimasi Bagi Hasil Bersih:</span>
                      <strong class="text-base text-blue-700 font-mono font-extrabold">
                        + Rp {heroInvestorProjectedYield.toLocaleString("id-ID")}
                      </strong>
                    </div>
                    <div class="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-sky-200">
                      <span>Akad: <strong class="text-slate-800">Mudharabah (15% p.a.)</strong></span>
                      <span>Total Akhir: <strong class="font-mono text-slate-800">Rp {heroInvestorTotalReturn.toLocaleString("id-ID")}</strong></span>
                    </div>
                  </div>

                  <a
                    href="/marketplace"
                    class="btn btn-info btn-large w-full font-bold flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Mulai Danai Sekarang</span>
                    <ArrowRight class="w-4 h-4" />
                  </a>
                </div>
              {/if}

              <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span class="flex items-center gap-1.5 font-medium text-emerald-700">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Simulasi transparan tanpa biaya tersembunyi
                </span>
                <a href="/calculators" class="text-slate-600 hover:text-emerald-700 font-bold underline">
                  Detail ➜
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- STATISTIK KINERJA FINANSIAL RIBBON (REUSABLE EARLY BOOTSTRAP METRICS STRIP) -->
  <LiveStatsStrip stats={liveStats} />

  <!-- HADITH QUOTE & 4 PILAR KEPATUHAN SYARIAH -->
  <section class="py-12 sm:py-16 bg-[#f8fafc] border-b border-slate-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Hadith Quote Banner: Early Bootstrap Well -->
      <div class="well well-white !p-6 !mb-10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left border-l-4 border-l-[#059669]">
        <div class="w-12 h-12 rounded-[4px] bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-300">
          <Scale class="w-6 h-6" />
        </div>
        <div class="space-y-1 flex-1">
          <p class="text-sm sm:text-base italic text-slate-800 leading-relaxed font-serif">
            {$cmsStore.siteSettings.quote || 'Rasulullah SAW bersabda: "Berdaganglah kamu sekalian, karena di dalamnya terdapat sembilan dari sepuluh pintu rezeki."'}
          </p>
          <span class="inline-block text-xs font-bold text-emerald-800 uppercase tracking-wider">
            {$cmsStore.siteSettings.quoteOrigin || "HR. Ahmad & Thabrani"}
          </span>
        </div>
      </div>

      <!-- 4 Pillars Section Header -->
      <div class="heading-block text-center mb-8">
        <h2>Prinsip & Keunggulan An-Namaa'</h2>
        <span>Platform fintech P2P financing syariah terpercaya berlandaskan 4 pilar tata kelola syariah murni</span>
      </div>

      <!-- 4 Pilar Cards (Clean & Simple Early Bootstrap Cards) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {#each $cmsStore.philosophies as pil, idx}
          <div class="bg-white border border-slate-300 rounded-[3px] p-5 flex flex-col justify-between hover:border-emerald-600 transition-colors shadow-2xs">
            <div class="space-y-3">
              <!-- Top Row: Icon & Focus Badge -->
              <div class="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div class="w-7 h-7 rounded-[3px] bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                  {#if idx === 0}
                    <TrendingUp class="w-3.5 h-3.5 text-emerald-700" />
                  {:else if idx === 1}
                    <Scale class="w-3.5 h-3.5 text-emerald-700" />
                  {:else if idx === 2}
                    <Users class="w-3.5 h-3.5 text-emerald-700" />
                  {:else}
                    <ShieldCheck class="w-3.5 h-3.5 text-emerald-700" />
                  {/if}
                </div>
                <span class="label label-success text-[10px] uppercase font-bold tracking-wider">
                  {pil.badge}
                </span>
              </div>

              <!-- Title Row: Full Width, Strictly Single Line (Never Wraps Down) -->
              <div>
                <h3 class="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">
                  {pil.title}
                </h3>
                <span class="text-xs font-semibold text-emerald-700 block font-serif mt-0.5">
                  {pil.arabicTitle}
                </span>
              </div>

              <!-- Description -->
              <p class="text-xs text-slate-600 leading-relaxed font-normal">
                {pil.description}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- PRODUK PEMBIAYAAN & INVESTASI NAMIA SYARIAH (EARLY BOOTSTRAP 2 CATALOG / SHOWCASE) -->
  <section class="py-14 sm:py-18 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#ffffff] border-b border-slate-200/80 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header with Authentic Early Bootstrap Heading & Counter -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Produk Pembiayaan & Investasi Namia Syariah
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-4xl leading-relaxed">
            Berlandaskan filosofi <strong class="text-slate-800 font-semibold">An-Namaa'</strong> (pertumbuhan riil & berkah), menghubungkan pelaku usaha produktif dengan komunitas pendana melalui akad syariah murni.
          </p>
        </div>

        <!-- Direct Action Buttons -->
        <div class="flex items-center gap-2 shrink-0">
          <a href="/borrower" class="btn btn-success font-bold text-xs flex items-center gap-1.5 shadow-xs">
            <span>Ajukan Modal Usaha</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </a>
          <a href="/aggregator" class="btn btn-default font-semibold text-xs flex items-center gap-1">
            <span>Katalog Lengkap</span>
          </a>
        </div>
      </div>

      <!-- Early Bootstrap Category Filter Nav Tabs (Mirroring the Hero Dual Focus) -->
      <div class="nav-tabs justify-start !mb-6">
        <button
          type="button"
          onclick={() => setProductCategory("all")}
          class="nav-link {activeProductCategory === 'all' ? 'active' : ''}"
        >
          <span>Semua Portofolio</span>
          <span class="badge {activeProductCategory === 'all' ? 'badge-success' : 'badge-inverse'} text-[10px] ml-1.5">
            {$cmsStore.products.length}
          </span>
        </button>
        <button
          type="button"
          onclick={() => setProductCategory("borrower")}
          class="nav-link {activeProductCategory === 'borrower' ? 'active' : ''}"
        >
          <span>Butuh Modal Usaha (UMKM)</span>
        </button>
        <button
          type="button"
          onclick={() => setProductCategory("investor")}
          class="nav-link {activeProductCategory === 'investor' ? 'active' : ''}"
        >
          <span>Ingin Mendanai (Investor)</span>
        </button>
        <button
          type="button"
          onclick={() => setProductCategory("modal")}
          class="nav-link {activeProductCategory === 'modal' ? 'active' : ''}"
        >
          <span>Modal Kerja & Kemitraan</span>
        </button>
        <button
          type="button"
          onclick={() => setProductCategory("invoice")}
          class="nav-link {activeProductCategory === 'invoice' ? 'active' : ''}"
        >
          <span>Invoice & Arus Kas</span>
        </button>
      </div>

      <!-- Horizontal Scrollable Showcase Track (Auto-Scroll Carousel Mode) -->
      <div class="relative group/carousel">
        <!-- Floating Left Arrow on Hover (Desktop) -->
        {#if canScrollLeft}
          <button
            type="button"
            onclick={() => scrollProducts("left")}
            class="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full bg-white/95 border border-slate-300 shadow-md text-slate-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-150"
            aria-label="Geser ke kiri"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
        {/if}

        <!-- Floating Right Arrow on Hover (Desktop) -->
        {#if canScrollRight}
          <button
            type="button"
            onclick={() => scrollProducts("right")}
            class="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 items-center justify-center rounded-full bg-white/95 border border-slate-300 shadow-md text-slate-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-150"
            aria-label="Geser ke kanan"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        {/if}

        <!-- Auto-Scrolling Carousel Track -->
        <div
          bind:this={productScrollEl}
          onscroll={updateProductScrollState}
          onmouseenter={() => (isCarouselPaused = true)}
          onmouseleave={() => (isCarouselPaused = false)}
          ontouchstart={() => (isCarouselPaused = true)}
          ontouchend={() => setTimeout(() => (isCarouselPaused = false), 4000)}
          class="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 px-1 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar"
        >
          {#each filteredProducts as prod}
            <div class="w-[85vw] max-w-[320px] sm:w-[335px] md:w-[350px] shrink-0 snap-start panel panel-default flex flex-col justify-between hover:border-emerald-600 transition-all duration-150 shadow-xs hover:shadow-md !mb-0 bg-white border border-slate-300 rounded-[6px] overflow-hidden">
              <!-- Product Image Header -->
              <div class="relative h-44 sm:h-48 overflow-hidden bg-slate-100 border-b border-slate-200">
                <img
                  src={prod.logo || "/images/products/namia_murabahah_goods.jpg"}
                  alt={prod.name}
                  class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none"></div>

                <!-- Top-Left Pill Badge (Reference Style) -->
                <div class="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs pointer-events-none">
                  Akad {prod.contractType}
                </div>

                <!-- Top-Right Category Badge -->
                <span class="absolute top-2.5 right-2.5 badge {prod.targetAudience === 'investor' ? 'badge-info' : 'badge-inverse'} text-[10px] font-bold shadow-xs pointer-events-none">
                  {prod.targetAudience === 'investor' ? 'PENDANAAN' : 'PEMBIAYAAN UMKM'}
                </span>

                <!-- Bottom Overlay Tag -->
                <div class="absolute bottom-2 left-2.5 right-2.5 text-white pointer-events-none flex items-center justify-between text-[11px] drop-shadow-sm">
                  <span class="font-medium opacity-90 truncate">
                    {prod.provider || "PT Namia Finansial Teknologi"}
                  </span>
                  <span class="font-bold text-amber-300 shrink-0">
                    ★ {prod.rating}
                  </span>
                </div>
              </div>

              <!-- Card Body (Clean Layout Inspired by Reference Card) -->
              <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 class="text-[15px] sm:text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors leading-snug line-clamp-2 min-h-[44px]">
                    {prod.name}
                  </h3>

                  <!-- Clean Green Status Pill -->
                  <div class="mt-2 mb-3">
                    <span class="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                      <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      <span>{prod.targetAudience === 'investor' ? 'PROYEK AKTIF' : 'PEMBIAYAAN TERSEDIA'}</span>
                    </span>
                  </div>

                  <!-- 100% Metric and Early Bootstrap Striped Progress Bar -->
                  <div class="space-y-1 mb-3">
                    <div class="flex items-center justify-between text-xs">
                      <strong class="text-emerald-700 font-extrabold text-sm sm:text-base font-mono">100%</strong>
                      <span class="text-[11px] text-slate-500 font-medium">{prod.targetAudience === 'investor' ? 'Kuota Terpenuhi' : 'Tingkat Kelayakan'}</span>
                    </div>
                    <div class="progress progress-striped active !h-2 !rounded-full !mb-0 bg-slate-200 border border-slate-300 shadow-inner">
                      <div class="bar !bg-emerald-600 w-full"></div>
                    </div>
                  </div>

                  <!-- Clean Key-Value Metrics Rows (Reference Card Style) -->
                  <div class="space-y-2 text-xs border-t border-slate-200/80 pt-3">
                    <div class="flex items-center justify-between">
                      <span class="text-slate-500 font-normal flex items-center gap-1">
                        <span>{prod.targetAudience === 'investor' ? 'Min. Investasi' : 'Plafon Pembiayaan'}</span>
                        <HelpCircle class="w-3 h-3 text-slate-400" />
                      </span>
                      <strong class="font-bold text-slate-900 font-mono text-xs sm:text-[13px]">
                        {prod.targetAudience === 'investor'
                          ? `Rp ${(prod.minAmount).toLocaleString("id-ID")}`
                          : `Rp ${(prod.minAmount / 1_000_000).toLocaleString("id-ID")} Jt - ${(prod.maxAmount / 1_000_000).toLocaleString("id-ID")} Jt`}
                      </strong>
                    </div>

                    <div class="flex items-center justify-between">
                      <span class="text-slate-500 font-normal flex items-center gap-1">
                        <span>{prod.targetAudience === 'investor' ? 'Target Kebutuhan' : 'Akad Transaksi'}</span>
                        <HelpCircle class="w-3 h-3 text-slate-400" />
                      </span>
                      <strong class="font-bold text-slate-800 font-mono text-xs sm:text-[13px]">
                        {prod.targetAudience === 'investor'
                          ? `Rp ${(prod.maxAmount).toLocaleString("id-ID")}`
                          : `Akad ${prod.contractType}`}
                      </strong>
                    </div>

                    <div class="flex items-center justify-between">
                      <span class="text-slate-500 font-normal flex items-center gap-1">
                        <span>Jangka Waktu</span>
                        <HelpCircle class="w-3 h-3 text-slate-400" />
                      </span>
                      <strong class="font-bold text-slate-900 font-mono text-xs sm:text-[13px]">
                        {prod.minTenorMonths} - {prod.maxTenorMonths} Bulan
                      </strong>
                    </div>

                    <div class="flex items-center justify-between">
                      <span class="text-slate-500 font-normal flex items-center gap-1">
                        <span>{prod.targetAudience === 'investor' ? 'Proyeksi ROI (%)' : 'Margin / Nisbah'}</span>
                        <HelpCircle class="w-3 h-3 text-slate-400" />
                      </span>
                      <strong class="font-bold text-emerald-800 font-mono text-xs sm:text-[13px]">
                        {prod.contractType === 'Musyarakah'
                          ? 'Nisbah 70:30'
                          : (prod.contractType.includes('Mudharabah')
                            ? '12% - 18% p.a.'
                            : (prod.interestRateAnnual > 0 ? `${prod.interestRateAnnual}% p.a. Flat` : 'Ujrah Pasti'))}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Actions in Authentic Early Bootstrap Panel Footer -->
              <div class="panel-footer flex items-center justify-between gap-2 bg-[#f8fafc] border-t border-slate-200 !py-2.5 !px-4">
                <button
                  type="button"
                  onclick={() => openProductDetail(prod)}
                  class="btn btn-small"
                >
                  <span>Detail Skema</span>
                </button>

                {#if prod.targetAudience === 'investor'}
                  <a
                    href="/investor"
                    class="btn btn-small btn-primary font-bold flex items-center gap-1 shadow-xs"
                  >
                    <span>Mulai Mendanai</span>
                    <ArrowRight class="w-3.5 h-3.5" />
                  </a>
                {:else}
                  <a
                    href={prod.applyUrl || "/borrower"}
                    class="btn btn-small btn-success font-bold flex items-center gap-1 shadow-xs"
                  >
                    <span>Ajukan Modal</span>
                    <ArrowRight class="w-3.5 h-3.5" />
                  </a>
                {/if}
              </div>
            </div>
          {/each}

          <!-- Custom Enterprise / Consultation Card inside Carousel -->
          <div class="w-[85vw] max-w-[320px] sm:w-[335px] md:w-[350px] shrink-0 snap-start panel flex flex-col justify-between !mb-0 bg-gradient-to-b from-[#1e293b] to-[#0f172a] text-white border-slate-800 p-5 sm:p-6 shadow-xs rounded-[6px]">
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <span class="label label-success text-[10px] uppercase font-bold">Layanan Korporasi</span>
                <span class="badge badge-inverse text-[10px]">Plafon Khusus</span>
              </div>
              <h3 class="text-base sm:text-lg font-bold text-white leading-snug">
                Butuh Plafon Di Atas Rp 2 Miliar?
              </h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Kami memfasilitasi sindikasi pendanaan institusional, penerbitan Sukuk Wakalah proyek produktif, dan struktur pembiayaan modal kerja konsorsium yang disesuaikan bagi entitas bisnis Anda.
              </p>

              <div class="well well-small well-dark !p-3 space-y-1.5 text-xs">
                <div class="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 class="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>Sindikasi Pendana Terakreditasi</span>
                </div>
                <div class="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 class="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>Penyusunan Akad Custom DPS</span>
                </div>
                <div class="flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 class="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>Dedicated Relationship Manager</span>
                </div>
              </div>
            </div>

            <div class="space-y-2 pt-4 border-t border-slate-700 mt-3">
              <a href="/contacts" class="btn btn-success w-full font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm">
                <span>Konsultasi Pembiayaan</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </a>
              <a href="/aggregator" class="btn btn-inverse w-full text-xs flex items-center justify-center gap-1">
                <span>Pelajari Portofolio Lengkap</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- INTERACTIVE FINANCIAL CALCULATOR SUITE (EARLY BOOTSTRAP 2 TACTILE SUITE) -->
  <section id="kalkulator" class="py-14 sm:py-18 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#ffffff] border-b border-slate-200/80 scroll-mt-20 relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="heading-block text-center mb-8">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight !normal-case">Kalkulator Finansial Syariah</h2>
        <span class="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-5xl mx-auto block leading-relaxed font-normal">
          Simulasikan estimasi cicilan tetap modal usaha (Murabahah), proyeksi bagi hasil investasi produktif (Mudharabah), atau uji rasio kapasitas pembayaran (DSR) secara instan dan transparan.
        </span>
      </div>

      <!-- Tab Navigation in Authentic Early Bootstrap 2 .nav-tabs Style -->
      <div class="overflow-x-auto no-scrollbar pb-1 mb-6 flex justify-start sm:justify-center">
        <div class="nav-tabs !mb-0 flex-nowrap shrink-0 border-b border-slate-300">
          <button
            type="button"
            onclick={() => (activeCalcTab = "loan")}
            class="nav-link {activeCalcTab === 'loan' ? 'active' : ''} text-xs sm:text-sm !py-2.5 !px-3 sm:!px-5"
          >
            <Calculator class="w-4 h-4 {activeCalcTab === 'loan' ? 'text-emerald-700' : 'text-slate-400'}" />
            <span><span class="hidden sm:inline">Simulasi </span>Pembiayaan (Murabahah)</span>
          </button>
          <button
            type="button"
            onclick={() => (activeCalcTab = "invest")}
            class="nav-link {activeCalcTab === 'invest' ? 'active' : ''} text-xs sm:text-sm !py-2.5 !px-3 sm:!px-5"
          >
            <TrendingUp class="w-4 h-4 {activeCalcTab === 'invest' ? 'text-emerald-700' : 'text-slate-400'}" />
            <span><span class="hidden sm:inline">Proyeksi </span>Investasi (Mudharabah)</span>
          </button>
          <button
            type="button"
            onclick={() => (activeCalcTab = "score")}
            class="nav-link {activeCalcTab === 'score' ? 'active' : ''} text-xs sm:text-sm !py-2.5 !px-3 sm:!px-5"
          >
            <Activity class="w-4 h-4 {activeCalcTab === 'score' ? 'text-emerald-700' : 'text-slate-400'}" />
            <span><span class="hidden sm:inline">Uji </span>Kelayakan (DSR)</span>
          </button>
        </div>
      </div>

      <!-- Active Calculator Pane -->
      {#if activeCalcTab === "loan"}
        <LoanCalculator />
      {:else if activeCalcTab === "invest"}
        <InvestmentCalculator />
      {:else}
        <CreditScoreEstimator />
      {/if}

      <!-- Bottom Calculator Guarantee Bar in Early Bootstrap Well Style -->
      <div class="well well-small !p-3 sm:!p-4 !mb-0 mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700 border border-slate-300 rounded-[4px] shadow-2xs">
        <div class="flex items-center gap-2.5">
          <ShieldCheck class="w-4 h-4 text-emerald-700 shrink-0" />
          <span><strong>Prinsip Syariah Terjamin:</strong> Seluruh simulasi angsuran bersifat flat tetap hingga akhir masa tenor tanpa risiko kenaikan suku bunga atau penalti denda berbunga.</span>
        </div>
        <a href="/aggregator" class="btn btn-small btn-default shrink-0 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <span>Bandingkan Semua Produk</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </section>

  <!-- LIPUTAN MEDIA & OPINI PUBLIK (EARLY BOOTSTRAP PRESS & SOCIAL PROOF CENTER) -->
  <section class="py-14 sm:py-18 bg-white border-b border-slate-200/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="heading-block text-center mb-8 sm:mb-10">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Liputan Media & Opini Publik
        </h2>
        <span class="text-xs sm:text-sm text-slate-600 mt-2 max-w-5xl mx-auto block leading-relaxed font-normal">
          Liputan resmi media massa kredibel nasional dan suara nyata para pelaku usaha serta pendana yang merasakan dampak berkah permodalan syariah.
        </span>
      </div>

      <!-- 2-Column Seamless Layout: Video Dokumenter (Kiri) & Testimoni/Media (Kanan) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left Column: Video Dokumentasi & Kisah Nyata (lg:col-span-5) -->
        <div class="lg:col-span-5 flex flex-col space-y-4">
          <!-- Video Frame -->
          <div class="aspect-video bg-slate-900 rounded-[4px] border border-slate-300 overflow-hidden shadow-sm relative group/video">
            {#if isVideoPlaying}
              <iframe
                src="https://www.youtube-nocookie.com/embed/7cBJ5jQckcA?autoplay=1&rel=0"
                title="Wawancara Dokumenter Namia Syariah"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                loading="lazy"
              ></iframe>
            {:else}
              <button
                type="button"
                onclick={() => (isVideoPlaying = true)}
                class="w-full h-full relative block text-left cursor-pointer overflow-hidden group"
                aria-label="Putar Wawancara Dokumenter Namia Syariah"
              >
                <img
                  src="https://img.youtube.com/vi/7cBJ5jQckcA/hqdefault.jpg"
                  alt="Thumbnail Wawancara Dokumenter"
                  class="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-102 transition-all duration-300"
                  loading="lazy"
                  decoding="async"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25 flex flex-col justify-between p-4">
                  <div class="flex items-center justify-between">
                    <span class="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-[2px] tracking-wide uppercase shadow-xs">
                      YouTube Video
                    </span>
                    <span class="text-white/90 text-[10px] font-mono bg-black/60 px-1.5 py-0.5 rounded-[2px]">
                      05:24
                    </span>
                  </div>

                  <div class="self-center flex flex-col items-center gap-1.5">
                    <div class="w-13 h-13 rounded-full bg-red-600 group-hover:bg-red-700 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-200">
                      <Play class="w-6 h-6 fill-current ml-0.5" />
                    </div>
                    <span class="text-xs font-bold text-white tracking-wide drop-shadow-md bg-black/60 px-2.5 py-0.5 rounded-[2px]">
                      Klik untuk Memutar
                    </span>
                  </div>

                  <div class="text-[11px] text-slate-200 font-medium truncate">
                    ▶ Wawancara Pelaku Usaha & Pendana Namia Syariah
                  </div>
                </div>
              </button>
            {/if}
          </div>

          <!-- Video Narrative & Context -->
          <div class="space-y-3 pt-1">
            <div class="flex items-center gap-2">
              <span class="label label-success text-[10px] uppercase tracking-wider font-bold">Wawancara Lapangan</span>
              <span class="text-xs text-slate-500 font-medium">Dokumenter Riset Mitra UMKM</span>
            </div>
            <h3 class="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              Suara Nyata Masyarakat: Mengapa Beralih ke Fintech Syariah?
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed font-normal">
              Simak rangkuman wawancara langsung bersama pelaku usaha perintis dan pendana ritel mengenai kepastian akad tanpa denda ribawi serta dampak riil bagi kelancaran arus kas usaha.
            </p>

            <!-- 3 Highlights Inset Well -->
            <div class="well well-small !p-3 bg-slate-50 border border-slate-200 rounded-[3px] space-y-1.5 text-xs text-slate-800">
              <div class="flex items-center gap-2">
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span class="text-[11px]">Transparansi skema margin jual-beli tanpa biaya tersembunyi</span>
              </div>
              <div class="flex items-center gap-2">
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span class="text-[11px]">Pencairan invoice kilat 2 - 3 hari untuk operasional vendor</span>
              </div>
              <div class="flex items-center gap-2">
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span class="text-[11px]">Ketenangan batin diawasi langsung DPS DSN-MUI</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-2 pt-1">
              <a
                href="https://www.youtube.com/watch?v=7cBJ5jQckcA"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-small btn-default font-bold flex items-center gap-1.5 text-slate-700 hover:text-red-700 shadow-2xs"
              >
                <Play class="w-3.5 h-3.5 text-red-600" />
                <span>Buka di YouTube</span>
              </a>
              <a
                href="/borrower"
                class="btn btn-small btn-success font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <span>Ajukan Modal Usaha</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        <!-- Right Column: Opini Publik & Liputan Media (lg:col-span-7) -->
        <div class="lg:col-span-7 flex flex-col space-y-4">
          <!-- Early Bootstrap Nav Tabs Header -->
          <div class="flex items-center justify-between border-b border-slate-300 pb-0 gap-2">
            <div class="nav-tabs !mb-0 border-b-0 gap-1 flex flex-nowrap">
              <button
                type="button"
                onclick={() => setProofTab("testimonials")}
                class="nav-link !py-2.5 !px-4 text-xs sm:text-sm whitespace-nowrap {activeProofTab === 'testimonials' ? 'active font-bold' : ''}"
              >
                <MessageSquare class="w-4 h-4 text-emerald-600 inline mr-1.5" />
                <span>Opini Pelaku Usaha & Pendana ({latestTestimonials.length})</span>
              </button>
              <button
                type="button"
                onclick={() => setProofTab("media")}
                class="nav-link !py-2.5 !px-4 text-xs sm:text-sm whitespace-nowrap {activeProofTab === 'media' ? 'active font-bold' : ''}"
              >
                <FileText class="w-4 h-4 text-emerald-600 inline mr-1.5" />
                <span>Liputan Media Nasional ({mediaCoverage.length})</span>
              </button>
            </div>

            <!-- Segmented Filter for Testimonials -->
            {#if activeProofTab === 'testimonials'}
              <div class="hidden sm:flex items-center gap-1 mb-1">
                <button
                  type="button"
                  class="btn btn-mini {activeTestimonialFilter === 'all' ? 'btn-success active font-bold' : 'btn-default'}"
                  onclick={() => (activeTestimonialFilter = "all")}
                >Semua</button>
                <button
                  type="button"
                  class="btn btn-mini {activeTestimonialFilter === 'borrower' ? 'btn-success active font-bold' : 'btn-default'}"
                  onclick={() => (activeTestimonialFilter = "borrower")}
                >UMKM</button>
                <button
                  type="button"
                  class="btn btn-mini {activeTestimonialFilter === 'investor' ? 'btn-success active font-bold' : 'btn-default'}"
                  onclick={() => (activeTestimonialFilter = "investor")}
                >Pendana</button>
              </div>
            {/if}
          </div>

          <!-- Tab Content Area (Without Inner Scrollbar, Clean & Spacious) -->
          <div>
            {#if activeProofTab === 'testimonials'}
              <!-- 2 Prominent Verified Testimonial Cards -->
              <div class="space-y-3.5">
                {#each filteredTestimonials.slice(0, 2) as t}
                  <div class="bg-white border border-slate-300 rounded-[4px] p-4 sm:p-5 shadow-2xs hover:border-emerald-600 transition-all duration-150">
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <div class="flex items-center gap-1 text-amber-500 text-sm">
                        {#each Array(Math.min(5, Math.max(1, Math.round(Number(t.rating) || 5)))) as _}
                          <span>★</span>
                        {/each}
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="badge {t.type === 'investor' ? 'badge-info' : 'badge-success'} text-[10px] uppercase font-bold tracking-wider">
                          {t.type === 'investor' ? 'Pendana' : 'Penerima Modal'}
                        </span>
                        {#if (t as any).date}
                          <span class="text-[11px] text-slate-500 font-mono hidden sm:inline">{(t as any).date}</span>
                        {/if}
                      </div>
                    </div>

                    <p class="text-xs sm:text-[13px] text-slate-800 leading-relaxed italic font-normal">
                      "{t.content}"
                    </p>

                    <div class="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between gap-3 text-xs">
                      <div class="flex items-center gap-2.5 min-w-0">
                        <img
                          src={t.avatar || "/images/team/p_syauqi_sq.jpg"}
                          alt={t.name}
                          class="w-9 h-9 rounded-[3px] object-cover border border-slate-300 shrink-0"
                        />
                        <div class="min-w-0">
                          <strong class="text-slate-900 text-xs font-bold block truncate">{t.name}</strong>
                          <span class="text-slate-500 text-[11px] block truncate">{t.businessName}</span>
                        </div>
                      </div>

                      {#if t.fundedAmount}
                        <span class="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-[2px] shrink-0">
                          {t.fundedAmount}
                        </span>
                      {/if}
                    </div>
                  </div>
                {/each}

                <!-- Footer under Testimonials -->
                <div class="flex items-center justify-between pt-2 text-xs border-t border-slate-200 text-slate-600">
                  <span class="text-[11px] font-mono">Terverifikasi dari 18.420+ mitra di 27 provinsi</span>
                  <a
                    href="/onboarding"
                    class="btn btn-mini btn-default font-bold text-emerald-800 hover:text-emerald-600 flex items-center gap-1"
                  >
                    <span>Beri Ulasan / Gabung Mitra</span>
                    <ChevronRight class="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            {:else}
              <!-- Media Coverage Editorial Cards -->
              <div class="space-y-3">
                {#each mediaCoverage.slice(0, 3) as media}
                  <div class="bg-white border border-slate-300 rounded-[4px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-600 transition-all duration-150 shadow-2xs">
                    <div class="flex items-start sm:items-center gap-4 min-w-0 flex-1">
                      <div class="w-24 h-10 bg-slate-50 border border-slate-200 rounded-[3px] p-1.5 flex items-center justify-center shrink-0">
                        <img
                          src={media.logo}
                          alt={media.name}
                          class="max-h-7 max-w-[85px] object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 mb-0.5">
                          <span class="badge badge-default text-[9px]">{media.source || "Pers Nasional"}</span>
                        </div>
                        <h4 class="text-xs sm:text-sm font-bold text-slate-900 leading-snug hover:text-emerald-700 transition-colors line-clamp-1">
                          {media.title || media.name}
                        </h4>
                        <p class="text-[11px] text-slate-600 leading-relaxed line-clamp-1 mt-0.5">
                          {media.excerpt || media.description}
                        </p>
                      </div>
                    </div>

                    <a
                      href={media.url || "https://google.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="btn btn-mini btn-default font-bold text-emerald-800 hover:text-emerald-600 flex items-center gap-1 shrink-0 self-end sm:self-center"
                    >
                      <span>Baca Rilis</span>
                      <ChevronRight class="w-3 h-3" />
                    </a>
                  </div>
                {/each}

                <!-- Footer under Media List -->
                <div class="flex items-center justify-between pt-2 text-xs border-t border-slate-200 text-slate-600">
                  <span class="text-[11px] text-slate-500">Dikutip dari publikasi media massa & pers ekonomi terkemuka</span>
                  <a
                    href="/blog"
                    class="btn btn-mini btn-default font-semibold text-slate-700 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>Arsip Berita Lengkap</span>
                    <ChevronRight class="w-3 h-3" />
                  </a>
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- EKOSISTEM, LEGALITAS & KEMITRAAN TERPERCAYA (REUSABLE COMPONENT) -->
  <TrustEcosystem />

  <!-- PERTANYAAN UMUM / FAQ MUAMALAH (EARLY BOOTSTRAP INTERACTIVE ACCORDION) -->
  <section class="py-14 sm:py-18 bg-[#f8fafc] border-b border-slate-200/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="heading-block text-center mb-8 sm:mb-10">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h2>
        <span class="text-xs sm:text-sm text-slate-600 mt-2 max-w-5xl mx-auto block leading-relaxed font-normal">
          Temukan jawaban transparan seputar tata kelola muamalah, proses verifikasi permodalan UMKM, bagi hasil investasi, dan kepatuhan syariah.
        </span>
      </div>

      <!-- 2-Column Documentation Layout: Sidebar Nav & Search (Kiri) & Accordion List (Kanan) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left Column: Search & Topic Filter Nav (lg:col-span-4) -->
        <div class="lg:col-span-4 space-y-4">
          <!-- Search & Filter Card -->
          <div class="bg-white border border-slate-300 rounded-[4px] p-4 sm:p-5 shadow-2xs space-y-4">
            <div>
              <label for="faq-search-input" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Cari Pertanyaan
              </label>
              <div class="relative">
                <input
                  id="faq-search-input"
                  type="text"
                  bind:value={faqSearchQuery}
                  placeholder="Ketik topik (margin, tenor, akad)..."
                  class="w-full pl-8 pr-8 py-2 text-xs bg-slate-50 border border-slate-300 rounded-[3px] focus:border-emerald-600 focus:bg-white focus:outline-none"
                />
                <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {#if faqSearchQuery}
                  <button
                    type="button"
                    onclick={() => (faqSearchQuery = "")}
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    aria-label="Hapus pencarian"
                  >
                    &times;
                  </button>
                {/if}
              </div>
            </div>

            <!-- Category Menu in Early Bootstrap .nav.nav-list style -->
            <div>
              <span class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Kategori Topik
              </span>
              <div class="space-y-1 font-medium text-xs">
                <button
                  type="button"
                  onclick={() => (activeFaqCategory = "all")}
                  class="w-full px-3 py-2 text-left rounded-[3px] flex items-center justify-between transition-colors {activeFaqCategory === 'all' ? 'bg-emerald-800 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'}"
                >
                  <span>Semua Topik</span>
                  <span class="badge {activeFaqCategory === 'all' ? 'badge-inverse' : 'badge-default'} text-[10px]">
                    {$cmsStore.faqs?.length || 0}
                  </span>
                </button>
                <button
                  type="button"
                  onclick={() => (activeFaqCategory = "borrower")}
                  class="w-full px-3 py-2 text-left rounded-[3px] flex items-center justify-between transition-colors {activeFaqCategory === 'borrower' ? 'bg-emerald-800 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'}"
                >
                  <span>🏢 Untuk Peminjam (UMKM)</span>
                </button>
                <button
                  type="button"
                  onclick={() => (activeFaqCategory = "investor")}
                  class="w-full px-3 py-2 text-left rounded-[3px] flex items-center justify-between transition-colors {activeFaqCategory === 'investor' ? 'bg-emerald-800 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'}"
                >
                  <span>📈 Untuk Pendana (Investor)</span>
                </button>
                <button
                  type="button"
                  onclick={() => (activeFaqCategory = "syariah")}
                  class="w-full px-3 py-2 text-left rounded-[3px] flex items-center justify-between transition-colors {activeFaqCategory === 'syariah' ? 'bg-emerald-800 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'}"
                >
                  <span>⚖️ Akad & Kepatuhan Syariah</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Assistance Card -->
          <div class="well well-white !p-4 sm:!p-5 border border-slate-300 rounded-[4px] shadow-2xs space-y-3">
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900">
                Butuh Konsultasi Akad?
              </h4>
              <p class="text-[11px] text-slate-600 leading-relaxed mt-1">
                Tim kepatuhan syariah dan CS Namia siap membantu simulasi dan telaah usaha tanpa biaya.
              </p>
            </div>
            <div class="flex flex-col sm:flex-row lg:flex-col gap-2 pt-1">
              <a href="/contacts" class="btn btn-small btn-success font-bold flex items-center justify-center gap-1.5 shadow-2xs">
                <span>Konsultasi Gratis</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </a>
              <a
                href="https://wa.me/6281283782337?text=Assalamu%27alaikum%2C%20saya%20ingin%20konsultasi%20pembiayaan%20di%20Namia%20Syariah"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-small btn-default font-semibold text-emerald-800 text-center"
              >
                WhatsApp CS Kami
              </a>
            </div>
          </div>
        </div>

        <!-- Right Column: FAQ Accordion List (lg:col-span-8) -->
        <div class="lg:col-span-8 space-y-2.5">
          {#if visibleFaqs.length === 0}
            <div class="well well-white !p-8 text-center space-y-2 border border-slate-300 rounded-[4px]">
              <p class="text-sm font-bold text-slate-800">Tidak ada pertanyaan yang sesuai dengan pencarian "{faqSearchQuery}".</p>
              <p class="text-xs text-slate-600 font-medium">Coba gunakan kata kunci lain seperti "dokumen", "tenor", "nisbah", atau "aplikasi".</p>
              <button
                type="button"
                onclick={() => { faqSearchQuery = ""; activeFaqCategory = "all"; }}
                class="btn btn-small btn-default mt-2"
              >
                Reset Pencarian
              </button>
            </div>
          {:else}
            {#each visibleFaqs as faq, i}
              <div class="panel !mb-0 shadow-2xs border border-slate-300 rounded-[4px] overflow-hidden bg-white hover:border-emerald-600 transition-colors">
                <button
                  type="button"
                  onclick={() => toggleFaq(i)}
                  class="w-full px-4 py-3.5 text-left flex items-start justify-between gap-3 cursor-pointer bg-slate-50/70 hover:bg-slate-100 transition-colors"
                  aria-expanded={openFaq === i}
                >
                  <div class="flex items-start gap-2.5 flex-1">
                    <span class="badge {faq.isInvestor === 1 ? 'badge-info' : 'badge-success'} text-[9px] uppercase font-bold shrink-0 mt-0.5">
                      {faq.categoryName || (faq.isInvestor === 1 ? 'INVESTOR' : 'BORROWER')}
                    </span>
                    <span class="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {faq.question || faq.q || ""}
                    </span>
                  </div>
                  <ChevronDown
                    class="w-4 h-4 text-slate-600 shrink-0 mt-0.5 transition-transform duration-200 {openFaq === i ? 'rotate-180 text-emerald-700' : ''}"
                  />
                </button>

                {#if openFaq === i}
                  <div class="p-4 sm:p-5 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-200 bg-white">
                    {@html faq.answer || faq.a || ""}
                  </div>
                {/if}
              </div>
            {/each}
          {/if}

          <!-- Expand / Collapse All Button -->
          {#if filteredFaqs.length > 6}
            <div class="text-center pt-3">
              <button
                type="button"
                onclick={() => (showAllFaqs = !showAllFaqs)}
                class="btn btn-small btn-default font-bold text-xs"
              >
                <span>{showAllFaqs ? "▴ Tampilkan Lebih Sedikit" : `▾ Tampilkan Semua (${filteredFaqs.length} Pertanyaan)`}</span>
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <!-- PRODUCT DETAIL MODAL (EARLY BOOTSTRAP MODAL DIALOG) -->
  {#if selectedProduct}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div class="panel max-w-xl w-full shadow-2xl !mb-0 border-slate-400 animate-in fade-in-50 zoom-in-95 duration-150">
        <!-- Modal Header -->
        <div class="panel-heading panel-emerald flex items-center justify-between !py-3 !px-5">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-white uppercase">Detail Produk Pembiayaan</span>
          </div>
          <button
            type="button"
            onclick={() => (selectedProduct = null)}
            class="text-white hover:text-emerald-200 font-bold text-lg cursor-pointer"
            aria-label="Tutup Modal"
          >
            &times;
          </button>
        </div>

        <div class="p-6 space-y-4 bg-white">
          <div class="flex items-center gap-4">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              class="w-16 h-16 rounded-[3px] object-cover border border-slate-300 shrink-0"
            />
            <div>
              <span class="label label-success mb-1">Akad {selectedProduct.contract}</span>
              <h3 class="text-base font-bold text-slate-900">
                {selectedProduct.name}
              </h3>
            </div>
          </div>

          <!-- Financial Specs Strip -->
          <table class="table table-bordered !mb-0 text-xs">
            <tbody>
              <tr>
                <td class="font-bold text-slate-600 bg-slate-50 w-1/3">Plafon:</td>
                <td class="font-mono font-bold text-slate-900">{selectedProduct.plafon}</td>
              </tr>
              <tr>
                <td class="font-bold text-slate-600 bg-slate-50">Jangka Tenor:</td>
                <td class="font-mono text-slate-900">{selectedProduct.tenor}</td>
              </tr>
              <tr>
                <td class="font-bold text-slate-600 bg-slate-50">Skema Imbal:</td>
                <td class="font-mono font-bold text-emerald-700">{selectedProduct.skema}</td>
              </tr>
            </tbody>
          </table>

          <p class="text-xs text-slate-600 leading-relaxed">
            {selectedProduct.desc}
          </p>

          <div class="well well-small !p-3 !mb-0 bg-slate-50">
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
              Keunggulan & Persyaratan:
            </h4>
            <ul class="space-y-1 text-xs text-slate-700">
              {#each selectedProduct.features as feat}
                <li class="flex items-center gap-2">
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{feat}</span>
                </li>
              {/each}
            </ul>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="panel-footer flex items-center justify-end gap-2 bg-slate-50">
          <button
            type="button"
            onclick={() => (selectedProduct = null)}
            class="btn btn-small"
          >
            Tutup
          </button>
          <a
            href="/borrower"
            class="btn btn-small btn-success font-bold"
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

  @media (prefers-reduced-motion: reduce) {
    .homepage :global(*) {
      scroll-behavior: auto !important;
      animation: none !important;
      transition: none !important;
    }
  }
</style>
