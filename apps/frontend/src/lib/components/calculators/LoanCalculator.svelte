<script lang="ts">
  import {
    Calculator,
    CheckCircle2,
    ChevronRight,
    HelpCircle,
    Printer
  } from "lucide-svelte";

  // State using modern Svelte 5 runes
  let amount = $state(20000000);
  let tenorMonths = $state(12);
  let marginPercent = $state(8.5);
  let contractType = $state("Murabahah");

  // Format currency helper
  function formatRupiah(num: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  }

  // Reactive calculations
  let totalMargin = $derived(
    Math.round(amount * (marginPercent / 100) * (tenorMonths / 12)),
  );
  let totalPayable = $derived(amount + totalMargin);
  let monthlyInstallment = $derived(Math.round(totalPayable / tenorMonths));
  let principalPercent = $derived(Math.round((amount / totalPayable) * 100));
  let marginRatioPercent = $derived(100 - principalPercent);

  function printSimulation() {
    window.print();
  }
</script>

<div class="panel panel-default shadow-xs border border-slate-300 rounded-[4px] overflow-hidden font-sans !mb-0">
  <!-- Early Bootstrap 2.0 Panel Header -->
  <div class="panel-heading panel-emerald flex items-center justify-between !py-2.5 !px-3 sm:!px-4">
    <div class="flex items-center gap-2 sm:gap-2.5 min-w-0">
      <Calculator class="w-4 h-4 text-emerald-100 shrink-0" />
      <span class="text-xs sm:text-sm font-bold uppercase tracking-wider text-white truncate">
        Simulasi Pembiayaan ({contractType})
      </span>
    </div>
    <span class="badge badge-inverse text-[10px] uppercase font-bold shrink-0 ml-2">
      Akad {contractType}
    </span>
  </div>

  <!-- Panel Body -->
  <div class="panel-body p-3.5 sm:p-5 lg:p-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
      <!-- Input Controls (7 cols) -->
      <div class="lg:col-span-7 space-y-4">
        <!-- Pilihan Akad Syariah (.btn-group) -->
        <div>
          <label for="contract-select-group" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Pilihan Akad Syariah
          </label>
          <div id="contract-select-group" class="btn-group w-full grid grid-cols-3">
            {#each ["Murabahah", "Ijarah", "Musyarakah"] as type}
              <button
                type="button"
                onclick={() => (contractType = type)}
                class="btn {contractType === type ? 'btn-success active font-bold' : 'btn-default'} !py-1.5 !px-1 text-[11px] sm:text-xs text-center truncate"
              >
                {type}
              </button>
            {/each}
          </div>
        </div>

        <!-- Jumlah Pembiayaan Box (.well) -->
        <div class="well well-white !p-3 sm:!p-4 !mb-0 space-y-2 border border-slate-300 rounded-[3px] shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <label for="loan-amount-slider" class="text-xs font-bold uppercase tracking-wider text-slate-700">
              Jumlah Pembiayaan:
            </label>
            <span class="font-mono font-bold text-xs sm:text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-[3px] shadow-inner">
              {formatRupiah(amount)}
            </span>
          </div>

          <input
            id="loan-amount-slider"
            type="range"
            min="5000000"
            max="2000000000"
            step="5000000"
            bind:value={amount}
            class="w-full accent-emerald-600 h-2 bg-slate-200 rounded cursor-pointer"
          />

          <div class="flex justify-between text-[10.5px] text-slate-500 font-mono">
            <span>Rp 5 Jt</span>
            <span>Rp 500 Jt</span>
            <span>Rp 2 Miliar</span>
          </div>
        </div>

        <!-- Jangka Waktu Tenor Slider Box (.well) -->
        <div class="well well-white !p-3 sm:!p-4 !mb-0 space-y-2 border border-slate-300 rounded-[3px] shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <label for="tenor-months-slider" class="text-xs font-bold uppercase tracking-wider text-slate-700">
              Jangka Waktu Tenor:
            </label>
            <span class="font-mono font-bold text-xs sm:text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-[3px] shadow-inner">
              {tenorMonths} Bulan ({tenorMonths / 12} Thn)
            </span>
          </div>

          <input
            id="tenor-months-slider"
            type="range"
            min="3"
            max="36"
            step="3"
            bind:value={tenorMonths}
            class="w-full accent-emerald-600 h-2 bg-slate-200 rounded cursor-pointer"
          />

          <div class="flex justify-between text-[10.5px] text-slate-500 font-mono">
            <span>3 Bulan</span>
            <span>12 Bulan (1 Thn)</span>
            <span>24 Bulan</span>
            <span>36 Bulan (3 Thn)</span>
          </div>
        </div>

        <!-- Margin Slider Box (.well) -->
        <div class="well well-white !p-3 sm:!p-4 !mb-0 space-y-2 border border-slate-300 rounded-[3px] shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <label for="margin-rate-slider" class="text-xs font-bold uppercase tracking-wider text-slate-700">
              Ekspektasi Margin / Ujrah:
            </label>
            <span class="font-mono font-bold text-xs sm:text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-[3px] shadow-inner">
              {marginPercent}% p.a.
            </span>
          </div>

          <input
            id="margin-rate-slider"
            type="range"
            min="5"
            max="20"
            step="0.5"
            bind:value={marginPercent}
            class="w-full accent-emerald-600 h-2 bg-slate-200 rounded cursor-pointer"
          />

          <div class="flex justify-between text-[10.5px] text-slate-500 font-mono">
            <span>5.0% (Ringan)</span>
            <span>12.5% (Standar)</span>
            <span>20.0% (Maksimal)</span>
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
                Estimasi Angsuran Bulanan
              </span>
              <span class="label label-success text-[9.5px] uppercase font-bold tracking-wide">
                Flat Tanpa Riba
              </span>
            </div>

            <!-- Big Number -->
            <div>
              <div class="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono text-emerald-900 tracking-tight leading-none">
                {formatRupiah(monthlyInstallment)}
                <span class="text-xs sm:text-sm text-emerald-700 font-normal font-sans">/bulan</span>
              </div>
              <p class="text-[11px] text-emerald-800 mt-1.5 leading-snug">
                Angsuran flat tetap hingga akhir tenor, bebas biaya penalti pelunasan dipercepat.
              </p>
            </div>

            <!-- Authentic Early Bootstrap Striped Progress Bar -->
            <div class="space-y-1">
              <div class="flex justify-between text-[11px] font-bold text-slate-700">
                <span>Pokok ({principalPercent}%)</span>
                <span class="text-emerald-800">Margin ({marginRatioPercent}%)</span>
              </div>
              <div class="progress progress-striped active !h-4 !mb-0 rounded-[3px] border border-slate-300">
                <div class="bar" style="width: {principalPercent}%"></div>
                <div class="bar" style="width: {marginRatioPercent}%; background-color: #047857; background-image: linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent); background-size: 40px 40px;"></div>
              </div>
            </div>

            <!-- Authentic Early Bootstrap Table Breakdown -->
            <div class="overflow-hidden border border-slate-300 rounded-[3px] bg-white">
              <table class="table table-bordered table-striped !mb-0 text-xs">
                <tbody>
                  <tr>
                    <td class="font-bold text-slate-700 w-1/2 !py-1.5 !px-2.5">Total Pokok:</td>
                    <td class="font-mono font-bold text-right text-slate-900 !py-1.5 !px-2.5">{formatRupiah(amount)}</td>
                  </tr>
                  <tr>
                    <td class="font-bold text-slate-700 !py-1.5 !px-2.5">Total Margin ({marginPercent}%):</td>
                    <td class="font-mono font-bold text-right text-emerald-700 !py-1.5 !px-2.5">{formatRupiah(totalMargin)}</td>
                  </tr>
                  <tr class="bg-emerald-50/80">
                    <td class="font-extrabold text-emerald-950 !py-2 !px-2.5">Total Pengembalian:</td>
                    <td class="font-mono font-extrabold text-right text-emerald-900 text-sm !py-2 !px-2.5">{formatRupiah(totalPayable)}</td>
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
              title="Cetak Ringkasan Simulasi"
            >
              <Printer class="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>

            <a
              href="/borrower?amount={amount}&tenor={tenorMonths}&contract={contractType}"
              class="btn btn-success btn-large flex-1 !py-2.5 !px-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm text-center"
            >
              <span>Ajukan Pembiayaan Ini</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
