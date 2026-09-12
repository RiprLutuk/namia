<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import {
    cmsStore,
    fetchCmsContent,
    updateSiteSettings,
    updateHeroContent,
    updateStat,
    createStat,
    deleteStat,
    createProduct,
    updateProduct,
    deleteProduct,
    createArticle,
    updateArticle,
    deleteArticle,
    createPersonil,
    updatePersonil,
    deletePersonil,
    createFaq,
    updateFaq,
    deleteFaq,
    createTestimonial,
    deleteTestimonial,
    updateInvestorInfo,
    resetCmsToDefaults,
    type ProductData,
    type StatData,
    type BlogPostData,
    type PersonilData,
    type FaqData,
    type TestimonialData,
    type InvestorInfo,
  } from "$lib/cms";
  import {
    LayoutDashboard,
    Globe,
    Sliders,
    Sparkles,
    BarChart3,
    Package,
    BookOpen,
    Users,
    HelpCircle,
    MessageSquare,
    Save,
    RotateCcw,
    Plus,
    Trash2,
    Edit3,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    ExternalLink,
    ChevronRight,
    ArrowUpRight,
    Building2,
    Layers,
    X,
    Check,
    Menu,
    ShieldCheck,
    Database,
    Server,
    Clock,
    FileText,
    Search,
    Filter,
    ArrowRight,
    Activity,
    Zap,
    TrendingUp,
    Award,
    Flame,
    Percent,
  } from "lucide-svelte";

  // Active Tab
  type TabKey =
    | "overview"
    | "branding"
    | "hero"
    | "investor"
    | "products"
    | "stats"
    | "articles"
    | "team"
    | "faqs"
    | "testimonials";
  const urlTab = page.url.searchParams.get("tab");
  let activeTab = $state<TabKey>(
    urlTab &&
      [
        "overview",
        "branding",
        "hero",
        "investor",
        "products",
        "stats",
        "articles",
        "team",
        "faqs",
        "testimonials",
      ].includes(urlTab)
      ? (urlTab as TabKey)
      : "overview",
  );
  let isMobileSidebarOpen = $state(false);

  // Filters
  let selectedProductContract = $state<string>("all");
  let selectedTeamLevelFilter = $state<number>(0);
  let selectedFaqCategory = $state<string>("all");

  // Derived filterings
  let filteredProducts = $derived(
    selectedProductContract === "all"
      ? $cmsStore.products
      : $cmsStore.products.filter(
          (p) =>
            p.contractType.toLowerCase() ===
            selectedProductContract.toLowerCase(),
        ),
  );

  let filteredTeam = $derived(
    selectedTeamLevelFilter === 0
      ? $cmsStore.team
      : $cmsStore.team.filter(
          (m) => (m.job_level ?? m.jobLevel) === selectedTeamLevelFilter,
        ),
  );

  let filteredFaqs = $derived(
    selectedFaqCategory === "all"
      ? $cmsStore.faqs
      : $cmsStore.faqs.filter(
          (f) =>
            f.category?.toLowerCase() === selectedFaqCategory.toLowerCase(),
        ),
  );

  // Notification Toast
  let toast = $state<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  let toastTimer: any;

  function showToast(
    message: string,
    type: "success" | "error" | "info" = "success",
  ) {
    clearTimeout(toastTimer);
    toast = { message, type };
    toastTimer = setTimeout(() => {
      toast = null;
    }, 4000);
  }

  // Local editable copies of site settings, hero & investor
  let settingsForm = $state({ ...$cmsStore.siteSettings });
  let heroForm = $state({ ...$cmsStore.heroContent });
  let investorForm = $state<InvestorInfo>(
    JSON.parse(JSON.stringify($cmsStore.investorInfo || {}))
  );

  // Keep local copies in sync when store changes initially
  $effect(() => {
    settingsForm = { ...$cmsStore.siteSettings };
    heroForm = { ...$cmsStore.heroContent };
    if ($cmsStore.investorInfo) {
      investorForm = JSON.parse(JSON.stringify($cmsStore.investorInfo));
    }
  });

  // Modals for editing/creating items
  let editingProduct = $state<ProductData | null>(null);
  let isNewProductModal = $state(false);
  let newProduct = $state<Omit<ProductData, "id">>({
    name: "",
    slug: "",
    contractType: "Murabahah",
    tagline: "",
    description: "",
    minAmount: 5_000_000,
    maxAmount: 50_000_000,
    minTenorMonths: 3,
    maxTenorMonths: 12,
    interestRateAnnual: 8.5,
    logo: "/images/products/namia_murabahah_goods.jpg",
    features: ["Bebas Riba & Denda", "Proses Cepat 1-3 Hari"],
    status: "active",
    applyUrl: "/borrower",
  });

  // Stat Modal
  let editingStat = $state<StatData | null>(null);
  let isNewStatModal = $state(false);
  let newStat = $state<Omit<StatData, "id">>({
    metricKey: "tkb90",
    label: "Tingkat Keberhasilan Bayar (TKB90)",
    value: "100%",
    sublabel: "Mitigasi risiko teruji",
    category: "borrower",
    icon: "ShieldCheck",
    order: 1,
  });

  // Article Modal
  let editingArticle = $state<BlogPostData | null>(null);
  let isNewArticleModal = $state(false);
  let newArticle = $state<Omit<BlogPostData, "id">>({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    coverImage: "/images/blog/grid/17.jpg",
    category: "Akad Syariah",
    author: "Tim Ahli Namia Syariah",
    publishedAt: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    tags: ["fintech", "syariah", "edukasi"],
  });

  // FAQ Modal
  let editingFaq = $state<FaqData | null>(null);
  let isNewFaqModal = $state(false);
  let newFaq = $state<Omit<FaqData, "id">>({
    category: "borrower",
    question: "",
    answer: "",
    order: 1,
  });

  // Testimonial Modal
  let isNewTestimonialModal = $state(false);
  let newTestimonial = $state<Omit<TestimonialData, "id">>({
    name: "",
    businessName: "",
    role: "borrower",
    content: "",
    rating: 5,
    fundedAmount: "Rp 50.000.000",
    avatar: "/images/team/p_putri_sq.jpeg",
  });

  // Team Member Modal
  let editingPersonil = $state<PersonilData | null>(null);
  let isNewPersonilModal = $state(false);
  let newPersonil = $state<Omit<PersonilData, "id">>({
    fullname: "",
    job_title: "",
    job_level: 1,
    education: "",
    photo: "/images/team/p_endi_dps_sq.jpeg",
    biography: "",
  });

  onMount(() => {
    fetchCmsContent();
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab");
      if (
        tabParam &&
        [
          "overview",
          "branding",
          "hero",
          "investor",
          "products",
          "stats",
          "articles",
          "team",
          "faqs",
          "testimonials",
        ].includes(tabParam)
      ) {
        activeTab = tabParam as TabKey;
      }
    }
  });

  // Save Site Settings & Hero
  async function handleSaveSettings() {
    try {
      await updateSiteSettings(settingsForm);
      showToast(
        "Branding dan Identitas Platform berhasil disimpan secara real-time!",
      );
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan pengaturan", "error");
    }
  }

  // Save Hero Content
  async function handleSaveHero() {
    try {
      await updateHeroContent(heroForm);
      showToast("Hero Section, Ticker Pengumuman, dan CTA berhasil disimpan!");
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan Hero", "error");
    }
  }

  // Save Investor Content
  async function handleSaveInvestor() {
    try {
      await updateInvestorInfo(investorForm);
      showToast(
        "Konten Portal Investor & Pendanaan berhasil disimpan secara real-time!",
      );
    } catch (err: any) {
      showToast(err.message || "Gagal menyimpan konten investor", "error");
    }
  }

  // Reset all to defaults
  async function handleResetDefaults() {
    if (
      confirm(
        "Apakah Anda yakin ingin mengembalikan seluruh konten ke default Namia Syariah? Perubahan kustom akan direset.",
      )
    ) {
      try {
        await resetCmsToDefaults();
        showToast(
          "Seluruh konten berhasil direset ke standar resmi Namia Syariah!",
        );
      } catch (err: any) {
        showToast("Gagal mereset konten", "error");
      }
    }
  }

  // Refresh
  async function handleRefresh() {
    await fetchCmsContent();
    showToast("Data konten berhasil disegarkan dari API!", "info");
  }

  // Helpers for Products
  async function handleSaveNewProduct() {
    if (!newProduct.name || !newProduct.description) {
      alert("Nama dan deskripsi produk wajib diisi!");
      return;
    }
    const slug =
      newProduct.slug ||
      newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await createProduct({ ...newProduct, slug });
    isNewProductModal = false;
    showToast(`Produk "${newProduct.name}" berhasil ditambahkan!`);
  }

  async function handleUpdateProduct() {
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, editingProduct);
    editingProduct = null;
    showToast("Produk berhasil diperbarui!");
  }

  async function handleDeleteProduct(id: number, name: string) {
    if (confirm(`Hapus produk "${name}"?`)) {
      await deleteProduct(id);
      showToast(`Produk "${name}" berhasil dihapus.`);
    }
  }

  // Helpers for Stats
  async function handleSaveNewStat() {
    await createStat(newStat);
    isNewStatModal = false;
    showToast("Metrik statistik baru berhasil ditambahkan!");
  }

  async function handleUpdateStat() {
    if (!editingStat) return;
    await updateStat(editingStat.id, editingStat);
    editingStat = null;
    showToast("Metrik statistik berhasil diperbarui!");
  }

  async function handleDeleteStat(id: number) {
    if (confirm("Hapus metrik statistik ini?")) {
      await deleteStat(id);
      showToast("Metrik statistik berhasil dihapus.");
    }
  }

  // Helpers for Articles
  async function handleSaveNewArticle() {
    if (!newArticle.title || !newArticle.content) {
      alert("Judul dan isi artikel wajib diisi!");
      return;
    }
    const slug =
      newArticle.slug ||
      newArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await createArticle({ ...newArticle, slug });
    isNewArticleModal = false;
    showToast(`Artikel "${newArticle.title}" berhasil dipublikasikan!`);
  }

  async function handleUpdateArticle() {
    if (!editingArticle) return;
    await updateArticle(editingArticle.id, editingArticle);
    editingArticle = null;
    showToast("Artikel berhasil diperbarui!");
  }

  async function handleDeleteArticle(id: number, title: string) {
    if (confirm(`Hapus artikel "${title}"?`)) {
      await deleteArticle(id);
      showToast(`Artikel "${title}" berhasil dihapus.`);
    }
  }

  // Helpers for FAQs
  async function handleSaveNewFaq() {
    if (!newFaq.question || !newFaq.answer) {
      alert("Pertanyaan dan jawaban FAQ wajib diisi!");
      return;
    }
    await createFaq(newFaq);
    isNewFaqModal = false;
    showToast("FAQ baru berhasil ditambahkan!");
  }

  async function handleUpdateFaq() {
    if (!editingFaq) return;
    await updateFaq(editingFaq.id, editingFaq);
    editingFaq = null;
    showToast("FAQ berhasil diperbarui!");
  }

  async function handleDeleteFaq(id: number) {
    if (confirm("Hapus FAQ ini?")) {
      await deleteFaq(id);
      showToast("FAQ berhasil dihapus.");
    }
  }

  // Helpers for Testimonials
  async function handleSaveNewTestimonial() {
    if (!newTestimonial.name || !newTestimonial.content) {
      alert("Nama dan isi ulasan testimoni wajib diisi!");
      return;
    }
    await createTestimonial(newTestimonial);
    isNewTestimonialModal = false;
    showToast(`Testimoni dari "${newTestimonial.name}" berhasil ditambahkan!`);
  }

  async function handleDeleteTestimonial(id: number, name: string) {
    if (confirm(`Hapus ulasan testimoni dari "${name}"?`)) {
      await deleteTestimonial(id);
      showToast("Testimoni berhasil dihapus.");
    }
  }

  // Helpers for Team
  async function handleSaveNewPersonil() {
    if (!newPersonil.fullname || !newPersonil.job_title) {
      alert("Nama lengkap dan jabatan wajib diisi!");
      return;
    }
    await createPersonil(newPersonil);
    isNewPersonilModal = false;
    showToast(`Personil "${newPersonil.fullname}" berhasil ditambahkan!`);
  }

  async function handleUpdatePersonil() {
    if (!editingPersonil) return;
    await updatePersonil(editingPersonil.id, editingPersonil);
    editingPersonil = null;
    showToast("Data personil berhasil diperbarui!");
  }

  async function handleDeletePersonil(id: number, fullname: string) {
    if (confirm(`Hapus personil "${fullname}"?`)) {
      await deletePersonil(id);
      showToast(`Personil "${fullname}" berhasil dihapus.`);
    }
  }
</script>

<svelte:head>
  <title>CMS Studio Admin &bull; Namia Syariah Dynamic Platform</title>
  <!-- Strict Anti-Crawler Meta Tags: Google & Bing Disallowed -->
  <meta
    name="robots"
    content="noindex, nofollow, noarchive, nosnippet, noimageindex"
  />
  <meta
    name="googlebot"
    content="noindex, nofollow, noarchive, nosnippet, noimageindex"
  />
</svelte:head>

<div
  class="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased overflow-x-hidden"
>
  <!-- SIDEBAR: Desktop fixed / sticky, mobile offcanvas -->
  <aside
    class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 z-40 fixed inset-y-0 left-0 transition-transform duration-200 md:static md:translate-x-0 {isMobileSidebarOpen
      ? 'translate-x-0 shadow-2xl'
      : '-translate-x-full'}"
  >
    <!-- Sidebar Header / Logo -->
    <div
      class="h-16 px-5 flex items-center justify-between border-b border-slate-800 bg-slate-950/60"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-950/50"
        >
          ⚡
        </div>
        <div>
          <div class="flex items-center gap-1.5">
            <span
              class="font-bold text-sm tracking-wide text-white font-['Raleway']"
              >NAMIA CMS</span
            >
            <span
              class="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-emerald-950 text-emerald-300 border border-emerald-800"
            >
              Studio
            </span>
          </div>
          <span class="text-[10px] text-slate-400">Headless API v1.2</span>
        </div>
      </div>
      <button
        type="button"
        onclick={() => (isMobileSidebarOpen = false)}
        class="md:hidden p-1 text-slate-400 hover:text-white cursor-pointer"
        aria-label="Tutup Menu"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation Groups -->
    <nav class="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
      <!-- Group: UTAMA -->
      <div>
        <div
          class="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400"
        >
          Utama
        </div>
        <div class="space-y-1">
          <button
            type="button"
            onclick={() => {
              activeTab = "overview";
              isMobileSidebarOpen = false;
            }}
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-[3px] text-xs font-semibold transition-all cursor-pointer {activeTab ===
            'overview'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'}"
          >
            <div class="flex items-center gap-2.5">
              <LayoutDashboard class="w-4 h-4" />
              <span>Dashboard Overview</span>
            </div>
            <span
              class="px-1.5 py-0.5 text-[9px] font-bold rounded {activeTab ===
              'overview'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-800 text-slate-400'}">Live</span
            >
          </button>
        </div>
      </div>

      <!-- Group: BRANDING & KONTEN DEPAN -->
      <div>
        <div
          class="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400"
        >
          Branding &amp; Tampilan
        </div>
        <div class="space-y-1">
          <button
            type="button"
            onclick={() => {
              activeTab = "branding";
              isMobileSidebarOpen = false;
            }}
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-[3px] text-xs font-semibold transition-all cursor-pointer {activeTab ===
            'branding'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'}"
          >
            <div class="flex items-center gap-2.5">
              <Building2 class="w-4 h-4" />
              <span>Identitas &amp; Legalitas</span>
            </div>
          </button>

          <button
            type="button"
            onclick={() => {
              activeTab = "hero";
              isMobileSidebarOpen = false;
            }}
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-[3px] text-xs font-semibold transition-all cursor-pointer {activeTab ===
            'hero'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'}"
          >
            <div class="flex items-center gap-2.5">
              <Sparkles class="w-4 h-4" />
              <span>Hero &amp; Ticker Berjalan</span>
            </div>
          </button>

          <button
            type="button"
            onclick={() => {
              activeTab = "investor";
              isMobileSidebarOpen = false;
            }}
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-[3px] text-xs font-semibold transition-all cursor-pointer {activeTab ===
            'investor'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'}"
          >
            <div class="flex items-center gap-2.5">
              <TrendingUp class="w-4 h-4" />
              <span>Portal Investor &amp; Lender</span>
            </div>
            <span
              class="px-1.5 py-0.5 text-[9px] font-bold rounded {activeTab ===
              'investor'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-800 text-slate-400'}">PORTAL</span
            >
          </button>
        </div>
      </div>

      <!-- Group: PRODUK & FINANSIAL -->
      <div>
        <div
          class="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400"
        >
          Katalog &amp; Transparansi
        </div>
        <div class="space-y-1">
          <button
            type="button"
            onclick={() => {
              activeTab = "products";
              isMobileSidebarOpen = false;
            }}
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-[3px] text-xs font-semibold transition-all cursor-pointer {activeTab ===
            'products'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'}"
          >
            <div class="flex items-center gap-2.5">
              <Package class="w-4 h-4" />
              <span>Produk Pembiayaan</span>
            </div>
            <span
              class="px-1.5 py-0.5 text-[10px] font-bold rounded {activeTab ===
              'products'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-800 text-slate-400'}"
              >{$cmsStore.products?.length || 0}</span
            >
          </button>

          <button
            type="button"
            onclick={() => {
              activeTab = "stats";
              isMobileSidebarOpen = false;
            }}
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-[3px] text-xs font-semibold transition-all cursor-pointer {activeTab ===
            'stats'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'}"
          >
            <div class="flex items-center gap-2.5">
              <BarChart3 class="w-4 h-4" />
              <span>Metrik &amp; TKB90</span>
            </div>
            <span
              class="px-1.5 py-0.5 text-[10px] font-bold rounded {activeTab ===
              'stats'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-800 text-slate-400'}"
              >{$cmsStore.stats?.length || 0}</span
            >
          </button>
        </div>
      </div>

      <!-- Group: INFORMASI & PUBLIKASI -->
      <div>
        <div
          class="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400"
        >
          Publikasi &amp; Stakeholder
        </div>
        <div class="space-y-1">
          <button
            type="button"
            onclick={() => {
              activeTab = "articles";
              isMobileSidebarOpen = false;
            }}
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-[3px] text-xs font-semibold transition-all cursor-pointer {activeTab ===
            'articles'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'}"
          >
            <div class="flex items-center gap-2.5">
              <BookOpen class="w-4 h-4" />
              <span>Artikel &amp; Blog</span>
            </div>
            <span
              class="px-1.5 py-0.5 text-[10px] font-bold rounded {activeTab ===
              'articles'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-800 text-slate-400'}"
              >{$cmsStore.blogPosts?.length || 0}</span
            >
          </button>

          <button
            type="button"
            onclick={() => {
              activeTab = "team";
              isMobileSidebarOpen = false;
            }}
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-[3px] text-xs font-semibold transition-all cursor-pointer {activeTab ===
            'team'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'}"
          >
            <div class="flex items-center gap-2.5">
              <Users class="w-4 h-4" />
              <span>Dewan &amp; Tim</span>
            </div>
            <span
              class="px-1.5 py-0.5 text-[10px] font-bold rounded {activeTab ===
              'team'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-800 text-slate-400'}"
              >{$cmsStore.team?.length || 0}</span
            >
          </button>

          <button
            type="button"
            onclick={() => {
              activeTab = "faqs";
              isMobileSidebarOpen = false;
            }}
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-[3px] text-xs font-semibold transition-all cursor-pointer {activeTab ===
            'faqs'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'}"
          >
            <div class="flex items-center gap-2.5">
              <HelpCircle class="w-4 h-4" />
              <span>FAQ Muamalah</span>
            </div>
            <span
              class="px-1.5 py-0.5 text-[10px] font-bold rounded {activeTab ===
              'faqs'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-800 text-slate-400'}"
              >{$cmsStore.faqs?.length || 0}</span
            >
          </button>

          <button
            type="button"
            onclick={() => {
              activeTab = "testimonials";
              isMobileSidebarOpen = false;
            }}
            class="w-full flex items-center justify-between px-3 py-2.5 rounded-[3px] text-xs font-semibold transition-all cursor-pointer {activeTab ===
            'testimonials'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'}"
          >
            <div class="flex items-center gap-2.5">
              <MessageSquare class="w-4 h-4" />
              <span>Testimoni Mitra</span>
            </div>
            <span
              class="px-1.5 py-0.5 text-[10px] font-bold rounded {activeTab ===
              'testimonials'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-800 text-slate-400'}"
              >{$cmsStore.testimonials?.length || 0}</span
            >
          </button>
        </div>
      </div>
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2.5">
      <div
        class="flex items-center gap-2.5 p-2 rounded-[3px] bg-slate-800/60 border border-slate-800"
      >
        <div
          class="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-xs font-bold text-emerald-200 shrink-0"
        >
          NS
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-xs font-bold text-white truncate">Admin Namia</div>
          <div class="text-[10px] text-slate-400 truncate">
            Super Administrator
          </div>
        </div>
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          onclick={handleResetDefaults}
          class="flex-1 px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-200 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
          title="Reset semua ke default Namia Syariah"
        >
          <RotateCcw class="w-3 h-3" />
          <span>Reset</span>
        </button>
        <a
          href="/"
          target="_blank"
          class="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
          title="Buka web publik"
        >
          <span>Web Publik</span>
          <ExternalLink class="w-3 h-3" />
        </a>
      </div>
    </div>
  </aside>

  <!-- BACKDROP FOR MOBILE SIDEBAR -->
  {#if isMobileSidebarOpen}
    <div
      role="button"
      tabindex="0"
      onclick={() => (isMobileSidebarOpen = false)}
      onkeydown={(e) => e.key === "Escape" && (isMobileSidebarOpen = false)}
      class="fixed inset-0 z-30 bg-black/60 md:hidden"
    ></div>
  {/if}

  <!-- RIGHT MAIN CONTENT AREA -->
  <div
    class="flex-1 flex flex-col min-w-0 bg-slate-950 text-slate-100 min-h-screen"
  >
    <!-- TOP APP BAR -->
    <header
      class="h-16 px-4 sm:px-8 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <button
          type="button"
          onclick={() => (isMobileSidebarOpen = true)}
          class="md:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          aria-label="Buka Menu Navigasi"
        >
          <Menu class="w-5 h-5" />
        </button>

        <!-- Breadcrumbs -->
        <div class="flex items-center gap-2 text-xs">
          <span class="text-slate-400 font-medium">Dashboard</span>
          <ChevronRight class="w-3.5 h-3.5 text-slate-600" />
          <span class="text-white font-bold capitalize">
            {activeTab === "overview"
              ? "Overview & Analytics"
              : activeTab === "branding"
                ? "Identitas Brand"
                : activeTab === "hero"
                  ? "Hero & Ticker"
                  : activeTab === "investor"
                    ? "Portal Pendanaan Investor"
                    : activeTab === "products"
                      ? "Produk Pembiayaan"
                      : activeTab === "stats"
                        ? "Metrik Finansial"
                        : activeTab === "articles"
                          ? "Artikel Blog"
                          : activeTab === "team"
                            ? "Dewan & Manajemen"
                            : activeTab === "faqs"
                              ? "Pusat FAQ"
                              : "Testimoni Mitra"}
          </span>
        </div>
      </div>

      <!-- Top Action Controls -->
      <div class="flex items-center gap-3">
        <!-- Live status -->
        <div
          class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-slate-800 border border-slate-700 text-xs"
        >
          <span
            class="w-2 h-2 rounded-full {$cmsStore.isSyncing
              ? 'bg-amber-400'
              : 'bg-emerald-400'}"
          ></span>
          <span class="text-slate-300 text-[11px] font-medium">
            {$cmsStore.isSyncing ? "Menyinkronkan..." : "API Real-time Aktif"}
          </span>
        </div>

        <button
          type="button"
          onclick={handleRefresh}
          class="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
          title="Segarkan data dari server"
        >
          <RefreshCw
            class="w-4 h-4 {$cmsStore.isSyncing ? 'animate-spin' : ''}"
          />
        </button>

        <a
          href="/"
          target="_blank"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
        >
          <span>Live Web</span>
          <ExternalLink class="w-3.5 h-3.5" />
        </a>
      </div>
    </header>

    <!-- INNER PAGE CONTENT -->
    <main class="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
      <!-- TOAST FEEDBACK -->
      {#if toast}
        <div
          class="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-xl border text-sm font-medium animate-in slide-in-from-bottom-5 {toast.type ===
          'success'
            ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
            : toast.type === 'error'
              ? 'bg-rose-900 text-rose-100 border-rose-700'
              : 'bg-slate-900 text-slate-100 border-slate-700'}"
        >
          {#if toast.type === "success"}
            <CheckCircle2 class="w-5 h-5 text-emerald-400 shrink-0" />
          {:else if toast.type === "error"}
            <AlertCircle class="w-5 h-5 text-rose-400 shrink-0" />
          {:else}
            <Sparkles class="w-5 h-5 text-amber-400 shrink-0" />
          {/if}
          <span>{toast.message}</span>
        </div>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 0: DASHBOARD OVERVIEW -->
      <!-- ========================================================= -->
      {#if activeTab === "overview"}
        <div class="space-y-6">
          <!-- Hero Banner Header -->
          <div
            class="relative overflow-hidden rounded-[3px] bg-[#0f172a] border border-slate-700 p-6 sm:p-8 shadow-xl"
          >
            <div class="relative z-10 max-w-3xl space-y-2">
              <div
                class="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold"
              >
                <Sparkles class="w-3.5 h-3.5 text-emerald-400" />
                <span>Namia Syariah Dynamic Content Studio</span>
              </div>
              <h1
                class="text-2xl sm:text-3xl font-bold font-['Raleway'] text-white"
              >
                Dashboard Pusat Kendali Konten &amp; Headless API
              </h1>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Kelola identitas resmi, produk pembiayaan, transparansi
                keuangan, artikel syariah, dan dewan pengawas secara terpusat
                dan dinamis. Setiap perubahan tersimpan otomatis di database
                persisten.
              </p>
            </div>

            <div class="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onclick={() => (isNewProductModal = true)}
                class="px-4 py-2 rounded-[3px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Plus class="w-4 h-4" />
                <span>Tambah Produk Pembiayaan</span>
              </button>

              <button
                type="button"
                onclick={() => (isNewArticleModal = true)}
                class="px-4 py-2 rounded-[3px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <BookOpen class="w-4 h-4 text-emerald-400" />
                <span>Tulis Artikel Baru</span>
              </button>

              <button
                type="button"
                onclick={() => (activeTab = "hero")}
                class="px-4 py-2 rounded-[3px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles class="w-4 h-4 text-amber-400" />
                <span>Ubah Hero &amp; Ticker</span>
              </button>

              <button
                type="button"
                onclick={() => (activeTab = "investor")}
                class="px-4 py-2 rounded-[3px] bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <TrendingUp class="w-4 h-4 text-emerald-400" />
                <span>Portal Investor &amp; Lender</span>
              </button>
            </div>
          </div>

          <!-- 4 PRIMARY METRIC CARDS -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Card 1: TKB90 -->
            <div
              class="bg-slate-900 border border-slate-800 rounded-[3px] p-5 space-y-3 hover:border-emerald-500/50 transition-all"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-400"
                  >Tingkat Keberhasilan Bayar</span
                >
                <div
                  class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center"
                >
                  <ShieldCheck class="w-4 h-4" />
                </div>
              </div>
              <div>
                <div
                  class="text-2xl font-extrabold text-white font-['Raleway']"
                >
                  {$cmsStore.stats?.find((s) => s.metricKey === "tkb90")
                    ?.value || "100%"}
                </div>
                <div class="text-[11px] text-emerald-400 font-medium">
                  TKB90 Terjaga Sangat Baik
                </div>
              </div>
              <div
                class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]"
              >
                <span class="text-slate-400">Metrik Utama OJK</span>
                <button
                  type="button"
                  onclick={() => (activeTab = "stats")}
                  class="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  Kelola <ChevronRight class="w-3 h-3" />
                </button>
              </div>
            </div>

            <!-- Card 2: Produk Pembiayaan -->
            <div
              class="bg-slate-900 border border-slate-800 rounded-[3px] p-5 space-y-3 hover:border-emerald-500/50 transition-all"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-400"
                  >Produk Pembiayaan</span
                >
                <div
                  class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center"
                >
                  <Package class="w-4 h-4" />
                </div>
              </div>
              <div>
                <div
                  class="text-2xl font-extrabold text-white font-['Raleway']"
                >
                  {$cmsStore.products?.length || 0} Produk
                </div>
                <div class="text-[11px] text-slate-400 font-medium">
                  Murabahah, Musyarakah, Ijarah
                </div>
              </div>
              <div
                class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]"
              >
                <span class="text-slate-400">Katalog Publik Aktif</span>
                <button
                  type="button"
                  onclick={() => (activeTab = "products")}
                  class="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  Lihat <ChevronRight class="w-3 h-3" />
                </button>
              </div>
            </div>

            <!-- Card 3: Artikel & Blog -->
            <div
              class="bg-slate-900 border border-slate-800 rounded-[3px] p-5 space-y-3 hover:border-emerald-500/50 transition-all"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-400"
                  >Artikel &amp; Edukasi Fiqih</span
                >
                <div
                  class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center"
                >
                  <BookOpen class="w-4 h-4" />
                </div>
              </div>
              <div>
                <div
                  class="text-2xl font-extrabold text-white font-['Raleway']"
                >
                  {$cmsStore.blogPosts?.length || 0} Artikel
                </div>
                <div class="text-[11px] text-slate-400 font-medium">
                  Literasi Keuangan Syariah
                </div>
              </div>
              <div
                class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]"
              >
                <span class="text-slate-400">Terbit di Weblog</span>
                <button
                  type="button"
                  onclick={() => (activeTab = "articles")}
                  class="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  Kelola <ChevronRight class="w-3 h-3" />
                </button>
              </div>
            </div>

            <!-- Card 4: Dewan & Tim -->
            <div
              class="bg-slate-900 border border-slate-800 rounded-[3px] p-5 space-y-3 hover:border-emerald-500/50 transition-all"
            >
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-400"
                  >Dewan Pengawas &amp; Tim</span
                >
                <div
                  class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center"
                >
                  <Users class="w-4 h-4" />
                </div>
              </div>
              <div>
                <div
                  class="text-2xl font-extrabold text-white font-['Raleway']"
                >
                  {$cmsStore.team?.length || 0} Personil
                </div>
                <div class="text-[11px] text-slate-400 font-medium">
                  DPS DSN-MUI, Direksi, Tim
                </div>
              </div>
              <div
                class="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]"
              >
                <span class="text-slate-400">Struktur Organisasi</span>
                <button
                  type="button"
                  onclick={() => (activeTab = "team")}
                  class="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  Lihat <ChevronRight class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <!-- TWO COLUMN LIVE PREVIEW & SYSTEM DIAGNOSTICS -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- 2 Cols: Live Hero Preview -->
            <div
              class="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[3px] p-6 space-y-4"
            >
              <div
                class="flex items-center justify-between border-b border-slate-800 pb-3"
              >
                <div class="flex items-center gap-2">
                  <Sparkles class="w-4 h-4 text-emerald-400" />
                  <h3 class="text-sm font-bold text-white font-['Raleway']">
                    Pratinjau Hero Banner Publik Saat Ini
                  </h3>
                </div>
                <button
                  type="button"
                  onclick={() => (activeTab = "hero")}
                  class="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  Edit Teks Hero
                </button>
              </div>

              <div
                class="p-6 rounded-[3px] bg-slate-950 border border-slate-800/80 space-y-3"
              >
                <div
                  class="inline-block px-2.5 py-0.5 rounded-[3px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold uppercase tracking-wider"
                >
                  {$cmsStore.heroContent?.badgeText ||
                    "Platform P2P Financing Syariah Terpercaya"}
                </div>
                <h4 class="text-xl font-bold text-white font-['Raleway']">
                  {$cmsStore.heroContent?.title || "Smart Growth, Halal Impact"}
                </h4>
                <p class="text-xs text-slate-300 leading-relaxed">
                  {$cmsStore.heroContent?.subtitle ||
                    "Akselerasi pendanaan produktif dan investasi syariah berbasis Fiqih Muamalah."}
                </p>

                {#if $cmsStore.heroContent?.tickerText}
                  <div
                    class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-amber-300 flex items-center gap-2"
                  >
                    <span class="w-2 h-2 rounded-full bg-amber-400 shrink-0"
                    ></span>
                    <span class="truncate"
                      ><strong>Pengumuman:</strong>
                      {$cmsStore.heroContent.tickerText}</span
                    >
                  </div>
                {/if}

                <div class="pt-2 flex items-center gap-3">
                  <span
                    class="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                  >
                    {$cmsStore.heroContent?.primaryCtaText ||
                      "Mulai Danai (Investor)"}
                  </span>
                  <span
                    class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    {$cmsStore.heroContent?.secondaryCtaText ||
                      "Ajukan Pembiayaan"}
                  </span>
                </div>
              </div>
            </div>

            <!-- 1 Col: Architecture & Persistence Diagnostics -->
            <div
              class="bg-slate-900 border border-slate-800 rounded-[3px] p-6 space-y-4 flex flex-col justify-between"
            >
              <div class="space-y-3">
                <div
                  class="border-b border-slate-800 pb-3 flex items-center gap-2"
                >
                  <Database class="w-4 h-4 text-emerald-400" />
                  <h3 class="text-sm font-bold text-white font-['Raleway']">
                    Status Arsitektur API
                  </h3>
                </div>

                <div class="space-y-2.5 text-xs">
                  <div
                    class="flex justify-between py-1 border-b border-slate-800/60"
                  >
                    <span class="text-slate-400">Backend Server</span>
                    <span class="font-semibold text-emerald-400"
                      >Bun + ElysiaJS 1.2</span
                    >
                  </div>
                  <div
                    class="flex justify-between py-1 border-b border-slate-800/60"
                  >
                    <span class="text-slate-400">Persistence File</span>
                    <span class="font-mono text-[11px] text-slate-300"
                      >cms_state.json</span
                    >
                  </div>
                  <div
                    class="flex justify-between py-1 border-b border-slate-800/60"
                  >
                    <span class="text-slate-400">Security Guard</span>
                    <span class="text-emerald-400 font-semibold"
                      >Rate Limit &amp; API Key</span
                    >
                  </div>
                  <div
                    class="flex justify-between py-1 border-b border-slate-800/60"
                  >
                    <span class="text-slate-400">Terakhir Disinkronkan</span>
                    <span class="text-slate-300 font-medium"
                      >{$cmsStore.lastSynced || "Baru saja"}</span
                    >
                  </div>
                  <div class="flex justify-between py-1">
                    <span class="text-slate-400">Total Modul Aktif</span>
                    <span class="text-white font-bold">8 Modul Headless</span>
                  </div>
                </div>
              </div>

              <div
                class="p-3 rounded-[3px] bg-emerald-950/40 border border-emerald-800/50 text-[11px] text-emerald-300 flex items-center gap-2"
              >
                <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Frontend terikat reaktif dengan offline resilience.</span>
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 1: IDENTITAS & LEGALITAS -->
      <!-- ========================================================= -->
      {#if activeTab === "branding"}
        <div class="space-y-6">
          <div
            class="p-5 bg-slate-900 rounded-[3px] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h2 class="text-lg font-bold font-['Raleway'] text-white">
                Identitas Brand &amp; Legalitas Platform
              </h2>
              <p class="text-xs text-slate-400">
                Kelola nama entitas hukum, tagline resmi, kontak kantor, alamat
                lengkap, dan kutipan hadits.
              </p>
            </div>
            <button
              type="button"
              onclick={handleSaveSettings}
              class="px-4 py-2.5 rounded-[3px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Save class="w-4 h-4" />
              <span>Simpan Perubahan Branding</span>
            </button>
          </div>

          <div
            class="bg-slate-900 rounded-[3px] border border-slate-800 p-6 space-y-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label
                  for="companyName"
                  class="block font-semibold text-slate-300 mb-1"
                  >Nama Brand Platform</label
                >
                <input
                  id="companyName"
                  type="text"
                  bind:value={settingsForm.companyName}
                  class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label
                  for="companyName"
                  class="block font-semibold text-slate-300 mb-1"
                  >Nama Entitas Badan Hukum</label
                >
                <input
                  id="companyName"
                  type="text"
                  bind:value={settingsForm.companyName}
                  class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div class="md:col-span-2">
                <label
                  for="tagline"
                  class="block font-semibold text-slate-300 mb-1"
                  >Tagline Resmi</label
                >
                <input
                  id="tagline"
                  type="text"
                  bind:value={settingsForm.tagline}
                  class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-[3px] text-emerald-400 font-bold outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label
                  for="phone"
                  class="block font-semibold text-slate-300 mb-1"
                  >Telepon Kantor</label
                >
                <input
                  id="phone"
                  type="text"
                  bind:value={settingsForm.phone}
                  class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label
                  for="email"
                  class="block font-semibold text-slate-300 mb-1"
                  >Email Resmi</label
                >
                <input
                  id="email"
                  type="email"
                  bind:value={settingsForm.email}
                  class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div class="md:col-span-2">
                <label
                  for="address"
                  class="block font-semibold text-slate-300 mb-1"
                  >Alamat Kantor Lengkap</label
                >
                <textarea
                  id="address"
                  rows="2"
                  bind:value={settingsForm.address}
                  class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div class="md:col-span-2 pt-2 border-t border-slate-800">
                <label
                  for="quote"
                  class="block font-semibold text-slate-300 mb-1"
                  >Kutipan Hadits Utama Beranda</label
                >
                <textarea
                  id="quote"
                  rows="2"
                  bind:value={settingsForm.quote}
                  class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500 italic"
                ></textarea>
                <div class="mt-2 flex items-center gap-2">
                  <span class="text-slate-400 text-xs">Sumber Kutipan:</span>
                  <input
                    type="text"
                    bind:value={settingsForm.quoteOrigin}
                    class="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 outline-none"
                    placeholder="HR. Ahmad & Thabrani"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 2: HERO & TICKER -->
      <!-- ========================================================= -->
      {#if activeTab === "hero"}
        <div class="space-y-6">
          <div
            class="p-5 bg-slate-900 rounded-[3px] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h2 class="text-lg font-bold font-['Raleway'] text-white">
                Hero Section, Ticker, &amp; Tombol CTA
              </h2>
              <p class="text-xs text-slate-400">
                Atur teks pembuka, headline utama, pengumuman berjalan, dan
                target tautan tombol call-to-action.
              </p>
            </div>
            <button
              type="button"
              onclick={handleSaveHero}
              class="px-4 py-2.5 rounded-[3px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Save class="w-4 h-4" />
              <span>Simpan Perubahan Hero</span>
            </button>
          </div>

          <div
            class="bg-slate-900 rounded-[3px] border border-slate-800 p-6 space-y-4"
          >
            <div class="space-y-4 text-xs">
              <div>
                <label
                  for="badgeText"
                  class="block font-semibold text-slate-300 mb-1"
                  >Teks Badge Atas</label
                >
                <input
                  id="badgeText"
                  type="text"
                  bind:value={heroForm.badgeText}
                  class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label
                  for="heroTitle"
                  class="block font-semibold text-slate-300 mb-1"
                  >Headline Judul Hero</label
                >
                <textarea
                  id="heroTitle"
                  rows="2"
                  bind:value={heroForm.title}
                  class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500 font-bold"
                ></textarea>
              </div>

              <div>
                <label
                  for="heroSubtitle"
                  class="block font-semibold text-slate-300 mb-1"
                  >Deskripsi Subtitle Hero</label
                >
                <textarea
                  id="heroSubtitle"
                  rows="3"
                  bind:value={heroForm.subtitle}
                  class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500 leading-relaxed"
                ></textarea>
              </div>

              <div>
                <label
                  for="tickerText"
                  class="block font-semibold text-slate-300 mb-1"
                  >Pengumuman Ticker Berjalan</label
                >
                <input
                  id="tickerText"
                  type="text"
                  bind:value={heroForm.tickerText}
                  placeholder="Contoh: Penyaluran batch 12 dibuka dengan estimasi imbal hasil 14.5% p.a."
                  class="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-[3px] text-amber-300 outline-none focus:border-emerald-500"
                />
              </div>

              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800"
              >
                <div
                  class="p-4 rounded-[3px] bg-slate-950 border border-slate-800/80 space-y-2"
                >
                  <label
                    for="cta1Text"
                    class="block font-semibold text-slate-300"
                    >Tombol Utama (CTA 1)</label
                  >
                  <input
                    id="cta1Text"
                    type="text"
                    bind:value={heroForm.primaryCtaText}
                    class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white outline-none text-xs"
                    placeholder="Mulai Danai (Investor)"
                  />
                  <input
                    type="text"
                    bind:value={heroForm.primaryCtaUrl}
                    class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 outline-none text-xs"
                    placeholder="/investor"
                  />
                </div>

                <div
                  class="p-4 rounded-[3px] bg-slate-950 border border-slate-800/80 space-y-2"
                >
                  <label
                    for="cta2Text"
                    class="block font-semibold text-slate-300"
                    >Tombol Kedua (CTA 2)</label
                  >
                  <input
                    id="cta2Text"
                    type="text"
                    bind:value={heroForm.secondaryCtaText}
                    class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white outline-none text-xs"
                    placeholder="Ajukan Pembiayaan"
                  />
                  <input
                    type="text"
                    bind:value={heroForm.secondaryCtaUrl}
                    class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 outline-none text-xs"
                    placeholder="/borrower"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB: PORTAL PENDANAAN INVESTOR -->
      <!-- ========================================================= -->
      {#if activeTab === "investor"}
        <div class="space-y-6">
          <!-- TOP BANNER -->
          <div
            class="p-5 bg-slate-900 rounded-[3px] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
          >
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-700 text-white uppercase tracking-wider">Portal Editor</span>
                <span class="text-xs text-slate-400 font-mono">/investor</span>
              </div>
              <h2 class="text-lg font-bold font-['Raleway'] text-white">
                Manajemen Konten Portal Investor &amp; Lender
              </h2>
              <p class="text-xs text-slate-400">
                Kelola headline hero, 4 indikator metrik, 5 pilar keunggulan, 5 alur pendanaan, 4 proteksi risiko, dan banner CTA secara dinamis.
              </p>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <a
                href="/investor"
                target="_blank"
                class="px-3 py-2 rounded-[3px] bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <span>Lihat Live</span>
                <ExternalLink class="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onclick={handleSaveInvestor}
                class="px-4 py-2 rounded-[3px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Save class="w-4 h-4" />
                <span>Simpan Perubahan Investor</span>
              </button>
            </div>
          </div>

          <!-- SECTION 1: HERO & 4 METRIK UTAMA -->
          <div class="bg-slate-900 border border-slate-800 rounded-[3px] p-5 space-y-4">
            <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-white uppercase tracking-wider">
                  1. Hero Masthead &amp; 4 Indikator Utama
                </h3>
                <p class="text-xs text-slate-400">
                  Teks headline utama, trust badge, deskripsi pengantar, dan kartu ringkasan metrik hero.
                </p>
              </div>
              <Sparkles class="w-4 h-4 text-emerald-400" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label for="invHeroBadge" class="block font-semibold text-slate-300 mb-1">
                  Badge Legalitas / OJK
                </label>
                <input
                  id="invHeroBadge"
                  type="text"
                  bind:value={investorForm.heroBadge}
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500"
                  placeholder="PLATFORM P2P FINANCING SYARIAH BERIZIN OJK"
                />
              </div>
              <div>
                <label for="invHeroBadgeContract" class="block font-semibold text-slate-300 mb-1">
                  Badge Akad Utama
                </label>
                <input
                  id="invHeroBadgeContract"
                  type="text"
                  bind:value={investorForm.heroBadgeContract}
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500"
                  placeholder="MUDHARABAH & MUSYARAKAH"
                />
              </div>

              <div>
                <label for="invHeroTitle" class="block font-semibold text-slate-300 mb-1">
                  Judul Baris 1
                </label>
                <input
                  id="invHeroTitle"
                  type="text"
                  bind:value={investorForm.heroTitle}
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500"
                  placeholder="Tumbuhkan Aset dengan"
                />
              </div>
              <div>
                <label for="invHeroHighlight" class="block font-semibold text-slate-300 mb-1">
                  Judul Baris 2 (Sorotan Hijau)
                </label>
                <input
                  id="invHeroHighlight"
                  type="text"
                  bind:value={investorForm.heroHighlight}
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[3px] text-emerald-400 font-bold outline-none focus:border-emerald-500"
                  placeholder="Imbal Hasil Halal & Berkah"
                />
              </div>

              <div class="sm:col-span-2">
                <label for="invHeroLead" class="block font-semibold text-slate-300 mb-1">
                  Deskripsi Pengantar (Lead Paragraph)
                </label>
                <textarea
                  id="invHeroLead"
                  rows="3"
                  bind:value={investorForm.heroLead}
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500"
                  placeholder="Salurkan pendanaan langsung ke proyek UMKM produktif..."
                ></textarea>
              </div>
            </div>

            <!-- 4 Indikator Metrik Ribbon -->
            <div class="pt-2 border-t border-slate-800/80">
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                4 Kartu Ringkasan Metrik (Ribbon)
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label for="invReturn" class="block text-slate-400 font-medium mb-1">
                    Est. Return / Thn
                  </label>
                  <input
                    id="invReturn"
                    type="text"
                    bind:value={investorForm.heroReturnRange}
                    class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-[3px] text-emerald-400 font-mono font-bold"
                    placeholder="12% - 18%"
                  />
                </div>
                <div>
                  <label for="invMin" class="block text-slate-400 font-medium mb-1">
                    Min. Pendanaan
                  </label>
                  <input
                    id="invMin"
                    type="text"
                    bind:value={investorForm.heroMinInvestment}
                    class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white font-bold"
                    placeholder="Rp 1.000.000"
                  />
                </div>
                <div>
                  <label for="invTkb" class="block text-slate-400 font-medium mb-1">
                    TKB90 Terverifikasi
                  </label>
                  <input
                    id="invTkb"
                    type="text"
                    bind:value={investorForm.heroTkb90}
                    class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-[3px] text-emerald-400 font-mono font-bold"
                    placeholder="98.4%"
                  />
                </div>
                <div>
                  <label for="invSharia" class="block text-slate-400 font-medium mb-1">
                    Fatwa DSN-MUI
                  </label>
                  <input
                    id="invSharia"
                    type="text"
                    bind:value={investorForm.heroShariaCompliance}
                    class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white font-bold"
                    placeholder="100% Sah"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 2: 5 PILAR KEUNGGULAN PENDANAAN -->
          <div class="bg-slate-900 border border-slate-800 rounded-[3px] p-5 space-y-4">
            <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-white uppercase tracking-wider">
                  2. 5 Pilar Keunggulan Pendanaan di Namia Syariah
                </h3>
                <p class="text-xs text-slate-400">
                  Kartu fitur keunggulan yang tampil pada bagian atas halaman investor.
                </p>
              </div>
              <Award class="w-4 h-4 text-emerald-400" />
            </div>

            <div class="space-y-3">
              {#each investorForm.pillars as pillar, pIdx}
                <div class="p-3.5 bg-slate-950 border border-slate-800 rounded-[3px] space-y-2.5 text-xs">
                  <div class="flex items-center justify-between text-slate-400 font-semibold">
                    <span class="text-emerald-400 font-bold">Pilar #{pIdx + 1}</span>
                    <span class="text-[11px] text-slate-500 font-mono">Index {pIdx}</span>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label for="pillarBadge_{pIdx}" class="block text-slate-400 mb-1">Badge Kategori</label>
                      <input
                        id="pillarBadge_{pIdx}"
                        type="text"
                        bind:value={pillar.badge}
                        class="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-[3px] text-white text-xs"
                      />
                    </div>
                    <div>
                      <label for="pillarTitle_{pIdx}" class="block text-slate-400 mb-1">Judul Pilar</label>
                      <input
                        id="pillarTitle_{pIdx}"
                        type="text"
                        bind:value={pillar.title}
                        class="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-[3px] text-white font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label for="pillarIcon_{pIdx}" class="block text-slate-400 mb-1">Path Icon</label>
                      <input
                        id="pillarIcon_{pIdx}"
                        type="text"
                        bind:value={pillar.icon}
                        class="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-[3px] text-slate-300 font-mono text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="pillarDesc_{pIdx}" class="block text-slate-400 mb-1">Deskripsi Pilar</label>
                    <textarea
                      id="pillarDesc_{pIdx}"
                      rows="2"
                      bind:value={pillar.desc}
                      class="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-[3px] text-slate-300 text-xs"
                    ></textarea>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- SECTION 3: 5 PRINSIP FUNDAMENTAL MUAMALAH -->
          <div class="bg-slate-900 border border-slate-800 rounded-[3px] p-5 space-y-4">
            <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-white uppercase tracking-wider">
                  3. 5 Prinsip Fundamental Namia Syariah
                </h3>
                <p class="text-xs text-slate-400">
                  Landasan nilai etis muamalah (Halal, Aman, Mudah, Cepat, Barakah).
                </p>
              </div>
              <ShieldCheck class="w-4 h-4 text-emerald-400" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {#each investorForm.coreValues as cv, cIdx}
                <div class="p-3 bg-slate-950 border border-slate-800 rounded-[3px] space-y-2 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-emerald-400 font-bold">Prinsip #{cIdx + 1}</span>
                  </div>
                  <div>
                    <label for="cvTitle_{cIdx}" class="block text-slate-400 text-[11px] mb-1">Nama Nilai</label>
                    <input
                      id="cvTitle_{cIdx}"
                      type="text"
                      bind:value={cv.title}
                      class="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-[3px] text-white font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label for="cvDesc_{cIdx}" class="block text-slate-400 text-[11px] mb-1">Penjelasan Singkat</label>
                    <textarea
                      id="cvDesc_{cIdx}"
                      rows="2"
                      bind:value={cv.desc}
                      class="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-[3px] text-slate-300 text-xs"
                    ></textarea>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- SECTION 4: 5 LANGKAH ALUR PENDANAAN -->
          <div class="bg-slate-900 border border-slate-800 rounded-[3px] p-5 space-y-4">
            <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-white uppercase tracking-wider">
                  4. 5 Langkah Alur Melakukan Pendanaan
                </h3>
                <p class="text-xs text-slate-400">
                  Instruksi langkah dari registrasi hingga penerimaan bagi hasil di akun.
                </p>
              </div>
              <Layers class="w-4 h-4 text-emerald-400" />
            </div>

            <div class="space-y-3">
              {#each investorForm.steps as st, sIdx}
                <div class="p-3.5 bg-slate-950 border border-slate-800 rounded-[3px] space-y-2.5 text-xs">
                  <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div class="sm:col-span-1">
                      <label for="stepNum_{sIdx}" class="block text-slate-400 mb-1">Nomor Langkah</label>
                      <input
                        id="stepNum_{sIdx}"
                        type="text"
                        bind:value={st.num}
                        class="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-[3px] text-emerald-400 font-mono font-bold text-xs"
                        placeholder="01"
                      />
                    </div>
                    <div class="sm:col-span-3">
                      <label for="stepTitle_{sIdx}" class="block text-slate-400 mb-1">Judul Langkah</label>
                      <input
                        id="stepTitle_{sIdx}"
                        type="text"
                        bind:value={st.title}
                        class="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-[3px] text-white font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label for="stepDesc_{sIdx}" class="block text-slate-400 mb-1">Uraian Prosedur</label>
                    <textarea
                      id="stepDesc_{sIdx}"
                      rows="2"
                      bind:value={st.desc}
                      class="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-[3px] text-slate-300 text-xs"
                    ></textarea>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- SECTION 5: 4 JAMINAN MITIGASI RISIKO -->
          <div class="bg-slate-900 border border-slate-800 rounded-[3px] p-5 space-y-4">
            <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-white uppercase tracking-wider">
                  5. 4 Lapisan Mitigasi Risiko &amp; Proteksi Modal
                </h3>
                <p class="text-xs text-slate-400">
                  Aspek kehati-hatian (prudence) dan mitigasi risiko untuk meyakinkan calon investor.
                </p>
              </div>
              <ShieldCheck class="w-4 h-4 text-emerald-400" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {#each investorForm.safetyMeasures as sm, smIdx}
                <div class="p-3.5 bg-slate-950 border border-slate-800 rounded-[3px] space-y-2 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-emerald-400 font-bold">Proteksi #{smIdx + 1}</span>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label for="smBadge_{smIdx}" class="block text-slate-400 text-[11px] mb-1">Badge Proteksi</label>
                      <input
                        id="smBadge_{smIdx}"
                        type="text"
                        bind:value={sm.badge}
                        class="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-[3px] text-white text-xs"
                      />
                    </div>
                    <div>
                      <label for="smTitle_{smIdx}" class="block text-slate-400 text-[11px] mb-1">Judul Mitigasi</label>
                      <input
                        id="smTitle_{smIdx}"
                        type="text"
                        bind:value={sm.title}
                        class="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-[3px] text-white font-bold text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <label for="smDesc_{smIdx}" class="block text-slate-400 text-[11px] mb-1">Uraian Jaminan</label>
                    <textarea
                      id="smDesc_{smIdx}"
                      rows="2"
                      bind:value={sm.desc}
                      class="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-[3px] text-slate-300 text-xs"
                    ></textarea>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- SECTION 6: PROYEK PILIHAN HARI INI (FEATURED DEAL) -->
          {#if investorForm.featuredDeal}
            <div class="bg-slate-900 border border-slate-800 rounded-[3px] p-5 space-y-4">
              <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-bold text-white uppercase tracking-wider">
                    6. Proyek Pilihan Hari Ini (Featured Deal Hero)
                  </h3>
                  <p class="text-xs text-slate-400">
                    Kartu crowdfunding proyek unggulan yang tampil di samping headline hero.
                  </p>
                </div>
                <Flame class="w-4 h-4 text-amber-400" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div class="sm:col-span-2">
                  <label for="fdTitle" class="block text-slate-400 mb-1">Judul Proyek</label>
                  <input
                    id="fdTitle"
                    type="text"
                    bind:value={investorForm.featuredDeal.title}
                    class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white font-bold text-xs"
                  />
                </div>
                <div>
                  <label for="fdBorrower" class="block text-slate-400 mb-1">Nama Calon Mitra</label>
                  <input
                    id="fdBorrower"
                    type="text"
                    bind:value={investorForm.featuredDeal.borrower}
                    class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white text-xs"
                  />
                </div>
                <div>
                  <label for="fdTarget" class="block text-slate-400 mb-1">Target Plafon</label>
                  <input
                    id="fdTarget"
                    type="text"
                    bind:value={investorForm.featuredDeal.targetAmount}
                    class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label for="fdPercent" class="block text-slate-400 mb-1">Persen Terkumpul (%)</label>
                  <input
                    id="fdPercent"
                    type="number"
                    bind:value={investorForm.featuredDeal.fundedPercent}
                    class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-[3px] text-emerald-400 font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label for="fdYield" class="block text-slate-400 mb-1">Est. Imbal Hasil (p.a.)</label>
                  <input
                    id="fdYield"
                    type="text"
                    bind:value={investorForm.featuredDeal.yieldRate}
                    class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-[3px] text-emerald-400 font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label for="fdTenor" class="block text-slate-400 mb-1">Tenor Proyek</label>
                  <input
                    id="fdTenor"
                    type="text"
                    bind:value={investorForm.featuredDeal.tenor}
                    class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white text-xs"
                  />
                </div>
                <div>
                  <label for="fdContract" class="block text-slate-400 mb-1">Akad Fiqih</label>
                  <input
                    id="fdContract"
                    type="text"
                    bind:value={investorForm.featuredDeal.contract}
                    class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-[3px] text-white text-xs"
                  />
                </div>
                <div>
                  <label for="fdTime" class="block text-slate-400 mb-1">Sisa Waktu</label>
                  <input
                    id="fdTime"
                    type="text"
                    bind:value={investorForm.featuredDeal.timeLeft}
                    class="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-[3px] text-amber-400 text-xs"
                  />
                </div>
              </div>
            </div>
          {/if}

          <!-- SECTION 7: MATRIKS KOMPARASI BENCHMARK -->
          {#if investorForm.benchmarkRows}
            <div class="bg-slate-900 border border-slate-800 rounded-[3px] p-5 space-y-4">
              <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-bold text-white uppercase tracking-wider">
                    7. Matriks Komparasi Imbal Hasil vs Pasar
                  </h3>
                  <p class="text-xs text-slate-400">
                    Tabel perbandingan keuntungan, pajak, dan risiko terhadap alternatif instrumen lain.
                  </p>
                </div>
                <Percent class="w-4 h-4 text-emerald-400" />
              </div>

              <div class="space-y-3">
                {#each investorForm.benchmarkRows as row, rIdx}
                  <div class="p-3 bg-slate-950 border border-slate-800 rounded-[3px] space-y-2 text-xs">
                    <div class="flex items-center justify-between font-bold {row.isHighlighted ? 'text-emerald-400' : 'text-slate-300'}">
                      <span>Baris #{rIdx + 1}: {row.instrument}</span>
                      {#if row.isHighlighted}
                        <span class="badge badge-success text-[9px]">SOROTAN UTAMA</span>
                      {/if}
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      <div>
                        <label for="bmInst_{rIdx}" class="block text-slate-400 text-[10px] mb-1">Nama Instrumen</label>
                        <input
                          id="bmInst_{rIdx}"
                          type="text"
                          bind:value={row.instrument}
                          class="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-[3px] text-white text-xs"
                        />
                      </div>
                      <div>
                        <label for="bmYield_{rIdx}" class="block text-slate-400 text-[10px] mb-1">Est. Yield (p.a.)</label>
                        <input
                          id="bmYield_{rIdx}"
                          type="text"
                          bind:value={row.yieldRange}
                          class="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-[3px] text-emerald-400 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label for="bmTax_{rIdx}" class="block text-slate-400 text-[10px] mb-1">Tarif Pajak</label>
                        <input
                          id="bmTax_{rIdx}"
                          type="text"
                          bind:value={row.taxRate}
                          class="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-[3px] text-white text-xs"
                        />
                      </div>
                      <div>
                        <label for="bmStatus_{rIdx}" class="block text-slate-400 text-[10px] mb-1">Status Syariah</label>
                        <input
                          id="bmStatus_{rIdx}"
                          type="text"
                          bind:value={row.shariaStatus}
                          class="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-[3px] text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <!-- SECTION 8: TINGKATAN AKUN PENDANA (LENDER TIERS) -->
          {#if investorForm.lenderTiers}
            <div class="bg-slate-900 border border-slate-800 rounded-[3px] p-5 space-y-4">
              <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-bold text-white uppercase tracking-wider">
                    8. Tingkatan Akun Pendana (Lender Membership Tiers)
                  </h3>
                  <p class="text-xs text-slate-400">
                    Paket tiering Retail, Prioritas, dan Institusi beserta batas minimal komitmen.
                  </p>
                </div>
                <Users class="w-4 h-4 text-emerald-400" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {#each investorForm.lenderTiers as tier, tIdx}
                  <div class="p-3.5 bg-slate-950 border border-slate-800 rounded-[3px] space-y-2 text-xs">
                    <div class="flex items-center justify-between">
                      <span class="text-emerald-400 font-bold">{tier.level}</span>
                      <span class="badge badge-inverse text-[9px]">{tier.badge}</span>
                    </div>
                    <div>
                      <label for="tierName_{tIdx}" class="block text-slate-400 text-[10px] mb-1">Nama Membership</label>
                      <input
                        id="tierName_{tIdx}"
                        type="text"
                        bind:value={tier.name}
                        class="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-[3px] text-white font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label for="tierMin_{tIdx}" class="block text-slate-400 text-[10px] mb-1">Minimal Alokasi</label>
                      <input
                        id="tierMin_{tIdx}"
                        type="text"
                        bind:value={tier.minCommitment}
                        class="w-full px-2 py-1 bg-slate-900 border border-slate-800 rounded-[3px] text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <!-- SECTION 9: CTA BANNER BAWAH -->
          <div class="bg-slate-900 border border-slate-800 rounded-[3px] p-5 space-y-4">
            <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-white uppercase tracking-wider">
                  9. Banner Ajakan Bertindak (CTA Bawah)
                </h3>
                <p class="text-xs text-slate-400">
                  Banner konversi di kaki halaman investor untuk mendorong pendaftaran.
                </p>
              </div>
              <ArrowRight class="w-4 h-4 text-emerald-400" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label for="invCtaTitle" class="block font-semibold text-slate-300 mb-1">
                  Judul Banner CTA
                </label>
                <input
                  id="invCtaTitle"
                  type="text"
                  bind:value={investorForm.ctaTitle}
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500"
                  placeholder="Siap Memulai Pendanaan Syariah?"
                />
              </div>
              <div>
                <label for="invCtaSubtitle" class="block font-semibold text-slate-300 mb-1">
                  Subjudul Banner CTA
                </label>
                <input
                  id="invCtaSubtitle"
                  type="text"
                  bind:value={investorForm.ctaSubtitle}
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500"
                  placeholder="Buka akun Anda dalam 3 menit..."
                />
              </div>

              <div>
                <label for="invCtaBtnText" class="block font-semibold text-slate-300 mb-1">
                  Teks Tombol Aksi
                </label>
                <input
                  id="invCtaBtnText"
                  type="text"
                  bind:value={investorForm.ctaButtonText}
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[3px] text-white outline-none focus:border-emerald-500"
                  placeholder="Katalog Proyek Aktif"
                />
              </div>
              <div>
                <label for="invCtaBtnUrl" class="block font-semibold text-slate-300 mb-1">
                  URL Tujuan Tombol
                </label>
                <input
                  id="invCtaBtnUrl"
                  type="text"
                  bind:value={investorForm.ctaButtonUrl}
                  class="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-[3px] text-slate-300 font-mono outline-none focus:border-emerald-500"
                  placeholder="/aggregator"
                />
              </div>
            </div>
          </div>

          <!-- BOTTOM SAVE BAR -->
          <div class="p-4 bg-slate-900 border border-slate-800 rounded-[3px] flex items-center justify-between shadow-sm">
            <div class="text-xs text-slate-400">
              Pastikan seluruh perubahan telah ditinjau sebelum menekan tombol simpan.
            </div>
            <button
              type="button"
              onclick={handleSaveInvestor}
              class="px-5 py-2.5 rounded-[3px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save class="w-4 h-4" />
              <span>Simpan Perubahan Konten Investor</span>
            </button>
          </div>
        </div>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 3: METRIK & STATISTIK -->
      <!-- ========================================================= -->
      {#if activeTab === "stats"}
        <div class="space-y-6">
          <div
            class="p-5 bg-slate-900 rounded-[3px] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h2 class="text-lg font-bold font-['Raleway'] text-white">
                Metrik Transparansi &amp; Statistik Publik
              </h2>
              <p class="text-xs text-slate-400">
                Angka TKB90, akumulasi penyaluran, total penerima pembiayaan,
                dan jumlah pendana.
              </p>
            </div>
            <button
              type="button"
              onclick={() => (isNewStatModal = true)}
              class="px-4 py-2.5 rounded-[3px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus class="w-4 h-4" />
              <span>Tambah Metrik Baru</span>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {#each $cmsStore.stats as st}
              <div
                class="bg-slate-900 rounded-[3px] border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/60 transition-all"
              >
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span
                      class="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800"
                    >
                      {st.metricKey}
                    </span>
                    <div class="flex items-center gap-1">
                      <button
                        type="button"
                        onclick={() => (editingStat = { ...st })}
                        class="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 class="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onclick={() => handleDeleteStat(st.id)}
                        class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 class="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div
                    class="text-2xl font-extrabold font-['Raleway'] text-white"
                  >
                    {st.value}
                  </div>
                  <div class="text-xs font-semibold text-slate-200">
                    {st.label}
                  </div>
                  <div class="text-[11px] text-slate-400">
                    {st.sublabel}
                  </div>
                </div>

                <div
                  class="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between"
                >
                  <span>Kategori: {st.category}</span>
                  <span>Urutan #{st.order}</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 4: PRODUK PEMBIAYAAN -->
      <!-- ========================================================= -->
      {#if activeTab === "products"}
        <div class="space-y-6">
          <div
            class="p-5 bg-slate-900 rounded-[3px] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h2 class="text-lg font-bold font-['Raleway'] text-white">
                Katalog Produk Pembiayaan Syariah
              </h2>
              <p class="text-xs text-slate-400">
                Kelola skema akad Murabahah, Musyarakah, Ijarah, dan Qardh yang
                tampil pada carousel beranda.
              </p>
            </div>
            <button
              type="button"
              onclick={() => (isNewProductModal = true)}
              class="px-4 py-2.5 rounded-[3px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus class="w-4 h-4" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          <!-- Contract Filter Pills -->
          <div class="flex flex-wrap items-center gap-2">
            {#each ["all", "Murabahah", "Musyarakah", "Ijarah", "Qardh", "Mudharabah"] as cType}
              <button
                type="button"
                onclick={() => (selectedProductContract = cType)}
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer {selectedProductContract.toLowerCase() ===
                cType.toLowerCase()
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}"
              >
                {cType === "all" ? "Semua Akad" : `Akad ${cType}`}
              </button>
            {/each}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredProducts as prod}
              <div
                class="bg-slate-900 rounded-[3px] border border-slate-800 overflow-hidden hover:border-emerald-500/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div class="relative h-44 overflow-hidden bg-slate-950">
                    <img
                      src={prod.logo || "/images/products/namia_murabahah_goods.jpg"}
                      alt={prod.name}
                      class="w-full h-full object-cover"
                    />
                    <div class="absolute top-2.5 right-2.5">
                      <span
                        class="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 bg-slate-950/90 rounded-md border border-emerald-800/80"
                      >
                        Akad {prod.contractType}
                      </span>
                    </div>
                  </div>

                  <div class="p-5 space-y-3">
                    <h3 class="text-base font-bold font-['Raleway'] text-white">
                      {prod.name}
                    </h3>
                    <p class="text-xs text-slate-400 line-clamp-2">
                      {prod.description}
                    </p>

                    <div
                      class="grid grid-cols-2 gap-2 p-2.5 bg-slate-950 border border-slate-800 rounded-[3px] text-xs"
                    >
                      <div>
                        <span
                          class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block"
                          >Plafon</span
                        >
                        <span class="font-bold text-white"
                          >Rp {(prod.minAmount / 1_000_000).toLocaleString(
                            "id-ID",
                          )}Jt - {(prod.maxAmount / 1_000_000).toLocaleString(
                            "id-ID",
                          )}Jt</span
                        >
                      </div>
                      <div>
                        <span
                          class="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block"
                          >Tenor</span
                        >
                        <span class="font-bold text-white"
                          >{prod.minTenorMonths} - {prod.maxTenorMonths} Bln</span
                        >
                      </div>
                    </div>

                    <div class="space-y-1 text-xs text-slate-300">
                      {#each (prod.features || []).slice(0, 2) as feat}
                        <div class="flex items-center gap-1.5">
                          <CheckCircle2
                            class="w-3.5 h-3.5 text-emerald-400 shrink-0"
                          />
                          <span class="line-clamp-1">{feat}</span>
                        </div>
                      {/each}
                    </div>
                  </div>
                </div>

                <div
                  class="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between"
                >
                  <span class="text-[11px] font-semibold text-emerald-400"
                    >Margin: {prod.interestRateAnnual}% p.a.</span
                  >
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      onclick={() => (editingProduct = { ...prod })}
                      class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 class="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onclick={() => handleDeleteProduct(prod.id, prod.name)}
                      class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 5: ARTIKEL & BLOG -->
      <!-- ========================================================= -->
      {#if activeTab === "articles"}
        <div class="space-y-6">
          <div
            class="p-5 bg-slate-900 rounded-[3px] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h2 class="text-lg font-bold font-['Raleway'] text-white">
                Pusat Artikel Literasi &amp; Berita Resmi
              </h2>
              <p class="text-xs text-slate-400">
                Publikasikan artikel fiqih muamalah, kisah sukses mitra UMKM,
                dan siaran pers korporat.
              </p>
            </div>
            <button
              type="button"
              onclick={() => (isNewArticleModal = true)}
              class="px-4 py-2.5 rounded-[3px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus class="w-4 h-4" />
              <span>Tulis Artikel Baru</span>
            </button>
          </div>

          <div
            class="bg-slate-900 rounded-[3px] border border-slate-800 overflow-hidden"
          >
            <div class="divide-y divide-slate-800">
              {#each $cmsStore.blogPosts as art}
                <div
                  class="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                >
                  <div class="flex items-start gap-4">
                    <img
                      src={art.coverImage || "/images/blog/grid/17.jpg"}
                      alt={art.title}
                      class="w-20 h-16 rounded-[3px] object-cover border border-slate-800 shrink-0"
                    />
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <span
                          class="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold text-[10px] uppercase"
                        >
                          {art.category}
                        </span>
                        <span class="text-xs text-slate-400">&bull;</span>
                        <span class="text-xs text-slate-400"
                          >{art.publishedAt}</span
                        >
                      </div>
                      <h4
                        class="font-bold text-sm text-white hover:text-emerald-400 transition-colors"
                      >
                        {art.title}
                      </h4>
                      <p class="text-xs text-slate-400 line-clamp-1">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  <div
                    class="flex items-center gap-2 shrink-0 self-end sm:self-center"
                  >
                    <button
                      type="button"
                      onclick={() => (editingArticle = { ...art })}
                      class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 class="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onclick={() => handleDeleteArticle(art.id, art.title)}
                      class="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg cursor-pointer"
                      title="Hapus Artikel"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 6: DEWAN & TIM PERSONIL -->
      <!-- ========================================================= -->
      {#if activeTab === "team"}
        <div class="space-y-6">
          <div
            class="p-5 bg-slate-900 rounded-[3px] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h2 class="text-lg font-bold font-['Raleway'] text-white">
                Jajaran Dewan Pengawas, Komisaris, &amp; Direksi
              </h2>
              <p class="text-xs text-slate-400">
                Kelola profil pimpinan (Level 1: DPS, Level 2: Komisaris, Level
                3: Direksi, Level 4: Tim Operasional).
              </p>
            </div>
            <button
              type="button"
              onclick={() => (isNewPersonilModal = true)}
              class="px-4 py-2.5 rounded-[3px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus class="w-4 h-4" />
              <span>Tambah Personil</span>
            </button>
          </div>

          <!-- Team Level Filter Pills -->
          <div class="flex flex-wrap items-center gap-2">
            {#each [{ label: "Semua Personil", level: 0 }, { label: "Level 1: Dewan Pengawas Syariah", level: 1 }, { label: "Level 2: Dewan Komisaris", level: 2 }, { label: "Level 3: Jajaran Direksi", level: 3 }, { label: "Level 4: Manajemen Operasional", level: 4 }] as item}
              <button
                type="button"
                onclick={() => (selectedTeamLevelFilter = item.level)}
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer {selectedTeamLevelFilter ===
                item.level
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}"
              >
                {item.label}
              </button>
            {/each}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredTeam as member}
              <div
                class="bg-slate-900 rounded-[3px] border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/60 transition-all"
              >
                <div class="flex items-start gap-4">
                  <img
                    src={member.photo}
                    alt={member.fullname || member.fullName}
                    class="w-16 h-16 rounded-[3px] object-cover border border-slate-800 shrink-0"
                  />
                  <div class="space-y-1 min-w-0">
                    <span
                      class="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-950 text-emerald-400 border border-slate-800"
                    >
                      Level {member.job_level ?? member.jobLevel} &bull; {(member.job_level ??
                        member.jobLevel) === 1
                        ? "DPS"
                        : (member.job_level ?? member.jobLevel) === 2
                          ? "Komisaris"
                          : (member.job_level ?? member.jobLevel) === 3
                            ? "Direksi"
                            : "Operasional"}
                    </span>
                    <h4 class="font-bold text-sm text-white truncate">
                      {member.fullname || member.fullName}
                    </h4>
                    <p class="text-xs text-emerald-400 font-semibold truncate">
                      {member.job_title || member.jobTitle}
                    </p>
                  </div>
                </div>

                <p class="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {member.biography}
                </p>

                <div
                  class="pt-3 border-t border-slate-800 flex items-center justify-between"
                >
                  <span
                    class="text-[11px] text-slate-400 truncate max-w-[160px]"
                    >{member.education || "-"}</span
                  >
                  <div class="flex items-center gap-1.5">
                    <button
                      type="button"
                      onclick={() => (editingPersonil = { ...member })}
                      class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onclick={() =>
                        handleDeletePersonil(
                          member.id,
                          member.fullname || member.fullName || "",
                        )}
                      class="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 7: FAQS -->
      <!-- ========================================================= -->
      {#if activeTab === "faqs"}
        <div class="space-y-6">
          <div
            class="p-5 bg-slate-900 rounded-[3px] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h2 class="text-lg font-bold font-['Raleway'] text-white">
                Pertanyaan Umum (FAQ) Muamalah &amp; Platform
              </h2>
              <p class="text-xs text-slate-400">
                Kelola daftar tanya jawab yang tampil pada accordion beranda dan
                pusat bantuan.
              </p>
            </div>
            <button
              type="button"
              onclick={() => (isNewFaqModal = true)}
              class="px-4 py-2.5 rounded-[3px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus class="w-4 h-4" />
              <span>Tambah FAQ Baru</span>
            </button>
          </div>

          <!-- FAQ Category Filter Pills -->
          <div class="flex flex-wrap items-center gap-2">
            {#each ["all", "borrower", "investor", "syariah"] as cat}
              <button
                type="button"
                onclick={() => (selectedFaqCategory = cat)}
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer {selectedFaqCategory.toLowerCase() ===
                cat.toLowerCase()
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'}"
              >
                {cat === "all" ? "Semua Kategori" : cat.toUpperCase()}
              </button>
            {/each}
          </div>

          <div
            class="bg-slate-900 rounded-[3px] border border-slate-800 overflow-hidden divide-y divide-slate-800"
          >
            {#each filteredFaqs as faq}
              <div
                class="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
              >
                <div class="space-y-1.5 max-w-3xl">
                  <div class="flex items-center gap-2">
                    <span
                      class="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-950 text-emerald-400 border border-slate-800"
                    >
                      {faq.category}
                    </span>
                    <span class="text-xs text-slate-400"
                      >&bull; Urutan #{faq.order}</span
                    >
                  </div>
                  <h4 class="font-bold text-sm text-white">
                    {faq.question}
                  </h4>
                  <p
                    class="text-xs text-slate-300 line-clamp-2 leading-relaxed"
                  >
                    {faq.answer}
                  </p>
                </div>

                <div
                  class="flex items-center gap-2 shrink-0 self-end sm:self-center"
                >
                  <button
                    type="button"
                    onclick={() => (editingFaq = { ...faq })}
                    class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 class="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onclick={() => handleDeleteFaq(faq.id)}
                    class="p-2 text-slate-400 hover:text-rose-400 rounded-lg cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 8: TESTIMONI -->
      <!-- ========================================================= -->
      {#if activeTab === "testimonials"}
        <div class="space-y-6">
          <div
            class="p-5 bg-slate-900 rounded-[3px] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h2 class="text-lg font-bold font-['Raleway'] text-white">
                Kisah Nyata &amp; Testimoni Mitra
              </h2>
              <p class="text-xs text-slate-400">
                Ulasan terverifikasi dari penerima pembiayaan UMKM dan pendana
                etis.
              </p>
            </div>
            <button
              type="button"
              onclick={() => (isNewTestimonialModal = true)}
              class="px-4 py-2.5 rounded-[3px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus class="w-4 h-4" />
              <span>Tambah Testimoni</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each $cmsStore.testimonials as t}
              <div
                class="bg-slate-900 rounded-[3px] border border-slate-800 p-6 flex flex-col justify-between space-y-4"
              >
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-0.5 text-amber-400">
                      {#each Array(Math.min(5, Math.max(1, Math.round(Number(t.rating) || 5)))) as _}
                        <span class="text-xs">★</span>
                      {/each}
                    </div>
                    <button
                      type="button"
                      onclick={() => handleDeleteTestimonial(t.id, t.name)}
                      class="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg cursor-pointer"
                      title="Hapus Testimoni"
                    >
                      <Trash2 class="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p class="text-xs text-slate-300 italic leading-relaxed">
                    "{t.content}"
                  </p>
                </div>

                <div
                  class="pt-4 border-t border-slate-800 flex items-center gap-3"
                >
                  <img
                    src={t.avatar || "/images/team/p_putri_sq.jpeg"}
                    alt={t.name}
                    class="w-10 h-10 rounded-full object-cover border border-slate-800 shrink-0"
                  />
                  <div class="text-xs">
                    <strong class="text-white block font-bold">{t.name}</strong>
                    <span class="text-slate-400 block">{t.businessName}</span>
                    {#if t.fundedAmount}
                      <span
                        class="inline-block mt-0.5 px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-semibold rounded"
                        >{t.fundedAmount}</span
                      >
                    {/if}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </main>
  </div>
</div>

<!-- ========================================================= -->
<!-- MODAL DIALOGS FOR CREATING/EDITING CONTENT -->
<!-- ========================================================= -->

<!-- 1. PRODUCT CREATE / EDIT MODAL -->
{#if isNewProductModal || editingProduct}
  {@const isEdit = !!editingProduct}
  {@const target = editingProduct ?? newProduct}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
  >
    <div
      class="bg-white text-slate-800 rounded-[3px] max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto"
    >
      <div
        class="flex items-center justify-between border-b border-slate-100 pb-3"
      >
        <h3 class="font-bold text-base font-['Raleway'] text-slate-900">
          {isEdit ? "Edit Produk Pembiayaan" : "Tambah Produk Pembiayaan Baru"}
        </h3>
        <button
          type="button"
          onclick={() => {
            isNewProductModal = false;
            editingProduct = null;
          }}
          class="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Nama Produk</label
          >
          <input
            type="text"
            bind:value={target.name}
            placeholder="Contoh: Pembiayaan Pengadaan Barang"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:border-emerald-600 outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Jenis Akad Syariah</label
            >
            <select
              bind:value={target.contractType}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:border-emerald-600 outline-none"
            >
              <option value="Murabahah">Murabahah (Jual Beli)</option>
              <option value="Musyarakah">Musyarakah (Kemitraan Modal)</option>
              <option value="Ijarah">Ijarah (Sewa / Manfaat)</option>
              <option value="Qardh">Qardh al-Hasan (Sosial/Kebajikan)</option>
              <option value="Mudharabah">Mudharabah (Bagi Hasil)</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Margin / Bagi Hasil (% p.a.)</label
            >
            <input
              type="number"
              step="0.1"
              bind:value={target.interestRateAnnual}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:border-emerald-600 outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Deskripsi Produk</label
          >
          <textarea
            rows="3"
            bind:value={target.description}
            placeholder="Uraikan peruntukan modal dan manfaat bagi mitra..."
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:border-emerald-600 outline-none"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Plafon Minimal (Rp)</label
            >
            <input
              type="number"
              bind:value={target.minAmount}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Plafon Maksimal (Rp)</label
            >
            <input
              type="number"
              bind:value={target.maxAmount}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Tenor Minimal (Bulan)</label
            >
            <input
              type="number"
              bind:value={target.minTenorMonths}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Tenor Maksimal (Bulan)</label
            >
            <input
              type="number"
              bind:value={target.maxTenorMonths}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >URL Gambar / Foto Produk</label
          >
          <input
            type="text"
            bind:value={target.logo}
            placeholder="/images/products/namia_murabahah_goods.jpg"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
          />
        </div>
      </div>

      <div
        class="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5"
      >
        <button
          type="button"
          onclick={() => {
            isNewProductModal = false;
            editingProduct = null;
          }}
          class="button-4 button-4-sm cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onclick={isEdit ? handleUpdateProduct : handleSaveNewProduct}
          class="button-4-primary button-4-sm cursor-pointer"
        >
          {isEdit ? "Simpan Perubahan" : "Tambahkan Produk"}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- 2. STAT MODAL -->
{#if isNewStatModal || editingStat}
  {@const isEdit = !!editingStat}
  {@const target = editingStat ?? newStat}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
  >
    <div
      class="bg-white text-slate-800 rounded-[3px] max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-300"
    >
      <div
        class="flex items-center justify-between border-b border-slate-100 pb-3"
      >
        <h3 class="font-bold text-base font-['Raleway'] text-slate-900">
          {isEdit ? "Edit Metrik Statistik" : "Tambah Metrik Baru"}
        </h3>
        <button
          type="button"
          onclick={() => {
            isNewStatModal = false;
            editingStat = null;
          }}
          class="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Key Metrik</label
          >
          <input
            type="text"
            bind:value={target.metricKey}
            placeholder="tkb90, total_funded, dll"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
          />
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Nilai Tampilan (Headline Value)</label
          >
          <input
            type="text"
            bind:value={target.value}
            placeholder="Contoh: 100% atau Rp 48,5 Miliar"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-bold text-slate-900 outline-none"
          />
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Label Deskriptif</label
          >
          <input
            type="text"
            bind:value={target.label}
            placeholder="Contoh: Tingkat Keberhasilan Bayar (TKB90)"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
          />
        </div>
        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Sublabel Keterangan</label
          >
          <input
            type="text"
            bind:value={target.sublabel}
            placeholder="Contoh: Mitigasi risiko teruji per Desember 2025"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
          />
        </div>
      </div>

      <div
        class="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5"
      >
        <button
          type="button"
          onclick={() => {
            isNewStatModal = false;
            editingStat = null;
          }}
          class="button-4 button-4-sm cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onclick={isEdit ? handleUpdateStat : handleSaveNewStat}
          class="button-4-primary button-4-sm cursor-pointer"
        >
          {isEdit ? "Simpan Perubahan" : "Tambahkan Metrik"}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- 3. ARTICLE MODAL -->
{#if isNewArticleModal || editingArticle}
  {@const isEdit = !!editingArticle}
  {@const target = editingArticle ?? newArticle}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
  >
    <div
      class="bg-white text-slate-800 rounded-[3px] max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto"
    >
      <div
        class="flex items-center justify-between border-b border-slate-100 pb-3"
      >
        <h3 class="font-bold text-base font-['Raleway'] text-slate-900">
          {isEdit ? "Edit Artikel" : "Tulis Artikel Baru"}
        </h3>
        <button
          type="button"
          onclick={() => {
            isNewArticleModal = false;
            editingArticle = null;
          }}
          class="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Judul Artikel</label
          >
          <input
            type="text"
            bind:value={target.title}
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:border-emerald-600 outline-none font-bold"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Kategori</label
            >
            <select
              bind:value={target.category}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            >
              <option value="Akad Syariah">Akad Syariah</option>
              <option value="Bisnis UMKM">Bisnis UMKM</option>
              <option value="Sukuk & Investasi">Sukuk & Investasi</option>
              <option value="Kemitraan">Kemitraan</option>
              <option value="Karir & Kultur">Karir & Kultur</option>
              <option value="Kisah Inspiratif">Kisah Inspiratif</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Penulis / Penanggung Jawab</label
            >
            <input
              type="text"
              bind:value={target.author}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Ringkasan Intisari (Excerpt)</label
          >
          <textarea
            rows="2"
            bind:value={target.excerpt}
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
          ></textarea>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Konten Lengkap (Paragraf terpisah 2x enter)</label
          >
          <textarea
            rows="8"
            bind:value={target.content}
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none font-mono text-[11px]"
          ></textarea>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >URL Cover Image</label
          >
          <input
            type="text"
            bind:value={target.coverImage}
            placeholder="/images/blog/grid/17.jpg"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
          />
        </div>
      </div>

      <div
        class="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5"
      >
        <button
          type="button"
          onclick={() => {
            isNewArticleModal = false;
            editingArticle = null;
          }}
          class="button-4 button-4-sm cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onclick={isEdit ? handleUpdateArticle : handleSaveNewArticle}
          class="button-4-primary button-4-sm cursor-pointer"
        >
          {isEdit ? "Simpan Perubahan" : "Publikasikan Artikel"}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- 4. FAQ MODAL -->
{#if isNewFaqModal || editingFaq}
  {@const isEdit = !!editingFaq}
  {@const target = editingFaq ?? newFaq}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
  >
    <div
      class="bg-white text-slate-800 rounded-[3px] max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-300"
    >
      <div
        class="flex items-center justify-between border-b border-slate-100 pb-3"
      >
        <h3 class="font-bold text-base font-['Raleway'] text-slate-900">
          {isEdit ? "Edit Pertanyaan FAQ" : "Tambah FAQ Baru"}
        </h3>
        <button
          type="button"
          onclick={() => {
            isNewFaqModal = false;
            editingFaq = null;
          }}
          class="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-3 text-xs">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Kategori Sasaran</label
            >
            <select
              bind:value={target.category}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            >
              <option value="borrower">Penerima Pembiayaan (Borrower)</option>
              <option value="investor">Pendana / Investor</option>
              <option value="syariah">Kaidah Fiqih Syariah</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Urutan Tampil</label
            >
            <input
              type="number"
              bind:value={target.order}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Pertanyaan</label
          >
          <input
            type="text"
            bind:value={target.question}
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none font-bold"
          />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Jawaban Lengkap</label
          >
          <textarea
            rows="4"
            bind:value={target.answer}
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
          ></textarea>
        </div>
      </div>

      <div
        class="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5"
      >
        <button
          type="button"
          onclick={() => {
            isNewFaqModal = false;
            editingFaq = null;
          }}
          class="button-4 button-4-sm cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onclick={isEdit ? handleUpdateFaq : handleSaveNewFaq}
          class="button-4-primary button-4-sm cursor-pointer"
        >
          {isEdit ? "Simpan Perubahan" : "Tambahkan FAQ"}
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- 5. TESTIMONIAL MODAL -->
{#if isNewTestimonialModal}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
  >
    <div
      class="bg-white text-slate-800 rounded-[3px] max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-300"
    >
      <div
        class="flex items-center justify-between border-b border-slate-100 pb-3"
      >
        <h3 class="font-bold text-base font-['Raleway'] text-slate-900">
          Tambah Testimoni Baru
        </h3>
        <button
          type="button"
          onclick={() => (isNewTestimonialModal = false)}
          class="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-3 text-xs">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Nama Mitra / Pengguna</label
            >
            <input
              type="text"
              bind:value={newTestimonial.name}
              placeholder="Contoh: Hendra Kurniawan"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Nama Usaha / Profesi</label
            >
            <input
              type="text"
              bind:value={newTestimonial.businessName}
              placeholder="Contoh: CV Logam Presisi Nusantara"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Peran Pengguna</label
            >
            <select
              bind:value={newTestimonial.role}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            >
              <option value="borrower">Penerima Pembiayaan (Borrower)</option>
              <option value="investor">Pendana (Investor)</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Rating Bintang (1-5)</label
            >
            <input
              type="number"
              min="1"
              max="5"
              bind:value={newTestimonial.rating}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Nominal Pembiayaan (Opsional)</label
          >
          <input
            type="text"
            bind:value={newTestimonial.fundedAmount}
            placeholder="Rp 75.000.000 (Murabahah)"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
          />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Isi Testimoni / Pengalaman</label
          >
          <textarea
            rows="3"
            bind:value={newTestimonial.content}
            placeholder="Ceritakan kepuasan bermuamalah tanpa riba di Namia Syariah..."
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
          ></textarea>
        </div>
      </div>

      <div
        class="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5"
      >
        <button
          type="button"
          onclick={() => (isNewTestimonialModal = false)}
          class="button-4 button-4-sm cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onclick={handleSaveNewTestimonial}
          class="button-4-primary button-4-sm cursor-pointer"
        >
          Tambahkan Testimoni
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- 6. PERSONIL MODAL -->
{#if isNewPersonilModal || editingPersonil}
  {@const isEdit = !!editingPersonil}
  {@const target = editingPersonil ?? newPersonil}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
  >
    <div
      class="bg-white text-slate-800 rounded-[3px] max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto"
    >
      <div
        class="flex items-center justify-between border-b border-slate-100 pb-3"
      >
        <h3 class="font-bold text-base font-['Raleway'] text-slate-900">
          {isEdit ? "Edit Profil Personil" : "Tambah Personil Baru"}
        </h3>
        <button
          type="button"
          onclick={() => {
            isNewPersonilModal = false;
            editingPersonil = null;
          }}
          class="p-1 text-slate-400 hover:text-slate-700 rounded cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="space-y-3 text-xs">
        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Nama Lengkap &amp; Gelar</label
          >
          <input
            type="text"
            bind:value={target.fullname}
            placeholder="DR. H. Endy M. Astiwara, MA"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none font-bold"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Jabatan Resmi</label
            >
            <input
              type="text"
              bind:value={target.job_title}
              placeholder="Dewan Pengawas Syariah"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1"
              >Level Jabatan</label
            >
            <select
              bind:value={target.job_level}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            >
              <option value={1}>1: Dewan Pengawas Syariah (DPS)</option>
              <option value={2}>2: Dewan Komisaris</option>
              <option value={3}>3: Jajaran Direksi</option>
              <option value={4}>4: Tim Operasional &amp; Manajemen</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Latar Belakang Pendidikan</label
          >
          <input
            type="text"
            bind:value={target.education}
            placeholder="UIN Syarif Hidayatullah Jakarta & Univ. Muhammadiyah"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
          />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >URL Foto Profil</label
          >
          <input
            type="text"
            bind:value={target.photo}
            placeholder="/images/team/p_endi_dps_sq.jpeg"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
          />
        </div>

        <div>
          <label class="block font-semibold text-slate-700 mb-1"
            >Biografi &amp; Pengalaman</label
          >
          <textarea
            rows="4"
            bind:value={target.biography}
            placeholder="Tuliskan riwayat karir, sertifikasi, dan peran di Namia Syariah..."
            class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
          ></textarea>
        </div>
      </div>

      <div
        class="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5"
      >
        <button
          type="button"
          onclick={() => {
            isNewPersonilModal = false;
            editingPersonil = null;
          }}
          class="button-4 button-4-sm cursor-pointer"
        >
          Batal
        </button>
        <button
          type="button"
          onclick={isEdit ? handleUpdatePersonil : handleSaveNewPersonil}
          class="button-4-primary button-4-sm cursor-pointer"
        >
          {isEdit ? "Simpan Perubahan" : "Tambahkan Personil"}
        </button>
      </div>
    </div>
  </div>
{/if}
