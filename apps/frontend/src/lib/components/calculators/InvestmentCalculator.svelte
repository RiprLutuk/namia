<script lang="ts">
  import { TrendingUp, HelpCircle, ArrowUpRight } from "lucide-svelte";

  let initialDeposit = $state(10000000);
  let monthlyDeposit = $state(500000);
  let expectedAnnualYield = $state(10);
  let durationYears = $state(3);
  let nisbahInvestor = $state(70); // 70% for investor, 30% for manager

  function formatRupiah(num: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  }

  // Reactive calculations
  let effectiveYield = $derived(
    Number((expectedAnnualYield * (nisbahInvestor / 100)).toFixed(2)),
  );

  let calculationResult = $derived.by(() => {
    const monthlyRate = effectiveYield / 100 / 12;
    const totalMonths = durationYears * 12;
    let balance = initialDeposit;
    let totalInvested = initialDeposit;

    for (let m = 1; m <= totalMonths; m++) {
      balance = (balance + monthlyDeposit) * (1 + monthlyRate);
      totalInvested += monthlyDeposit;
    }

    const profit = Math.round(balance - totalInvested);
    return {
      totalInvested: Math.round(totalInvested),
      profit,
      finalValue: Math.round(balance),
    };
  });
</script>

<div
  class="bg-white rounded-[3px] border border-slate-300 shadow-xs overflow-hidden font-sans"
>
  <div
    class="bg-[#0f172a] px-6 py-4 text-white flex items-center justify-between border-b border-slate-700"
  >
    <div class="flex items-center gap-3">
      <div
        class="w-8 h-8 rounded-[2px] bg-slate-800 border border-slate-600 flex items-center justify-center text-emerald-400"
      >
        <TrendingUp class="w-4 h-4" />
      </div>
      <div>
        <h3 class="text-base font-bold text-white uppercase">
          Kalkulator Investasi & Sukuk Syariah
        </h3>
        <p class="text-[11px] text-slate-300">
          Simulasi proyeksi imbal hasil akad Mudharabah & Musyarakah
        </p>
      </div>
    </div>
    <span
      class="px-2.5 py-1 rounded-[2px] bg-slate-800 text-[10px] font-bold tracking-wider text-emerald-400 border border-slate-600"
    >
      NISBAH {nisbahInvestor}:{100 - nisbahInvestor}
    </span>
  </div>

  <div class="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
    <!-- Inputs (7 Cols) -->
    <div class="lg:col-span-7 space-y-5">
      <!-- Setoran Awal -->
      <div>
        <div class="flex justify-between items-center mb-1.5">
          <label
            for="initial-deposit-slider"
            class="text-xs font-semibold text-slate-700"
            >Modal Investasi Awal</label
          >
          <span class="text-base font-bold text-emerald-800 font-mono"
            >{formatRupiah(initialDeposit)}</span
          >
        </div>
        <input
          id="initial-deposit-slider"
          type="range"
          min="1000000"
          max="100000000"
          step="1000000"
          bind:value={initialDeposit}
          class="w-full h-1.5 bg-slate-200 rounded-[2px] appearance-none cursor-pointer accent-emerald-700"
        />
        <div class="flex justify-between text-[11px] text-slate-500 mt-1">
          <span>Rp 1 Jt</span>
          <span>Rp 50 Jt</span>
          <span>Rp 100 Jt</span>
        </div>
      </div>

      <!-- Rutin Bulanan -->
      <div>
        <div class="flex justify-between items-center mb-1.5">
          <label
            for="monthly-deposit-slider"
            class="text-xs font-semibold text-slate-700"
            >Top-Up Rutin Bulanan</label
          >
          <span class="text-base font-bold text-slate-900 font-mono"
            >{formatRupiah(monthlyDeposit)}</span
          >
        </div>
        <input
          id="monthly-deposit-slider"
          type="range"
          min="0"
          max="10000000"
          step="250000"
          bind:value={monthlyDeposit}
          class="w-full h-1.5 bg-slate-200 rounded-[2px] appearance-none cursor-pointer accent-emerald-700"
        />
      </div>

      <!-- Durasi & Nisbah Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            for="duration-years-select"
            class="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5"
            >Durasi Pendanaan</label
          >
          <select
            id="duration-years-select"
            bind:value={durationYears}
            class="w-full h-9 bg-white border border-slate-300 rounded-[2px] px-3 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-600"
          >
            <option value={1}>1 Tahun (12 Bulan)</option>
            <option value={2}>2 Tahun (24 Bulan)</option>
            <option value={3}>3 Tahun (36 Bulan)</option>
            <option value={5}>5 Tahun (60 Bulan)</option>
          </select>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label
              for="nisbah-slider"
              class="text-xs font-semibold text-slate-600 uppercase tracking-wider"
              >Nisbah Investor</label
            >
            <span class="text-xs font-bold text-emerald-800 font-mono"
              >{nisbahInvestor}%</span
            >
          </div>
          <input
            id="nisbah-slider"
            type="range"
            min="50"
            max="90"
            step="5"
            bind:value={nisbahInvestor}
            class="w-full h-1.5 bg-slate-200 rounded-[2px] appearance-none cursor-pointer accent-emerald-700 mt-2"
          />
        </div>
      </div>
    </div>

    <!-- Output (5 Cols) -->
    <div
      class="lg:col-span-5 bg-slate-50 border border-slate-300 rounded-[3px] p-5 flex flex-col justify-between space-y-4"
    >
      <div class="space-y-4">
        <div>
          <span
            class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block"
            >Proyeksi Nilai Akhir</span
          >
          <div
            class="text-2xl sm:text-3xl font-extrabold text-emerald-800 font-mono mt-0.5"
          >
            {formatRupiah(calculationResult.finalValue)}
          </div>
          <div
            class="inline-flex items-center gap-1 text-xs text-emerald-800 font-semibold mt-1"
          >
            <span>Imbal Hasil: ~{effectiveYield}% / tahun</span>
          </div>
        </div>

        <div
          class="pt-3 border-t border-slate-300 space-y-2 text-xs text-slate-600"
        >
          <div class="flex justify-between">
            <span>Total Pokok Disetor</span>
            <span class="font-medium text-slate-900 font-mono"
              >{formatRupiah(calculationResult.totalInvested)}</span
            >
          </div>
          <div class="flex justify-between">
            <span>Estimasi Bagi Hasil</span>
            <span class="font-semibold text-emerald-800 font-mono"
              >+{formatRupiah(calculationResult.profit)}</span
            >
          </div>
        </div>

        <p class="text-[11px] text-slate-500 leading-relaxed italic pt-1">
          *Bagi hasil merupakan proyeksi berdasarkan rata-rata historis proyek
          sejenis. Realisasi aktual bergantung pada kinerja riil usaha mitra.
        </p>
      </div>

      <div class="pt-2">
        <a
          href="/investor"
          class="button-4-primary w-full text-xs py-2 px-4 rounded-[3px] flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider"
        >
          <span>Mulai Pendanaan</span>
          <ArrowUpRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </div>
</div>
