<script lang="ts">
  import { Scale, X } from "lucide-svelte";
  import type { Product } from "./ProductCard.svelte";

  let { comparedProducts = [], onRemoveProduct, onClearAll }: {
    comparedProducts: Product[];
    onRemoveProduct: (id: string) => void;
    onClearAll: () => void;
  } = $props();
  let comparisonDialog: HTMLDialogElement;
  const money = (value: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
</script>

{#if comparedProducts.length > 0}
  <aside class="compare-dock" aria-label="Produk untuk dibandingkan">
    <div class="dock-title"><Scale size={17} /><strong>Bandingkan {comparedProducts.length}/3</strong></div>
    <div class="selected-products">
      {#each comparedProducts as product}
        <span class="selected-product">{product.name}<button type="button" onclick={() => onRemoveProduct(product.id)} aria-label="Hapus {product.name} dari perbandingan"><X size={14} /></button></span>
      {/each}
    </div>
    <div class="dock-actions"><button class="clear" type="button" onclick={onClearAll}>Kosongkan</button><button class="portal-button" type="button" disabled={comparedProducts.length < 2} onclick={() => comparisonDialog.showModal()}>Lihat perbandingan</button></div>
  </aside>
{/if}

<dialog bind:this={comparisonDialog} class="comparison-dialog">
  <header><div><p>Keputusan yang lebih jelas</p><h2>Bandingkan pilihan Anda</h2></div><button type="button" onclick={() => comparisonDialog.close()} aria-label="Tutup perbandingan"><X size={21} /></button></header>
  <div class="comparison-scroll">
    <table>
      <thead><tr><th scope="col">Yang perlu Anda tahu</th>{#each comparedProducts as product}<th scope="col"><span>{product.institution}</span>{product.name}</th>{/each}</tr></thead>
      <tbody>
        <tr><th scope="row">Akad</th>{#each comparedProducts as product}<td>{product.islamicContract}</td>{/each}</tr>
        <tr><th scope="row">Rentang dana</th>{#each comparedProducts as product}<td><strong>{money(product.minAmount)} – {money(product.maxAmount)}</strong></td>{/each}</tr>
        <tr><th scope="row">Margin / bagi hasil</th>{#each comparedProducts as product}<td>{product.interestRateOrMargin}</td>{/each}</tr>
        <tr><th scope="row">Jangka waktu</th>{#each comparedProducts as product}<td>{product.tenorMinMonths}–{product.tenorMaxMonths} bulan</td>{/each}</tr>
        <tr><th scope="row">Fitur produk</th>{#each comparedProducts as product}<td><ul>{#each product.features as feature}<li>{feature}</li>{/each}</ul></td>{/each}</tr>
        <tr><th scope="row">Langkah berikutnya</th>{#each comparedProducts as product}<td><a class="portal-button" href={product.applyUrl}>{product.targetAudience === "investor" ? "Mulai mendanai" : "Lanjutkan pengajuan"}</a></td>{/each}</tr>
      </tbody>
    </table>
  </div>
  <footer>Ketentuan akhir mengikuti produk dan penyedia yang Anda pilih.</footer>
</dialog>

<style>
  .compare-dock{position:fixed;z-index:45;bottom:20px;left:50%;transform:translateX(-50%);width:calc(100% - 32px);max-width:1100px;border:1px solid #aebfac;border-radius:6px;box-shadow:0 5px 25px #233b3529;display:flex;align-items:center;gap:15px;padding:15px 18px;background:#fff;color:#233b35}
  .dock-title{display:flex;align-items:center;gap:8px;white-space:nowrap;font-size:12px;color:#165b45}.selected-products{display:flex;flex:1;gap:7px;overflow:auto;min-width:0}.selected-product{display:flex;align-items:center;gap:6px;border:1px solid #d6dfcf;background:#f3f6ee;border-radius:3px;padding:6px 8px;font-size:11px;white-space:nowrap}.selected-product button,header button{border:0;background:transparent;color:#65736e;cursor:pointer;padding:3px}.dock-actions{display:flex;align-items:center;gap:12px;flex-shrink:0}.dock-actions .portal-button{font-size:12px}.clear{background:transparent;border:0;text-decoration:underline;font-size:11px;color:#65736e;cursor:pointer}.portal-button:disabled{opacity:.5;cursor:not-allowed}
  .comparison-dialog{width:min(1080px,calc(100% - 32px));max-height:85vh;margin:auto;padding:0;border:1px solid #aebfac;border-radius:7px;box-shadow:0 12px 70px #102f3544;color:#233b35;background:#fff}.comparison-dialog::backdrop{background:#18352a88}.comparison-dialog header{display:flex;justify-content:space-between;align-items:center;padding:24px;border-bottom:1px solid #d9e1d5;background:#f3f6ee}.comparison-dialog header p{margin:0 0 5px;font-size:11px;color:#65736e}.comparison-dialog h2{font:25px Georgia,serif;margin:0}.comparison-scroll{overflow:auto}table{border-collapse:collapse;width:100%;font-size:13px;text-align:left}th,td{padding:17px 20px;border-right:1px solid #e1e7de;border-bottom:1px solid #e1e7de;min-width:210px;vertical-align:top}thead th{background:#fafbf8;font-size:16px}thead span{display:block;font-size:11px;color:#65736e;font-weight:400;margin-bottom:6px}tbody th{font-size:12px;font-weight:400;background:#fafbf8;min-width:160px}td strong{color:#165b45}td ul{margin:0;padding-left:15px;line-height:1.7}td .portal-button{font-size:12px}footer{font-size:12px;color:#65736e;padding:20px}button:focus-visible,a:focus-visible{outline:3px solid #a1bb73;outline-offset:3px}
  @media(max-width:850px){.compare-dock{flex-wrap:wrap;gap:10px;padding:12px}.selected-products{flex-basis:60%}.dock-actions{margin-left:auto}.comparison-dialog header{padding:18px}.comparison-dialog h2{font-size:21px}}
  @media print{.compare-dock{display:none}}
</style>
