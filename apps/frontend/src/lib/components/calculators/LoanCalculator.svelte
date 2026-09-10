<script lang="ts">
  import { Calculator, CheckCircle2, ChevronRight, HelpCircle } from "lucide-svelte";

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
      maximumFractionDigits: 0
    }).format(num);
  }

  // Reactive calculations
  let totalMargin = $derived(
    Math.round(amount * (marginPercent / 100) * (tenorMonths / 12))
  );
  let totalPayable = $derived(amount + totalMargin);
  let monthlyInstallment = $derived(
    Math.round(totalPayable / tenorMonths)
  );
</script>

<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
  <div class="bg-gradient-to-r from-emerald-700 to-emerald-600 px-6 py-5 text-white flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
        <Calculator class="w-5 h-5 text-emerald-100" />
      </div>
      <div>
        <h3 class="text-lg font-bold">Simulasi Pembiayaan Syariah</h3>
        <p class="text-xs text-emerald-100">Kalkulasi cicilan flat tanpa riba berbasis akad {contractType}</p>
      </div>
    </div>
    <span class="px-3 py-1 rounded-full bg-emerald-800/60 text-xs font-semibold tracking-wider text-emerald-200 border border-emerald-500/30">
      AKAD {contractType.toUpperCase()}
    </span>
  </div>

  <div class="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <!-- Input Form Section (7 Cols) -->
    <div class="lg:col-span-7 space-y-6">
      
      <!-- Akad Selector -->
      <div>
        <label for="contract-type" class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Pilihan Akad Syariah</label>
        <div class="grid grid-cols-3 gap-2">
          {#each ["Murabahah", "Ijarah", "Musyarakah"] as type}
            <button
              type="button"
              onclick={() => contractType = type}
              class="py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all text-center {contractType === type ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/20' : 'border-slate-200 text-slate-600 hover:border-slate-300'}"
            >
              {type}
            </button>
          {/each}
        </div>
      </div>

      <!-- Plafon Slider -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label for="loan-amount-slider" class="text-sm font-semibold text-slate-700">Jumlah Pembiayaan</label>
          <span class="text-lg font-bold text-emerald-600 font-mono">{formatRupiah(amount)}</span>
        </div>
        <input
          id="loan-amount-slider"
          type="range"
          min="2000000"
          max="100000000"
          step="1000000"
          bind:value={amount}
          class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
        <div class="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>Rp 2 Juta</span>
          <span>Rp 50 Juta</span>
          <span>Rp 100 Juta</span>
        </div>
      </div>

      <!-- Tenor Slider -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label for="tenor-months-slider" class="text-sm font-semibold text-slate-700">Jangka Waktu (Tenor)</label>
          <span class="text-lg font-bold text-slate-900 font-mono">{tenorMonths} Bulan</span>
        </div>
        <input
          id="tenor-months-slider"
          type="range"
          min="3"
          max="36"
          step="3"
          bind:value={tenorMonths}
          class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
        <div class="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>3 Bulan</span>
          <span>12 Bulan (1 Thn)</span>
          <span>24 Bulan</span>
          <span>36 Bulan</span>
        </div>
      </div>

      <!-- Margin Rate Slider -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center gap-1.5">
            <label for="margin-rate-slider" class="text-sm font-semibold text-slate-700">Estimasi Margin Tahunan</label>
            <span class="text-slate-400" title="Margin keuntungan yang disepakati bersama di awal akad">
              <HelpCircle class="w-3.5 h-3.5" />
            </span>
          </div>
          <span class="text-sm font-bold text-slate-800 font-mono">{marginPercent}% / tahun</span>
        </div>
        <input
          id="margin-rate-slider"
          type="range"
          min="5"
          max="18"
          step="0.5"
          bind:value={marginPercent}
          class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
      </div>

    </div>

    <!-- Output Summary Card (5 Cols) -->
    <div class="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-xl p-6 flex flex-col justify-between">
      <div class="space-y-4">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Estimasi Angsuran Bulanan</span>
          <div class="text-3xl font-extrabold text-emerald-700 font-mono mt-1">
            {formatRupiah(monthlyInstallment)}
            <span class="text-xs font-normal text-slate-500">/ bulan</span>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
          <div class="flex justify-between">
            <span>Harga Pokok Barang</span>
            <span class="font-medium text-slate-900 font-mono">{formatRupiah(amount)}</span>
          </div>
          <div class="flex justify-between">
            <span>Total Margin Syariah</span>
            <span class="font-medium text-slate-900 font-mono">{formatRupiah(totalMargin)}</span>
          </div>
          <div class="flex justify-between font-semibold text-slate-900 pt-2 border-t border-slate-200">
            <span>Total Harga Jual Akhir</span>
            <span class="text-emerald-700 font-mono text-sm">{formatRupiah(totalPayable)}</span>
          </div>
        </div>

        <div class="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-start gap-2 text-[11px] text-emerald-800 leading-relaxed">
          <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>Nominal cicilan tetap dan mengikat sejak tanda tangan akad tanpa denda bunga majemuk.</span>
        </div>
      </div>

      <div class="pt-6">
        <a
          href="/onboarding?amount={amount}&tenor={tenorMonths}&contract={contractType}"
          class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm text-center flex items-center justify-center gap-2 shadow-xs transition-all hover:shadow-md"
        >
          <span>Ajukan Sekarang dengan Hasil Ini</span>
          <ChevronRight class="w-4 h-4" />
        </a>
      </div>
    </div>

  </div>
</div>
