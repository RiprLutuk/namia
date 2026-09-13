<script lang="ts">
  import { Check, ChevronRight, Scale } from "lucide-svelte";

  export interface Product {
    id: string;
    name: string;
    institution: string;
    categorySlug: string;
    islamicContract: string;
    minAmount: number;
    maxAmount: number;
    interestRateOrMargin: string;
    tenorMinMonths: number;
    tenorMaxMonths: number;
    approvalSpeed: string;
    rating: number;
    reviewCount: number;
    features: string[];
    ojkRegulated: boolean;
    dpsSupervised: boolean;
    applyUrl: string;
    isFeatured?: boolean;
    description?: string;
    targetAudience?: "borrower" | "investor" | "both";
  }

  let { product, isCompared = false, onToggleCompare }: {
    product: Product;
    isCompared?: boolean;
    onToggleCompare?: (product: Product) => void;
  } = $props();

  const money = (value: number) => new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", notation: "compact", maximumFractionDigits: 1,
  }).format(value);
</script>

<article class="product-card">
  <div class="product-top">
    <span class="contract">{product.islamicContract}</span>
    {#if onToggleCompare}
      <button class:chosen={isCompared} class="compare-button" type="button" aria-pressed={isCompared} aria-label="Bandingkan {product.name}" onclick={() => onToggleCompare?.(product)}>
        {#if isCompared}<Check size={14} />{:else}<Scale size={14} />{/if}
        {isCompared ? "Terpilih" : "Bandingkan"}
      </button>
    {/if}
  </div>
  <div class="product-name">
    <p>{product.institution}</p>
    <h2>{product.name}</h2>
  </div>
  <dl class="product-values">
    <div class="amount"><dt>Rentang dana</dt><dd>{money(product.minAmount)} – {money(product.maxAmount)}</dd></div>
    <div><dt>Margin / bagi hasil</dt><dd>{product.interestRateOrMargin}</dd></div>
    <div><dt>Jangka waktu</dt><dd>{product.tenorMinMonths}–{product.tenorMaxMonths} bulan</dd></div>
  </dl>
  <ul class="product-features">
    {#each product.features.slice(0, 2) as feature}
      <li><Check size={14} /><span>{feature}</span></li>
    {/each}
  </ul>
  <details class="product-details">
    <summary>Rincian produk</summary>
    {#if product.description}<p>{product.description}</p>{/if}
    <ul>{#each product.features as feature}<li>{feature}</li>{/each}</ul>
    <p>Periksa syarat, biaya, dan ketersediaan produk pada penyedia sebelum melanjutkan.</p>
  </details>
  <div class="product-footer">
    <span>{product.targetAudience === "investor" ? "Untuk pendana" : "Pilihan pembiayaan"}</span>
    <a class="portal-button" href={product.applyUrl}>
      {product.targetAudience === "investor" ? "Mulai mendanai" : "Lanjutkan"}<ChevronRight size={15} />
    </a>
  </div>
</article>

<style>
  .product-card{display:flex;flex-direction:column;background:#fff;border:1px solid #cdd8ce;border-radius:6px;overflow:hidden;box-shadow:0 2px 0 #e4eae1;color:#233b35;min-width:0}
  .product-top{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:17px 19px 0}
  .contract{font-size:11px;color:#165b45;background:#edf3e4;border:1px solid #d6e0ca;padding:3px 7px;border-radius:3px}
  .compare-button{display:flex;align-items:center;gap:5px;font-size:11px;border:1px solid #cdd8ce;border-radius:4px;padding:5px 7px;background:linear-gradient(#fff,#f0f3ed);color:#65736e;cursor:pointer}
  .compare-button.chosen{background:#dfecb9;border-color:#98b583;color:#165b45}
  .product-name{padding:18px 19px 15px}.product-name p{font-size:11px;color:#65736e;margin:0 0 5px}.product-name h2{font-family:Tahoma,Arial,sans-serif;font-size:18px;line-height:1.35;font-weight:700;margin:0;color:#233b35}
  .product-values{display:grid;grid-template-columns:1fr 1fr;gap:16px 12px;margin:0 19px;padding:16px 0;border-top:1px solid #e0e7dc;border-bottom:1px solid #e0e7dc}.product-values .amount{grid-column:1/-1}.product-values dt{font-size:11px;color:#65736e;margin-bottom:5px}.product-values dd{font-size:12px;font-weight:700;margin:0}.product-values .amount dd{font-size:20px;font-weight:600;letter-spacing:-.5px;color:#165b45}
  .product-features{list-style:none;margin:0;padding:17px 19px 12px;display:grid;gap:9px}.product-features li{display:flex;align-items:flex-start;gap:7px;font-size:12px;line-height:1.5}.product-features :global(svg){color:#165b45;flex-shrink:0;margin-top:2px}
  .product-details{font-size:12px;margin:0 19px 18px;line-height:1.65}.product-details summary{cursor:pointer;text-decoration:underline;text-underline-offset:3px;color:#165b45}.product-details p{margin:10px 0 0;color:#65736e}.product-details ul{padding-left:16px;margin-top:10px}
  .product-footer{margin-top:auto;padding:13px 19px;background:#f8faf5;border-top:1px solid #e0e7dc;display:flex;align-items:center;justify-content:space-between;gap:10px}.product-footer>span{font-size:11px;color:#65736e}.product-footer a{font-size:12px;display:inline-flex;align-items:center;gap:5px;padding:8px 11px}
  button:focus-visible,summary:focus-visible,a:focus-visible{outline:3px solid #a1bb73;outline-offset:3px}
</style>
