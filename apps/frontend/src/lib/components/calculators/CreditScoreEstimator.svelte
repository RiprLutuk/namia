<script lang="ts">


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
<div class="calculator-grid"><div class="calculator-inputs"><h2>Kenali ruang keuangan Anda.</h2>
  <div><div class="control-header"><label for="monthly-income-slider">Penghasilan bersih per bulan</label><output for="monthly-income-slider">{formatRupiah(monthlyIncome)}</output></div><input id="monthly-income-slider" type="range" min="3000000" max="50000000" step="500000" bind:value={monthlyIncome} /><div class="range-labels"><span>Rp 3 juta</span><span>Rp 50 juta</span></div></div>
  <div><div class="control-header"><label for="monthly-expense-slider">Pengeluaran rutin per bulan</label><output for="monthly-expense-slider">{formatRupiah(monthlyExpenses)}</output></div><input id="monthly-expense-slider" type="range" min="1000000" max="30000000" step="500000" bind:value={monthlyExpenses} /><div class="range-labels"><span>Rp 1 juta</span><span>Rp 30 juta</span></div></div>
  <div><div class="control-header"><label for="existing-loan-slider">Cicilan yang sedang berjalan</label><output for="existing-loan-slider">{formatRupiah(existingLoan)}</output></div><input id="existing-loan-slider" type="range" min="0" max="20000000" step="250000" bind:value={existingLoan} /><div class="range-labels"><span>Tanpa cicilan</span><span>Rp 20 juta</span></div></div>
  <div class="small-grid"><div><label for="employment-type">Status pekerjaan</label><select id="employment-type" bind:value={employmentType}><option value="permanent_employee">Karyawan tetap</option><option value="entrepreneur">Wirausaha / UMKM</option><option value="contract_employee">Karyawan kontrak</option></select></div><div><label for="employment-duration">Lama bekerja / berusaha</label><select id="employment-duration" bind:value={employmentDuration}><option value={0}>Kurang dari 1 tahun</option><option value={1}>1–2 tahun</option><option value={3}>3 tahun atau lebih</option></select></div></div>
  <div><label for="credit-history">Riwayat pembayaran</label><select id="credit-history" bind:value={creditHistory}><option value="excellent">Selalu tepat waktu</option><option value="good">Lancar</option><option value="no_history">Belum pernah memiliki pinjaman</option><option value="fair">Pernah terlambat kurang dari 30 hari</option></select></div>
</div><div class="calculator-result"><p class="result-label">Indikator estimasi mandiri</p><div class="result-number">{estimation.score}<span style="font-size:16px;letter-spacing:0"> / 850</span></div><p class="result-unit">{estimation.tier}</p><div class="score-meter"><span style="width:{estimation.scorePercent}%"></span></div><dl class="result-lines"><div><dt>Cicilan ÷ penghasilan</dt><dd>{estimation.dsr}%</dd></div><div><dt>Sisa dana bulanan</dt><dd>{formatRupiah(estimation.disposable)}</dd></div><div><dt>Perkiraan plafon model</dt><dd>{formatRupiah(estimation.maxFunding)}</dd></div></dl><p class="result-note">Indikator ini berasal dari model simulasi sederhana, bukan skor SLIK atau keputusan persetujuan. Pengeluaran dan kewajiban Anda tetap perlu diperhitungkan sebelum mengajukan pembiayaan.</p><div class="result-actions"><button class="portal-button-secondary" type="button" onclick={printEstimation}>Cetak</button><a class="portal-button" href="/calculators?tab=loan&amount={Math.max(2000000, estimation.maxFunding)}">Hitung cicilan →</a></div></div></div>
