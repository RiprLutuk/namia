<script lang="ts">
  import {
    Calculator,
    CheckCircle2,
    ChevronRight,
    HelpCircle,
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
        <Calculator class="w-4 h-4" />
      </div>
      <div>
        <h3 class="text-base font-bold text-white uppercase">
          Simulasi Pembiayaan Syariah
        </h3>
        <p class="text-[11px] text-slate-300">
          Kalkulasi cicilan flat tanpa riba berbasis akad {contractType}
        </p>
      </div>
    </div>
    <span
      class="px-2.5 py-1 rounded-[2px] bg-slate-800 text-[10px] font-bold tracking-wider text-emerald-400 border border-slate-600"
    >
      AKAD {contractType.toUpperCase()}
    </span>
  </div>

  <div class="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
    <!-- Input Form Section (7 Cols) -->
    <div class="lg:col-span-7 space-y-5">
      <!-- Akad Selector -->
      <div>
        <label
          for="contract-type"
          class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2"
          >Pilihan Akad Syariah</label
        >
        <div class="grid grid-cols-3 gap-2">
          {#each ["Murabahah", "Ijarah", "Musyarakah"] as type}
            <button
              type="button"
              onclick={() => (contractType = type)}
              class="h-9 px-2 text-xs font-medium rounded-[2px] border transition-colors text-center flex items-center justify-center cursor-pointer {contractType ===
              type
                ? 'border-emerald-700 bg-emerald-700 text-white font-bold'
                : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100'}"
            >
              {type}
            </button>
          {/each}
        </div>
      </div>

      <!-- Plafon Slider -->
      <div>
        <div class="flex justify-between items-center mb-1.5">
          <label
            for="loan-amount-slider"
            class="text-xs font-semibold text-slate-700"
            >Jumlah Pembiayaan</label
          >
          <span class="text-base font-bold text-emerald-800 font-mono"
            >{formatRupiah(amount)}</span
          >
        </div>
        <input
          id="loan-amount-slider"
          type="range"
          min="2000000"
          max="100000000"
          step="1000000"
          bind:value={amount}
          class="w-full h-1.5 bg-slate-200 rounded-[2px] appearance-none cursor-pointer accent-emerald-700"
        />
        <div class="flex justify-between text-[11px] text-slate-500 mt-1">
          <span>Rp 2 Jt</span>
          <span>Rp 50 Jt</span>
          <span>Rp 100 Jt</span>
        </div>
      </div>

      <!-- Tenor Slider -->
      <div>
        <div class="flex justify-between items-center mb-1.5">
          <label
            for="tenor-months-slider"
            class="text-xs font-semibold text-slate-700"
            >Jangka Waktu (Tenor)</label
          >
          <span class="text-base font-bold text-slate-900 font-mono"
            >{tenorMonths} Bulan</span
          >
        </div>
        <input
          id="tenor-months-slider"
          type="range"
          min="3"
          max="36"
          step="3"
          bind:value={tenorMonths}
          class="w-full h-1.5 bg-slate-200 rounded-[2px] appearance-none cursor-pointer accent-emerald-700"
        />
        <div class="flex justify-between text-[11px] text-slate-500 mt-1">
          <span>3 Bulan</span>
          <span>12 Bulan (1 Thn)</span>
          <span>24 Bulan</span>
          <span>36 Bulan</span>
        </div>
      </div>

      <!-- Margin Rate Slider -->
      <div>
        <div class="flex justify-between items-center mb-1.5">
          <div class="flex items-center gap-1.5">
            <label
              for="margin-rate-slider"
              class="text-xs font-semibold text-slate-700"
              >Estimasi Margin Tahunan</label
            >
            <span
              class="text-slate-400"
              title="Margin keuntungan yang disepakati bersama di awal akad"
            >
              <HelpCircle class="w-3.5 h-3.5" />
            </span>
          </div>
          <span class="text-xs font-bold text-slate-800 font-mono"
            >{marginPercent}% / tahun</span
          >
        </div>
        <input
          id="margin-rate-slider"
          type="range"
          min="5"
          max="18"
          step="0.5"
          bind:value={marginPercent}
          class="w-full h-1.5 bg-slate-200 rounded-[2px] appearance-none cursor-pointer accent-emerald-700"
        />
      </div>
    </div>

    <!-- Output Summary Card (5 Cols) -->
    <div
      class="lg:col-span-5 bg-slate-50 border border-slate-300 rounded-[3px] p-5 flex flex-col justify-between space-y-4"
    >
      <div class="space-y-4">
        <div>
          <span
            class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block"
            >Estimasi Angsuran Bulanan</span
          >
          <div class="flex items-baseline gap-1.5 flex-nowrap mt-1">
            <span
              class="text-xl sm:text-2xl font-extrabold text-emerald-800 font-mono tracking-tight whitespace-nowrap"
            >
              {formatRupiah(monthlyInstallment)}
            </span>
            <span
              class="text-xs sm:text-sm font-medium text-slate-600 font-sans whitespace-nowrap shrink-0"
              >/ bln</span
            >
          </div>
        </div>

        <div
          class="pt-3 border-t border-slate-300 space-y-2 text-xs text-slate-600"
        >
          <div class="flex justify-between">
            <span>Harga Pokok Barang</span>
            <span class="font-medium text-slate-900 font-mono"
              >{formatRupiah(amount)}</span
            >
          </div>
          <div class="flex justify-between">
            <span>Total Margin Syariah</span>
            <span class="font-medium text-slate-900 font-mono"
              >{formatRupiah(totalMargin)}</span
            >
          </div>
          <div
            class="flex justify-between font-semibold text-slate-900 pt-2 border-t border-slate-300"
          >
            <span>Total Harga Jual Akhir</span>
            <span class="text-emerald-800 font-mono text-sm"
              >{formatRupiah(totalPayable)}</span
            >
          </div>
        </div>

        <div
          class="p-2.5 bg-emerald-50 rounded-[2px] border border-emerald-200 flex items-start gap-2 text-[11px] text-emerald-900 leading-relaxed"
        >
          <CheckCircle2 class="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
          <span
            >Nominal cicilan tetap dan mengikat sejak tanda tangan akad tanpa
            denda bunga majemuk.</span
          >
        </div>
      </div>

      <div class="pt-2">
        <a
          href="/onboarding?amount={amount}&tenor={tenorMonths}&contract={contractType}"
          class="button-4-primary w-full text-xs py-2 px-4 rounded-[3px] flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider"
        >
          <span>Ajukan Pembiayaan</span>
          <ChevronRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </div>
</div>
