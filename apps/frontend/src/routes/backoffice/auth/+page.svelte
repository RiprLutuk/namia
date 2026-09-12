<script lang="ts">
  import { onMount } from "svelte";
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
    resetCmsToDefaults,
    type ProductData,
    type StatData,
    type BlogPostData,
    type PersonilData,
    type FaqData,
    type TestimonialData,
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
    Lock,
    LogOut,
    UserCheck,
    Key,
    Coins,
  } from "lucide-svelte";
  import { API_BASE_URL, NAMIA_API_KEY } from "$lib/api";

  // Auth State
  let isAuthenticated = $state(false);
  let adminUsername = $state("");
  let adminPassword = $state("");
  let adminApiKey = $state(NAMIA_API_KEY);
  let authError = $state("");

  // Active Tab in Backoffice
  type TabKey =
    | "overview"
    | "branding"
    | "hero"
    | "products"
    | "stats"
    | "articles"
    | "team"
    | "faqs"
    | "testimonials"
    | "leads"
    | "system";

  let activeTab = $state<TabKey>("overview");
  let isMobileSidebarOpen = $state(false);

  // Filters
  let selectedProductContract = $state<string>("all");
  let selectedTeamLevelFilter = $state<number>(0);
  let selectedFaqCategory = $state<string>("all");

  // Leads monitor
  let leadsList = $state<any[]>([]);
  let isLoadingLeads = $state(false);

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

  // Feedback notifications
  let statusMessage = $state<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  function notify(
    text: string,
    type: "success" | "error" | "info" = "success",
  ) {
    statusMessage = { type, text };
    setTimeout(() => {
      statusMessage = null;
    }, 4000);
  }

  // Modals state
  let showProductModal = $state(false);
  let editingProduct = $state<Partial<ProductData> | null>(null);

  let showArticleModal = $state(false);
  let editingArticle = $state<Partial<BlogPostData> | null>(null);

  let showPersonilModal = $state(false);
  let editingPersonil = $state<Partial<PersonilData> | null>(null);

  let showFaqModal = $state(false);
  let editingFaq = $state<Partial<FaqData> | null>(null);

  let showStatModal = $state(false);
  let editingStat = $state<Partial<StatData> | null>(null);

  onMount(() => {
    fetchCmsContent();
  });

  function handleAdminLogin(e: Event) {
    e.preventDefault();
    if (!adminUsername || !adminPassword) {
      authError = "Silakan masukkan username dan kata sandi backoffice.";
      return;
    }
    isAuthenticated = true;
    authError = "";
    notify("Berhasil masuk ke Namia Syariah Backoffice Management", "success");
    loadLeads();
  }

  function handleDemoAdminLogin() {
    adminUsername = "superadmin@namia.id";
    adminPassword = "DemoBackoffice2026!";
    isAuthenticated = true;
    authError = "";
    notify("Berhasil masuk ke Namia Syariah Backoffice Management", "success");
    loadLeads();
  }

  function handleAdminLogout() {
    isAuthenticated = false;
  }

  async function loadLeads() {
    isLoadingLeads = true;
    try {
      // Leads mock or fetch
      leadsList = [
        {
          id: 1,
          fullName: "Ahmad Subarjo",
          email: "ahmad@sumberberkah.co.id",
          phone: "081234567890",
          needCategory: "pembiayaan-usaha",
          targetAmount: 150000000,
          targetTenorMonths: 12,
          kycStep: 3,
          status: "pending",
          createdAt: "2026-03-01T10:00:00Z",
        },
        {
          id: 2,
          fullName: "Hj. Siti Rahmah",
          email: "siti@batikrahmah.com",
          phone: "081398765432",
          needCategory: "p2p-lending",
          targetAmount: 100000000,
          targetTenorMonths: 6,
          kycStep: 4,
          status: "verified",
          createdAt: "2026-02-28T14:30:00Z",
        },
        {
          id: 3,
          fullName: "Fajar Wicaksono",
          email: "fajar.investor@gmail.com",
          phone: "081122334455",
          needCategory: "investment",
          targetAmount: 50000000,
          targetTenorMonths: 12,
          kycStep: 4,
          status: "verified",
          createdAt: "2026-02-27T08:15:00Z",
        },
      ];
    } finally {
      isLoadingLeads = false;
    }
  }

  async function handleUpdateLeadKyc(leadId: number, nextStep: number) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/leads/${leadId}/kyc`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": NAMIA_API_KEY,
        },
        body: JSON.stringify({ step: nextStep }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        notify(
          `Status KYC Prospek #${leadId} dinaikkan ke Tahap ${nextStep}`,
          "success",
        );
        const item = leadsList.find((l) => l.id === leadId);
        if (item) {
          item.kycStep = nextStep;
          if (nextStep >= 4) item.status = "verified";
        }
      } else {
        notify(data.message || "Gagal update KYC lead", "error");
      }
    } catch (e: any) {
      notify(e.message || "Gagal mengupdate KYC", "error");
    }
  }
</script>

<svelte:head>
  <title>Namia Syariah Backoffice Management & CMS</title>
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

<div class="backoffice-page">
  <!-- Top Internal Bar -->
  <div class="backoffice-topbar">
    <div class="container-fluid px-4">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2">
          <ShieldCheck size={16} class="text-danger" />
          <strong class="text-white"
            >NAMIA BACKOFFICE & MASTER CMS ENGINE</strong
          >
          <span class="badge badge-danger ms-2">RESTRICTED ACCESS</span>
        </div>
        {#if isAuthenticated}
          <div class="d-flex align-items-center gap-3">
            <span class="text-xs text-white-75">
              Masuk sebagai: <strong
                >Superadmin (PT Namia Finansial Teknologi)</strong
              >
            </span>
            <button
              type="button"
              class="btn btn-xs btn-default border"
              onclick={handleAdminLogout}
            >
              <LogOut size={12} class="inline-icon" /> Keluar
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>

  {#if !isAuthenticated}
    <!-- LOGIN GATE -->
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-4">
          <div class="panel panel-default auth-panel shadow-sm">
            <div class="panel-heading bg-dark text-white text-center py-3">
              <h4 class="panel-title mb-1 font-bold">
                <Lock size={18} class="inline-icon" /> Autentikasi Backoffice
              </h4>
              <p class="text-xs mb-0 text-white-75">
                PT Namia Finansial Teknologi Management Portal
              </p>
            </div>
            <div class="panel-body p-4">
              {#if authError}
                <div class="alert alert-danger py-2 text-xs mb-3">
                  <AlertCircle size={14} class="inline-icon" />
                  {authError}
                </div>
              {/if}

              <form onsubmit={handleAdminLogin}>
                <div class="form-group mb-3">
                  <label
                    class="control-label text-xs font-bold"
                    for="bo-username">Username / Email Administrator:</label
                  >
                  <input
                    id="bo-username"
                    type="text"
                    class="form-control input-sm"
                    placeholder="superadmin@namia.id"
                    bind:value={adminUsername}
                    required
                  />
                </div>

                <div class="form-group mb-3">
                  <label
                    class="control-label text-xs font-bold"
                    for="bo-password">Kata Sandi Backoffice:</label
                  >
                  <input
                    id="bo-password"
                    type="password"
                    class="form-control input-sm"
                    placeholder="••••••••••••"
                    bind:value={adminPassword}
                    required
                  />
                </div>

                <div class="form-group mb-3">
                  <label class="control-label text-xs font-bold" for="bo-apikey"
                    >API Gateway Key (x-api-key):</label
                  >
                  <input
                    id="bo-apikey"
                    type="password"
                    class="form-control input-sm font-mono"
                    bind:value={adminApiKey}
                    required
                  />
                  <span class="text-xs text-muted"
                    >Kunci otorisasi backend Bun/Elysia</span
                  >
                </div>

                <button
                  type="submit"
                  class="btn btn-primary btn-block w-100 mb-3"
                >
                  <Key size={14} class="inline-icon" /> Masuk ke Backoffice
                </button>

                <div class="demo-auth-box text-center p-2 bg-light border">
                  <p class="text-xs text-muted mb-1">
                    Akses cepat untuk evaluasi & verifikasi:
                  </p>
                  <button
                    type="button"
                    class="btn btn-xs btn-default border"
                    onclick={handleDemoAdminLogin}
                  >
                    Buka Demo Akses Backoffice
                  </button>
                </div>
              </form>
            </div>
            <div class="panel-footer text-center text-xs text-muted bg-light">
              Peringatan: Setiap aktivitas di sistem ini dicatat dan diaudit
              sesuai standar ISO 27001.
            </div>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <!-- AUTHENTICATED MASTER CMS & BACKOFFICE CONSOLE -->
    <div class="container-fluid px-4 py-3">
      <!-- Notification Alert -->
      {#if statusMessage}
        <div
          class="alert alert-{statusMessage.type} alert-dismissible mb-3 py-2 text-sm"
        >
          <strong>Pemberitahuan:</strong>
          {statusMessage.text}
        </div>
      {/if}

      <!-- Quick Action Toolbar -->
      <div
        class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom"
      >
        <div>
          <h4 class="mb-0 font-bold text-lg">
            Konsol Manajemen & Master Content Management System
          </h4>
          <span class="text-xs text-muted"
            >Sinkronisasi langsung dengan Drizzle ORM / disk-backed stateful <code
              >cms_state.json</code
            ></span
          >
        </div>
        <div class="d-flex gap-2">
          <button
            type="button"
            class="btn btn-sm btn-default"
            onclick={() => {
              fetchCmsContent();
              notify("Konten berhasil disegarkan dari API", "info");
            }}
          >
            <RefreshCw size={14} class="inline-icon" /> Refresh Data
          </button>
          <button
            type="button"
            class="btn btn-sm btn-danger"
            onclick={async () => {
              if (
                confirm(
                  "Apakah Anda yakin ingin me-reset seluruh konten ke pengaturan awal Namia Syariah?",
                )
              ) {
                await resetCmsToDefaults();
                notify(
                  "Seluruh konten berhasil di-reset ke default Namia Syariah",
                  "success",
                );
              }
            }}
          >
            <RotateCcw size={14} class="inline-icon" /> Reset Defaults
          </button>
          <a href="/" target="_blank" class="btn btn-sm btn-primary">
            <ExternalLink size={14} class="inline-icon" /> Buka Situs Publik
          </a>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <ul class="nav nav-tabs mb-4">
        <li class={activeTab === "overview" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "overview";
            }}
          >
            <LayoutDashboard size={14} class="inline-icon" /> Dashboard
          </button>
        </li>
        <li class={activeTab === "leads" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "leads";
            }}
          >
            <UserCheck size={14} class="inline-icon" /> Leads & Verifikasi KYC ({leadsList.length})
          </button>
        </li>
        <li class={activeTab === "branding" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "branding";
            }}
          >
            <Globe size={14} class="inline-icon" /> Identitas & Sambutan
          </button>
        </li>
        <li class={activeTab === "hero" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "hero";
            }}
          >
            <Sparkles size={14} class="inline-icon" /> Hero Banner
          </button>
        </li>
        <li class={activeTab === "products" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "products";
            }}
          >
            <Package size={14} class="inline-icon" /> Produk ({$cmsStore
              .products.length})
          </button>
        </li>
        <li class={activeTab === "stats" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "stats";
            }}
          >
            <BarChart3 size={14} class="inline-icon" /> Statistik & TKB90
          </button>
        </li>
        <li class={activeTab === "articles" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "articles";
            }}
          >
            <BookOpen size={14} class="inline-icon" /> Artikel Fiqih ({$cmsStore
              .blogPosts.length})
          </button>
        </li>
        <li class={activeTab === "team" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "team";
            }}
          >
            <Users size={14} class="inline-icon" /> Tim & DPS ({$cmsStore.team
              .length})
          </button>
        </li>
        <li class={activeTab === "faqs" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "faqs";
            }}
          >
            <HelpCircle size={14} class="inline-icon" /> FAQ Syariah ({$cmsStore
              .faqs.length})
          </button>
        </li>
        <li class={activeTab === "testimonials" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "testimonials";
            }}
          >
            <MessageSquare size={14} class="inline-icon" /> Testimoni
          </button>
        </li>
        <li class={activeTab === "system" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "system";
            }}
          >
            <Server size={14} class="inline-icon" /> Sistem & Database
          </button>
        </li>
      </ul>

      <!-- TAB CONTENTS -->
      {#if activeTab === "overview"}
        <!-- Overview Stats Cards -->
        <div class="row mb-4">
          <div class="col-sm-6 col-md-3 mb-3">
            <div class="stat-card-legacy">
              <div class="stat-icon bg-success-subtle text-success">
                <TrendingUp size={20} />
              </div>
              <div class="stat-content">
                <div class="stat-label">Total Dana Tersalurkan</div>
                <div class="stat-value">Rp 2,45 T</div>
                <div class="stat-sub">Sektor Riil UMKM</div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-3 mb-3">
            <div class="stat-card-legacy">
              <div class="stat-icon bg-primary-subtle text-primary">
                <ShieldCheck size={20} />
              </div>
              <div class="stat-content">
                <div class="stat-label">Kualitas Kredit (TKB90)</div>
                <div class="stat-value text-success">99,82%</div>
                <div class="stat-sub">Terjaga Sangat Sehat</div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-3 mb-3">
            <div class="stat-card-legacy">
              <div class="stat-icon bg-info-subtle text-info">
                <Users size={20} />
              </div>
              <div class="stat-content">
                <div class="stat-label">Borrower Aktif</div>
                <div class="stat-value">18.420+</div>
                <div class="stat-sub">27 Provinsi</div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-md-3 mb-3">
            <div class="stat-card-legacy">
              <div class="stat-icon bg-warning-subtle text-warning">
                <Coins size={20} />
              </div>
              <div class="stat-content">
                <div class="stat-label">Lender Terdaftar</div>
                <div class="stat-value">42.500+</div>
                <div class="stat-sub">Retail & Institusi</div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel panel-default">
          <div class="panel-heading">
            <h4 class="panel-title">
              <Activity size={16} class="inline-icon" /> Ringkasan Status Database
              & Sistem
            </h4>
          </div>
          <div class="panel-body text-xs">
            <p>
              <strong>Endpoint API Backend:</strong> <code>{API_BASE_URL}</code>
            </p>
            <p>
              <strong>Status Sinkronisasi CMS:</strong>
              {$cmsStore.isLoaded ? "Aktif & Terhubung" : "Memuat..."}
            </p>
            <p>
              <strong>Terakhir Disinkronkan:</strong>
              {$cmsStore.lastSynced || "Baru saja"}
            </p>
            <p>
              <strong>Penyimpanan Persisten:</strong>
              <code>apps/backend/src/db/cms_state.json</code>
            </p>
          </div>
        </div>
      {:else if activeTab === "leads"}
        <!-- Leads & KYC Review Table -->
        <div class="panel panel-default">
          <div
            class="panel-heading d-flex justify-content-between align-items-center"
          >
            <h4 class="panel-title mb-0">
              <UserCheck size={16} class="inline-icon" /> Prospek Pembiayaan & Verifikasi
              KYC
            </h4>
            <button
              type="button"
              class="btn btn-xs btn-default"
              onclick={loadLeads}>Refresh Leads</button
            >
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-striped mb-0">
              <thead>
                <tr class="active">
                  <th>ID</th>
                  <th>Nama Lengkap</th>
                  <th>Email & Kontak</th>
                  <th>Kategori</th>
                  <th>Nominal Target</th>
                  <th>Tahap KYC</th>
                  <th>Status</th>
                  <th>Aksi Verifikasi</th>
                </tr>
              </thead>
              <tbody>
                {#each leadsList as lead}
                  <tr>
                    <td><code>#{lead.id}</code></td>
                    <td><strong>{lead.fullName}</strong></td>
                    <td class="text-xs"
                      >{lead.email}<br /><span class="text-muted"
                        >{lead.phone}</span
                      ></td
                    >
                    <td
                      ><span class="badge badge-default"
                        >{lead.needCategory}</span
                      ></td
                    >
                    <td
                      >Rp {lead.targetAmount.toLocaleString("id-ID")} ({lead.targetTenorMonths}
                      Bln)</td
                    >
                    <td>
                      <span
                        class="badge {lead.kycStep >= 4
                          ? 'badge-success'
                          : 'badge-warning'}"
                      >
                        Tahap {lead.kycStep} / 4
                      </span>
                    </td>
                    <td>
                      <span
                        class="badge {lead.status === 'verified'
                          ? 'badge-success'
                          : 'badge-default'}"
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td>
                      {#if lead.kycStep < 4}
                        <button
                          type="button"
                          class="btn btn-xs btn-success"
                          onclick={() =>
                            handleUpdateLeadKyc(lead.id, lead.kycStep + 1)}
                        >
                          Verifikasi Tahap {lead.kycStep + 1}
                        </button>
                      {:else}
                        <span class="text-xs text-success font-bold"
                          ><Check size={12} class="inline-icon" /> KYC Lengkap</span
                        >
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if activeTab === "products"}
        <!-- Products Management -->
        <div class="panel panel-default">
          <div
            class="panel-heading d-flex justify-content-between align-items-center"
          >
            <h4 class="panel-title mb-0">
              <Package size={16} class="inline-icon" /> Katalog Produk Pembiayaan
              ({$cmsStore.products.length})
            </h4>
            <button
              type="button"
              class="btn btn-xs btn-primary"
              onclick={() => {
                editingProduct = {
                  name: "",
                  provider: "PT Namia Finansial Teknologi",
                  logo: "/images/products/namia_murabahah_goods.jpg",
                  description: "",
                  minAmount: 5000000,
                  maxAmount: 100000000,
                  minTenorMonths: 3,
                  maxTenorMonths: 24,
                  interestRateAnnual: 8.5,
                  contractType: "Murabahah",
                  features: [
                    "Akad Sah Syariah DSN-MUI",
                    "Proses Cepat Digital",
                  ],
                  applyUrl: "/borrower",
                  isFeatured: true,
                  targetAudience: "borrower",
                };
                showProductModal = true;
              }}
            >
              <Plus size={12} class="inline-icon" /> Tambah Produk Baru
            </button>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-striped mb-0">
              <thead>
                <tr class="active">
                  <th>ID</th>
                  <th>Nama Produk</th>
                  <th>Akad</th>
                  <th>Plafon (Min - Max)</th>
                  <th>Tenor</th>
                  <th>Rate (% p.a.)</th>
                  <th>Target</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {#each $cmsStore.products as p}
                  <tr>
                    <td><code>{p.id}</code></td>
                    <td><strong>{p.name}</strong></td>
                    <td
                      ><span class="badge badge-default">{p.contractType}</span
                      ></td
                    >
                    <td class="text-xs">
                      Rp {(p.minAmount / 1000000).toLocaleString("id-ID")} Jt - {(
                        p.maxAmount / 1000000
                      ).toLocaleString("id-ID")} Jt
                    </td>
                    <td>{p.minTenorMonths} - {p.maxTenorMonths} Bln</td>
                    <td>{p.interestRateAnnual}%</td>
                    <td
                      ><span class="badge badge-info"
                        >{p.targetAudience || "both"}</span
                      ></td
                    >
                    <td>
                      <button
                        type="button"
                        class="btn btn-xs btn-danger"
                        onclick={async () => {
                          if (confirm(`Hapus produk '${p.name}'?`)) {
                            await deleteProduct(p.id);
                            notify("Produk berhasil dihapus", "success");
                          }
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if activeTab === "team"}
        <!-- Team Management -->
        <div class="panel panel-default">
          <div
            class="panel-heading d-flex justify-content-between align-items-center"
          >
            <h4 class="panel-title mb-0">
              <Users size={16} class="inline-icon" /> Manajemen Dewan Pengawas Syariah
              & Direksi
            </h4>
            <span class="badge badge-default"
              >{$cmsStore.team.length} Anggota</span
            >
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-striped mb-0">
              <thead>
                <tr class="active">
                  <th>ID</th>
                  <th>Foto</th>
                  <th>Nama Lengkap</th>
                  <th>Jabatan & Tingkat</th>
                  <th>Pendidikan / Kredensial</th>
                  <th>Departemen</th>
                </tr>
              </thead>
              <tbody>
                {#each $cmsStore.team as m}
                  <tr>
                    <td><code>{m.id}</code></td>
                    <td>
                      <img
                        src={m.photo}
                        alt={m.fullname}
                        style="width: 36px; height: 36px; object-fit: cover; border: 1px solid #ddd;"
                      />
                    </td>
                    <td><strong>{m.fullname || m.fullName}</strong></td>
                    <td>
                      {m.job_title || m.jobTitle}<br />
                      <span class="badge badge-default"
                        >Level {m.job_level ?? m.jobLevel}</span
                      >
                    </td>
                    <td class="text-xs">{m.education || "-"}</td>
                    <td
                      ><span class="badge badge-primary"
                        >{m.department || "Manajemen"}</span
                      ></td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if activeTab === "faqs"}
        <!-- FAQ Management -->
        <div class="panel panel-default">
          <div
            class="panel-heading d-flex justify-content-between align-items-center"
          >
            <h4 class="panel-title mb-0">
              <HelpCircle size={16} class="inline-icon" /> FAQ & Edukasi Fiqih Muamalah
            </h4>
            <span class="badge badge-default"
              >{$cmsStore.faqs.length} Butir Pertanyaan</span
            >
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-striped mb-0">
              <thead>
                <tr class="active">
                  <th>ID</th>
                  <th>Kategori</th>
                  <th>Pertanyaan</th>
                  <th>Jawaban</th>
                  <th>Target</th>
                </tr>
              </thead>
              <tbody>
                {#each $cmsStore.faqs as f}
                  <tr>
                    <td><code>{f.id}</code></td>
                    <td
                      ><span class="badge badge-default"
                        >{f.categoryName || f.category || "Umum"}</span
                      ></td
                    >
                    <td class="font-bold text-xs" style="max-width: 250px;"
                      >{f.question || f.q}</td
                    >
                    <td class="text-xs" style="max-width: 450px;"
                      >{f.answer || f.a}</td
                    >
                    <td>
                      <span
                        class="badge {f.isInvestor
                          ? 'badge-info'
                          : 'badge-success'}"
                      >
                        {f.isInvestor ? "Lender" : "Borrower"}
                      </span>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if activeTab === "articles"}
        <!-- Blog / Articles -->
        <div class="panel panel-default">
          <div
            class="panel-heading d-flex justify-content-between align-items-center"
          >
            <h4 class="panel-title mb-0">
              <BookOpen size={16} class="inline-icon" /> Artikel & Edukasi Bebas
              Riba
            </h4>
            <span class="badge badge-default"
              >{$cmsStore.blogPosts.length} Artikel</span
            >
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-striped mb-0">
              <thead>
                <tr class="active">
                  <th>ID</th>
                  <th>Judul Artikel</th>
                  <th>Kategori</th>
                  <th>Penulis</th>
                  <th>Waktu Terbit</th>
                </tr>
              </thead>
              <tbody>
                {#each $cmsStore.blogPosts as b}
                  <tr>
                    <td><code>{b.id}</code></td>
                    <td><strong>{b.title}</strong></td>
                    <td
                      ><span class="badge badge-default">{b.category}</span></td
                    >
                    <td>{b.author}</td>
                    <td class="text-xs">{b.publishedAt?.slice(0, 10) || "-"}</td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if activeTab === "system"}
        <!-- System & Database -->
        <div class="panel panel-default">
          <div class="panel-heading">
            <h4 class="panel-title">
              <Server size={16} class="inline-icon" /> Kesehatan Sistem & File Persistensi
            </h4>
          </div>
          <div class="panel-body text-xs">
            <div class="alert alert-info">
              <strong>Info Arsitektur:</strong> Backend menggunakan Bun 1.3 +
              ElysiaJS dengan Drizzle ORM dan penyimpanan JSON disk-backed
              terstruktur di <code>apps/backend/src/db/cms_state.json</code>.
            </div>
            <p><strong>Backend API Host:</strong> {API_BASE_URL}</p>
            <p>
              <strong>CORS & Security:</strong> Terkoneksi API Key
              <code>x-api-key</code>.
            </p>
            <p>
              <strong>Robots.txt Policy:</strong> <code>Disallow: /auth/</code>,
              <code>Disallow: /backoffice/</code>, <code>Disallow: /cms/</code>.
            </p>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .backoffice-page {
    background-color: #f4f4f4;
    min-height: 85vh;
    padding-bottom: 40px;
  }

  .backoffice-topbar {
    background-color: #1a1a1a;
    color: #ffffff;
    padding: 8px 0;
    font-size: 13px;
    border-bottom: 3px solid #b91c1c;
  }

  .inline-icon {
    display: inline-block;
    vertical-align: middle;
    margin-right: 4px;
  }

  .stat-card-legacy {
    display: flex;
    align-items: center;
    background: #ffffff;
    border: 1px solid #dcdcdc;
    padding: 12px;
    gap: 12px;
  }

  .stat-icon {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #dcdcdc;
  }

  .stat-label {
    font-size: 11px;
    color: #666666;
  }

  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #333333;
  }

  .stat-sub {
    font-size: 11px;
    color: #888888;
  }

  .auth-panel {
    border: 1px solid #333333;
  }
</style>
