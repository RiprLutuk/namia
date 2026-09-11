<script lang="ts">
  import { Scale, X, ArrowRight } from "lucide-svelte";
  import type { Product } from "./ProductCard.svelte";

  let {
    comparedProducts = [],
    onRemoveProduct,
    onClearAll,
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
      maximumFractionDigits: 0,
    }).format(num);
  }
</script>

{#if comparedProducts.length > 0}
  <!-- Floating Bottom Dock -->
  <div
    class="fixed bottom-6 inset-x-0 z-40 px-4 sm:px-6 pointer-events-none font-sans"
  >
    <div
      class="max-w-4xl mx-auto bg-[#0f172a] text-white border border-slate-700 shadow-xl rounded-[3px] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto"
    >
      <div class="flex items-center gap-3 overflow-x-auto w-full sm:w-auto">
        <div
          class="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider shrink-0"
        >
          <Scale class="w-4 h-4" />
          <span>Bandingkan ({comparedProducts.length}/3):</span>
        </div>

        <div class="flex items-center gap-2">
          {#each comparedProducts as p}
            <div
              class="flex items-center gap-1.5 bg-slate-800 border border-slate-600 rounded-[2px] px-2.5 py-1 text-xs text-slate-200 shrink-0"
            >
              <span class="max-w-[140px] truncate">{p.name}</span>
              <button
                type="button"
                onclick={() => onRemoveProduct(p.id)}
                class="text-slate-400 hover:text-white cursor-pointer"
              >
                <X class="w-3 h-3" />
              </button>
            </div>
          {/each}
        </div>
      </div>

      <div
        class="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end"
      >
        <button
          type="button"
          onclick={onClearAll}
          class="text-xs text-slate-400 hover:text-white underline cursor-pointer"
        >
          Reset
        </button>

        <button
          type="button"
          disabled={comparedProducts.length < 2}
          onclick={() => (isModalOpen = true)}
          class="button-4-primary text-xs py-2 px-4 rounded-[3px] font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
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
  <div
    class="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 font-sans"
  >
    <div
      class="bg-white rounded-[3px] max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-300"
    >
      <!-- Modal Header -->
      <div
        class="sticky top-0 bg-[#0f172a] text-white border-b border-slate-700 px-6 py-4 flex items-center justify-between z-10"
      >
        <div class="flex items-center gap-2">
          <Scale class="w-5 h-5 text-emerald-400" />
          <h2 class="text-base font-bold text-white uppercase">
            Perbandingan Produk Finansial Syariah
          </h2>
        </div>
        <button
          type="button"
          onclick={() => (isModalOpen = false)}
          class="p-1 rounded-[2px] text-slate-400 hover:text-white cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Comparison Table -->
      <div class="p-6">
        <div class="overflow-x-auto">
          <table
            class="w-full text-left text-sm border-collapse border border-slate-300"
          >
            <thead>
              <tr class="border-b border-slate-300">
                <th
                  class="p-3 text-xs font-bold text-slate-700 uppercase tracking-wider bg-slate-100 w-1/4 border-r border-slate-300"
                  >Fitur / Kriteria</th
                >
                {#each comparedProducts as p}
                  <th
                    class="p-3 text-sm font-bold text-slate-900 uppercase w-1/3 border-r border-slate-300"
                  >
                    <span
                      class="text-xs text-slate-500 block font-normal capitalize"
                      >{p.institution}</span
                    >
                    {p.name}
                  </th>
                {/each}
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-300 text-xs">
              <tr>
                <td
                  class="p-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-300"
                  >Akad Syariah</td
                >
                {#each comparedProducts as p}
                  <td
                    class="p-3 font-medium text-emerald-800 border-r border-slate-300"
                    >Akad {p.islamicContract}</td
                  >
                {/each}
              </tr>
              <tr>
                <td
                  class="p-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-300"
                  >Plafon Pembiayaan</td
                >
                {#each comparedProducts as p}
                  <td
                    class="p-3 font-mono font-medium text-slate-900 border-r border-slate-300"
                  >
                    {formatRupiah(p.minAmount)} s/d {formatRupiah(p.maxAmount)}
                  </td>
                {/each}
              </tr>
              <tr>
                <td
                  class="p-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-300"
                  >Margin / Bagi Hasil</td
                >
                {#each comparedProducts as p}
                  <td
                    class="p-3 font-mono font-bold text-emerald-800 border-r border-slate-300"
                    >{p.interestRateOrMargin}</td
                  >
                {/each}
              </tr>
              <tr>
                <td
                  class="p-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-300"
                  >Jangka Waktu Tenor</td
                >
                {#each comparedProducts as p}
                  <td class="p-3 text-slate-800 border-r border-slate-300"
                    >{p.tenorMinMonths} - {p.tenorMaxMonths} Bulan</td
                  >
                {/each}
              </tr>
              <tr>
                <td
                  class="p-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-300"
                  >Kecepatan Approval</td
                >
                {#each comparedProducts as p}
                  <td class="p-3 text-slate-800 border-r border-slate-300"
                    >{p.approvalSpeed}</td
                  >
                {/each}
              </tr>
              <tr>
                <td
                  class="p-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-300"
                  >Kepatuhan Regulasi</td
                >
                {#each comparedProducts as p}
                  <td class="p-3 text-slate-800 border-r border-slate-300">
                    <span
                      class="inline-block px-2 py-0.5 rounded-[2px] bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-300"
                    >
                      {p.ojkRegulated ? "Berizin OJK" : "Koperasi Kemenkop"} & DPS
                    </span>
                  </td>
                {/each}
              </tr>
              <tr>
                <td
                  class="p-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-300"
                  >Keunggulan Utama</td
                >
                {#each comparedProducts as p}
                  <td class="p-3 text-slate-700 border-r border-slate-300">
                    <ul class="list-disc list-inside space-y-1">
                      {#each p.features as f}
                        <li>{f}</li>
                      {/each}
                    </ul>
                  </td>
                {/each}
              </tr>
              <tr>
                <td
                  class="p-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-300"
                  >Aksi Pengajuan</td
                >
                {#each comparedProducts as p}
                  <td class="p-3 border-r border-slate-300">
                    <a
                      href="/onboarding?productId={p.id}&name={encodeURIComponent(
                        p.name,
                      )}"
                      class="button-4-primary w-full text-xs py-2 px-4 rounded-[3px] flex items-center justify-center font-bold uppercase tracking-wider"
                    >
                      <span>Ajukan Sekarang</span>
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
