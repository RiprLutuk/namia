<script lang="ts">
  import { page } from "$app/state";

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

  $effect(() => {
    const amount = Number(page.url.searchParams.get("amount"));
    const tenor = Number(page.url.searchParams.get("tenor"));
    if (page.url.searchParams.get("tab") === "invest" && Number.isFinite(amount) && amount > 0) initialDeposit = Math.min(500000000, Math.max(1000000, amount));
    if (page.url.searchParams.get("tab") === "invest" && Number.isFinite(tenor) && tenor > 0) durationYears = Math.min(5, Math.max(1, Math.round(tenor / 12)));
  });
</script>
<div class="calculator-grid"><div class="calculator-inputs"><h2>Gambarkan rencana pendanaan.</h2>
  <div><div class="control-header"><label for="initial-deposit-slider">Dana awal</label><output for="initial-deposit-slider">{formatRupiah(initialDeposit)}</output></div><input id="initial-deposit-slider" type="range" min="1000000" max="500000000" step="1000000" bind:value={initialDeposit} /><div class="range-labels"><span>Rp 1 juta</span><span>Rp 500 juta</span></div></div>
  <div><div class="control-header"><label for="monthly-deposit-slider">Tambahan setiap bulan</label><output for="monthly-deposit-slider">{formatRupiah(monthlyDeposit)}</output></div><input id="monthly-deposit-slider" type="range" min="0" max="10000000" step="250000" bind:value={monthlyDeposit} /><div class="range-labels"><span>Tanpa tambahan</span><span>Rp 10 juta</span></div></div>
  <div><div class="control-header"><label for="duration-years-slider">Jangka waktu</label><output for="duration-years-slider">{durationYears} tahun</output></div><input id="duration-years-slider" type="range" min="1" max="5" step="1" bind:value={durationYears} /><div class="range-labels"><span>1 tahun</span><span>5 tahun</span></div></div>
  <fieldset><legend>Porsi bagi hasil Anda : pengelola</legend><div class="option-group">{#each [60,70,80] as ratio}<button type="button" class:selected={nisbahInvestor === ratio} aria-pressed={nisbahInvestor === ratio} onclick={() => nisbahInvestor = ratio}>{ratio} : {100 - ratio}</button>{/each}</div></fieldset>
  <div><div class="control-header"><label for="expected-yield-slider">Asumsi hasil bruto per tahun</label><output for="expected-yield-slider">{expectedAnnualYield}%</output></div><input id="expected-yield-slider" type="range" min="0" max="22" step="0.5" bind:value={expectedAnnualYield} /><div class="range-labels"><span>0%</span><span>22%</span></div></div>
</div><div class="calculator-result"><p class="result-label">Proyeksi nilai akhir</p><div class="result-number">{formatRupiah(calculationResult.finalValue)}</div><p class="result-unit">setelah {durationYears} tahun</p><dl class="result-lines"><div><dt>Total dana Anda</dt><dd>{formatRupiah(calculationResult.totalInvested)}</dd></div><div><dt>Proyeksi bagi hasil</dt><dd>{formatRupiah(calculationResult.profit)}</dd></div><div><dt>Asumsi hasil setelah nisbah</dt><dd>{effectiveYield}% / tahun</dd></div></dl><p class="result-note">Simulasi mengasumsikan tambahan dana pada awal bulan dan hasil diinvestasikan kembali. Belum termasuk biaya dan pajak. Hasil pendanaan dapat berubah dan modal memiliki risiko kerugian.</p><div class="result-actions"><button class="portal-button-secondary" type="button" onclick={printSimulation}>Cetak</button><a class="portal-button" href="/auth/cms/lender">Buka portal pendana →</a></div></div></div>
