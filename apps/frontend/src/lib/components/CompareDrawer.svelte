<script lang="ts">
  import { Scale, X, ArrowRight } from "lucide-svelte";
  import type { Product } from "./ProductCard.svelte";

  let { 
    comparedProducts = [], 
    onRemoveProduct, 
    onClearAll 
  }: { 
    comparedProducts: Product[];
    onRemoveProduct: (id: string) => void;
    onClearAll: () => void;
  } = $props();

  let isModalOpen = $state(false);

  function formatRupiah(num: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(num);
  }
</script>

{#if comparedProducts.length > 0}
  <!-- Floating Bottom Dock -->
  <div class="fixed bottom-6 inset-x-0 z-40 px-4 sm:px-6 pointer-events-none">
    <div class="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 shadow-2xl rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
      <div class="flex items-center gap-3 overflow-x-auto w-full sm:w-auto">
        <div class="flex items-center gap-2 text-xs font-semibold text-emerald-400 shrink-0">
          <Scale class="w-4 h-4" />
          <span>Bandingkan ({comparedProducts.length}/3):</span>
        </div>

        <div class="flex items-center gap-2">
          {#each comparedProducts as p}
            <div class="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 shrink-0">
              <span class="max-w-[120px] truncate">{p.name}</span>
              <button 
                type="button" 
                onclick={() => onRemoveProduct(p.id)}
                class="text-slate-400 hover:text-white"
              >
                <X class="w-3 h-3" />
              </button>
            </div>
          {/each}
        </div>
      </div>

      <div class="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
        <button
          type="button"
          onclick={onClearAll}
          class="text-xs text-slate-400 hover:text-white underline"
        >
          Reset
        </button>

        <button
          type="button"
          disabled={comparedProducts.length < 2}
          onclick={() => isModalOpen = true}
          class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold text-xs flex items-center gap-2 transition-all shadow-md"
        >
          <span>Bandingkan Sekarang</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Side-by-Side Comparison Modal -->
{#if isModalOpen}
  <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
      
      <!-- Modal Header -->
      <div class="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
        <div class="flex items-center gap-2">
          <Scale class="w-5 h-5 text-emerald-600" />
          <h2 class="text-lg font-bold text-slate-900">Perbandingan Produk Finansial Syariah</h2>
        </div>
        <button 
          type="button"
          onclick={() => isModalOpen = false} 
          class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Comparison Table -->
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr class="border-b border-slate-200">
                <th class="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 w-1/4">Fitur / Kriteria</th>
                {#each comparedProducts as p}
                  <th class="p-3 text-sm font-bold text-slate-900 w-1/3">
                    <span class="text-xs text-slate-500 block font-normal">{p.institution}</span>
                    {p.name}
                  </th>
                {/each}
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs">
              <tr>
                <td class="p-3 font-semibold text-slate-600 bg-slate-50">Akad Syariah</td>
                {#each comparedProducts as p}
                  <td class="p-3 font-medium text-emerald-700">Akad {p.islamicContract}</td>
                {/each}
              </tr>
              <tr>
                <td class="p-3 font-semibold text-slate-600 bg-slate-50">Plafon Pembiayaan</td>
                {#each comparedProducts as p}
                  <td class="p-3 font-mono font-medium text-slate-900">
                    {formatRupiah(p.minAmount)} s/d {formatRupiah(p.maxAmount)}
                  </td>
                {/each}
              </tr>
              <tr>
                <td class="p-3 font-semibold text-slate-600 bg-slate-50">Margin / Bagi Hasil</td>
                {#each comparedProducts as p}
                  <td class="p-3 font-mono font-bold text-emerald-600">{p.interestRateOrMargin}</td>
                {/each}
              </tr>
              <tr>
                <td class="p-3 font-semibold text-slate-600 bg-slate-50">Jangka Waktu Tenor</td>
                {#each comparedProducts as p}
                  <td class="p-3 text-slate-800">{p.tenorMinMonths} - {p.tenorMaxMonths} Bulan</td>
                {/each}
              </tr>
              <tr>
                <td class="p-3 font-semibold text-slate-600 bg-slate-50">Kecepatan Approval</td>
                {#each comparedProducts as p}
                  <td class="p-3 text-slate-800">{p.approvalSpeed}</td>
                {/each}
              </tr>
              <tr>
                <td class="p-3 font-semibold text-slate-600 bg-slate-50">Kepatuhan Regulasi</td>
                {#each comparedProducts as p}
                  <td class="p-3 text-slate-800">
                    <span class="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {p.ojkRegulated ? 'Berizin OJK' : 'Koperasi Kemenkop'} & DPS
                    </span>
                  </td>
                {/each}
              </tr>
              <tr>
                <td class="p-3 font-semibold text-slate-600 bg-slate-50">Keunggulan Utama</td>
                {#each comparedProducts as p}
                  <td class="p-3 text-slate-700">
                    <ul class="list-disc list-inside space-y-1">
                      {#each p.features as f}
                        <li>{f}</li>
                      {/each}
                    </ul>
                  </td>
                {/each}
              </tr>
              <tr>
                <td class="p-3 font-semibold text-slate-600 bg-slate-50">Aksi Pengajuan</td>
                {#each comparedProducts as p}
                  <td class="p-3">
                    <a
                      href="/onboarding?productId={p.id}&name={encodeURIComponent(p.name)}"
                      class="inline-block w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-center font-semibold text-xs transition-colors"
                    >
                      Ajukan Produk Ini
                    </a>
                  </td>
                {/each}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
{/if}
