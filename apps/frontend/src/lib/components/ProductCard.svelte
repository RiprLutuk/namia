<script lang="ts">
  import {
    ShieldCheck,
    Star,
    Clock,
    Check,
    ChevronRight,
    Scale,
    Building2,
    Sparkles
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
    isFeatured?: boolean;
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

<div class="panel ribbon-wrapper flex flex-col justify-between hover:border-emerald-600 transition-colors shadow-sm group font-sans">
  {#if product.isFeatured}
    <div class="ribbon-tag">Unggulan</div>
  {/if}

  <div class="p-5">
    <!-- Top Tags & Compare Button -->
    <div class="flex items-start justify-between gap-3 mb-3">
      <div class="flex flex-wrap gap-1.5 items-center">
        <span class="label label-success">
          Akad {product.islamicContract}
        </span>
        {#if product.ojkRegulated}
          <span class="label label-inverse flex items-center gap-1">
            <ShieldCheck class="w-3 h-3 text-emerald-400" />
            <span>OJK</span>
          </span>
        {/if}
      </div>

      {#if onToggleCompare}
        <button
          type="button"
          onclick={() => onToggleCompare?.(product)}
          class="btn btn-mini {isCompared ? 'btn-success' : 'btn-default'}"
          title="Bandingkan produk ini berdampingan"
        >
          <Scale class="w-3 h-3" />
          <span>{isCompared ? "Terpilih" : "Bandingkan"}</span>
        </button>
      {/if}
    </div>

    <!-- Product Title & Provider -->
    <div class="mb-3.5">
      <span class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
        {product.institution}
      </span>
      <h3 class="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
        {product.name}
      </h3>
    </div>

    <!-- Key Metrics Grid in Early Bootstrap Well -->
    <div class="well well-small !p-3 !mb-4 grid grid-cols-2 gap-2 text-xs bg-slate-50/80">
      <div>
        <span class="text-slate-500 block text-[10px] uppercase font-bold">Plafon Pembiayaan</span>
        <strong class="text-slate-900 font-mono text-xs">
          {formatRupiah(product.minAmount)} - {formatRupiah(product.maxAmount)}
        </strong>
      </div>
      <div>
        <span class="text-slate-500 block text-[10px] uppercase font-bold">Margin / Bagi Hasil</span>
        <strong class="text-emerald-700 font-mono text-xs">
          {product.interestRateOrMargin}
        </strong>
      </div>
      <div>
        <span class="text-slate-500 block text-[10px] uppercase font-bold">Tenor Waktu</span>
        <span class="font-semibold text-slate-800 font-mono text-xs">
          {product.tenorMinMonths} - {product.tenorMaxMonths} Bulan
        </span>
      </div>
      <div>
        <span class="text-slate-500 block text-[10px] uppercase font-bold">Kecepatan Verifikasi</span>
        <span class="font-semibold text-slate-800 flex items-center gap-1 text-xs">
          <Clock class="w-3 h-3 text-slate-400" />
          <span>{product.approvalSpeed}</span>
        </span>
      </div>
    </div>

    <!-- Feature Checklist -->
    <ul class="space-y-1.5 mb-4 text-xs text-slate-600">
      {#each product.features.slice(0, 3) as feat}
        <li class="flex items-start gap-1.5">
          <Check class="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
          <span class="line-clamp-1">{feat}</span>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Action & Rating Row (Panel Footer) -->
  <div class="panel-footer flex items-center justify-between gap-3 bg-[#f8fafc]">
    <div class="flex items-center gap-1.5">
      <Star class="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
      <span class="text-xs font-bold text-slate-900">{product.rating}</span>
      <span class="text-[11px] text-slate-500">({product.reviewCount})</span>
    </div>

    <a
      href="/onboarding?productId={product.id}&name={encodeURIComponent(product.name)}"
      class="btn btn-small btn-success flex items-center gap-1"
    >
      <span>Ajukan</span>
      <ChevronRight class="w-3.5 h-3.5" />
    </a>
  </div>
</div>
