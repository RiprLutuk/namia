<script lang="ts">
  import { page } from "$app/state";

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

  $effect(() => {
    const initialAmount = Number(page.url.searchParams.get("amount"));
    const initialTenor = Number(page.url.searchParams.get("tenor"));
    if (Number.isFinite(initialAmount) && initialAmount > 0) amount = Math.min(2000000000, Math.max(2000000, initialAmount));
    if (Number.isFinite(initialTenor) && initialTenor > 0) tenorMonths = Math.min(60, Math.max(3, Math.round(initialTenor)));
    const initialContract = page.url.searchParams.get("contract");
    if (initialContract && ["Murabahah", "Ijarah", "Musyarakah"].includes(initialContract)) contractType = initialContract;
  });
</script>
<div class="calculator-grid">
  <div class="calculator-inputs"><h2>Rencanakan cicilan Anda.</h2>
    <fieldset><legend>Pilihan akad</legend><div class="option-group">{#each ["Murabahah","Ijarah","Musyarakah"] as type}<button type="button" class:selected={contractType === type} aria-pressed={contractType === type} onclick={() => contractType = type}>{type}</button>{/each}</div></fieldset>
    <div><div class="control-header"><label for="loan-amount-slider">Jumlah pembiayaan</label><output for="loan-amount-slider">{formatRupiah(amount)}</output></div><input id="loan-amount-slider" type="range" min="2000000" max="2000000000" step="1000000" bind:value={amount} /><div class="range-labels"><span>Rp 2 juta</span><span>Rp 2 miliar</span></div></div>
    <div><div class="control-header"><label for="tenor-months-slider">Jangka waktu</label><output for="tenor-months-slider">{tenorMonths} bulan</output></div><input id="tenor-months-slider" type="range" min="3" max="60" step="1" bind:value={tenorMonths} /><div class="range-labels"><span>3 bulan</span><span>60 bulan</span></div></div>
    <div><div class="control-header"><label for="margin-rate-slider">Asumsi margin / ujrah tahunan</label><output for="margin-rate-slider">{marginPercent}%</output></div><input id="margin-rate-slider" type="range" min="0" max="20" step="0.5" bind:value={marginPercent} /><div class="range-labels"><span>0%</span><span>20%</span></div></div>
  </div>
  <div class="calculator-result"><p class="result-label">Perkiraan cicilan</p><div class="result-number">{formatRupiah(monthlyInstallment)}</div><p class="result-unit">per bulan selama {tenorMonths} bulan</p><dl class="result-lines"><div><dt>Pokok pembiayaan</dt><dd>{formatRupiah(amount)}</dd></div><div><dt>Total margin / ujrah</dt><dd>{formatRupiah(totalMargin)}</dd></div><div><dt>Total pembayaran</dt><dd>{formatRupiah(totalPayable)}</dd></div></dl><p class="result-note">Perhitungan memakai asumsi margin sederhana atas pokok dan jangka waktu. Biaya lain belum termasuk. Skema akad dan pembayaran aktual perlu disepakati dengan penyedia.</p><div class="result-actions"><button type="button" class="portal-button-secondary" onclick={printSimulation}>Cetak</button><a class="portal-button" href="/onboarding?amount={amount}&tenor={tenorMonths}&contract={contractType}">Lanjutkan pengajuan →</a></div></div>
</div>
