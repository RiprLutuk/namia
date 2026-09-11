<script lang="ts">
  import {
    Calculator,
    TrendingUp,
    Award,
    HelpCircle,
    CheckCircle2,
    BookOpen,
    ShieldCheck,
  } from "lucide-svelte";
  import LoanCalculator from "$lib/components/calculators/LoanCalculator.svelte";
  import InvestmentCalculator from "$lib/components/calculators/InvestmentCalculator.svelte";
  import CreditScoreEstimator from "$lib/components/calculators/CreditScoreEstimator.svelte";

  let activeTab = $state<"loan" | "invest" | "score">("loan");
</script>

<svelte:head>
  <title>Kalkulator Finansial Syariah Cerdas — Namia Syariah</title>
  <meta
    name="description"
    content="Simulasi cicilan pembiayaan Murabahah, proyeksi bagi hasil Mudharabah, dan estimasi skor kelayakan kredit syariah online di Namia Syariah."
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
            Kalkulator Syariah
          </h1>
          <p class="text-xs text-slate-300 mt-1 font-normal tracking-wider">
            Simulasi Finansial Mandiri Tanpa Riba & Transparan
          </p>
        </div>
        <nav
          class="flex text-xs font-semibold text-slate-400 gap-2 items-center"
        >
          <a href="/" class="hover:text-emerald-400 transition-colors"
            >Beranda</a
          >
          <span>/</span>
          <span class="text-emerald-400">Kalkulator</span>
        </nav>
      </div>
    </div>
  </section>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
    <!-- Calculator Tab Selector -->
    <div class="flex justify-center">
      <div
        class="inline-flex p-1 bg-slate-100 border border-slate-300 rounded-[3px] gap-1"
      >
        <button
          type="button"
          onclick={() => (activeTab = "loan")}
          class="flex items-center gap-2 px-6 py-2.5 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer {activeTab ===
          'loan'
            ? 'bg-emerald-700 text-white'
            : 'text-slate-700 hover:text-slate-900'}"
        >
          <Calculator class="w-4 h-4" />
          <span>Pembiayaan (Murabahah)</span>
        </button>

        <button
          type="button"
          onclick={() => (activeTab = "invest")}
          class="flex items-center gap-2 px-6 py-2.5 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer {activeTab ===
          'invest'
            ? 'bg-emerald-700 text-white'
            : 'text-slate-700 hover:text-slate-900'}"
        >
          <TrendingUp class="w-4 h-4" />
          <span>Investasi (Mudharabah)</span>
        </button>

        <button
          type="button"
          onclick={() => (activeTab = "score")}
          class="flex items-center gap-2 px-6 py-2.5 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer {activeTab ===
          'score'
            ? 'bg-emerald-700 text-white'
            : 'text-slate-700 hover:text-slate-900'}"
        >
          <Award class="w-4 h-4" />
          <span>Skor Kelayakan (DSR)</span>
        </button>
      </div>
    </div>

    <!-- Calculator Component -->
    <div>
      {#if activeTab === "loan"}
        <LoanCalculator />
      {:else if activeTab === "invest"}
        <InvestmentCalculator />
      {:else}
        <CreditScoreEstimator />
      {/if}
    </div>

    <!-- Educational Comparison Guide -->
    <div
      class="bg-white rounded-[3px] border border-slate-300 p-8 space-y-6 shadow-xs"
    >
      <div class="heading-block text-left mb-4">
        <h2 class="text-xl font-bold text-slate-900 uppercase">
          Perbedaan Prinsip: Konvensional vs Syariah
        </h2>
        <span class="text-xs text-slate-500"
          >Panduan edukatif memahami muamalah bebas riba</span
        >
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
        <div
          class="p-6 rounded-[3px] bg-slate-50 border border-slate-300 space-y-3"
        >
          <span
            class="font-bold text-slate-900 uppercase tracking-wider text-xs block"
            >Sistem Pinjaman Konvensional</span
          >
          <ul
            class="space-y-2 text-slate-600 list-disc list-inside leading-relaxed"
          >
            <li>
              <strong>Bunga Pinjaman:</strong> Menggunakan persentase bunga atas
              pokok hutang yang berpotensi bunga berbunga (compounding).
            </li>
            <li>
              <strong>Denda Keterlambatan:</strong> Menjadi pendapatan laba bagi
              lembaga peminjam (berpotensi riba jahiliyah).
            </li>
            <li>
              <strong>Objek Transaksi:</strong> Berfokus murni pada uang meminjamkan
              uang (riba nasiah).
            </li>
          </ul>
        </div>

        <div
          class="p-6 rounded-[3px] bg-emerald-50/50 border border-emerald-300 space-y-3"
        >
          <span
            class="font-bold text-emerald-800 uppercase tracking-wider text-xs block"
            >Sistem Pembiayaan Namia Syariah</span
          >
          <ul
            class="space-y-2 text-slate-700 list-disc list-inside leading-relaxed"
          >
            <li>
              <strong>Margin Jual Beli / Bagi Hasil:</strong> Keuntungan ditetapkan
              flat mengikat di awal akad atau proporsi bagi hasil riil (Nisbah).
            </li>
            <li>
              <strong>Kompensasi Keterlambatan (Ta'zir):</strong> Disalurkan 100%
              sebagai dana kebajikan / sosial (Qardhul Hasan), bukan keuntungan perusahaan.
            </li>
            <li>
              <strong>Objek Transaksi:</strong> Wajib ada underlying asset riil halal
              yang jelas (barang dagang, mesin, invoice riil).
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Fatwa DSN-MUI Reference -->
    <div
      class="p-8 rounded-[3px] bg-slate-900 text-slate-300 border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
    >
      <div class="space-y-1 max-w-2xl">
        <div
          class="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider"
        >
          <ShieldCheck class="w-4 h-4" />
          <span>Rujukan Fatwa DSN-MUI</span>
        </div>
        <h4 class="text-base font-bold text-white uppercase">
          Fatwa DSN-MUI No. 117/DSN-MUI/II/2018
        </h4>
        <p class="text-xs text-slate-400 leading-relaxed">
          Mengatur tentang Layanan Pembiayaan Berbasis Teknologi Informasi
          Berdasarkan Prinsip Syariah, memastikan seluruh mekanisme kontrak
          fintech berada dalam koridor muamalah yang sah.
        </p>
      </div>

      <a
        href="/about#dps"
        class="button-4-primary text-xs py-2.5 px-6 rounded-[3px] shrink-0 font-bold uppercase tracking-wider"
      >
        Lihat Dewan Pengawas
      </a>
    </div>
  </div>
</div>
