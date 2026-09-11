<script lang="ts">
  import { onMount } from "svelte";
  import {
    ShieldCheck,
    Coins,
    TrendingUp,
    Wallet,
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    Lock,
    LogOut,
    AlertCircle,
    UserCheck,
    Briefcase,
    Building2,
    Search,
    Filter,
    Download,
    Calculator,
    CreditCard,
    ArrowDownRight,
    RefreshCw,
  } from "lucide-svelte";
  import { API_BASE_URL, NAMIA_API_KEY } from "$lib/api";
  import { cmsStore, fetchCmsContent, type ProductData } from "$lib/cms";

  // Auth State
  let isAuthenticated = $state(false);
  let authMode = $state<"login" | "register" | "forgot">("login");
  let emailInput = $state("");
  let passwordInput = $state("");
  let fullNameInput = $state("");
  let phoneInput = $state("");
  let authError = $state("");
  let authSuccess = $state("");

  // Active Lender Tab
  type LenderTab =
    | "overview"
    | "marketplace"
    | "portfolio"
    | "wallet"
    | "calculator";
  let activeTab = $state<LenderTab>("overview");

  // Dynamic Products from CMS Store or API
  let products = $derived($cmsStore.products);

  // Escrow Wallet State
  let escrowBalance = $state(24500000);
  let activeInvestmentTotal = $state(75000000);
  let totalProfitEarned = $state(8945000);
  let topupAmount = $state(5000000);
  let topupBank = $state("BSI");
  let topupSuccessMsg = $state("");

  // Interactive Investment Calculator State
  let calcInitial = $state(10000000);
  let calcMonthly = $state(1000000);
  let calcRate = $state(14.5);
  let calcYears = $state(2);
  let calcNisbah = $state(70);
  let calcResult = $state<any>(null);
  let isCalculating = $state(false);

  // Portfolio items
  let portfolioList = $state([
    {
      id: "INV-2026-041",
      projectName: "Kemitraan Modal Usaha Kuliner Halal Solo",
      akad: "Musyarakah",
      amount: 25000000,
      tenorMonths: 12,
      progressMonths: 7,
      nisbahInvestor: "70%",
      projectedYield: "14.5% p.a.",
      status: "Lancar (Kolek 1)",
      lastProfit: 302083,
      certUrl: "#",
    },
    {
      id: "INV-2026-089",
      projectName: "Invoice Financing Pengadaan Mesin Tekstil",
      akad: "Wakalah bil Ujrah",
      amount: 50000000,
      tenorMonths: 6,
      progressMonths: 3,
      nisbahInvestor: "80%",
      projectedYield: "12.0% p.a.",
      status: "Lancar (Kolek 1)",
      lastProfit: 500000,
      certUrl: "#",
    },
  ]);

  onMount(() => {
    fetchCmsContent();
    runCalculator();
  });

  function handleLogin(e: Event) {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      authError = "Silakan masukkan email dan kata sandi.";
      return;
    }
    isAuthenticated = true;
    authError = "";
    authSuccess = "Berhasil masuk ke Portal Pendana Syariah";
  }

  function handleDemoLogin() {
    emailInput = "dr.fajar.investor@gmail.com";
    passwordInput = "DemoLender123!";
    isAuthenticated = true;
    authError = "";
  }

  function handleLogout() {
    isAuthenticated = false;
    authSuccess = "";
  }

  function handleTopup(e: Event) {
    e.preventDefault();
    const amt = Number(topupAmount);
    if (amt <= 0) return;
    escrowBalance += amt;
    topupSuccessMsg = `Alhamdulillah! Permintaan deposit Rp ${amt.toLocaleString("id-ID")} berhasil dibuat. Silakan transfer ke VA ${topupBank}: 8809 3321 0092 1109 (PT Namia Escrow).`;
  }

  async function runCalculator() {
    isCalculating = true;
    try {
      const res = await fetch(`${API_BASE_URL}/api/calculator/investment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": NAMIA_API_KEY,
        },
        body: JSON.stringify({
          initialAmount: calcInitial,
          monthlyContribution: calcMonthly,
          projectedAnnualYieldPercent: calcRate,
          durationYears: calcYears,
          nisbahInvestorPercent: calcNisbah,
        }),
      });
      const json = await res.json();
      if (json.success) {
        calcResult = json.data;
      }
    } catch (e) {
      // Offline fallback calculation
      const totalContr = calcInitial + calcMonthly * calcYears * 12;
      const estReturn =
        totalContr * (calcRate / 100) * calcYears * (calcNisbah / 100);
      calcResult = {
        totalDeposited: totalContr,
        projectedGrossProfit: estReturn,
        projectedNetBalance: totalContr + estReturn,
        effectiveAnnualYieldPercent: ((calcRate * calcNisbah) / 100).toFixed(2),
      };
    } finally {
      isCalculating = false;
    }
  }

  function handleFundProject(productName: string, minAmt: number) {
    if (escrowBalance < minAmt) {
      alert(
        `Saldo Escrow Anda (Rp ${escrowBalance.toLocaleString("id-ID")}) belum mencukupi minimum pendanaan produk ini (Rp ${minAmt.toLocaleString("id-ID")}). Silakan lakukan Top-Up Saldo Escrow terlebih dahulu.`,
      );
      activeTab = "wallet";
      return;
    }
    escrowBalance -= minAmt;
    activeInvestmentTotal += minAmt;
    portfolioList.unshift({
      id: `INV-2026-0${Math.floor(Math.random() * 900) + 100}`,
      projectName: productName,
      akad: "Murabahah / Musyarakah",
      amount: minAmt,
      tenorMonths: 12,
      progressMonths: 0,
      nisbahInvestor: "70%",
      projectedYield: "14.0% p.a.",
      status: "Baru Disalurkan",
      lastProfit: 0,
      certUrl: "#",
    });
    alert(
      `Alhamdulillah! Pendanaan sebesar Rp ${minAmt.toLocaleString("id-ID")} untuk '${productName}' telah berhasil disalurkan dengan akad Ijab Qabul tersertifikasi digital.`,
    );
    activeTab = "portfolio";
  }
</script>

<svelte:head>
  <title>Portal Mitra Pendana Syariah (Lender) | Namia Syariah</title>
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

<div class="lender-portal-page">
  <!-- Top Portal Notice Bar -->
  <div class="portal-security-banner">
    <div class="container-legacy">
      <div class="d-flex align-items-center justify-content-between">
        <div class="security-text">
          <Lock size={14} class="inline-icon" />
          <strong>Area Aman Khusus Investor:</strong> Portal Mitra Pendana
          (Lender) Namia Syariah.
          <span class="text-muted text-xs ms-2"
            >Terproteksi Rekening Escrow Perbankan Syariah Berizin OJK.</span
          >
        </div>
        <div class="security-badge">
          <span class="badge badge-success">PORTAL PENDANA</span>
        </div>
      </div>
    </div>
  </div>

  <div class="container-legacy my-4">
    <!-- Breadcrumbs -->
    <ul class="breadcrumb-legacy">
      <li><a href="/">Beranda</a></li>
      <li><a href="/investor">Pendana Syariah</a></li>
      <li class="active">Portal CMS Lender</li>
    </ul>

    {#if !isAuthenticated}
      <!-- AUTHENTICATION FORM (LOGIN / REGISTER) -->
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="panel panel-success auth-panel">
            <div class="panel-heading text-center">
              <h4 class="panel-title mb-1 text-white">
                <Coins size={18} class="inline-icon" /> Masuk Portal Pendana (Lender)
              </h4>
              <p class="text-xs mb-0 text-white-75">
                Kelola Portofolio Investasi Riil Halal & Bagi Hasil Nisbah
              </p>
            </div>
            <div class="panel-body">
              {#if authError}
                <div class="alert alert-danger py-2 text-sm mb-3">
                  <AlertCircle size={15} class="inline-icon" />
                  {authError}
                </div>
              {/if}

              {#if authSuccess}
                <div class="alert alert-success py-2 text-sm mb-3">
                  <CheckCircle2 size={15} class="inline-icon" />
                  {authSuccess}
                </div>
              {/if}

              <!-- Auth Mode Tabs -->
              <div class="btn-group btn-group-justified mb-3">
                <button
                  type="button"
                  class="btn btn-sm {authMode === 'login'
                    ? 'btn-success active'
                    : 'btn-default'}"
                  onclick={() => {
                    authMode = "login";
                    authError = "";
                  }}
                >
                  Masuk Pendana
                </button>
                <button
                  type="button"
                  class="btn btn-sm {authMode === 'register'
                    ? 'btn-success active'
                    : 'btn-default'}"
                  onclick={() => {
                    authMode = "register";
                    authError = "";
                  }}
                >
                  Daftar Akun Baru
                </button>
              </div>

              {#if authMode === "login"}
                <form onsubmit={handleLogin}>
                  <div class="form-group mb-3">
                    <label class="control-label text-sm" for="lender-email"
                      >Email Terdaftar:</label
                    >
                    <input
                      id="lender-email"
                      type="email"
                      class="form-control"
                      placeholder="investor@gmail.com"
                      bind:value={emailInput}
                      required
                    />
                  </div>

                  <div class="form-group mb-3">
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <label
                        class="control-label text-sm mb-0"
                        for="lender-password">Kata Sandi:</label
                      >
                      <button
                        type="button"
                        class="btn-link text-xs p-0 border-0 bg-transparent"
                        onclick={() => {
                          authMode = "forgot";
                        }}
                      >
                        Lupa Sandi?
                      </button>
                    </div>
                    <input
                      id="lender-password"
                      type="password"
                      class="form-control"
                      placeholder="••••••••••••"
                      bind:value={passwordInput}
                      required
                    />
                  </div>

                  <div class="checkbox mb-3">
                    <label class="text-xs">
                      <input type="checkbox" checked /> Simpan sesi di peramban ini
                    </label>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-success btn-block w-100 mb-2"
                  >
                    <Lock size={14} class="inline-icon" /> Masuk ke Dashboard Pendana
                  </button>

                  <div
                    class="demo-auth-box text-center p-2 mt-3 bg-light border"
                  >
                    <p class="text-xs text-muted mb-1">
                      Akses cepat untuk inspeksi portofolio & simulasi:
                    </p>
                    <button
                      type="button"
                      class="btn btn-xs btn-default border"
                      onclick={handleDemoLogin}
                    >
                      Buka Demo Akun Pendana (Fajar Wicaksono, ST)
                    </button>
                  </div>
                </form>
              {:else if authMode === "register"}
                <form
                  onsubmit={(e) => {
                    e.preventDefault();
                    handleDemoLogin();
                  }}
                >
                  <div class="form-group mb-2">
                    <label class="control-label text-xs"
                      >Nama Lengkap (Sesuai KTP):</label
                    >
                    <input
                      type="text"
                      class="form-control input-sm"
                      placeholder="Fajar Wicaksono, ST"
                      bind:value={fullNameInput}
                      required
                    />
                  </div>
                  <div class="form-group mb-2">
                    <label class="control-label text-xs"
                      >Nomor WhatsApp Aktif:</label
                    >
                    <input
                      type="tel"
                      class="form-control input-sm"
                      placeholder="081234567890"
                      bind:value={phoneInput}
                      required
                    />
                  </div>
                  <div class="form-group mb-2">
                    <label class="control-label text-xs">Email:</label>
                    <input
                      type="email"
                      class="form-control input-sm"
                      placeholder="fajar@gmail.com"
                      bind:value={emailInput}
                      required
                    />
                  </div>
                  <div class="form-group mb-3">
                    <label class="control-label text-xs">Kata Sandi Akun:</label
                    >
                    <input
                      type="password"
                      class="form-control input-sm"
                      placeholder="Minimal 8 karakter"
                      bind:value={passwordInput}
                      required
                    />
                  </div>
                  <button type="submit" class="btn btn-success btn-block w-100">
                    <UserCheck size={14} class="inline-icon" /> Registrasi Akun Pendana
                  </button>
                </form>
              {:else}
                <div class="forgot-box text-center py-3">
                  <p class="text-sm">
                    Masukkan email Anda untuk menerima tautan pemulihan sandi
                    aman.
                  </p>
                  <input
                    type="email"
                    class="form-control mb-3"
                    placeholder="email@gmail.com"
                  />
                  <button
                    type="button"
                    class="btn btn-success btn-sm mb-2"
                    onclick={() => {
                      authSuccess = "Tautan pemulihan dikirim ke email";
                      authMode = "login";
                    }}
                  >
                    Kirim Tautan Reset
                  </button>
                  <br />
                  <button
                    type="button"
                    class="btn-link text-xs"
                    onclick={() => {
                      authMode = "login";
                    }}
                  >
                    Kembali ke Login
                  </button>
                </div>
              {/if}
            </div>
            <div class="panel-footer text-center text-xs text-muted">
              Dana Anda ditempatkan pada Rekening Escrow Terpisah yang diawasi
              OJK.
            </div>
          </div>
        </div>
      </div>
    {:else}
      <!-- AUTHENTICATED LENDER DASHBOARD -->
      <div class="lender-dashboard-header panel panel-default mb-4">
        <div class="panel-body">
          <div
            class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
          >
            <div>
              <div class="d-flex align-items-center gap-2 mb-1">
                <span class="badge badge-success"
                  >PENDANA TERVERIFIKASI (E-KYC)</span
                >
                <span class="badge badge-default">ID: LND-882910</span>
              </div>
              <h3 class="panel-title text-xl font-bold mb-1">
                Fajar Wicaksono, S.T.
              </h3>
              <p class="text-sm text-muted mb-0">
                Kategori: Investor Retail Mandiri | Rekening Penampung: BSI
                (Bank Syariah Indonesia)
              </p>
            </div>
            <div class="d-flex align-items-center gap-2">
              <button
                type="button"
                class="btn btn-sm btn-success"
                onclick={() => {
                  activeTab = "wallet";
                }}
              >
                <Wallet size={14} class="inline-icon" /> Top Up Escrow
              </button>
              <button
                type="button"
                class="btn btn-sm btn-primary"
                onclick={() => {
                  activeTab = "marketplace";
                }}
              >
                <Search size={14} class="inline-icon" /> Katalog Proyek
              </button>
              <button
                type="button"
                class="btn btn-sm btn-default"
                onclick={handleLogout}
              >
                <LogOut size={14} class="inline-icon" /> Keluar
              </button>
            </div>
          </div>
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
            <TrendingUp size={14} class="inline-icon" /> Ringkasan Portofolio
          </button>
        </li>
        <li class={activeTab === "marketplace" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "marketplace";
            }}
          >
            <Briefcase size={14} class="inline-icon" /> Katalog Proyek UMKM
          </button>
        </li>
        <li class={activeTab === "portfolio" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "portfolio";
            }}
          >
            <ShieldCheck size={14} class="inline-icon" /> Pendanaan Saya ({portfolioList.length})
          </button>
        </li>
        <li class={activeTab === "wallet" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "wallet";
            }}
          >
            <Wallet size={14} class="inline-icon" /> Dompet Escrow & Rekening
          </button>
        </li>
        <li class={activeTab === "calculator" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "calculator";
            }}
          >
            <Calculator size={14} class="inline-icon" /> Kalkulator Nisbah Syariah
          </button>
        </li>
      </ul>

      <!-- TAB CONTENTS -->
      {#if activeTab === "overview"}
        <!-- Key Metrics Cards -->
        <div class="row mb-4">
          <div class="col-sm-6 col-md-3 mb-3">
            <div class="stat-card-legacy">
              <div class="stat-icon bg-success-subtle text-success">
                <Wallet size={20} />
              </div>
              <div class="stat-content">
                <div class="stat-label">Saldo Escrow Siap Danai</div>
                <div class="stat-value text-success">
                  Rp {escrowBalance.toLocaleString("id-ID")}
                </div>
                <div class="stat-sub">Virtual Account BSI</div>
              </div>
            </div>
          </div>

          <div class="col-sm-6 col-md-3 mb-3">
            <div class="stat-card-legacy">
              <div class="stat-icon bg-primary-subtle text-primary">
                <Coins size={20} />
              </div>
              <div class="stat-content">
                <div class="stat-label">Total Dana Terdanai Aktif</div>
                <div class="stat-value">
                  Rp {activeInvestmentTotal.toLocaleString("id-ID")}
                </div>
                <div class="stat-sub">
                  Tersebar di {portfolioList.length} Proyek
                </div>
              </div>
            </div>
          </div>

          <div class="col-sm-6 col-md-3 mb-3">
            <div class="stat-card-legacy">
              <div class="stat-icon bg-info-subtle text-info">
                <TrendingUp size={20} />
              </div>
              <div class="stat-content">
                <div class="stat-label">Akumulasi Bagi Hasil</div>
                <div class="stat-value text-primary font-bold">
                  Rp {totalProfitEarned.toLocaleString("id-ID")}
                </div>
                <div class="stat-sub">Imbal hasil bersih diterima</div>
              </div>
            </div>
          </div>

          <div class="col-sm-6 col-md-3 mb-3">
            <div class="stat-card-legacy">
              <div class="stat-icon bg-warning-subtle text-warning">
                <ShieldCheck size={20} />
              </div>
              <div class="stat-content">
                <div class="stat-label">Tingkat Pengembalian (TKB90)</div>
                <div class="stat-value text-success font-bold">99,82%</div>
                <div class="stat-sub">Underwriting 5C & Proteksi</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Ongoing Investments Summary -->
        <div class="panel panel-default mb-4">
          <div
            class="panel-heading d-flex justify-content-between align-items-center"
          >
            <h4 class="panel-title mb-0">
              <TrendingUp size={16} class="inline-icon" /> Proyek Aktif dalam Portofolio
              Anda
            </h4>
            <button
              type="button"
              class="btn btn-xs btn-default"
              onclick={() => {
                activeTab = "portfolio";
              }}
            >
              Lihat Semua Portofolio
            </button>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-striped mb-0">
              <thead>
                <tr class="active">
                  <th>ID Pendanaan</th>
                  <th>Nama Proyek & Mitra</th>
                  <th>Akad</th>
                  <th>Nilai Pokok</th>
                  <th>Nisbah & Proyeksi</th>
                  <th>Bagi Hasil Terakhir</th>
                  <th>Status Portofolio</th>
                </tr>
              </thead>
              <tbody>
                {#each portfolioList as p}
                  <tr>
                    <td><code>{p.id}</code></td>
                    <td><strong>{p.projectName}</strong></td>
                    <td><span class="badge badge-default">{p.akad}</span></td>
                    <td>Rp {p.amount.toLocaleString("id-ID")}</td>
                    <td>{p.nisbahInvestor} ({p.projectedYield})</td>
                    <td class="text-success font-bold"
                      >+Rp {p.lastProfit.toLocaleString("id-ID")}</td
                    >
                    <td><span class="badge badge-success">{p.status}</span></td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if activeTab === "marketplace"}
        <!-- Live Project Marketplace from CMS API -->
        <div class="panel panel-default mb-4">
          <div class="panel-heading">
            <h4 class="panel-title">
              <Briefcase size={16} class="inline-icon" /> Katalog Proyek Pembiayaan
              UMKM Produktif Siap Danai
            </h4>
          </div>
          <div class="panel-body">
            <p class="text-sm text-muted mb-3">
              Seluruh proyek pembiayaan telah melalui proses underwriting
              kelayakan 5C dan verifikasi kesesuaian syariah oleh Dewan Pengawas
              Syariah DSN-MUI.
            </p>

            <div class="row">
              {#each products as prod}
                <div class="col-md-6 col-lg-4 mb-3">
                  <div
                    class="panel panel-default h-100 d-flex flex-column border"
                  >
                    <div class="panel-heading bg-light">
                      <div
                        class="d-flex justify-content-between align-items-start"
                      >
                        <span class="badge badge-primary"
                          >{prod.contractType}</span
                        >
                        <span class="badge badge-success"
                          >Rating {prod.rating || 4.9} ★</span
                        >
                      </div>
                      <h5 class="panel-title text-base font-bold mt-2 mb-0">
                        {prod.name}
                      </h5>
                      <span class="text-xs text-muted"
                        >{prod.provider || "PT Namia Finansial Teknologi"}</span
                      >
                    </div>
                    <div class="panel-body flex-grow-1 text-xs">
                      <p class="text-muted mb-2">{prod.description}</p>
                      <hr class="my-2" />
                      <div class="d-flex justify-content-between mb-1">
                        <span>Plafon Proyek:</span>
                        <strong
                          >s/d Rp {(prod.maxAmount / 1000000).toLocaleString(
                            "id-ID",
                          )} Juta</strong
                        >
                      </div>
                      <div class="d-flex justify-content-between mb-1">
                        <span>Tenor Pendanaan:</span>
                        <strong
                          >{prod.minTenorMonths} - {prod.maxTenorMonths} Bulan</strong
                        >
                      </div>
                      <div class="d-flex justify-content-between mb-1">
                        <span>Proyeksi Margin / Bagi Hasil:</span>
                        <strong class="text-success font-bold"
                          >{prod.interestRateAnnual > 0
                            ? `${prod.interestRateAnnual}% p.a.`
                            : "Sosial / 0%"}</strong
                        >
                      </div>
                      <div class="d-flex justify-content-between">
                        <span>Min. Pendanaan:</span>
                        <strong class="text-primary"
                          >Rp {prod.minAmount.toLocaleString("id-ID")}</strong
                        >
                      </div>
                    </div>
                    <div class="panel-footer bg-white border-top">
                      <button
                        type="button"
                        class="btn btn-sm btn-success btn-block w-100"
                        onclick={() =>
                          handleFundProject(prod.name, prod.minAmount)}
                      >
                        <Coins size={14} class="inline-icon" /> Danai Proyek Ini
                      </button>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {:else if activeTab === "portfolio"}
        <!-- Detailed Portfolio List -->
        <div class="panel panel-default mb-4">
          <div class="panel-heading">
            <h4 class="panel-title">
              <ShieldCheck size={16} class="inline-icon" /> Rincian Akad & Portofolio
              Pendanaan Anda
            </h4>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-striped mb-0">
              <thead>
                <tr class="active">
                  <th>ID Pendanaan</th>
                  <th>Nama Proyek</th>
                  <th>Akad Muamalah</th>
                  <th>Pokok Investasi</th>
                  <th>Tenor</th>
                  <th>Nisbah Hasil</th>
                  <th>Bagi Hasil Bulanan</th>
                  <th>Status</th>
                  <th>Sertifikat Akad</th>
                </tr>
              </thead>
              <tbody>
                {#each portfolioList as p}
                  <tr>
                    <td><code>{p.id}</code></td>
                    <td><strong>{p.projectName}</strong></td>
                    <td><span class="badge badge-default">{p.akad}</span></td>
                    <td>Rp {p.amount.toLocaleString("id-ID")}</td>
                    <td>{p.progressMonths}/{p.tenorMonths} Bulan</td>
                    <td>{p.nisbahInvestor}</td>
                    <td class="text-success font-bold"
                      >+Rp {p.lastProfit.toLocaleString("id-ID")}</td
                    >
                    <td><span class="badge badge-success">{p.status}</span></td>
                    <td>
                      <button
                        type="button"
                        class="btn btn-xs btn-default"
                        onclick={() =>
                          alert(`Unduh Sertifikat Ijab Qabul Digital: ${p.id}`)}
                      >
                        <Download size={12} class="inline-icon" /> Unduh Akad
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if activeTab === "wallet"}
        <!-- Wallet & Escrow Management -->
        <div class="row">
          <div class="col-md-6">
            <div class="panel panel-primary">
              <div class="panel-heading">
                <h4 class="panel-title">
                  <Wallet size={16} class="inline-icon" /> Top-Up Saldo Dompet Escrow
                </h4>
              </div>
              <div class="panel-body">
                {#if topupSuccessMsg}
                  <div class="alert alert-success text-xs mb-3">
                    <CheckCircle2 size={14} class="inline-icon" />
                    {topupSuccessMsg}
                  </div>
                {/if}

                <form onsubmit={handleTopup}>
                  <div class="form-group mb-3">
                    <label class="control-label text-xs"
                      >Pilih Bank Virtual Account Tujuan:</label
                    >
                    <select
                      class="form-control input-sm"
                      bind:value={topupBank}
                    >
                      <option value="BSI"
                        >Bank Syariah Indonesia (BSI) - VA 8809 3321 0092 1109</option
                      >
                      <option value="Muamalat"
                        >Bank Muamalat - VA 8809 3321 0092 1109</option
                      >
                      <option value="BCA Syariah"
                        >BCA Syariah - VA 8809 3321 0092 1109</option
                      >
                    </select>
                  </div>

                  <div class="form-group mb-3">
                    <label class="control-label text-xs"
                      >Nominal Deposit (Rp):</label
                    >
                    <input
                      type="number"
                      step="500000"
                      min="1000000"
                      class="form-control input-sm"
                      bind:value={topupAmount}
                      required
                    />
                    <span class="text-xs text-muted"
                      >Minimal deposit Rp 1.000.000</span
                    >
                  </div>

                  <button type="submit" class="btn btn-success">
                    <CreditCard size={14} class="inline-icon" /> Buat Tagihan Deposit
                    Virtual Account
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h4 class="panel-title">
                  <ArrowDownRight size={16} class="inline-icon" /> Penarikan Dana
                  (Withdrawal)
                </h4>
              </div>
              <div class="panel-body">
                <p class="text-xs text-muted">
                  Bagi hasil atau saldo escrow yang belum dialokasikan dapat
                  dicairkan kembali ke rekening bank terdaftar Anda kapan saja
                  pada hari kerja.
                </p>
                <div class="form-group mb-3">
                  <label class="control-label text-xs"
                    >Rekening Tujuan Terdaftar:</label
                  >
                  <input
                    type="text"
                    class="form-control input-sm"
                    value="BSI - 7192839102 a/n Fajar Wicaksono"
                    readonly
                  />
                </div>
                <div class="form-group mb-3">
                  <label class="control-label text-xs"
                    >Nominal Penarikan (Rp):</label
                  >
                  <input
                    type="number"
                    class="form-control input-sm"
                    placeholder="Maks. Rp 24.500.000"
                    max={escrowBalance}
                  />
                </div>
                <button
                  type="button"
                  class="btn btn-default"
                  onclick={() =>
                    alert(
                      "Permintaan penarikan berhasil diajukan ke bagian Treasury Syariah.",
                    )}
                >
                  Tarik Dana ke Rekening Saya
                </button>
              </div>
            </div>
          </div>
        </div>
      {:else if activeTab === "calculator"}
        <!-- Interactive Investment ROI Calculator -->
        <div class="panel panel-default">
          <div class="panel-heading">
            <h4 class="panel-title">
              <Calculator size={16} class="inline-icon" /> Simulasi Proyeksi Imbal
              Hasil (Nisbah Syariah)
            </h4>
          </div>
          <div class="panel-body">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group mb-2">
                  <label class="control-label text-xs"
                    >Modal Awal Pendanaan (Rp):</label
                  >
                  <input
                    type="number"
                    step="1000000"
                    class="form-control input-sm"
                    bind:value={calcInitial}
                    oninput={runCalculator}
                  />
                </div>
                <div class="form-group mb-2">
                  <label class="control-label text-xs"
                    >Kontribusi Tambahan Bulanan (Rp):</label
                  >
                  <input
                    type="number"
                    step="500000"
                    class="form-control input-sm"
                    bind:value={calcMonthly}
                    oninput={runCalculator}
                  />
                </div>
                <div class="form-group mb-2">
                  <label class="control-label text-xs"
                    >Durasi Waktu Pendanaan (Tahun):</label
                  >
                  <select
                    class="form-control input-sm"
                    bind:value={calcYears}
                    onchange={runCalculator}
                  >
                    <option value={1}>1 Tahun</option>
                    <option value={2}>2 Tahun</option>
                    <option value={3}>3 Tahun</option>
                    <option value={5}>5 Tahun</option>
                  </select>
                </div>
                <div class="form-group mb-3">
                  <label class="control-label text-xs"
                    >Proyeksi Laba Proyek UMKM (% p.a.):</label
                  >
                  <input
                    type="number"
                    step="0.5"
                    class="form-control input-sm"
                    bind:value={calcRate}
                    oninput={runCalculator}
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="p-3 bg-light border">
                  <h5 class="font-bold text-sm mb-3">
                    Hasil Simulasi Nisbah ({calcNisbah}% Hak Investor):
                  </h5>
                  {#if calcResult}
                    <div class="d-flex justify-content-between text-xs mb-2">
                      <span>Total Pokok Modal Disetor:</span>
                      <strong
                        >Rp {Math.round(
                          calcResult.totalDeposited || 0,
                        ).toLocaleString("id-ID")}</strong
                      >
                    </div>
                    <div class="d-flex justify-content-between text-xs mb-2">
                      <span>Proyeksi Keuntungan Bagi Hasil:</span>
                      <strong class="text-success font-bold"
                        >+Rp {Math.round(
                          calcResult.projectedGrossProfit || 0,
                        ).toLocaleString("id-ID")}</strong
                      >
                    </div>
                    <hr class="my-2" />
                    <div class="d-flex justify-content-between text-sm mb-1">
                      <span class="font-bold">Total Akumulasi Nilai Aset:</span>
                      <strong class="text-primary font-bold"
                        >Rp {Math.round(
                          calcResult.projectedNetBalance || 0,
                        ).toLocaleString("id-ID")}</strong
                      >
                    </div>
                    <div
                      class="d-flex justify-content-between text-xs text-muted"
                    >
                      <span>Imbal Hasil Efektif:</span>
                      <span
                        >~{calcResult.effectiveAnnualYieldPercent || "10.15"}%
                        per tahun</span
                      >
                    </div>
                  {/if}
                </div>
                <p class="text-xs text-muted mt-2">
                  *Simulasi ini menggunakan kalkulasi riil dari backend service <code
                    >/api/calculator/investment</code
                  >. Hasil actual mengacu pada kinerja riil proyek mitra.
                </p>
              </div>
            </div>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .lender-portal-page {
    background-color: #f5f5f5;
    min-height: 80vh;
    padding-bottom: 40px;
  }

  .portal-security-banner {
    background-color: #1e3a8a;
    color: #ffffff;
    padding: 6px 0;
    font-size: 12px;
    border-bottom: 2px solid #2563eb;
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
    margin-top: 30px;
    border: 1px solid #047857;
  }
</style>
