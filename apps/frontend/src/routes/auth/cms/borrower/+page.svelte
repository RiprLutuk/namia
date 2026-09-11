<script lang="ts">
  import { onMount } from "svelte";
  import {
    ShieldCheck,
    Building2,
    CheckCircle2,
    FileText,
    UploadCloud,
    UserCheck,
    Coins,
    Calendar,
    AlertCircle,
    ArrowRight,
    Lock,
    Send,
    LogOut,
    PlusCircle,
    FileUp,
    PhoneCall,
    Receipt,
    Briefcase,
  } from "lucide-svelte";
  import { API_BASE_URL, NAMIA_API_KEY } from "$lib/api";

  // Auth State
  let isAuthenticated = $state(false);
  let authMode = $state<"login" | "register" | "forgot">("login");
  let emailInput = $state("");
  let passwordInput = $state("");
  let companyNameInput = $state("");
  let phoneInput = $state("");
  let authError = $state("");
  let authSuccess = $state("");

  // Active Borrower Tab
  type BorrowerTab =
    | "overview"
    | "apply"
    | "schedule"
    | "documents"
    | "support";
  let activeTab = $state<BorrowerTab>("overview");

  // New Financing Application Form
  let applyData = $state({
    companyName: "PT Sumber Berkah Sejahtera",
    picName: "Ahmad Subarjo",
    email: "ahmad@sumberberkah.co.id",
    phone: "081234567890",
    needCategory: "pembiayaan-usaha",
    targetAmount: 150000000,
    targetTenorMonths: 12,
    contractType: "Murabahah",
    purpose: "Pengadaan bahan baku kain tekstil dan inventaris operasional",
    notes: "",
  });
  let isSubmitting = $state(false);
  let submitMessage = $state<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Mock Active Loans & Schedule Data
  let activeFacilities = $state([
    {
      id: "FIN-2026-081",
      productName: "Pembiayaan Pengadaan Bahan Baku (Murabahah)",
      akadNumber: "AKD/MRB/2026/0188",
      plafon: 200000000,
      remaining: 83333334,
      tenorTotal: 12,
      tenorRemaining: 5,
      installmentMonthly: 18055556,
      dueDate: "15 setiap bulan",
      vaNumber: "8809 1002 9182 3310",
      status: "Lancar (Kolek 1)",
      statusClass: "badge-success",
    },
  ]);

  let installmentSchedule = $state([
    {
      month: 8,
      date: "15 Okt 2026",
      amount: 18055556,
      principal: 16666667,
      margin: 1388889,
      status: "Menunggu Jatuh Tempo",
      va: "8809 1002 9182 3310",
    },
    {
      month: 9,
      date: "15 Nov 2026",
      amount: 18055556,
      principal: 16666667,
      margin: 1388889,
      status: "Akan Datang",
      va: "8809 1002 9182 3310",
    },
    {
      month: 10,
      date: "15 Des 2026",
      amount: 18055556,
      principal: 16666667,
      margin: 1388889,
      status: "Akan Datang",
      va: "8809 1002 9182 3310",
    },
    {
      month: 11,
      date: "15 Jan 2027",
      amount: 18055556,
      principal: 16666667,
      margin: 1388889,
      status: "Akan Datang",
      va: "8809 1002 9182 3310",
    },
    {
      month: 12,
      date: "15 Feb 2027",
      amount: 18055556,
      principal: 16666667,
      margin: 1388889,
      status: "Akan Datang",
      va: "8809 1002 9182 3310",
    },
  ]);

  function handleLogin(e: Event) {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
      authError = "Silakan lengkapi alamat email dan kata sandi.";
      return;
    }
    // Simulate authentication
    isAuthenticated = true;
    authError = "";
    authSuccess = "Berhasil masuk ke Portal Penerima Pembiayaan";
  }

  function handleDemoLogin() {
    emailInput = "mitra.usaha@sumberberkah.co.id";
    passwordInput = "DemoBorrower123!";
    isAuthenticated = true;
    authError = "";
  }

  function handleLogout() {
    isAuthenticated = false;
    authSuccess = "";
  }

  async function handleNewApplication(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    submitMessage = null;

    try {
      const payload = {
        fullName: applyData.picName,
        email: applyData.email,
        phone: applyData.phone,
        needCategory: applyData.needCategory,
        targetAmount: Number(applyData.targetAmount),
        targetTenorMonths: Number(applyData.targetTenorMonths),
        notes: `Badan Usaha: ${applyData.companyName} | Akad: ${applyData.contractType} | Tujuan: ${applyData.purpose}. ${applyData.notes}`,
      };

      const res = await fetch(`${API_BASE_URL}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": NAMIA_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        submitMessage = {
          type: "success",
          text: `Alhamdulillah! Pengajuan pembiayaan berhasil tercatat dengan Nomor Tiket: PROSPEK-${data.data?.id || "NEW"}. Analis Pembiayaan Syariah kami akan menghubungi Anda dalam 1x24 jam kerja.`,
        };
        // Reset purpose/notes
        applyData.notes = "";
      } else {
        throw new Error(
          data.message || "Gagal menyimpan pengajuan pembiayaan.",
        );
      }
    } catch (err: any) {
      submitMessage = {
        type: "error",
        text:
          err.message ||
          "Terjadi kesalahan jaringan saat mengirimkan pengajuan.",
      };
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Portal Mitra Penerima Pembiayaan (Borrower) | Namia Syariah</title>
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

<div class="borrower-portal-page">
  <!-- Top Portal Notice Bar -->
  <div class="portal-security-banner">
    <div class="container-legacy">
      <div class="d-flex align-items-center justify-content-between">
        <div class="security-text">
          <Lock size={14} class="inline-icon" />
          <strong>Area Aman Khusus Mitra:</strong> Portal Akses Penerima
          Pembiayaan (Borrower) Namia Syariah.
          <span class="text-muted text-xs ms-2"
            >Terkoneksi Enkripsi SSL 256-bit ISO 27001.</span
          >
        </div>
        <div class="security-badge">
          <span class="badge badge-warning">AREA INTERNAL</span>
        </div>
      </div>
    </div>
  </div>

  <div class="container-legacy my-4">
    <!-- Breadcrumbs -->
    <ul class="breadcrumb-legacy">
      <li><a href="/">Beranda</a></li>
      <li><a href="/borrower">Penerima Pembiayaan</a></li>
      <li class="active">Portal CMS Borrower</li>
    </ul>

    {#if !isAuthenticated}
      <!-- AUTHENTICATION FORM (LOGIN / REGISTER) -->
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="panel panel-primary auth-panel">
            <div class="panel-heading text-center">
              <h4 class="panel-title mb-1">
                <Building2 size={18} class="inline-icon" /> Masuk Portal Borrower
              </h4>
              <p class="text-xs mb-0 text-white-75">
                Kelola Fasilitas Pembiayaan Modal Kerja & Invoice Usaha
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
                    ? 'btn-primary active'
                    : 'btn-default'}"
                  onclick={() => {
                    authMode = "login";
                    authError = "";
                  }}
                >
                  Masuk Akun
                </button>
                <button
                  type="button"
                  class="btn btn-sm {authMode === 'register'
                    ? 'btn-primary active'
                    : 'btn-default'}"
                  onclick={() => {
                    authMode = "register";
                    authError = "";
                  }}
                >
                  Daftar Usaha Baru
                </button>
              </div>

              {#if authMode === "login"}
                <form onsubmit={handleLogin}>
                  <div class="form-group mb-3">
                    <label class="control-label text-sm" for="borrower-email"
                      >Email Terdaftar / Akun Usaha:</label
                    >
                    <input
                      id="borrower-email"
                      type="email"
                      class="form-control"
                      placeholder="nama@perusahaan.co.id"
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
                        for="borrower-password">Kata Sandi:</label
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
                      id="borrower-password"
                      type="password"
                      class="form-control"
                      placeholder="••••••••••••"
                      bind:value={passwordInput}
                      required
                    />
                  </div>

                  <div class="checkbox mb-3">
                    <label class="text-xs">
                      <input type="checkbox" checked /> Ingat kredensial di peramban
                      ini
                    </label>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-success btn-block w-100 mb-2"
                  >
                    <Lock size={14} class="inline-icon" /> Masuk ke Dashboard Borrower
                  </button>

                  <div
                    class="demo-auth-box text-center p-2 mt-3 bg-light border"
                  >
                    <p class="text-xs text-muted mb-1">
                      Butuh akses cepat untuk inspeksi & verifikasi?
                    </p>
                    <button
                      type="button"
                      class="btn btn-xs btn-default border"
                      onclick={handleDemoLogin}
                    >
                      Buka Demo Akun Borrower (PT Sumber Berkah)
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
                      >Nama Badan Usaha / PT / CV / UD:</label
                    >
                    <input
                      type="text"
                      class="form-control input-sm"
                      placeholder="PT Sumber Berkah Sejahtera"
                      bind:value={companyNameInput}
                      required
                    />
                  </div>
                  <div class="form-group mb-2">
                    <label class="control-label text-xs"
                      >Nomor Telepon / WhatsApp PIC:</label
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
                    <label class="control-label text-xs"
                      >Email Operasional Perusahaan:</label
                    >
                    <input
                      type="email"
                      class="form-control input-sm"
                      placeholder="direksi@usaha.co.id"
                      bind:value={emailInput}
                      required
                    />
                  </div>
                  <div class="form-group mb-3">
                    <label class="control-label text-xs">Kata Sandi Baru:</label
                    >
                    <input
                      type="password"
                      class="form-control input-sm"
                      placeholder="Minimal 8 karakter"
                      bind:value={passwordInput}
                      required
                    />
                  </div>
                  <button type="submit" class="btn btn-primary btn-block w-100">
                    <UserCheck size={14} class="inline-icon" /> Registrasi Akun Borrower
                  </button>
                </form>
              {:else}
                <div class="forgot-box text-center py-3">
                  <p class="text-sm">
                    Masukkan email terdaftar untuk menerima tautan pemulihan
                    sandi aman.
                  </p>
                  <input
                    type="email"
                    class="form-control mb-3"
                    placeholder="email@usaha.co.id"
                  />
                  <button
                    type="button"
                    class="btn btn-primary btn-sm mb-2"
                    onclick={() => {
                      authSuccess = "Tautan reset dikirim ke email";
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
              Supervisi Dewan Pengawas Syariah DSN-MUI & Otoritas Jasa Keuangan
              (OJK).
            </div>
          </div>
        </div>
      </div>
    {:else}
      <!-- AUTHENTICATED BORROWER DASHBOARD -->
      <div class="borrower-dashboard-header panel panel-default mb-4">
        <div class="panel-body">
          <div
            class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
          >
            <div>
              <div class="d-flex align-items-center gap-2 mb-1">
                <span class="badge badge-success">BORROWER TERVERIFIKASI</span>
                <span class="badge badge-default">NIB: 9120008129812</span>
              </div>
              <h3 class="panel-title text-xl font-bold mb-1">
                PT Sumber Berkah Sejahtera
              </h3>
              <p class="text-sm text-muted mb-0">
                PIC: Ahmad Subarjo (Direktur Utama) | Rekening Operasional: Bank
                Syariah Indonesia (BSI)
              </p>
            </div>
            <div class="d-flex align-items-center gap-2">
              <button
                type="button"
                class="btn btn-sm btn-primary"
                onclick={() => {
                  activeTab = "apply";
                }}
              >
                <PlusCircle size={14} class="inline-icon" /> Ajukan Pembiayaan Baru
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
            <Building2 size={14} class="inline-icon" /> Ringkasan Fasilitas
          </button>
        </li>
        <li class={activeTab === "apply" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "apply";
            }}
          >
            <PlusCircle size={14} class="inline-icon" /> Formulir Pengajuan
          </button>
        </li>
        <li class={activeTab === "schedule" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "schedule";
            }}
          >
            <Calendar size={14} class="inline-icon" /> Jadwal Angsuran & VA
          </button>
        </li>
        <li class={activeTab === "documents" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "documents";
            }}
          >
            <FileText size={14} class="inline-icon" /> Dokumen & Legalitas
          </button>
        </li>
        <li class={activeTab === "support" ? "active" : ""}>
          <button
            type="button"
            onclick={() => {
              activeTab = "support";
            }}
          >
            <PhoneCall size={14} class="inline-icon" /> Account Officer Syariah
          </button>
        </li>
      </ul>

      <!-- TAB CONTENTS -->
      {#if activeTab === "overview"}
        <!-- Key Metrics Cards -->
        <div class="row mb-4">
          <div class="col-sm-6 col-md-3 mb-3">
            <div class="stat-card-legacy">
              <div class="stat-icon bg-primary-subtle text-primary">
                <Coins size={20} />
              </div>
              <div class="stat-content">
                <div class="stat-label">Total Plafon Disetujui</div>
                <div class="stat-value">Rp 200 Juta</div>
                <div class="stat-sub">Akad Murabahah Aktif</div>
              </div>
            </div>
          </div>

          <div class="col-sm-6 col-md-3 mb-3">
            <div class="stat-card-legacy">
              <div class="stat-icon bg-success-subtle text-success">
                <Receipt size={20} />
              </div>
              <div class="stat-content">
                <div class="stat-label">Sisa Pokok Angsuran</div>
                <div class="stat-value">Rp 83,3 Juta</div>
                <div class="stat-sub">Sisa 5 Bulan Tenor</div>
              </div>
            </div>
          </div>

          <div class="col-sm-6 col-md-3 mb-3">
            <div class="stat-card-legacy">
              <div class="stat-icon bg-info-subtle text-info">
                <Calendar size={20} />
              </div>
              <div class="stat-content">
                <div class="stat-label">Jatuh Tempo Berikutnya</div>
                <div class="stat-value">15 Okt 2026</div>
                <div class="stat-sub">Rp 18.055.556</div>
              </div>
            </div>
          </div>

          <div class="col-sm-6 col-md-3 mb-3">
            <div class="stat-card-legacy">
              <div class="stat-icon bg-warning-subtle text-warning">
                <ShieldCheck size={20} />
              </div>
              <div class="stat-content">
                <div class="stat-label">Kolektibilitas SLIK</div>
                <div class="stat-value text-success font-bold">
                  Kolek 1 (Lancar)
                </div>
                <div class="stat-sub">Track record pembayaran prima</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Active Facilities Table -->
        <div class="panel panel-default mb-4">
          <div class="panel-heading">
            <h4 class="panel-title">
              <Briefcase size={16} class="inline-icon" /> Fasilitas Pembiayaan Aktif
            </h4>
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-striped mb-0">
              <thead>
                <tr class="active">
                  <th>ID Proyek</th>
                  <th>Produk & Akad</th>
                  <th>Nomor Akad</th>
                  <th>Plafon Awal</th>
                  <th>Sisa Angsuran</th>
                  <th>Angsuran / Bln</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {#each activeFacilities as f}
                  <tr>
                    <td><code>{f.id}</code></td>
                    <td><strong>{f.productName}</strong></td>
                    <td class="text-xs">{f.akadNumber}</td>
                    <td>Rp {f.plafon.toLocaleString("id-ID")}</td>
                    <td
                      ><span class="text-danger font-bold"
                        >Rp {f.remaining.toLocaleString("id-ID")}</span
                      ></td
                    >
                    <td>Rp {f.installmentMonthly.toLocaleString("id-ID")}</td>
                    <td
                      ><span class="badge {f.statusClass}">{f.status}</span></td
                    >
                    <td>
                      <button
                        type="button"
                        class="btn btn-xs btn-default"
                        onclick={() => {
                          activeTab = "schedule";
                        }}
                      >
                        Detail Jadwal
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if activeTab === "apply"}
        <!-- Apply Financing Form -->
        <div class="row">
          <div class="col-md-8">
            <div class="panel panel-primary">
              <div class="panel-heading">
                <h4 class="panel-title">
                  <PlusCircle size={16} class="inline-icon" /> Pengajuan Tambahan
                  Modal Usaha Syariah
                </h4>
              </div>
              <div class="panel-body">
                {#if submitMessage}
                  <div
                    class="alert alert-{submitMessage.type === 'success'
                      ? 'success'
                      : 'danger'} mb-3"
                  >
                    {#if submitMessage.type === "success"}
                      <CheckCircle2 size={16} class="inline-icon" />
                    {:else}
                      <AlertCircle size={16} class="inline-icon" />
                    {/if}
                    {submitMessage.text}
                  </div>
                {/if}

                <form onsubmit={handleNewApplication}>
                  <div class="row">
                    <div class="col-sm-6">
                      <div class="form-group mb-3">
                        <label class="control-label text-xs"
                          >Nama Perusahaan / Usaha:</label
                        >
                        <input
                          type="text"
                          class="form-control input-sm"
                          bind:value={applyData.companyName}
                          required
                        />
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="form-group mb-3">
                        <label class="control-label text-xs"
                          >Nama Penanggung Jawab (PIC):</label
                        >
                        <input
                          type="text"
                          class="form-control input-sm"
                          bind:value={applyData.picName}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-6">
                      <div class="form-group mb-3">
                        <label class="control-label text-xs"
                          >Email Korespondensi:</label
                        >
                        <input
                          type="email"
                          class="form-control input-sm"
                          bind:value={applyData.email}
                          required
                        />
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="form-group mb-3">
                        <label class="control-label text-xs"
                          >No. WhatsApp Aktif PIC:</label
                        >
                        <input
                          type="tel"
                          class="form-control input-sm"
                          bind:value={applyData.phone}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-6">
                      <div class="form-group mb-3">
                        <label class="control-label text-xs"
                          >Kategori Pembiayaan:</label
                        >
                        <select
                          class="form-control input-sm"
                          bind:value={applyData.needCategory}
                        >
                          <option value="pembiayaan-usaha"
                            >Modal Kerja UMKM (Musyarakah)</option
                          >
                          <option value="p2p-lending"
                            >Pengadaan Barang (Murabahah)</option
                          >
                          <option value="invoice-financing"
                            >Invoice & PO Financing (Wakalah bil Ujrah)</option
                          >
                          <option value="pembiayaan-sosial"
                            >Dana Talangan / Qardhul Hasan</option
                          >
                        </select>
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="form-group mb-3">
                        <label class="control-label text-xs"
                          >Skema Akad yang Diharapkan:</label
                        >
                        <select
                          class="form-control input-sm"
                          bind:value={applyData.contractType}
                        >
                          <option value="Murabahah"
                            >Murabahah (Jual Beli Margin Flat)</option
                          >
                          <option value="Musyarakah"
                            >Musyarakah (Bagi Hasil Untung-Rugi)</option
                          >
                          <option value="Ijarah"
                            >Ijarah (Sewa Manfaat Jasa)</option
                          >
                          <option value="Wakalah bil Ujrah"
                            >Wakalah bil Ujrah (Anjak Piutang Invoice)</option
                          >
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-sm-6">
                      <div class="form-group mb-3">
                        <label class="control-label text-xs"
                          >Nominal Pengajuan Modal (Rp):</label
                        >
                        <input
                          type="number"
                          step="10000000"
                          min="10000000"
                          max="2000000000"
                          class="form-control input-sm"
                          bind:value={applyData.targetAmount}
                          required
                        />
                        <span class="text-xs text-muted"
                          >Contoh: 150000000 (Rp 150 Juta)</span
                        >
                      </div>
                    </div>
                    <div class="col-sm-6">
                      <div class="form-group mb-3">
                        <label class="control-label text-xs"
                          >Tenor yang Diinginkan (Bulan):</label
                        >
                        <select
                          class="form-control input-sm"
                          bind:value={applyData.targetTenorMonths}
                        >
                          <option value={3}>3 Bulan</option>
                          <option value={6}>6 Bulan</option>
                          <option value={12}>12 Bulan (1 Tahun)</option>
                          <option value={18}>18 Bulan</option>
                          <option value={24}>24 Bulan (2 Tahun)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="form-group mb-3">
                    <label class="control-label text-xs"
                      >Tujuan Penggunaan Dana & Perputaran Usaha:</label
                    >
                    <textarea
                      class="form-control text-sm"
                      rows={3}
                      bind:value={applyData.purpose}
                      placeholder="Jelaskan kebutuhan pengadaan barang atau proyek invoice yang akan didanai..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-success"
                    disabled={isSubmitting}
                  >
                    {#if isSubmitting}
                      Mengirimkan Data...
                    {:else}
                      <Send size={14} class="inline-icon" /> Ajukan ke Analis Risiko
                      Syariah
                    {/if}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h4 class="panel-title">
                  <ShieldCheck size={16} class="inline-icon" /> Panduan Pengajuan
                  Cepat
                </h4>
              </div>
              <div class="panel-body text-xs">
                <ol class="ps-3 mb-0">
                  <li class="mb-2">
                    Pastikan usaha Anda telah berjalan aktif minimal 1 tahun dan
                    memiliki legalitas resmi (NIB/SIUP/NPWP).
                  </li>
                  <li class="mb-2">
                    Siapkan mutasi rekening koran operasional 3-6 bulan terakhir
                    dalam format PDF resmi perbankan.
                  </li>
                  <li class="mb-2">
                    Untuk pembiayaan invoice, lampirkan salinan Purchase Order
                    (PO) atau kontrak kerja yang sah dari Payor.
                  </li>
                  <li class="mb-2">
                    Seluruh margin keuntungan dan ujrah disepakati transparan di
                    awal tanpa ada denda bunga berjalan.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      {:else if activeTab === "schedule"}
        <!-- Installment Schedule & Escrow VA -->
        <div class="panel panel-default mb-4">
          <div class="panel-heading">
            <div class="d-flex justify-content-between align-items-center">
              <h4 class="panel-title">
                <Calendar size={16} class="inline-icon" /> Jadwal Angsuran Pembiayaan
                Berjalan
              </h4>
              <span class="badge badge-info"
                >VA Escrow BSI: 8809 1002 9182 3310</span
              >
            </div>
          </div>
          <div class="panel-body text-xs text-muted pb-0">
            Pembayaran angsuran disetor ke Rekening Virtual Account Escrow resmi
            Namia Syariah. Mohon tidak mentransfer dana ke rekening perorangan.
          </div>
          <div class="table-responsive">
            <table class="table table-bordered table-striped mb-0">
              <thead>
                <tr class="active">
                  <th>Angsuran Ke</th>
                  <th>Jatuh Tempo</th>
                  <th>Porsi Pokok</th>
                  <th>Porsi Margin Akad</th>
                  <th>Total Angsuran</th>
                  <th>Nomor Virtual Account</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {#each installmentSchedule as s}
                  <tr>
                    <td><strong>Ke-{s.month}</strong></td>
                    <td>{s.date}</td>
                    <td>Rp {s.principal.toLocaleString("id-ID")}</td>
                    <td>Rp {s.margin.toLocaleString("id-ID")}</td>
                    <td
                      ><strong>Rp {s.amount.toLocaleString("id-ID")}</strong
                      ></td
                    >
                    <td><code>{s.va}</code></td>
                    <td>
                      {#if s.status === "Menunggu Jatuh Tempo"}
                        <span class="badge badge-warning">{s.status}</span>
                      {:else}
                        <span class="badge badge-default">{s.status}</span>
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if activeTab === "documents"}
        <!-- Document Management -->
        <div class="panel panel-default">
          <div class="panel-heading">
            <h4 class="panel-title">
              <FileText size={16} class="inline-icon" /> Berkas Legalitas & Kepatuhan
              KYC Usaha
            </h4>
          </div>
          <div class="panel-body">
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr class="active">
                    <th>Nama Dokumen</th>
                    <th>Wajib / Opsional</th>
                    <th>Status Verifikasi</th>
                    <th>Terakhir Diperbarui</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>KTP Direksi / Penanggung Jawab Usaha</td>
                    <td><span class="badge badge-danger">Wajib</span></td>
                    <td
                      ><span class="badge badge-success"
                        ><CheckCircle2 size={12} class="inline-icon" /> Terverifikasi</span
                      ></td
                    >
                    <td>10 Jan 2026</td>
                    <td
                      ><button class="btn btn-xs btn-default"
                        >Unduh Salinan</button
                      ></td
                    >
                  </tr>
                  <tr>
                    <td>NPWP Perusahaan & Pribadi</td>
                    <td><span class="badge badge-danger">Wajib</span></td>
                    <td
                      ><span class="badge badge-success"
                        ><CheckCircle2 size={12} class="inline-icon" /> Terverifikasi</span
                      ></td
                    >
                    <td>10 Jan 2026</td>
                    <td
                      ><button class="btn btn-xs btn-default"
                        >Unduh Salinan</button
                      ></td
                    >
                  </tr>
                  <tr>
                    <td>Nomor Induk Berusaha (NIB) / Izin Usaha</td>
                    <td><span class="badge badge-danger">Wajib</span></td>
                    <td
                      ><span class="badge badge-success"
                        ><CheckCircle2 size={12} class="inline-icon" /> Terverifikasi</span
                      ></td
                    >
                    <td>12 Jan 2026</td>
                    <td
                      ><button class="btn btn-xs btn-default"
                        >Unduh Salinan</button
                      ></td
                    >
                  </tr>
                  <tr>
                    <td>Rekening Koran Operasional (3 Bulan)</td>
                    <td><span class="badge badge-danger">Wajib</span></td>
                    <td
                      ><span class="badge badge-warning"
                        >Perlu Update Periode Baru</span
                      ></td
                    >
                    <td>01 Jul 2026</td>
                    <td
                      ><button class="btn btn-xs btn-primary"
                        ><UploadCloud size={12} class="inline-icon" /> Unggah Baru</button
                      ></td
                    >
                  </tr>
                  <tr>
                    <td>Laporan Keuangan Sederhana 2025</td>
                    <td><span class="badge badge-default">Pendukung</span></td>
                    <td
                      ><span class="badge badge-success"
                        ><CheckCircle2 size={12} class="inline-icon" /> Terverifikasi</span
                      ></td
                    >
                    <td>15 Feb 2026</td>
                    <td
                      ><button class="btn btn-xs btn-default"
                        >Unduh Salinan</button
                      ></td
                    >
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      {:else if activeTab === "support"}
        <!-- Account Officer Support -->
        <div class="row">
          <div class="col-md-6">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h4 class="panel-title">
                  <PhoneCall size={16} class="inline-icon" /> Kontak Account Officer
                  Khusus
                </h4>
              </div>
              <div class="panel-body">
                <div class="d-flex align-items-center gap-3 mb-3">
                  <img
                    src="/images/team/p_riki_sq.jpeg"
                    alt="AO"
                    class="img-thumbnail"
                    style="width: 70px; height: 70px; object-fit: cover;"
                  />
                  <div>
                    <h5 class="mb-1 font-bold">Maulana Riki Alamsyah, SE</h5>
                    <p class="text-xs text-muted mb-1">
                      Senior Sharia Financing Specialist
                    </p>
                    <span class="badge badge-success"
                      >Online & Siap Membantu</span
                    >
                  </div>
                </div>
                <p class="text-sm">
                  Untuk konsultasi perpanjangan tenor, restrukturisasi akad,
                  atau penambahan plafon baru, Anda dapat berdiskusi langsung
                  dengan tim pendamping kami.
                </p>
                <div class="d-flex gap-2">
                  <a
                    href="https://wa.me/6281283782337?text=Halo%20Namia%20Syariah,%20saya%20Borrower%20PT%20Sumber%20Berkah"
                    target="_blank"
                    class="btn btn-sm btn-success"
                  >
                    Hubungi via WhatsApp
                  </a>
                  <a
                    href="mailto:salam@namia.id?subject=Konsultasi%20Borrower%20Sumber%20Berkah"
                    class="btn btn-sm btn-default"
                  >
                    Kirim Email Resmi
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="panel panel-default">
              <div class="panel-heading">
                <h4 class="panel-title">
                  <ShieldCheck size={16} class="inline-icon" /> Hotline Pengaduan
                  Konsumen & Syariah
                </h4>
              </div>
              <div class="panel-body text-sm">
                <p>
                  Jika Anda memiliki pertanyaan seputar kesesuaian syariah atau
                  membutuhkan klarifikasi akad, silakan hubungi Sekretariat
                  Dewan Pengawas Syariah Namia:
                </p>
                <ul class="list-unstyled mb-0">
                  <li class="mb-1">
                    <strong>Telepon:</strong> (021) 8378 2337
                  </li>
                  <li class="mb-1"><strong>Email DPS:</strong> dps@namia.id</li>
                  <li>
                    <strong>Alamat Kantor:</strong> Menara MTH Lantai 10, Jl. MT
                    Haryono Kav 23, Jakarta Selatan
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div>

<style>
  .borrower-portal-page {
    background-color: #f5f5f5;
    min-height: 80vh;
    padding-bottom: 40px;
  }

  .portal-security-banner {
    background-color: #333333;
    color: #ffffff;
    padding: 6px 0;
    font-size: 12px;
    border-bottom: 2px solid #047857;
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
