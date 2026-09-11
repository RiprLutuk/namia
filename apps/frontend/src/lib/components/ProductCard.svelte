<script lang="ts">
  import {
    ShieldCheck,
    Star,
    Clock,
    Check,
    ChevronRight,
    Scale,
  } from "lucide-svelte";

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
  }

  let {
    product,
    isCompared = false,
    onToggleCompare,
  }: {
    product: Product;
    isCompared?: boolean;
    onToggleCompare?: (product: Product) => void;
  } = $props();

  function formatRupiah(num: number): string {
    if (num >= 1000000000) {
      return `Rp ${(num / 1000000000).toLocaleString("id-ID")} M`;
    }
    return `Rp ${(num / 1000000).toLocaleString("id-ID")} Jt`;
  }
</script>

<div
  class="bg-white rounded-[3px] border border-slate-300 shadow-xs hover:border-emerald-600 transition-colors p-6 flex flex-col justify-between group font-sans"
>
  <div>
    <!-- Top Tags & Compare Checkbox -->
    <div class="flex items-start justify-between gap-3 mb-4">
      <div class="flex flex-wrap gap-1.5 items-center">
        <span
          class="px-2 py-0.5 rounded-[2px] text-[10px] font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 border border-emerald-300"
        >
          Akad {product.islamicContract}
        </span>
        {#if product.ojkRegulated}
          <span
            class="px-2 py-0.5 rounded-[2px] text-[10px] font-semibold uppercase bg-slate-100 text-slate-700 flex items-center gap-1 border border-slate-300"
          >
            <ShieldCheck class="w-3 h-3 text-emerald-700" />
            <span>OJK</span>
          </span>
        {/if}
      </div>

      {#if onToggleCompare}
        <button
          type="button"
          onclick={() => onToggleCompare?.(product)}
          class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-[2px] border transition-colors cursor-pointer {isCompared
            ? 'button-4-primary'
            : 'button-4'}"
          title="Bandingkan produk ini"
        >
          <Scale class="w-3.5 h-3.5" />
          <span>{isCompared ? "Terpilih" : "Bandingkan"}</span>
        </button>
      {/if}
    </div>

    <!-- Product Title & Provider -->
    <div class="mb-4">
      <span
        class="text-xs text-slate-500 font-medium block uppercase tracking-wider"
        >{product.institution}</span
      >
      <h3
        class="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug"
      >
        {product.name}
      </h3>
    </div>

    <!-- Key Metrics Grid -->
    <div
      class="grid grid-cols-2 gap-3 py-3 px-3.5 bg-slate-50 rounded-[2px] border border-slate-300 text-xs mb-4"
    >
      <div>
        <span class="text-slate-500 block text-[10px] uppercase font-semibold"
          >Plafon Pembiayaan</span
        >
        <span class="font-bold text-slate-900 font-mono text-xs">
          {formatRupiah(product.minAmount)} - {formatRupiah(product.maxAmount)}
        </span>
      </div>
      <div>
        <span class="text-slate-500 block text-[10px] uppercase font-semibold"
          >Margin / Bagi Hasil</span
        >
        <span class="font-bold text-emerald-800 font-mono text-xs">
          {product.interestRateOrMargin}
        </span>
      </div>
      <div>
        <span class="text-slate-500 block text-[10px] uppercase font-semibold"
          >Tenor</span
        >
        <span class="font-medium text-slate-800 font-mono">
          {product.tenorMinMonths} - {product.tenorMaxMonths} Bln
        </span>
      </div>
      <div>
        <span class="text-slate-500 block text-[10px] uppercase font-semibold"
          >Kecepatan Proses</span
        >
        <span class="font-medium text-slate-800 flex items-center gap-1">
          <Clock class="w-3 h-3 text-slate-500" />
          <span>{product.approvalSpeed}</span>
        </span>
      </div>
    </div>

    <!-- Feature Checklist -->
    <ul class="space-y-1.5 mb-6 text-xs text-slate-600">
      {#each product.features.slice(0, 3) as feat}
        <li class="flex items-start gap-2">
          <Check class="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
          <span class="line-clamp-1">{feat}</span>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Action & Rating Row -->
  <div
    class="pt-4 border-t border-slate-200 flex items-center justify-between gap-3"
  >
    <div class="flex items-center gap-1.5">
      <Star class="w-4 h-4 text-amber-500 fill-amber-400" />
      <span class="text-xs font-bold text-slate-900">{product.rating}</span>
      <span class="text-[11px] text-slate-500">({product.reviewCount})</span>
    </div>

    <a
      href="/onboarding?productId={product.id}&name={encodeURIComponent(
        product.name,
      )}"
      class="button-4-primary text-xs py-1.5 px-3.5 inline-flex items-center rounded-[3px] font-bold uppercase tracking-wider"
    >
      <span>Ajukan</span>
      <ChevronRight class="w-3.5 h-3.5 inline ml-1" />
    </a>
  </div>
</div>
