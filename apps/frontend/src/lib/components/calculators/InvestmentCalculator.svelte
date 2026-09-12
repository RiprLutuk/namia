<script lang="ts">
  import { TrendingUp, HelpCircle, ArrowUpRight, Coins, Printer } from "lucide-svelte";

  let initialDeposit = $state(10000000);
  let monthlyDeposit = $state(500000);
  let expectedAnnualYield = $state(12);
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
    const profitPercent = totalInvested > 0 ? Math.round((profit / totalInvested) * 100) : 0;

    return {
      totalInvested: Math.round(totalInvested),
      profit,
      profitPercent,
      finalValue: Math.round(balance),
    };
  });

  function printSimulation() {
    window.print();
  }
</script>

<div class="panel panel-default shadow-xs border border-slate-300 rounded-[4px] overflow-hidden font-sans !mb-0">
  <!-- Early Bootstrap 2.0 Panel Header -->
  <div class="panel-heading panel-emerald flex items-center justify-between !py-2.5 !px-3 sm:!px-4">
    <div class="flex items-center gap-2 sm:gap-2.5 min-w-0">
      <TrendingUp class="w-4 h-4 text-emerald-100 shrink-0" />
      <span class="text-xs sm:text-sm font-bold uppercase tracking-wider text-white truncate">
        Simulasi Investasi Bagi Hasil Mudharabah
      </span>
    </div>
    <span class="badge badge-inverse text-[10px] uppercase font-bold shrink-0 ml-2">
      Akad Mudharabah
    </span>
  </div>

  <!-- Panel Body -->
  <div class="panel-body p-3.5 sm:p-5 lg:p-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
      <!-- Input Controls (7 cols) -->
      <div class="lg:col-span-7 space-y-4">
        <!-- Modal Awal Box (.well) -->
        <div class="well well-white !p-3 sm:!p-4 !mb-0 space-y-2 border border-slate-300 rounded-[3px] shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <label for="initial-deposit-slider" class="text-xs font-bold uppercase tracking-wider text-slate-700">
              Modal Investasi Awal:
            </label>
            <span class="font-mono font-bold text-xs sm:text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-[3px] shadow-inner">
              {formatRupiah(initialDeposit)}
            </span>
          </div>

          <input
            id="initial-deposit-slider"
            type="range"
            min="1000000"
            max="500000000"
            step="1000000"
            bind:value={initialDeposit}
            class="w-full accent-emerald-600 h-2 bg-slate-200 rounded cursor-pointer"
          />

          <div class="flex justify-between text-[10.5px] text-slate-500 font-mono">
            <span>Rp 1 Jt</span>
            <span>Rp 100 Jt</span>
            <span>Rp 500 Jt</span>
          </div>
        </div>

        <!-- Top-up Rutin Bulanan Box (.well) -->
        <div class="well well-white !p-3 sm:!p-4 !mb-0 space-y-2 border border-slate-300 rounded-[3px] shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <label for="monthly-deposit-slider" class="text-xs font-bold uppercase tracking-wider text-slate-700">
              Top-up Rutin Bulanan:
            </label>
            <span class="font-mono font-bold text-xs sm:text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-[3px] shadow-inner">
              {formatRupiah(monthlyDeposit)} /bln
            </span>
          </div>

          <input
            id="monthly-deposit-slider"
            type="range"
            min="0"
            max="10000000"
            step="250000"
            bind:value={monthlyDeposit}
            class="w-full accent-emerald-600 h-2 bg-slate-200 rounded cursor-pointer"
          />

          <div class="flex justify-between text-[10.5px] text-slate-500 font-mono">
            <span>Rp 0 (Sekali Investasi)</span>
            <span>Rp 5 Jt</span>
            <span>Rp 10 Jt</span>
          </div>
        </div>

        <!-- Durasi Investasi Range Slider Box (.well) -->
        <div class="well well-white !p-3 sm:!p-4 !mb-0 space-y-2 border border-slate-300 rounded-[3px] shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <label for="duration-years-slider" class="text-xs font-bold uppercase tracking-wider text-slate-700">
              Durasi Investasi:
            </label>
            <span class="font-mono font-bold text-xs sm:text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-[3px] shadow-inner">
              {durationYears} Tahun ({durationYears * 12} Bulan)
            </span>
          </div>

          <input
            id="duration-years-slider"
            type="range"
            min="1"
            max="5"
            step="1"
            bind:value={durationYears}
            class="w-full accent-emerald-600 h-2 bg-slate-200 rounded cursor-pointer"
          />

          <div class="flex justify-between text-[10.5px] text-slate-500 font-mono">
            <span>1 Tahun</span>
            <span>2 Tahun</span>
            <span>3 Tahun</span>
            <span>5 Tahun</span>
          </div>
        </div>

        <!-- Nisbah Bagi Hasil Box (.well) -->
        <div class="well well-white !p-3 sm:!p-4 !mb-0 space-y-2 border border-slate-300 rounded-[3px] shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Porsi Bagi Hasil (Nisbah):</span>
            <span class="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-[3px]">
              {nisbahInvestor}% : {100 - nisbahInvestor}%
            </span>
          </div>
          <div class="btn-group w-full grid grid-cols-3">
            {#each [60, 70, 80] as n}
              <button
                type="button"
                onclick={() => (nisbahInvestor = n)}
                class="btn {nisbahInvestor === n ? 'btn-success active font-bold' : 'btn-default'} !py-1.5 !px-1 text-xs text-center w-full"
              >
                {n} : {100 - n}
              </button>
            {/each}
          </div>
        </div>

        <!-- Proyeksi Imbal Hasil Bruto Slider (.well) -->
        <div class="well well-white !p-3 sm:!p-4 !mb-0 space-y-2 border border-slate-300 rounded-[3px] shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <label for="expected-yield-slider" class="text-xs font-bold uppercase tracking-wider text-slate-700">
              Proyeksi Imbal Hasil Bruto:
            </label>
            <span class="font-mono font-bold text-xs sm:text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-[3px] shadow-inner">
              {expectedAnnualYield}% p.a. (Net: {effectiveYield}%)
            </span>
          </div>

          <input
            id="expected-yield-slider"
            type="range"
            min="8"
            max="22"
            step="0.5"
            bind:value={expectedAnnualYield}
            class="w-full accent-emerald-600 h-2 bg-slate-200 rounded cursor-pointer"
          />

          <div class="flex justify-between text-[10.5px] text-slate-500 font-mono">
            <span>8.0% (Konservatif)</span>
            <span>15.0% (Moderat)</span>
            <span>22.0% (Agresif)</span>
          </div>
        </div>
      </div>

      <!-- Output Result Section (5 cols) -->
      <div class="lg:col-span-5 flex flex-col justify-between h-full">
        <div class="well well-emerald !p-3.5 sm:!p-4 lg:!p-5 border-emerald-300 rounded-[4px] flex-1 flex flex-col justify-between space-y-4 !mb-0 shadow-xs">
          <div class="space-y-3.5">
            <!-- Header Result -->
            <div class="flex items-center justify-between border-b border-emerald-200 pb-2">
              <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                Estimasi Nilai Akhir
              </span>
              <span class="label label-success text-[9.5px] uppercase font-bold tracking-wide">
                Nisbah {nisbahInvestor}:{100 - nisbahInvestor}
              </span>
            </div>

            <!-- Big Number -->
            <div>
              <div class="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono text-emerald-900 tracking-tight leading-none">
                {formatRupiah(calculationResult.finalValue)}
              </div>
              <p class="text-[11px] text-emerald-800 mt-1.5 leading-snug">
                Proyeksi akumulasi modal pokok dan bagi hasil riil berbasis nisbah {nisbahInvestor}%.
              </p>
            </div>

            <!-- Authentic Early Bootstrap Striped Progress Bar -->
            <div class="space-y-1">
              <div class="flex justify-between text-[11px] font-bold text-slate-700">
                <span>Modal Pokok Disetor</span>
                <span class="text-emerald-800 font-bold">+{calculationResult.profitPercent}% Bagi Hasil</span>
              </div>
              <div class="progress progress-striped active !h-4 !mb-0 rounded-[3px] border border-slate-300">
                <div class="bar" style="width: 100%"></div>
              </div>
            </div>

            <!-- Authentic Early Bootstrap Table Breakdown -->
            <div class="overflow-hidden border border-slate-300 rounded-[3px] bg-white">
              <table class="table table-bordered table-striped !mb-0 text-xs">
                <tbody>
                  <tr>
                    <td class="font-bold text-slate-700 w-1/2 !py-1.5 !px-2.5">Total Modal Disetor:</td>
                    <td class="font-mono font-bold text-right text-slate-900 !py-1.5 !px-2.5">{formatRupiah(calculationResult.totalInvested)}</td>
                  </tr>
                  <tr>
                    <td class="font-bold text-slate-700 !py-1.5 !px-2.5">Estimasi Bagi Hasil ({effectiveYield}% net):</td>
                    <td class="font-mono font-bold text-right text-emerald-700 !py-1.5 !px-2.5">+{formatRupiah(calculationResult.profit)}</td>
                  </tr>
                  <tr class="bg-emerald-50/80">
                    <td class="font-extrabold text-emerald-950 !py-2 !px-2.5">Total Saldo Akhir:</td>
                    <td class="font-mono font-extrabold text-right text-emerald-900 text-sm !py-2 !px-2.5">{formatRupiah(calculationResult.finalValue)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Action Buttons in Early Bootstrap Style -->
          <div class="pt-2 border-t border-emerald-200 flex flex-col sm:flex-row items-stretch gap-2">
            <button
              type="button"
              onclick={printSimulation}
              class="btn btn-default !py-2 !px-3 font-semibold text-xs flex items-center justify-center gap-1.5 shrink-0"
              title="Cetak Ringkasan Investasi"
            >
              <Printer class="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>

            <a
              href="/investor"
              class="btn btn-success btn-large flex-1 !py-2.5 !px-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm text-center"
            >
              <span>Mulai Mendanai Proyek</span>
              <ArrowUpRight class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
