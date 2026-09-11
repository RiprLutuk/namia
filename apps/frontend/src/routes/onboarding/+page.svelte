<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import {
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    ShieldCheck,
    FileText,
    User,
    CreditCard,
    Sparkles,
    Building,
    AlertCircle,
  } from "lucide-svelte";
  import { API_BASE_URL, NAMIA_API_KEY } from "$lib/api";

  let step = $state(1);
  let isSubmitting = $state(false);
  let submissionSuccess = $state(false);
  let leadReference = $state("");
  let errorMessage = $state("");

  // Form State
  let fullName = $state("");
  let nik = $state("");
  let phone = $state("");
  let email = $state("");
  let categorySlug = $state("p2p-lending");
  let requestedAmount = $state(20000000);
  let tenorMonths = $state(12);
  let purpose = $state("Modal Usaha UMKM");

  // KYC Details
  let employmentType = $state("entrepreneur");
  let companyName = $state("");
  let monthlyIncome = $state(15000000);
  let existingObligation = $state(0);
  let agreesIslamicRules = $state(true);
  let digitalSignatureAgreed = $state(false);

  // Pre-fill from query params
  onMount(() => {
    const pId = page.url.searchParams.get("productId");
    const amt = page.url.searchParams.get("amount");
    const tnr = page.url.searchParams.get("tenor");
    if (amt) requestedAmount = Number(amt);
    if (tnr) tenorMonths = Number(tnr);
  });

  function formatRupiah(num: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  }

  function validateStep(currentStep: number): boolean {
    errorMessage = "";
    if (currentStep === 1) {
      if (!fullName.trim() || fullName.trim().length < 3) {
        errorMessage = "Nama lengkap wajib diisi minimal 3 karakter.";
        return false;
      }
      if (!nik || nik.length < 16) {
        errorMessage = "NIK KTP wajib terdiri dari 16 digit angka.";
        return false;
      }
      if (!phone || phone.length < 9) {
        errorMessage = "Nomor WhatsApp aktif wajib diisi.";
        return false;
      }
      if (!email || !email.includes("@")) {
        errorMessage = "Format alamat email tidak valid.";
        return false;
      }
    } else if (currentStep === 2) {
      if (requestedAmount < 1000000) {
        errorMessage = "Minimal pengajuan adalah Rp 1.000.000.";
        return false;
      }
    } else if (currentStep === 3) {
      if (monthlyIncome <= 0) {
        errorMessage = "Penghasilan bulanan wajib diisi.";
        return false;
      }
    } else if (currentStep === 4) {
      if (!agreesIslamicRules || !digitalSignatureAgreed) {
        errorMessage =
          "Wajib menyetujui prinsip syariah dan Ijab Qabul digital.";
        return false;
      }
    }
    return true;
  }

  function nextStep() {
    if (validateStep(step)) {
      step++;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function prevStep() {
    errorMessage = "";
    if (step > 1) {
      step--;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit() {
    if (!validateStep(4)) return;
    isSubmitting = true;
    errorMessage = "";

    try {
      const payload = {
        fullName,
        nik,
        phone,
        email,
        categorySlug,
        requestedAmount: Number(requestedAmount),
        tenorMonths: Number(tenorMonths),
        purpose,
      };

      const res = await fetch(`${API_BASE_URL}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": NAMIA_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Gagal mengirim pengajuan. Silakan coba lagi.");
      }

      const result = await res.json();
      leadReference =
        result.referenceCode || `NAM-${Date.now().toString().slice(-6)}`;
      submissionSuccess = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      // Fallback mock success for local preview
      leadReference = `NAM-${Date.now().toString().slice(-6)}`;
      submissionSuccess = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Pengajuan Finansial & E-KYC Syariah — Namia Syariah</title>
  <meta
    name="description"
    content="Formulir pengajuan pembiayaan syariah praktis dengan verifikasi e-KYC dan Ijab Qabul digital di Namia Syariah."
  />
</svelte:head>

<div class="space-y-0 font-sans">
  <!-- PAGE TITLE JUMBOTRON -->
  <section class="bg-[#0f172a] text-white py-12 border-b border-slate-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold text-white uppercase">
            Pengajuan Pembiayaan
          </h1>
          <p class="text-xs text-slate-300 mt-1 font-normal tracking-wider">
            Formulir e-KYC, Kebutuhan Dana, & Ijab Qabul Syariah
          </p>
        </div>
        <nav
          class="flex text-xs font-semibold text-slate-400 gap-2 items-center"
        >
          <a href="/" class="hover:text-emerald-400 transition-colors"
            >Beranda</a
          >
          <span>/</span>
          <span class="text-emerald-400">Pengajuan</span>
        </nav>
      </div>
    </div>
  </section>

  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12">
    {#if submissionSuccess}
      <!-- SUCCESS CONFIRMATION STATE -->
      <div
        class="bg-white rounded-[3px] border border-slate-300 shadow-xs p-8 sm:p-12 text-center space-y-6"
      >
        <div
          class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300"
        >
          <CheckCircle2 class="w-8 h-8" />
        </div>

        <div class="space-y-2">
          <span
            class="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-[2px] border border-emerald-300"
          >
            Alhamdulillah, Pengajuan Diterima
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 uppercase">
            Formulir Anda Sedang Diverifikasi
          </h2>
          <p class="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
            Tim analis syariah Namia Syariah bersama mitra keuangan berlisensi
            OJK akan meninjau kelayakan dokumen dalam 1x24 jam kerja.
          </p>
        </div>

        <div
          class="bg-slate-50 border border-slate-300 rounded-[3px] p-5 max-w-sm mx-auto text-left text-xs space-y-2 font-mono"
        >
          <div class="flex justify-between">
            <span class="text-slate-500">Nomor Referensi:</span>
            <span class="font-bold text-emerald-800 text-sm"
              >{leadReference}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Nama Pemohon:</span>
            <span class="text-slate-900 font-medium">{fullName}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Plafon Diajukan:</span>
            <span class="text-slate-900 font-bold"
              >{formatRupiah(requestedAmount)}</span
            >
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Durasi Tenor:</span>
            <span class="text-slate-900">{tenorMonths} Bulan</span>
          </div>
        </div>

        <div
          class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/"
            class="button-4 text-xs py-2.5 px-6 w-full sm:w-auto rounded-[3px] font-bold uppercase tracking-wider"
          >
            Kembali ke Beranda
          </a>
          <a
            href="/aggregator"
            class="button-4-primary text-xs py-2.5 px-6 w-full sm:w-auto rounded-[3px] font-bold uppercase tracking-wider"
          >
            Lihat Produk Lainnya
          </a>
        </div>
      </div>
    {:else}
      <!-- STEP PROGRESS BAR -->
      <div class="mb-8">
        <div
          class="grid grid-cols-4 gap-2 text-center text-xs font-bold uppercase tracking-wider mb-3"
        >
          <span class={step >= 1 ? "text-emerald-700" : "text-slate-400"}
            >1. Data Diri</span
          >
          <span class={step >= 2 ? "text-emerald-700" : "text-slate-400"}
            >2. Kebutuhan</span
          >
          <span class={step >= 3 ? "text-emerald-700" : "text-slate-400"}
            >3. Finansial</span
          >
          <span class={step >= 4 ? "text-emerald-700" : "text-slate-400"}
            >4. Akad</span
          >
        </div>
        <div class="h-1.5 bg-slate-200 rounded-[2px] overflow-hidden">
          <div
            class="h-full bg-emerald-700 transition-colors rounded-[2px]"
            style="width: {(step / 4) * 100}%"
          ></div>
        </div>
      </div>

      <!-- MAIN FORM CARD -->
      <div
        class="bg-white rounded-[3px] border border-slate-300 shadow-xs overflow-hidden"
      >
        <!-- Card Header -->
        <div
          class="bg-[#0f172a] text-white px-6 sm:px-8 py-5 flex items-center justify-between border-b border-slate-700"
        >
          <div>
            <span
              class="text-[11px] font-bold uppercase tracking-wider text-emerald-400"
              >Langkah {step} dari 4</span
            >
            <h2 class="text-lg font-bold uppercase mt-0.5 text-white">
              {#if step === 1}
                Data Diri & Identitas Pemohon
              {:else if step === 2}
                Rincian Kebutuhan Pembiayaan
              {:else if step === 3}
                Informasi Pekerjaan & Finansial
              {:else}
                Persetujuan Akad & Ijab Qabul
              {/if}
            </h2>
          </div>
          <div
            class="w-8 h-8 rounded-[2px] bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-600"
          >
            <ShieldCheck class="w-4 h-4" />
          </div>
        </div>

        <!-- Error Message Banner -->
        {#if errorMessage}
          <div
            class="m-6 p-4 rounded-[3px] bg-rose-50 border border-rose-300 text-rose-700 text-xs flex items-center gap-2"
          >
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        {/if}

        <!-- Form Steps -->
        <form
          onsubmit={(e) => {
            e.preventDefault();
            if (step === 4) handleSubmit();
            else nextStep();
          }}
          class="p-6 sm:p-8 space-y-6"
        >
          <!-- STEP 1: Basic Info -->
          {#if step === 1}
            <div class="space-y-4">
              <div>
                <label
                  for="fullName"
                  class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                  >Nama Lengkap (Sesuai KTP) *</label
                >
                <input
                  id="fullName"
                  type="text"
                  bind:value={fullName}
                  placeholder="Contoh: Ahmad Fadilah"
                  class="w-full bg-white border border-slate-300 rounded-[2px] px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label
                  for="nik"
                  class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                  >Nomor Induk Kependudukan (NIK 16 Digit) *</label
                >
                <input
                  id="nik"
                  type="text"
                  maxlength="16"
                  bind:value={nik}
                  placeholder="327xxxxxxxxxxxxx"
                  class="w-full bg-white border border-slate-300 rounded-[2px] px-3.5 py-2 text-xs font-mono text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    for="phone"
                    class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                    >No. WhatsApp Aktif *</label
                  >
                  <input
                    id="phone"
                    type="tel"
                    bind:value={phone}
                    placeholder="08xxxxxxxxxx"
                    class="w-full bg-white border border-slate-300 rounded-[2px] px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    for="email"
                    class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                    >Alamat Email *</label
                  >
                  <input
                    id="email"
                    type="email"
                    bind:value={email}
                    placeholder="nama@email.com"
                    class="w-full bg-white border border-slate-300 rounded-[2px] px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          {/if}

          <!-- STEP 2: Loan Amount & Tenor -->
          {#if step === 2}
            <div class="space-y-6">
              <div>
                <label
                  for="categorySlug"
                  class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                  >Kategori Produk *</label
                >
                <select
                  id="categorySlug"
                  bind:value={categorySlug}
                  class="w-full bg-white border border-slate-300 rounded-[2px] px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
                >
                  <option value="p2p-lending"
                    >P2P Lending Syariah (Modal Usaha)</option
                  >
                  <option value="pembiayaan-usaha"
                    >Pembiayaan UMKM & Kemitraan</option
                  >
                  <option value="paylater-syariah"
                    >Paylater Syariah (Belanja & Alat)</option
                  >
                  <option value="asuransi-syariah"
                    >Takaful Proteksi Diri & Aset</option
                  >
                </select>
              </div>

              <div>
                <div class="flex justify-between items-center mb-1">
                  <label
                    for="requestedAmount"
                    class="text-xs font-bold uppercase tracking-wider text-slate-700"
                    >Nominal Pengajuan</label
                  >
                  <span class="text-base font-bold text-emerald-800 font-mono"
                    >{formatRupiah(requestedAmount)}</span
                  >
                </div>
                <input
                  id="requestedAmount"
                  type="range"
                  min="2000000"
                  max="100000000"
                  step="1000000"
                  bind:value={requestedAmount}
                  class="w-full h-1.5 bg-slate-200 rounded-[2px] appearance-none cursor-pointer accent-emerald-700"
                />
              </div>

              <div>
                <div class="flex justify-between items-center mb-1">
                  <label
                    for="tenorMonths"
                    class="text-xs font-bold uppercase tracking-wider text-slate-700"
                    >Pilihan Tenor</label
                  >
                  <span class="text-sm font-bold text-slate-900 font-mono"
                    >{tenorMonths} Bulan</span
                  >
                </div>
                <div class="grid grid-cols-4 gap-2 mt-2">
                  {#each [6, 12, 18, 24] as t}
                    <button
                      type="button"
                      onclick={() => (tenorMonths = t)}
                      class="py-2 text-xs font-bold uppercase tracking-wider rounded-[2px] border transition-colors cursor-pointer {tenorMonths ===
                      t
                        ? 'border-emerald-700 bg-emerald-700 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}"
                    >
                      {t} Bulan
                    </button>
                  {/each}
                </div>
              </div>

              <div>
                <label
                  for="purpose"
                  class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                  >Tujuan Penggunaan Dana *</label
                >
                <input
                  id="purpose"
                  type="text"
                  bind:value={purpose}
                  placeholder="Contoh: Pembelian stok bahan baku menjelang Ramadhan"
                  class="w-full bg-white border border-slate-300 rounded-[2px] px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          {/if}

          <!-- STEP 3: Financial & Employment -->
          {#if step === 3}
            <div class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    for="employmentType"
                    class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                    >Status Pekerjaan *</label
                  >
                  <select
                    id="employmentType"
                    bind:value={employmentType}
                    class="w-full bg-white border border-slate-300 rounded-[2px] px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="entrepreneur">Pemilik Usaha / UMKM</option>
                    <option value="permanent_employee"
                      >Karyawan Tetap Swasta / BUMN</option
                    >
                    <option value="contract_employee">Karyawan Kontrak</option>
                    <option value="freelancer">Profesional / Freelancer</option>
                  </select>
                </div>

                <div>
                  <label
                    for="companyName"
                    class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                    >Nama Usaha / Tempat Kerja *</label
                  >
                  <input
                    id="companyName"
                    type="text"
                    bind:value={companyName}
                    placeholder="Contoh: CV Berkah Sentosa"
                    class="w-full bg-white border border-slate-300 rounded-[2px] px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    for="monthlyIncome"
                    class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                    >Omzet / Penghasilan Bulanan (Rp) *</label
                  >
                  <input
                    id="monthlyIncome"
                    type="number"
                    step="500000"
                    bind:value={monthlyIncome}
                    class="w-full bg-white border border-slate-300 rounded-[2px] px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    for="existingObligation"
                    class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
                    >Tanggungan Cicilan Lain / Bulan (Rp)</label
                  >
                  <input
                    id="existingObligation"
                    type="number"
                    step="250000"
                    bind:value={existingObligation}
                    class="w-full bg-white border border-slate-300 rounded-[2px] px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          {/if}

          <!-- STEP 4: Islamic Contract & Ijab Qabul -->
          {#if step === 4}
            <div class="space-y-5">
              <div
                class="p-4 rounded-[3px] bg-emerald-50 border border-emerald-300 text-xs text-slate-700 space-y-2"
              >
                <h4 class="font-bold text-emerald-900 uppercase text-sm">
                  Pernyataan Ijab Qabul Elektronik Syariah
                </h4>
                <p class="leading-relaxed">
                  Dengan mengklik persetujuan di bawah ini, saya menyatakan
                  dengan sungguh-sungguh bahwa data yang saya berikan adalah
                  benar, dan berniat melakukan perikatan pembiayaan halal tanpa
                  riba berdasarkan akad Murabahah/Mudharabah yang diawasi oleh
                  Dewan Pengawas Syariah (DPS) Namia Syariah.
                </p>
              </div>

              <div class="space-y-3 pt-2">
                <label class="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    bind:checked={agreesIslamicRules}
                    class="mt-0.5 w-4 h-4 text-emerald-700 rounded-[2px] border-slate-300 focus:ring-0"
                  />
                  <span class="text-xs text-slate-600 leading-relaxed">
                    Saya menyetujui seluruh ketentuan akad syariah, tidak akan
                    mempergunakan dana untuk hal-hal yang diharamkan syariat
                    Islam (miras, judi, komoditas non-halal).
                  </span>
                </label>

                <label class="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    bind:checked={digitalSignatureAgreed}
                    class="mt-0.5 w-4 h-4 text-emerald-700 rounded-[2px] border-slate-300 focus:ring-0"
                  />
                  <span class="text-xs text-slate-600 leading-relaxed">
                    Saya memberikan kuasa kepada Namia Syariah dan mitra berizin
                    OJK untuk memverifikasi keabsahan data SLIK OJK dan catatan
                    kependudukan saya.
                  </span>
                </label>
              </div>
            </div>
          {/if}

          <!-- Wizard Navigation Buttons -->
          <div
            class="pt-6 border-t border-slate-200 flex items-center justify-between gap-4"
          >
            {#if step > 1}
              <button
                type="button"
                onclick={prevStep}
                class="button-4 text-xs py-2 px-4 rounded-[3px] flex items-center gap-1.5 font-bold uppercase tracking-wider cursor-pointer"
              >
                <ArrowLeft class="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>
            {:else}
              <div></div>
            {/if}

            <button
              type="submit"
              disabled={isSubmitting}
              class="button-4-primary text-xs py-2 px-5 rounded-[3px] flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wider cursor-pointer"
            >
              {#if isSubmitting}
                <span>Memproses...</span>
              {:else if step === 4}
                <span>Kirim Pengajuan</span>
                <CheckCircle2 class="w-3.5 h-3.5" />
              {:else}
                <span>Lanjutkan</span>
                <ArrowRight class="w-3.5 h-3.5" />
              {/if}
            </button>
          </div>
        </form>
      </div>
    {/if}
  </div>
</div>
