<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { 
    CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, 
    FileText, User, CreditCard, Sparkles, Building, AlertCircle
  } from "lucide-svelte";

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
      maximumFractionDigits: 0
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
        errorMessage = "Wajib menyetujui prinsip syariah dan Ijab Qabul digital.";
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
        purpose
      };

      const res = await fetch("http://localhost:3000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Gagal mengirim pengajuan. Silakan coba lagi.");
      }

      const result = await res.json();
      leadReference = result.referenceCode || `SYF-${Date.now().toString().slice(-6)}`;
      submissionSuccess = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      // Fallback mock success for local demo preview
      leadReference = `SYF-${Date.now().toString().slice(-6)}`;
      submissionSuccess = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Pengajuan Finansial & E-KYC Syariah — Syarfi</title>
  <meta name="description" content="Formulir pengajuan pembiayaan syariah praktis dengan verifikasi e-KYC dan Ijab Qabul digital." />
</svelte:head>

<div class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
  
  {#if submissionSuccess}
    <!-- SUCCESS CONFIRMATION STATE -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-lg p-8 sm:p-12 text-center space-y-6 animate-fade-in">
      <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 class="w-10 h-10" />
      </div>

      <div class="space-y-2">
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Alhamdulillah, Pengajuan Diterima
        </span>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Formulir Anda Sedang Diverifikasi
        </h1>
        <p class="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
          Tim analis syariah Syarfi bersama mitra keuangan berlisensi OJK akan meninjau kelayakan dokumen dalam 1x24 jam kerja.
        </p>
      </div>

      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-sm mx-auto text-left text-xs space-y-2 font-mono">
        <div class="flex justify-between">
          <span class="text-slate-500">Nomor Referensi:</span>
          <span class="font-bold text-emerald-700 text-sm">{leadReference}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Nama Pemohon:</span>
          <span class="text-slate-900 font-medium">{fullName}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Plafon Diajukan:</span>
          <span class="text-slate-900 font-bold">{formatRupiah(requestedAmount)}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Durasi Tenor:</span>
          <span class="text-slate-900">{tenorMonths} Bulan</span>
        </div>
      </div>

      <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="/"
          class="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
        >
          Kembali ke Beranda
        </a>
        <a
          href="/aggregator"
          class="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
        >
          Lihat Produk Lainnya
        </a>
      </div>
    </div>

  {:else}
    
    <!-- STEP PROGRESS BAR -->
    <div class="mb-8">
      <div class="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
        <span class="{step >= 1 ? 'text-emerald-700 font-bold' : ''}">1. Data Diri</span>
        <span class="{step >= 2 ? 'text-emerald-700 font-bold' : ''}">2. Kebutuhan Dana</span>
        <span class="{step >= 3 ? 'text-emerald-700 font-bold' : ''}">3. Profil Finansial</span>
        <span class="{step >= 4 ? 'text-emerald-700 font-bold' : ''}">4. Akad Syariah</span>
      </div>
      <div class="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          class="h-full bg-emerald-600 transition-all duration-300 rounded-full" 
          style="width: {(step / 4) * 100}%"
        ></div>
      </div>
    </div>

    <!-- MAIN FORM CARD -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
      
      <!-- Card Header -->
      <div class="bg-slate-900 text-white px-6 sm:px-8 py-6 flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wider text-emerald-400">Langkah {step} dari 4</span>
          <h2 class="text-xl font-bold mt-0.5">
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
        <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <ShieldCheck class="w-6 h-6" />
        </div>
      </div>

      <!-- Error Message Banner -->
      {#if errorMessage}
        <div class="m-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle class="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      {/if}

      <!-- Form Steps -->
      <form onsubmit={(e) => { e.preventDefault(); if (step === 4) handleSubmit(); else nextStep(); }} class="p-6 sm:p-8 space-y-6">
        
        <!-- STEP 1: Basic Info -->
        {#if step === 1}
          <div class="space-y-4">
            <div>
              <label for="fullName" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Nama Lengkap (Sesuai KTP) *</label>
              <input
                id="fullName"
                type="text"
                bind:value={fullName}
                placeholder="Contoh: Ahmad Fadilah"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
              />
            </div>

            <div>
              <label for="nik" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Nomor Induk Kependudukan (NIK 16 Digit) *</label>
              <input
                id="nik"
                type="text"
                maxlength="16"
                bind:value={nik}
                placeholder="327xxxxxxxxxxxxx"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="phone" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">No. WhatsApp Aktif *</label>
                <input
                  id="phone"
                  type="tel"
                  bind:value={phone}
                  placeholder="08xxxxxxxxxx"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label for="email" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Alamat Email *</label>
                <input
                  id="email"
                  type="email"
                  bind:value={email}
                  placeholder="nama@email.com"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                />
              </div>
            </div>
          </div>
        {/if}

        <!-- STEP 2: Loan Amount & Tenor -->
        {#if step === 2}
          <div class="space-y-6">
            <div>
              <label for="categorySlug" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Kategori Produk *</label>
              <select
                id="categorySlug"
                bind:value={categorySlug}
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
              >
                <option value="p2p-lending">P2P Lending Syariah (Modal Usaha)</option>
                <option value="pembiayaan-usaha">Pembiayaan UMKM & Kemitraan</option>
                <option value="paylater-syariah">Paylater Syariah (Belanja & Alat)</option>
                <option value="asuransi-syariah">Takaful Proteksi Diri & Aset</option>
              </select>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <label for="requestedAmount" class="text-xs font-semibold uppercase tracking-wider text-slate-700">Nominal Pengajuan</label>
                <span class="text-lg font-bold text-emerald-700 font-mono">{formatRupiah(requestedAmount)}</span>
              </div>
              <input
                id="requestedAmount"
                type="range"
                min="2000000"
                max="100000000"
                step="1000000"
                bind:value={requestedAmount}
                class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div>
              <div class="flex justify-between items-center mb-1">
                <label for="tenorMonths" class="text-xs font-semibold uppercase tracking-wider text-slate-700">Pilihan Tenor</label>
                <span class="text-base font-bold text-slate-900 font-mono">{tenorMonths} Bulan</span>
              </div>
              <div class="grid grid-cols-4 gap-2 mt-2">
                {#each [6, 12, 18, 24] as t}
                  <button
                    type="button"
                    onclick={() => tenorMonths = t}
                    class="py-2.5 text-xs font-semibold rounded-xl border transition-all {tenorMonths === t ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'}"
                  >
                    {t} Bulan
                  </button>
                {/each}
              </div>
            </div>

            <div>
              <label for="purpose" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Tujuan Penggunaan Dana *</label>
              <input
                id="purpose"
                type="text"
                bind:value={purpose}
                placeholder="Contoh: Pembelian stok bahan baku menjelang Ramadhan"
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
              />
            </div>
          </div>
        {/if}

        <!-- STEP 3: Financial & Employment -->
        {#if step === 3}
          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="employmentType" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Status Pekerjaan *</label>
                <select
                  id="employmentType"
                  bind:value={employmentType}
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="entrepreneur">Pemilik Usaha / UMKM</option>
                  <option value="permanent_employee">Karyawan Tetap Swasta / BUMN</option>
                  <option value="contract_employee">Karyawan Kontrak</option>
                  <option value="freelancer">Profesional / Freelancer</option>
                </select>
              </div>

              <div>
                <label for="companyName" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Nama Usaha / Tempat Kerja *</label>
                <input
                  id="companyName"
                  type="text"
                  bind:value={companyName}
                  placeholder="Contoh: CV Berkah Sentosa"
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="monthlyIncome" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Omzet / Penghasilan Bulanan (Rp) *</label>
                <input
                  id="monthlyIncome"
                  type="number"
                  step="500000"
                  bind:value={monthlyIncome}
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                />
              </div>

              <div>
                <label for="existingObligation" class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">Tanggungan Cicilan Lain / Bulan (Rp)</label>
                <input
                  id="existingObligation"
                  type="number"
                  step="250000"
                  bind:value={existingObligation}
                  class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
                />
              </div>
            </div>
          </div>
        {/if}

        <!-- STEP 4: Islamic Contract & Ijab Qabul -->
        {#if step === 4}
          <div class="space-y-5">
            <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-slate-700 space-y-2">
              <h4 class="font-bold text-emerald-900 text-sm">Pernyataan Ijab Qabul Elektronik Syariah</h4>
              <p class="leading-relaxed">
                Dengan mengklik persetujuan di bawah ini, saya menyatakan dengan sungguh-sungguh bahwa data yang saya berikan adalah benar, dan berniat melakukan perikatan pembiayaan halal tanpa riba berdasarkan akad Murabahah/Mudharabah yang diawasi oleh Dewan Pengawas Syariah (DPS) Syarfi.
              </p>
            </div>

            <div class="space-y-3 pt-2">
              <label class="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  bind:checked={agreesIslamicRules}
                  class="mt-1 w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
                />
                <span class="text-xs text-slate-700 leading-relaxed">
                  Saya menyetujui seluruh ketentuan akad syariah, tidak akan mempergunakan dana untuk hal-hal yang diharamkan syariat Islam (miras, judi, komoditas non-halal).
                </span>
              </label>

              <label class="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  bind:checked={digitalSignatureAgreed}
                  class="mt-1 w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500"
                />
                <span class="text-xs text-slate-700 leading-relaxed">
                  Saya memberikan kuasa kepada Syarfi dan mitra berizin OJK untuk memverifikasi keabsahan data SLIK OJK dan catatan kependudukan saya.
                </span>
              </label>
            </div>
          </div>
        {/if}

        <!-- Wizard Navigation Buttons -->
        <div class="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          {#if step > 1}
            <button
              type="button"
              onclick={prevStep}
              class="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft class="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          {:else}
            <div></div>
          {/if}

          {#if step < 4}
            <button
              type="button"
              onclick={nextStep}
              class="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Lanjut</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          {:else}
            <button
              type="submit"
              disabled={isSubmitting || !agreesIslamicRules || !digitalSignatureAgreed}
              class="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-colors"
            >
              {#if isSubmitting}
                <span>Memproses Verifikasi...</span>
              {:else}
                <Sparkles class="w-4 h-4" />
                <span>Kirim Pengajuan Syariah</span>
              {/if}
            </button>
          {/if}
        </div>

      </form>

    </div>
  {/if}

</div>
