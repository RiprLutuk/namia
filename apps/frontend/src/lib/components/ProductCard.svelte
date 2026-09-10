<script lang="ts">
  import { ShieldCheck, Star, Clock, Check, ChevronRight, Scale } from "lucide-svelte";

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

  let { product, isCompared = false, onToggleCompare }: { 
    product: Product; 
    isCompared?: boolean; 
    onToggleCompare?: (product: Product) => void 
  } = $props();

  function formatRupiah(num: number): string {
    if (num >= 1000000000) {
      return `Rp ${(num / 1000000000).toLocaleString("id-ID")} M`;
    }
    return `Rp ${(num / 1000000).toLocaleString("id-ID")} Jt`;
  }
</script>

<div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between group hover:border-emerald-500/40">
  <div>
    <!-- Top Tags & Compare Checkbox -->
    <div class="flex items-start justify-between gap-3 mb-4">
      <div class="flex flex-wrap gap-1.5 items-center">
        <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          Akad {product.islamicContract}
        </span>
        {#if product.ojkRegulated}
          <span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 flex items-center gap-1 border border-slate-200">
            <ShieldCheck class="w-3 h-3 text-emerald-600" />
            <span>OJK</span>
          </span>
        {/if}
      </div>

      {#if onToggleCompare}
        <button
          type="button"
          onclick={() => onToggleCompare?.(product)}
          class="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors {isCompared ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'}"
          title="Bandingkan produk ini"
        >
          <Scale class="w-3.5 h-3.5" />
          <span>{isCompared ? 'Terpilih' : 'Bandingkan'}</span>
        </button>
      {/if}
    </div>

    <!-- Product Title & Provider -->
    <div class="mb-4">
      <span class="text-xs text-slate-500 font-medium block">{product.institution}</span>
      <h3 class="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
        {product.name}
      </h3>
    </div>

    <!-- Key Metrics Grid -->
    <div class="grid grid-cols-2 gap-3 py-3 px-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-4">
      <div>
        <span class="text-slate-400 block text-[10px] uppercase font-semibold">Plafon Pembiayaan</span>
        <span class="font-bold text-slate-900 font-mono text-xs">
          {formatRupiah(product.minAmount)} - {formatRupiah(product.maxAmount)}
        </span>
      </div>
      <div>
        <span class="text-slate-400 block text-[10px] uppercase font-semibold">Margin / Bagi Hasil</span>
        <span class="font-bold text-emerald-600 font-mono text-xs">
          {product.interestRateOrMargin}
        </span>
      </div>
      <div>
        <span class="text-slate-400 block text-[10px] uppercase font-semibold">Tenor</span>
        <span class="font-medium text-slate-800 font-mono">
          {product.tenorMinMonths} - {product.tenorMaxMonths} Bln
        </span>
      </div>
      <div>
        <span class="text-slate-400 block text-[10px] uppercase font-semibold">Kecepatan Proses</span>
        <span class="font-medium text-slate-800 flex items-center gap-1">
          <Clock class="w-3 h-3 text-slate-400" />
          <span>{product.approvalSpeed}</span>
        </span>
      </div>
    </div>

    <!-- Feature Checklist -->
    <ul class="space-y-1.5 mb-6 text-xs text-slate-600">
      {#each product.features.slice(0, 3) as feat}
        <li class="flex items-start gap-2">
          <Check class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span class="line-clamp-1">{feat}</span>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Action & Rating Row -->
  <div class="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
    <div class="flex items-center gap-1.5">
      <Star class="w-4 h-4 text-amber-400 fill-amber-400" />
      <span class="text-xs font-bold text-slate-800">{product.rating}</span>
      <span class="text-[11px] text-slate-400">({product.reviewCount})</span>
    </div>

    <a
      href="/onboarding?productId={product.id}&name={encodeURIComponent(product.name)}"
      class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all hover:gap-2"
    >
      <span>Ajukan</span>
      <ChevronRight class="w-3.5 h-3.5" />
    </a>
  </div>
</div>
