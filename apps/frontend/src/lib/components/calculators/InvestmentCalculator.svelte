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
      maximumFractionDigits: 0
    }).format(num);
  }

  // Reactive calculations
  let effectiveYield = $derived(
    Number(((expectedAnnualYield * (nisbahInvestor / 100))).toFixed(2))
  );

  let calculationResult = $derived.by(() => {
    const monthlyRate = (effectiveYield / 100) / 12;
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
      finalValue: Math.round(balance)
    };
  });
</script>

<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
  <div class="bg-gradient-to-r from-sky-700 to-sky-600 px-6 py-5 text-white flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
        <TrendingUp class="w-5 h-5 text-sky-100" />
      </div>
      <div>
        <h3 class="text-lg font-bold">Kalkulator Investasi & Sukuk Syariah</h3>
        <p class="text-xs text-sky-100">Simulasi proyeksi imbal hasil akad Mudharabah & Musyarakah</p>
      </div>
    </div>
    <span class="px-3 py-1 rounded-full bg-sky-800/60 text-xs font-semibold tracking-wider text-sky-200 border border-sky-500/30">
      NISBAH {nisbahInvestor}:{100 - nisbahInvestor}
    </span>
  </div>

  <div class="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <!-- Inputs (7 Cols) -->
    <div class="lg:col-span-7 space-y-6">
      
      <!-- Setoran Awal -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label for="initial-deposit-slider" class="text-sm font-semibold text-slate-700">Modal Investasi Awal</label>
          <span class="text-lg font-bold text-sky-700 font-mono">{formatRupiah(initialDeposit)}</span>
        </div>
        <input
          id="initial-deposit-slider"
          type="range"
          min="1000000"
          max="100000000"
          step="1000000"
          bind:value={initialDeposit}
          class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
        />
        <div class="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>Rp 1 Juta</span>
          <span>Rp 50 Juta</span>
          <span>Rp 100 Juta</span>
        </div>
      </div>

      <!-- Rutin Bulanan -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label for="monthly-deposit-slider" class="text-sm font-semibold text-slate-700">Top-Up Rutin Bulanan</label>
          <span class="text-base font-bold text-slate-900 font-mono">{formatRupiah(monthlyDeposit)}</span>
        </div>
        <input
          id="monthly-deposit-slider"
          type="range"
          min="0"
          max="10000000"
          step="250000"
          bind:value={monthlyDeposit}
          class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
        />
      </div>

      <!-- Durasi & Nisbah Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="duration-years-select" class="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">Durasi Pendanaan</label>
          <select
            id="duration-years-select"
            bind:value={durationYears}
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
          >
            <option value={1}>1 Tahun (12 Bulan)</option>
            <option value={2}>2 Tahun (24 Bulan)</option>
            <option value={3}>3 Tahun (36 Bulan)</option>
            <option value={5}>5 Tahun (60 Bulan)</option>
          </select>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <label for="nisbah-slider" class="text-xs font-semibold text-slate-600 uppercase tracking-wider">Nisbah Investor</label>
            <span class="text-xs font-bold text-sky-700">{nisbahInvestor}%</span>
          </div>
          <input
            id="nisbah-slider"
            type="range"
            min="50"
            max="90"
            step="5"
            bind:value={nisbahInvestor}
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600 mt-2"
          />
        </div>
      </div>

    </div>

    <!-- Output (5 Cols) -->
    <div class="lg:col-span-5 bg-sky-50/50 border border-sky-100 rounded-xl p-6 flex flex-col justify-between">
      <div class="space-y-4">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Proyeksi Nilai Akhir Portofolio</span>
          <div class="text-3xl font-extrabold text-sky-800 font-mono mt-1">
            {formatRupiah(calculationResult.finalValue)}
          </div>
          <div class="inline-flex items-center gap-1 text-xs text-sky-700 font-semibold mt-1">
            <span>Imbal Hasil Efektif: ~{effectiveYield}% / tahun</span>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
          <div class="flex justify-between">
            <span>Total Pokok Disetor</span>
            <span class="font-medium text-slate-900 font-mono">{formatRupiah(calculationResult.totalInvested)}</span>
          </div>
          <div class="flex justify-between">
            <span>Estimasi Bagi Hasil Riil</span>
            <span class="font-semibold text-emerald-600 font-mono">+{formatRupiah(calculationResult.profit)}</span>
          </div>
        </div>

        <p class="text-[11px] text-slate-500 leading-relaxed italic">
          *Bagi hasil merupakan proyeksi berdasarkan rata-rata historis proyek sejenis. Realisasi aktual bergantung pada kinerja riil usaha mitra.
        </p>
      </div>

      <div class="pt-6">
        <a
          href="/investor"
          class="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm text-center flex items-center justify-center gap-2 shadow-xs transition-all"
        >
          <span>Mulai Pendanaan Sekarang</span>
          <ArrowUpRight class="w-4 h-4" />
        </a>
      </div>
    </div>

  </div>
</div>
