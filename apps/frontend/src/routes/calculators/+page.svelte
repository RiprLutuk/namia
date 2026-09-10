<script lang="ts">
  import { Calculator, TrendingUp, Award, HelpCircle, CheckCircle2, BookOpen, ShieldCheck } from "lucide-svelte";
  import LoanCalculator from "$lib/components/calculators/LoanCalculator.svelte";
  import InvestmentCalculator from "$lib/components/calculators/InvestmentCalculator.svelte";
  import CreditScoreEstimator from "$lib/components/calculators/CreditScoreEstimator.svelte";

  let activeTab = $state<"loan" | "invest" | "score">("loan");
</script>

<svelte:head>
  <title>Kalkulator Finansial Syariah Cerdas — Syarfi</title>
  <meta name="description" content="Simulasi cicilan pembiayaan Murabahah, proyeksi bagi hasil Mudharabah, dan estimasi skor kelayakan kredit syariah online." />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
  
  <!-- Header -->
  <div class="text-center max-w-3xl mx-auto space-y-3">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold">
      <Calculator class="w-3.5 h-3.5 text-emerald-600" />
      <span>Simulasi Finansial Mandiri Tanpa Riba</span>
    </div>
    <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
      Kalkulator Keuangan Syariah
    </h1>
    <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
      Hitung estimasi angsuran pembiayaan jual-beli (Murabahah), proyeksi return pendanaan bagi hasil (Mudharabah), serta ukur kapasitas rasio hutang Anda sebelum mengajukan.
    </p>
  </div>

  <!-- Calculator Tab Selector -->
  <div class="flex justify-center">
    <div class="inline-flex p-1.5 bg-slate-200/80 rounded-2xl gap-1">
      <button
        type="button"
        onclick={() => activeTab = "loan"}
        class="flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all {activeTab === 'loan' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
      >
        <Calculator class="w-4 h-4" />
        <span>Pembiayaan (Murabahah)</span>
      </button>

      <button
        type="button"
        onclick={() => activeTab = "invest"}
        class="flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all {activeTab === 'invest' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
      >
        <TrendingUp class="w-4 h-4" />
        <span>Investasi (Mudharabah)</span>
      </button>

      <button
        type="button"
        onclick={() => activeTab = "score"}
        class="flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all {activeTab === 'score' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}"
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
  <div class="bg-white rounded-2xl border border-slate-200/80 p-8 space-y-6">
    <div class="flex items-center gap-2.5 text-emerald-800">
      <BookOpen class="w-5 h-5 text-emerald-600" />
      <h3 class="text-lg font-bold text-slate-900">Perbedaan Prinsip: Konvensional vs Syariah</h3>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
      <div class="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
        <span class="font-bold text-slate-700 uppercase tracking-wider text-xs block">Sistem Pinjaman Konvensional</span>
        <ul class="space-y-2 text-slate-600 list-disc list-inside leading-relaxed">
          <li><strong>Bunga Pinjaman:</strong> Menggunakan persentase bunga atas pokok hutang yang berpotensi bunga berbunga (compounding).</li>
          <li><strong>Denda Keterlambatan:</strong> Menjadi pendapatan laba bagi lembaga peminjam (berpotensi riba jahiliyah).</li>
          <li><strong>Objek Transaksi:</strong> Berfokus murni pada uang meminjamkan uang (riba nasiah).</li>
        </ul>
      </div>

      <div class="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
        <span class="font-bold text-emerald-800 uppercase tracking-wider text-xs block">Sistem Pembiayaan Syarfi</span>
        <ul class="space-y-2 text-slate-700 list-disc list-inside leading-relaxed">
          <li><strong>Margin Jual Beli / Bagi Hasil:</strong> Keuntungan ditetapkan flat mengikat di awal akad atau proporsi bagi hasil riil (Nisbah).</li>
          <li><strong>Kompensasi Keterlambatan (Ta'zir):</strong> Disalurkan 100% sebagai dana kebajikan / sosial (Qardhul Hasan), bukan keuntungan perusahaan.</li>
          <li><strong>Objek Transaksi:</strong> Wajib ada underlying asset riil halal yang jelas (barang dagang, mesin, invoice riil).</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Fatwa DSN-MUI Reference -->
  <div class="p-6 rounded-2xl bg-slate-900 text-slate-300 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
    <div class="space-y-1 max-w-2xl">
      <div class="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
        <ShieldCheck class="w-4 h-4" />
        <span>Rujukan Fatwa DSN-MUI</span>
      </div>
      <h4 class="text-base font-bold text-white">Fatwa DSN-MUI No. 117/DSN-MUI/II/2018</h4>
      <p class="text-xs text-slate-400 leading-relaxed">
        Mengatur tentang Layanan Pembiayaan Berbasis Teknologi Informasi Berdasarkan Prinsip Syariah, memastikan seluruh mekanisme kontrak fintech berada dalam koridor muamalah yang sah.
      </p>
    </div>

    <a
      href="/about#dps"
      class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shrink-0"
    >
      Lihat Dewan Pengawas
    </a>
  </div>

</div>
