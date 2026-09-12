<script lang="ts">
  import { Scale, X, ArrowRight, Check } from "lucide-svelte";
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
  <!-- Floating Bottom Dock in Early Bootstrap 2 Style -->
  <div class="fixed bottom-6 inset-x-0 z-40 px-4 sm:px-6 pointer-events-none font-sans">
    <div class="max-w-4xl mx-auto bg-gradient-to-b from-[#243342] to-[#18222c] text-white border border-[#0f172a] shadow-2xl rounded-[5px] p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto">
      <div class="flex items-center gap-3 overflow-x-auto w-full sm:w-auto">
        <div class="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider shrink-0">
          <Scale class="w-4 h-4" />
          <span>Komparasi ({comparedProducts.length}/3):</span>
        </div>

        <div class="flex items-center gap-2">
          {#each comparedProducts as p}
            <div class="flex items-center gap-1.5 bg-[#0f172a] border border-slate-700 rounded-[3px] px-2.5 py-1 text-xs text-slate-200 shrink-0">
              <span class="max-w-[130px] truncate font-semibold">{p.name}</span>
              <button
                type="button"
                onclick={() => onRemoveProduct(p.id)}
                class="text-slate-400 hover:text-white cursor-pointer ml-1"
                title="Hapus"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </div>
          {/each}
        </div>
      </div>

      <div class="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
        <button
          type="button"
          onclick={onClearAll}
          class="btn btn-mini btn-inverse text-xs"
        >
          Reset
        </button>

        <button
          type="button"
          disabled={comparedProducts.length < 2}
          onclick={() => (isModalOpen = true)}
          class="btn btn-small btn-success flex items-center gap-1.5 text-xs font-bold"
        >
          <span>Bandingkan Sekarang</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Side-by-Side Comparison Modal in Early Bootstrap 2 Style -->
{#if isModalOpen}
  <div class="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 font-sans backdrop-blur-xs">
    <div class="panel max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl !mb-0 border-slate-400">
      <!-- Modal Header (Early Bootstrap Style) -->
      <div class="panel-heading panel-emerald flex items-center justify-between !py-3 !px-5 sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <Scale class="w-4 h-4 text-white" />
          <h2 class="text-sm font-bold text-white uppercase tracking-wider">
            Matriks Perbandingan Produk Syariah
          </h2>
        </div>
        <button
          type="button"
          onclick={() => (isModalOpen = false)}
          class="text-white hover:text-emerald-200 cursor-pointer font-bold text-lg"
          aria-label="Tutup"
        >
          &times;
        </button>
      </div>

      <!-- Comparison Table -->
      <div class="p-5 bg-white">
        <div class="overflow-x-auto">
          <table class="table table-bordered table-striped !mb-0 text-xs">
            <thead>
              <tr>
                <th class="w-1/4">Kriteria Evaluasi</th>
                {#each comparedProducts as p}
                  <th class="w-1/3">
                    <span class="text-[10px] text-slate-500 font-semibold block uppercase tracking-wider">{p.institution}</span>
                    <span class="text-sm font-bold text-slate-900">{p.name}</span>
                  </th>
                {/each}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="font-bold text-slate-700">Akad Syariah</td>
                {#each comparedProducts as p}
                  <td>
                    <span class="label label-success">Akad {p.islamicContract}</span>
                  </td>
                {/each}
              </tr>
              <tr>
                <td class="font-bold text-slate-700">Plafon Pembiayaan</td>
                {#each comparedProducts as p}
                  <td class="font-mono font-bold text-slate-900">
                    {formatRupiah(p.minAmount)} s/d {formatRupiah(p.maxAmount)}
                  </td>
                {/each}
              </tr>
              <tr>
                <td class="font-bold text-slate-700">Margin / Bagi Hasil</td>
                {#each comparedProducts as p}
                  <td class="font-mono font-bold text-emerald-700">
                    {p.interestRateOrMargin}
                  </td>
                {/each}
              </tr>
              <tr>
                <td class="font-bold text-slate-700">Jangka Waktu Tenor</td>
                {#each comparedProducts as p}
                  <td class="font-semibold text-slate-800">
                    {p.tenorMinMonths} - {p.tenorMaxMonths} Bulan
                  </td>
                {/each}
              </tr>
              <tr>
                <td class="font-bold text-slate-700">Kecepatan Verifikasi</td>
                {#each comparedProducts as p}
                  <td class="text-slate-800 font-medium">
                    {p.approvalSpeed}
                  </td>
                {/each}
              </tr>
              <tr>
                <td class="font-bold text-slate-700">Regulasi & Legalitas</td>
                {#each comparedProducts as p}
                  <td>
                    <span class="label label-inverse">
                      {p.ojkRegulated ? "Berizin OJK" : "Koperasi Kemenkop"} & DPS
                    </span>
                  </td>
                {/each}
              </tr>
              <tr>
                <td class="font-bold text-slate-700">Fitur & Manfaat</td>
                {#each comparedProducts as p}
                  <td>
                    <ul class="space-y-1">
                      {#each p.features as f}
                        <li class="flex items-start gap-1">
                          <Check class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      {/each}
                    </ul>
                  </td>
                {/each}
              </tr>
              <tr>
                <td class="font-bold text-slate-700">Aksi Pengajuan</td>
                {#each comparedProducts as p}
                  <td>
                    <a
                      href="/onboarding?productId={p.id}&name={encodeURIComponent(p.name)}"
                      class="btn btn-small btn-success w-full font-bold uppercase"
                    >
                      Ajukan Sekarang
                    </a>
                  </td>
                {/each}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="panel-footer flex items-center justify-end gap-2 bg-slate-50">
        <button
          type="button"
          onclick={() => (isModalOpen = false)}
          class="btn btn-small"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
{/if}
