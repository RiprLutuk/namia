<script lang="ts">
  import { ShieldAlert, CheckCircle, Award, ArrowRight, Activity, Printer } from "lucide-svelte";

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
      maximumFractionDigits: 0,
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
    let badgeClass = "badge-warning";
    let maxFunding = Math.round(disposable * 0.3 * 18);

    if (score >= 750) {
      tier = "Sangat Prima";
      badgeClass = "badge-success";
      maxFunding = Math.round(disposable * 0.45 * 24);
    } else if (score >= 670) {
      tier = "Sehat & Layak";
      badgeClass = "badge-info";
      maxFunding = Math.round(disposable * 0.35 * 18);
    } else if (score < 580) {
      tier = "Perlu Pembenahan";
      badgeClass = "badge-important";
      maxFunding = Math.round(disposable * 0.15 * 6);
    }

    const scorePercent = Math.round(((score - 300) / (850 - 300)) * 100);

    return {
      score,
      scorePercent,
      tier,
      badgeClass,
      dsr: Number(dsr.toFixed(1)),
      disposable,
      maxFunding,
    };
  });

  function printEstimation() {
    window.print();
  }
</script>

<div class="panel panel-default shadow-xs border border-slate-300 rounded-[4px] overflow-hidden font-sans !mb-0">
  <!-- Early Bootstrap 2.0 Panel Header -->
  <div class="panel-heading panel-emerald flex items-center justify-between !py-2.5 !px-3 sm:!px-4">
    <div class="flex items-center gap-2 sm:gap-2.5 min-w-0">
      <Activity class="w-4 h-4 text-emerald-100 shrink-0" />
      <span class="text-xs sm:text-sm font-bold uppercase tracking-wider text-white truncate">
        Uji Rasio Keuangan & Debt Service Ratio (DSR)
      </span>
    </div>
    <span class="badge badge-inverse text-[10px] uppercase font-bold shrink-0 ml-2">
      Skor Kelayakan
    </span>
  </div>

  <!-- Panel Body -->
  <div class="panel-body p-3.5 sm:p-5 lg:p-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
      <!-- Input Controls (7 cols) -->
      <div class="lg:col-span-7 space-y-4">
        <!-- Penghasilan Bulanan Box (.well) -->
        <div class="well well-white !p-3 sm:!p-4 !mb-0 space-y-2 border border-slate-300 rounded-[3px] shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <label for="monthly-income-slider" class="text-xs font-bold uppercase tracking-wider text-slate-700">
              Penghasilan Bersih Bulanan:
            </label>
            <span class="font-mono font-bold text-xs sm:text-sm text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-[3px] shadow-inner">
              {formatRupiah(monthlyIncome)}
            </span>
          </div>

          <input
            id="monthly-income-slider"
            type="range"
            min="3000000"
            max="50000000"
            step="500000"
            bind:value={monthlyIncome}
            class="w-full accent-emerald-600 h-2 bg-slate-200 rounded cursor-pointer"
          />

          <div class="flex justify-between text-[10.5px] text-slate-500 font-mono">
            <span>Rp 3 Jt</span>
            <span>Rp 25 Jt</span>
            <span>Rp 50 Jt</span>
          </div>
        </div>

        <!-- Pengeluaran Bulanan Box (.well) -->
        <div class="well well-white !p-3 sm:!p-4 !mb-0 space-y-2 border border-slate-300 rounded-[3px] shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <label for="monthly-expense-slider" class="text-xs font-bold uppercase tracking-wider text-slate-700">
              Pengeluaran Rutin Rumah Tangga:
            </label>
            <span class="font-mono font-bold text-xs sm:text-sm text-slate-800 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-[3px]">
              {formatRupiah(monthlyExpenses)}
            </span>
          </div>

          <input
            id="monthly-expense-slider"
            type="range"
            min="1000000"
            max="30000000"
            step="500000"
            bind:value={monthlyExpenses}
            class="w-full accent-emerald-600 h-2 bg-slate-200 rounded cursor-pointer"
          />

          <div class="flex justify-between text-[10.5px] text-slate-500 font-mono">
            <span>Rp 1 Jt</span>
            <span>Rp 15 Jt</span>
            <span>Rp 30 Jt</span>
          </div>
        </div>

        <!-- Cicilan Berjalan Box (.well) -->
        <div class="well well-white !p-3 sm:!p-4 !mb-0 space-y-2 border border-slate-300 rounded-[3px] shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <label for="existing-loan-slider" class="text-xs font-bold uppercase tracking-wider text-slate-700">
              Cicilan Berjalan di Tempat Lain:
            </label>
            <span class="font-mono font-bold text-xs sm:text-sm text-slate-800 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-[3px]">
              {formatRupiah(existingLoan)}
            </span>
          </div>

          <input
            id="existing-loan-slider"
            type="range"
            min="0"
            max="20000000"
            step="250000"
            bind:value={existingLoan}
            class="w-full accent-emerald-600 h-2 bg-slate-200 rounded cursor-pointer"
          />

          <div class="flex justify-between text-[10.5px] text-slate-500 font-mono">
            <span>Rp 0 (Bebas Cicilan)</span>
            <span>Rp 10 Jt</span>
            <span>Rp 20 Jt</span>
          </div>
        </div>

        <!-- Profil Pekerjaan & Kolektibilitas Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div class="space-y-1.5">
            <label for="employment-type" class="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Status Pekerjaan:
            </label>
            <select
              id="employment-type"
              bind:value={employmentType}
              class="w-full text-xs font-semibold p-2 bg-white border border-slate-300 rounded-[3px] focus:outline-none focus:border-emerald-600 shadow-inner text-slate-800"
            >
              <option value="permanent_employee">Karyawan Tetap</option>
              <option value="entrepreneur">Wirausaha / UMKM</option>
              <option value="contract_employee">Karyawan Kontrak</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label for="credit-history" class="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Riwayat Kolektibilitas:
            </label>
            <select
              id="credit-history"
              bind:value={creditHistory}
              class="w-full text-xs font-semibold p-2 bg-white border border-slate-300 rounded-[3px] focus:outline-none focus:border-emerald-600 shadow-inner text-slate-800"
            >
              <option value="excellent">Kolektibilitas 1 (Lancar Sempurna)</option>
              <option value="good">Kolektibilitas 1 (Lancar)</option>
              <option value="no_history">Belum Pernah Ada Pinjaman</option>
              <option value="fair">Pernah Terlambat &lt; 30 Hari</option>
            </select>
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
                Hasil Analisis Kelayakan
              </span>
              <span class="badge {estimation.score >= 670 ? 'badge-success' : 'badge-warning'} text-[9.5px] uppercase font-bold tracking-wide">
                {estimation.tier}
              </span>
            </div>

            <!-- Big Number -->
            <div>
              <div class="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-mono text-emerald-900 tracking-tight leading-none">
                {estimation.score}
                <span class="text-xs sm:text-sm text-emerald-700 font-normal font-sans">/ 850</span>
              </div>
              <p class="text-[11px] text-emerald-800 mt-1.5 leading-snug">
                Skor estimasi mandiri berbasis rasio beban utang (DSR) dan kapasitas riil angsuran.
              </p>
            </div>

            <!-- Authentic Early Bootstrap Striped Progress Bar -->
            <div class="space-y-1">
              <div class="flex justify-between text-[11px] font-bold text-slate-700">
                <span>Indeks Kelayakan</span>
                <span class="text-emerald-800 font-bold">{estimation.scorePercent}%</span>
              </div>
              <div class="progress progress-striped active !h-4 !mb-0 rounded-[3px] border border-slate-300">
                <div class="bar" style="width: {estimation.scorePercent}%"></div>
              </div>
            </div>

            <!-- Authentic Early Bootstrap Table Breakdown -->
            <div class="overflow-hidden border border-slate-300 rounded-[3px] bg-white">
              <table class="table table-bordered table-striped !mb-0 text-xs">
                <tbody>
                  <tr>
                    <td class="font-bold text-slate-700 w-1/2 !py-1.5 !px-2.5">Rasio Utang (DSR):</td>
                    <td class="font-mono font-bold text-right !py-1.5 !px-2.5 {estimation.dsr > 35 ? 'text-amber-700' : 'text-emerald-700'}">
                      {estimation.dsr}% (Maks. 35%)
                    </td>
                  </tr>
                  <tr>
                    <td class="font-bold text-slate-700 !py-1.5 !px-2.5">Sisa Dana Bebas:</td>
                    <td class="font-mono font-bold text-right text-slate-900 !py-1.5 !px-2.5">{formatRupiah(estimation.disposable)}</td>
                  </tr>
                  <tr class="bg-emerald-50/80">
                    <td class="font-extrabold text-emerald-950 !py-2 !px-2.5">Rekomendasi Plafon:</td>
                    <td class="font-mono font-extrabold text-right text-emerald-900 text-sm !py-2 !px-2.5">{formatRupiah(estimation.maxFunding)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Action Buttons in Early Bootstrap Style -->
          <div class="pt-2 border-t border-emerald-200 flex flex-col sm:flex-row items-stretch gap-2">
            <button
              type="button"
              onclick={printEstimation}
              class="btn btn-default !py-2 !px-3 font-semibold text-xs flex items-center justify-center gap-1.5 shrink-0"
              title="Cetak Hasil Evaluasi"
            >
              <Printer class="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>

            <a
              href="/borrower"
              class="btn btn-success btn-large flex-1 !py-2.5 !px-3 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm text-center"
            >
              <span>Ajukan Berdasarkan Skor</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
