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
            image: p.logo || "/images/products/namia_murabahah_goods.jpg",
            modalImage: p.logo || "/images/products/namia_murabahah_goods.jpg",
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

<div class="borrower-page">
  <!-- HERO SECTION: FULL-WIDTH TWITTER BOOTSTRAP 2.0 JUMBOTRON MASTHEAD -->
  <section class="jumbotron-masthead">
    <div class="container px-4">
      <div class="max-w-4xl mx-auto space-y-4 text-center">
        <!-- Trust Badge -->
        <div class="inline-flex items-center gap-2">
          <span class="badge badge-success px-3 py-1 font-bold text-xs">
            <Sparkles class="w-3.5 h-3.5 inline mr-1" />
            SOLUSI PERMODALAN USAHA PRODUKTIF TANPA RIBA &bull; BERIZIN OJK
          </span>
          <span class="badge badge-inverse hidden sm:inline-block text-xs py-1 px-3 font-bold">
            MURABAHAH & IJARAH
          </span>
        </div>

        <h1>
          Akselerasi Bisnis dengan <br />
          <span class="text-emerald-700">Pembiayaan Syariah Terpercaya</span>
        </h1>

        <p class="lead max-w-2xl mx-auto">
          Dapatkan akses modal kerja, pengadaan barang, dan sewa jasa produktif hingga
          <strong class="text-slate-900 font-bold"> Rp 2 Miliar</strong> dengan margin keuntungan tetap transparan, skema cicilan fleksibel, dan diawasi langsung oleh Dewan Pengawas Syariah DSN-MUI.
        </p>

        <!-- CTA Buttons -->
        <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a href="/onboarding" class="btn btn-primary btn-large font-bold">
            <span>Ajukan Pembiayaan Sekarang</span>
            <ArrowRight class="w-4 h-4 inline ml-1" />
          </a>
          <button
            type="button"
            onclick={() => (showCalcModal = true)}
            class="btn btn-default btn-large font-bold"
          >
            <Calculator class="w-4 h-4 inline mr-1 text-slate-700" />
            <span>Simulasi Angsuran</span>
          </button>
        </div>

        <!-- Floating Metrics Ribbon inside Hero -->
        <div class="pt-4 max-w-3xl mx-auto">
          <div class="well well-white mb-0 py-3 px-4 shadow-xs border border-slate-300">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center divide-x divide-slate-300">
              <div class="px-2">
                <div class="text-lg sm:text-xl font-bold text-emerald-700 font-mono">s/d Rp 2 Miliar</div>
                <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Plafon Pembiayaan</div>
              </div>
              <div class="px-2">
                <div class="text-lg sm:text-xl font-bold text-slate-800">Mulai 0.8% / bln</div>
                <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Margin / Ujrah Flat</div>
              </div>
              <div class="px-2">
                <div class="text-lg sm:text-xl font-bold text-emerald-700 font-mono">1 - 24 Bulan</div>
                <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Pilihan Tenor</div>
              </div>
              <div class="px-2">
                <div class="text-lg sm:text-xl font-bold text-slate-800">100% Halal</div>
                <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Tanpa Riba</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- BREADCRUMB SUB-BAR -->
  <div class="bg-slate-100 border-b border-slate-200 py-2">
    <div class="container px-4">
      <ul class="breadcrumb mb-0">
        <li><a href="/">Beranda</a> <span class="divider">/</span></li>
        <li class="active">Penerima Pembiayaan &bull; Fasilitas Modal Usaha Syariah</li>
      </ul>
    </div>
  </div>

  <!-- SECTION 1: KEUNGGULAN UTAMA PEMBIAYAAN NAMIA -->
  <section id="keunggulan" class="py-12 bg-white border-b border-[#E5E5E5]">
    <div class="container space-y-8">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="label label-info text-xs uppercase tracking-wider mb-1">Mengapa Memilih Kami</span>
        <h2 class="text-2xl font-bold text-slate-900 uppercase">Keunggulan Pembiayaan di Namia Syariah</h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Dirancang khusus untuk mendukung pertumbuhan UMKM nasional dengan proses transparan, adil, dan bernilai ibadah berlandaskan An-Namaa'.
        </p>
      </div>

      <!-- 5 Features Grid in Early Bootstrap Panels -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {#each features as f}
          <div class="panel panel-default text-center p-4 space-y-3 flex flex-col justify-between mb-0 shadow-xs">
            <div class="space-y-2">
              <span class="badge badge-success text-[10px] uppercase">
                {f.badge}
              </span>
              <div class="h-12 flex items-center justify-center">
                <img
                  src={f.icon}
                  alt={f.title}
                  class="max-h-10 w-auto object-contain"
                />
              </div>
              <h4 class="text-xs font-bold text-slate-900 uppercase leading-snug">
                {f.title}
              </h4>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-slate-100 mb-0">
              {f.desc}
            </p>
          </div>
        {/each}
      </div>

      <!-- 5 Core Principles Bar in Dark Inset Well -->
      <div class="well well-dark p-6">
        <div class="text-center max-w-lg mx-auto mb-4 space-y-1">
          <h3 class="text-base font-bold text-white uppercase tracking-wider mb-0">
            5 Prinsip Fundamental Pembiayaan Namia Syariah
          </h3>
          <p class="text-xs text-slate-300 mb-0">
            Komitmen kami dalam mengedepankan amanah dan kemitraan maslahat
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {#each coreValues as v}
            <div class="well well-small bg-slate-800 text-center p-3 mb-0 border border-slate-700">
              <div class="w-7 h-7 rounded-full bg-emerald-900 text-emerald-300 mx-auto flex items-center justify-center mb-1.5">
                <CheckCircle2 class="w-4 h-4" />
              </div>
              <div class="font-bold text-xs text-white uppercase">
                {v.title}
              </div>
              <div class="text-[10.5px] text-slate-300 mt-1 leading-snug">
                {v.desc}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 2: 4 PRODUK PEMBIAYAAN & AKAD SYARIAH -->
  <section id="produk" class="py-12 bg-slate-50 border-b border-[#E5E5E5]">
    <div class="container space-y-8">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="label label-success text-xs uppercase tracking-wider mb-1">Solusi Modal Usaha</span>
        <h2 class="text-2xl font-bold text-slate-900 uppercase">Produk & Skema Akad Pembiayaan</h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Pilih skema pembiayaan yang tepat sesuai peruntukan modal usaha Anda dengan akad resmi Dewan Pengawas Syariah.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {#each products as p}
          <div class="panel panel-default shadow-xs flex flex-col justify-between mb-0">
            <div>
              <div class="relative h-40 overflow-hidden bg-slate-100 border-b border-slate-200">
                <img
                  src={p.image}
                  alt={p.title}
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/40"></div>
                <span class="absolute top-2 left-2 badge badge-success text-[10px] uppercase">
                  Akad {p.contract}
                </span>
                <div class="absolute bottom-2 left-3 right-3 text-left">
                  <h3 class="text-base font-bold text-white uppercase leading-tight">
                    {p.title}
                  </h3>
                  <div class="text-[11px] text-emerald-300 font-semibold">
                    {p.tagline}
                  </div>
                </div>
              </div>

              <div class="panel-body space-y-3">
                <p class="text-xs text-slate-600 leading-relaxed min-h-[44px] mb-0">
                  {p.desc}
                </p>

                <!-- Spec Table Early Bootstrap Style -->
                <table class="table table-bordered table-striped table-condensed mb-0 text-xs">
                  <tbody>
                    <tr>
                      <td class="text-slate-500 font-semibold w-24">Plafon:</td>
                      <td class="font-bold text-slate-800">{p.plafon}</td>
                    </tr>
                    <tr>
                      <td class="text-slate-500 font-semibold">Tenor:</td>
                      <td class="font-bold text-emerald-700">{p.tenor}</td>
                    </tr>
                    <tr>
                      <td class="text-slate-500 font-semibold">Skema:</td>
                      <td class="font-semibold text-slate-700">{p.margin}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="panel-footer bg-slate-50 p-3 space-y-2">
              <button
                type="button"
                onclick={() => (selectedProduct = p)}
                class="btn btn-default btn-small w-100 flex items-center justify-center gap-1"
              >
                <FileText class="w-3.5 h-3.5 inline text-emerald-600" />
                <span>Lihat Skema Akad</span>
              </button>

              <a
                href="/onboarding?product={p.contract.toLowerCase()}"
                class="btn btn-primary btn-small w-100 flex items-center justify-center gap-1"
              >
                <span>Ajukan Produk Ini</span>
                <ArrowRight class="w-3.5 h-3.5 inline" />
              </a>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SECTION 3: 6 LANGKAH ALUR MENGAJUKAN PEMBIAYAAN -->
  <section id="alur" class="py-12 bg-slate-900 text-white border-b border-slate-800">
    <div class="container space-y-8">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="badge badge-success text-xs uppercase tracking-wider mb-1">Alur Pengajuan Praktis</span>
        <h2 class="text-2xl font-bold text-white uppercase">6 Langkah Mengajukan Pembiayaan</h2>
        <p class="text-xs sm:text-sm text-slate-300">
          Proses permohonan modal kerja yang ringkas, transparan, dan terstandar dari pendaftaran hingga pencairan.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each steps as st}
          <div class="well well-dark p-5 mb-0 flex flex-col justify-between border border-slate-700">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-2xl font-extrabold text-emerald-400 font-mono">{st.num}</span>
                <span class="badge badge-success text-[10px]">TAHAP {st.num}</span>
              </div>
              <h4 class="text-sm font-bold text-white uppercase leading-snug">
                {st.title}
              </h4>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-700 mt-2 mb-0">
              {st.desc}
            </p>
          </div>
        {/each}
      </div>

      <div class="text-center pt-2">
        <a href="/onboarding" class="btn btn-primary btn-large font-bold">
          <span>Daftar & Ajukan Sekarang</span>
          <ArrowRight class="w-4 h-4 inline ml-1" />
        </a>
      </div>
    </div>
  </section>

  <!-- SECTION 4: KALKULATOR SIMULASI ANGSURAN PEMBIAYAAN -->
  <section id="kalkulator" class="py-12 bg-white border-b border-[#E5E5E5]">
    <div class="container max-w-4xl space-y-6">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="label label-info text-xs uppercase tracking-wider mb-1">Simulasi Pembiayaan</span>
        <h2 class="text-2xl font-bold text-slate-900 uppercase">Hitung Estimasi Angsuran Usaha Anda</h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Gunakan kalkulator simulasi di bawah untuk mengestimasi besaran angsuran bulanan yang sesuai dengan kapasitas arus kas bisnis Anda.
        </p>
      </div>

      <div class="panel panel-default shadow-sm mb-0">
        <div class="panel-heading bg-slate-50 font-bold text-slate-900 text-xs uppercase">
          <Calculator class="w-4 h-4 inline mr-1 text-emerald-600" />
          Simulasi Kalkulator Pembiayaan Syariah
        </div>
        <div class="panel-body p-4 sm:p-6 space-y-4">
          <LoanCalculator />

          <div class="alert alert-info py-2 px-3 text-xs mb-0">
            <strong>Catatan Transparansi:</strong> Simulasi di atas merupakan perkiraan cicilan flat berdasarkan rata-rata margin historis. Besaran margin riil, ujrah sewa, atau nisbah bagi hasil akan disesuaikan setelah penilaian risiko (credit scoring) terhadap profil usaha Anda.
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 5: PERSYARATAN & FAQ PEMBIAYAAN -->
  <section id="edukasi" class="py-12 bg-slate-50 border-b border-[#E5E5E5]">
    <div class="container max-w-4xl space-y-8">
      <!-- Syarat & Dokumen Section -->
      <div class="space-y-4">
        <div class="heading-block text-center max-w-2xl mx-auto">
          <span class="label label-success text-xs uppercase tracking-wider mb-1">Kualifikasi Penerima Pembiayaan</span>
          <h2 class="text-2xl font-bold text-slate-900 uppercase">Syarat & Dokumen Pengajuan</h2>
          <p class="text-xs sm:text-sm text-slate-600">
            Pastikan usaha Anda memenuhi kualifikasi dasar di bawah ini sebelum mengajukan permohonan modal.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each requirements as req}
            <div class="panel panel-default mb-0 shadow-xs">
              <div class="panel-heading bg-white font-bold text-xs uppercase flex items-center gap-2">
                <Briefcase class="w-4 h-4 text-emerald-600" />
                <span>{req.category}</span>
              </div>
              <div class="panel-body p-4">
                <ul class="space-y-2 mb-0">
                  {#each req.items as item}
                    <li class="flex items-start gap-2 text-xs text-slate-700">
                      <Check class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  {/each}
                </ul>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- FAQ Accordion List -->
      <div class="space-y-4 pt-4">
        <div class="heading-block text-center max-w-2xl mx-auto">
          <span class="label label-inverse text-xs uppercase tracking-wider mb-1">Pusat Informasi</span>
          <h2 class="text-2xl font-bold text-slate-900 uppercase">Pertanyaan Umum Seputar Pembiayaan</h2>
        </div>

        <div class="space-y-2">
          {#each faqs as item, idx}
            <div class="panel panel-default mb-0 shadow-2xs">
              <button
                type="button"
                onclick={() => (openFaqIndex = openFaqIndex === idx ? null : idx)}
                class="w-100 text-left p-3 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-800 hover:text-emerald-700 bg-white"
              >
                <span class="flex items-center gap-2">
                  <HelpCircle class="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item.q}</span>
                </span>
                <ChevronDown
                  class="w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 {openFaqIndex === idx ? 'rotate-180 text-emerald-600' : ''}"
                />
              </button>

              {#if openFaqIndex === idx}
                <div class="p-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200 bg-slate-50">
                  {item.a}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- SOLID RETRO CTA BANNER -->
  <section class="py-8 text-white text-center" style="background: linear-gradient(180deg, #059669 0%, #047857 100%); border-top: 1px solid #065f46; border-bottom: 1px solid #065f46;">
    <div class="container flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-left space-y-1">
        <h3 class="text-xl font-bold uppercase tracking-wider text-white mb-0">
          Siap Mengembangkan Bisnis Anda?
        </h3>
        <p class="text-xs text-emerald-100 mb-0">
          Ajukan pembiayaan modal kerja syariah sekarang dan dapatkan solusi modal tanpa riba.
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <a href="/onboarding" class="btn btn-default btn-large font-bold">
          <span>Mulai Pengajuan Modal</span>
          <ArrowRight class="w-4 h-4 inline ml-1 text-emerald-700" />
        </a>
      </div>
    </div>
  </section>
</div>

<!-- CALCULATOR MODAL -->
{#if showCalcModal}
  <div class="modal-backdrop fade in" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1040;"></div>
  <div class="modal" style="display: block; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1050; max-width: 600px; width: 92%; background: #ffffff; border: 1px solid #999; border-radius: 6px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
    <div class="modal-header d-flex justify-content-between align-items-center py-2 px-3 border-b bg-slate-50">
      <div>
        <span class="badge badge-success text-[10px] uppercase">Simulasi Mandiri</span>
        <h4 class="modal-title font-bold text-slate-900 text-base mb-0">
          Kalkulator Pembiayaan Namia Syariah
        </h4>
      </div>
      <button
        type="button"
        class="close text-slate-400 hover:text-slate-700"
        onclick={() => (showCalcModal = false)}
        aria-label="Tutup"
      >
        &times;
      </button>
    </div>

    <div class="modal-body p-4">
      <LoanCalculator />
    </div>

    <div class="modal-footer py-2 px-3 border-t bg-slate-50 flex justify-end gap-2">
      <button
        type="button"
        class="btn btn-default btn-small"
        onclick={() => (showCalcModal = false)}
      >
        Tutup
      </button>
      <a href="/onboarding" class="btn btn-primary btn-small">
        <span>Lanjut Pengajuan</span>
      </a>
    </div>
  </div>
{/if}

<!-- PRODUCT SCHEME INFOGRAPHIC MODAL -->
{#if selectedProduct}
  <div class="modal-backdrop fade in" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1040;"></div>
  <div class="modal" style="display: block; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1050; max-width: 600px; width: 92%; background: #ffffff; border: 1px solid #999; border-radius: 6px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
    <div class="modal-header d-flex justify-content-between align-items-center py-2 px-3 border-b bg-slate-50">
      <div>
        <span class="badge badge-success text-[10px] uppercase">Skema Akad Syariah</span>
        <h4 class="modal-title font-bold text-slate-900 text-base mb-0">
          {selectedProduct.title} (Akad {selectedProduct.contract})
        </h4>
      </div>
      <button
        type="button"
        class="close text-slate-400 hover:text-slate-700"
        onclick={() => (selectedProduct = null)}
        aria-label="Tutup"
      >
        &times;
      </button>
    </div>

    <div class="modal-body p-4 text-center">
      <div class="well well-small p-2 bg-slate-100 border border-slate-300">
        <img
          src={selectedProduct.modalImage}
          alt="{selectedProduct.title} Skema"
          class="max-w-full max-h-[300px] object-contain mx-auto"
        />
      </div>
      <p class="text-xs text-slate-500 mt-2 mb-0">Diawasi oleh Dewan Pengawas Syariah DSN-MUI</p>
    </div>

    <div class="modal-footer py-2 px-3 border-t bg-slate-50 flex justify-end gap-2">
      <button
        type="button"
        class="btn btn-default btn-small"
        onclick={() => (selectedProduct = null)}
      >
        Tutup
      </button>
      <a
        href="/onboarding?product={selectedProduct.contract.toLowerCase()}"
        class="btn btn-primary btn-small"
      >
        <span>Ajukan Pembiayaan</span>
      </a>
    </div>
  </div>
{/if}
