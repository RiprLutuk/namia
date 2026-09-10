<script lang="ts">
  import { ShieldAlert, CheckCircle, Award, ArrowRight } from "lucide-svelte";

  let monthlyIncome = $state(15000000);
  let monthlyExpenses = $state(6000000);
  let existingLoan = $state(2000000);
  let employmentType = $state("permanent_employee");
  let employmentDuration = $state(3);
  let creditHistory = $state("good");

  function formatRupiah(num: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  }

  let estimation = $derived.by(() => {
    const totalCommitments = monthlyExpenses + existingLoan;
    const dsr = monthlyIncome > 0 ? (existingLoan / monthlyIncome) * 100 : 100;
    const disposable = Math.max(0, monthlyIncome - totalCommitments);

    let score = 550;
    if (dsr < 20) score += 140;
    else if (dsr < 30) score += 90;
    else if (dsr < 40) score += 40;
    else if (dsr > 50) score -= 100;

    if (employmentType === "permanent_employee") score += 60;
    else if (employmentType === "entrepreneur") score += 45;
    else if (employmentType === "contract_employee") score += 20;

    if (employmentDuration >= 3) score += 40;
    else if (employmentDuration >= 1) score += 20;

    if (creditHistory === "excellent") score += 80;
    else if (creditHistory === "good") score += 50;
    else if (creditHistory === "no_history") score += 10;
    else score -= 80;

    score = Math.min(850, Math.max(300, score));

    let tier = "Cukup";
    let colorClass = "text-amber-600 bg-amber-50 border-amber-200";
    let maxFunding = Math.round(disposable * 0.3 * 18);

    if (score >= 750) {
      tier = "Sangat Prima";
      colorClass = "text-emerald-700 bg-emerald-50 border-emerald-200";
      maxFunding = Math.round(disposable * 0.45 * 24);
    } else if (score >= 670) {
      tier = "Sehat & Layak";
      colorClass = "text-sky-700 bg-sky-50 border-sky-200";
      maxFunding = Math.round(disposable * 0.35 * 18);
    } else if (score < 580) {
      tier = "Perlu Pembenahan";
      colorClass = "text-rose-700 bg-rose-50 border-rose-200";
      maxFunding = Math.round(disposable * 0.15 * 6);
    }

    return {
      score,
      tier,
      colorClass,
      dsr: Number(dsr.toFixed(1)),
      disposable,
      maxFunding
    };
  });
</script>

<div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
  <div class="bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-5 text-white flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
        <Award class="w-5 h-5 text-amber-100" />
      </div>
      <div>
        <h3 class="text-lg font-bold">Kalkulator Skor Kelayakan Finansial</h3>
        <p class="text-xs text-amber-100">Ukur rasio beban hutang (DSR) dan kapasitas pembiayaan Anda</p>
      </div>
    </div>
    <span class="px-3 py-1 rounded-full bg-amber-700/60 text-xs font-semibold tracking-wider text-amber-200 border border-amber-400/30">
      ESTIMASI SKOR
    </span>
  </div>

  <div class="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- Form Inputs (7 Cols) -->
    <div class="lg:col-span-7 space-y-5">
      
      <!-- Income & Existing Loan -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="monthly-income-input" class="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">Penghasilan Bersih / Bulan</label>
          <div class="relative">
            <input
              id="monthly-income-input"
              type="number"
              step="500000"
              bind:value={monthlyIncome}
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900"
            />
          </div>
          <span class="text-[11px] text-slate-400 mt-1 block">{formatRupiah(monthlyIncome)}</span>
        </div>

        <div>
          <label for="existing-loan-input" class="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">Cicilan Hutang Berjalan</label>
          <div class="relative">
            <input
              id="existing-loan-input"
              type="number"
              step="250000"
              bind:value={existingLoan}
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900"
            />
          </div>
          <span class="text-[11px] text-slate-400 mt-1 block">{formatRupiah(existingLoan)}</span>
        </div>
      </div>

      <!-- Living Expenses -->
      <div>
        <label for="monthly-expenses-input" class="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">Biaya Hidup & Pengeluaran Rutin</label>
        <input
          id="monthly-expenses-input"
          type="number"
          step="500000"
          bind:value={monthlyExpenses}
          class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-900"
        />
        <span class="text-[11px] text-slate-400 mt-1 block">{formatRupiah(monthlyExpenses)}</span>
      </div>

      <!-- Employment & Status -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="employment-status-select" class="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">Status Pekerjaan</label>
          <select
            id="employment-status-select"
            bind:value={employmentType}
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-800"
          >
            <option value="permanent_employee">Karyawan Tetap</option>
            <option value="contract_employee">Karyawan Kontrak</option>
            <option value="entrepreneur">Pengusaha / Wirausaha</option>
            <option value="freelancer">Freelancer / Profesional</option>
          </select>
        </div>

        <div>
          <label for="credit-history-select" class="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">Riwayat Kredit (SLIK / OJK)</label>
          <select
            id="credit-history-select"
            bind:value={creditHistory}
            class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-800"
          >
            <option value="excellent">Sangat Baik (Kolektibilitas 1)</option>
            <option value="good">Lancar & Tepat Waktu</option>
            <option value="no_history">Belum Pernah Ada Kredit</option>
            <option value="fair">Pernah Menunggak Singkat</option>
          </select>
        </div>
      </div>

    </div>

    <!-- Output Result (5 Cols) -->
    <div class="lg:col-span-5 bg-amber-50/50 border border-amber-200/60 rounded-xl p-6 flex flex-col justify-between">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-600">Estimasi Skor Kredit</span>
          <span class="px-2.5 py-1 rounded-full text-xs font-bold border {estimation.colorClass}">
            {estimation.tier}
          </span>
        </div>

        <div class="flex items-baseline gap-2">
          <span class="text-4xl font-extrabold text-slate-900 font-mono">{estimation.score}</span>
          <span class="text-xs text-slate-400 font-medium">/ 850</span>
        </div>

        <div class="space-y-2 text-xs pt-3 border-t border-amber-200/60">
          <div class="flex justify-between">
            <span class="text-slate-600">Debt Service Ratio (DSR):</span>
            <span class="font-bold {estimation.dsr <= 30 ? 'text-emerald-700' : 'text-amber-700'} font-mono">{estimation.dsr}%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-600">Sisa Pendapatan Bebas:</span>
            <span class="font-medium text-slate-900 font-mono">{formatRupiah(estimation.disposable)}</span>
          </div>
          <div class="flex justify-between pt-2 border-t border-amber-200/40 font-semibold text-slate-900">
            <span>Rekomendasi Plafon Maksimal:</span>
            <span class="text-emerald-700 font-mono">{formatRupiah(estimation.maxFunding)}</span>
          </div>
        </div>

        <p class="text-[11px] text-slate-500 italic leading-relaxed">
          {#if estimation.dsr <= 30}
            Profil keuangan Anda berada pada kategori ideal untuk pengajuan produk pembiayaan syariah.
          {:else}
            Rasio cicilan hutang Anda cukup tinggi. Disarankan melunasi beberapa kewajiban sebelum menambah pembiayaan baru.
          {/if}
        </p>
      </div>

      <div class="pt-6">
        <a
          href="/aggregator?maxAmount={estimation.maxFunding}"
          class="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm text-center flex items-center justify-center gap-2 shadow-xs transition-all"
        >
          <span>Cari Produk Sesuai Plafon Ini</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      </div>
    </div>

  </div>
</div>
