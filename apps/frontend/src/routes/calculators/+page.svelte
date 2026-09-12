<script lang="ts">
  import {
    Calculator,
    TrendingUp,
    Award,
    HelpCircle,
    CheckCircle2,
    BookOpen,
    ShieldCheck,
    Activity,
    ArrowRight
  } from "lucide-svelte";
  import LoanCalculator from "$lib/components/calculators/LoanCalculator.svelte";
  import InvestmentCalculator from "$lib/components/calculators/InvestmentCalculator.svelte";
  import CreditScoreEstimator from "$lib/components/calculators/CreditScoreEstimator.svelte";

  let activeTab = $state<"loan" | "invest" | "score">("loan");
</script>

<svelte:head>
  <title>Kalkulator Finansial Syariah — Namia Syariah</title>
  <meta
    name="description"
    content="Simulasi cicilan pembiayaan Murabahah, proyeksi bagi hasil Mudharabah, dan estimasi skor kelayakan kredit syariah online di Namia Syariah."
  />
</svelte:head>

<div class="calculators-page space-y-0 font-sans">
  <!-- PAGE HEADER WITH AUTHENTIC EARLY BOOTSTRAP 2.0 SUBHEAD JUMBOTRON -->
  <section class="jumbotron-subhead">
    <div class="container px-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1.5">
          <div class="flex items-center gap-2">
            <span class="badge badge-success text-[10px] uppercase font-bold">
              Simulasi Mandiri Cerdas
            </span>
            <span class="badge badge-inverse text-[10px] uppercase font-bold">
              Fatwa DSN-MUI
            </span>
          </div>
          <h1>Kalkulator Finansial Syariah</h1>
          <p>
            Simulasi pembiayaan, imbal hasil investasi, dan uji kelayakan tanpa bunga riba
          </p>
        </div>

        <!-- Early Bootstrap Breadcrumb -->
        <ul class="breadcrumb mb-0 text-slate-800 self-start md:self-auto">
          <li><a href="/">Beranda</a> <span class="divider">/</span></li>
          <li class="active">Kalkulator</li>
        </ul>
      </div>
    </div>
  </section>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
    <!-- Authentic Early Bootstrap 2 .nav-tabs Style Selector -->
    <div class="overflow-x-auto no-scrollbar pb-1 mb-6 flex justify-start sm:justify-center">
      <div class="nav-tabs !mb-0 flex-nowrap shrink-0 border-b border-slate-300">
        <button
          type="button"
          onclick={() => (activeTab = "loan")}
          class="nav-link {activeTab === 'loan' ? 'active' : ''} text-xs sm:text-sm !py-2.5 !px-3 sm:!px-5"
        >
          <Calculator class="w-4 h-4 {activeTab === 'loan' ? 'text-emerald-700' : 'text-slate-400'}" />
          <span><span class="hidden sm:inline">Simulasi </span>Pembiayaan (Murabahah)</span>
        </button>

        <button
          type="button"
          onclick={() => (activeTab = "invest")}
          class="nav-link {activeTab === 'invest' ? 'active' : ''} text-xs sm:text-sm !py-2.5 !px-3 sm:!px-5"
        >
          <TrendingUp class="w-4 h-4 {activeTab === 'invest' ? 'text-emerald-700' : 'text-slate-400'}" />
          <span><span class="hidden sm:inline">Proyeksi </span>Investasi (Mudharabah)</span>
        </button>

        <button
          type="button"
          onclick={() => (activeTab = "score")}
          class="nav-link {activeTab === 'score' ? 'active' : ''} text-xs sm:text-sm !py-2.5 !px-3 sm:!px-5"
        >
          <Activity class="w-4 h-4 {activeTab === 'score' ? 'text-emerald-700' : 'text-slate-400'}" />
          <span><span class="hidden sm:inline">Uji </span>Kelayakan (DSR)</span>
        </button>
      </div>
    </div>

    <!-- Active Calculator Component Pane -->
    <div>
      {#if activeTab === "loan"}
        <LoanCalculator />
      {:else if activeTab === "invest"}
        <InvestmentCalculator />
      {:else}
        <CreditScoreEstimator />
      {/if}
    </div>

    <!-- Educational Comparison Table: Konvensional vs Syariah -->
    <div class="panel shadow-xs !mb-0">
      <div class="panel-heading panel-emerald flex items-center justify-between !py-2.5 !px-4">
        <span class="text-xs font-bold uppercase tracking-wider text-white">
          Komparasi Fiqih: Sistem Pinjaman Konvensional vs Pembiayaan Syariah
        </span>
        <span class="label label-inverse text-[10px]">Edukasi Muamalah</span>
      </div>

      <div class="p-0 overflow-x-auto">
        <table class="table table-bordered table-striped !mb-0 text-xs">
          <thead>
            <tr>
              <th class="w-1/4">Aspek Perbandingan</th>
              <th class="w-3/8 text-rose-800 bg-rose-50/50">Pinjaman Konvensional</th>
              <th class="w-3/8 text-emerald-800 bg-emerald-50/50">Pembiayaan Namia Syariah</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-bold text-slate-700">Skema Keuntungan</td>
              <td class="text-slate-600">Bunga majemuk berbunga (compounding), floating fluktuatif</td>
              <td class="text-emerald-900 font-semibold">Margin jual beli (Murabahah) flat mengikat sejak awal ijab qabul</td>
            </tr>
            <tr>
              <td class="font-bold text-slate-700">Denda Keterlambatan</td>
              <td class="text-slate-600">Masuk sebagai laba lembaga pemberi pinjaman (riba jahiliyah)</td>
              <td class="text-emerald-900 font-semibold">Kompensasi (Ta'zir) 100% disalurkan ke dana sosial fakir miskin (Qardhul Hasan)</td>
            </tr>
            <tr>
              <td class="font-bold text-slate-700">Objek Transaksi (Underlying)</td>
              <td class="text-slate-600">Murni pinjaman uang tunai membiakkan uang (riba nasiah)</td>
              <td class="text-emerald-900 font-semibold">Wajib ada underlying asset riil halal yang jelas (barang dagang, mesin, invoice)</td>
            </tr>
            <tr>
              <td class="font-bold text-slate-700">Pengawasan</td>
              <td class="text-slate-600">Hanya pengawasan OJK aspek legalitas</td>
              <td class="text-emerald-900 font-semibold">Diawasi OJK dan Dewan Pengawas Syariah (DPS) sertifikasi DSN-MUI</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Fatwa DSN-MUI Reference in Early Bootstrap Well -->
    <div class="well well-dark flex flex-col md:flex-row items-start md:items-center justify-between gap-6 !p-6">
      <div class="space-y-1.5 max-w-2xl">
        <div class="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase">
          <ShieldCheck class="w-4 h-4" />
          <span>Rujukan Fatwa Resmi DSN-MUI</span>
        </div>
        <h4 class="text-base font-bold text-white uppercase">
          Fatwa DSN-MUI No. 117/DSN-MUI/II/2018
        </h4>
        <p class="text-xs text-slate-300 leading-relaxed">
          Mengatur tentang Layanan Pembiayaan Berbasis Teknologi Informasi Berdasarkan Prinsip Syariah, memastikan seluruh mekanisme akad fintech berada dalam koridor hukum muamalah yang sah.
        </p>
      </div>

      <a
        href="/about#dps"
        class="btn btn-success btn-small shrink-0 font-bold uppercase flex items-center gap-1.5"
      >
        <span>Lihat Dewan Pengawas</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
    </div>
  </div>
</div>
