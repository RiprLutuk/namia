<script lang="ts">
  import { page } from "$app/state";
  import { AlertTriangle, Home, RefreshCw } from "lucide-svelte";
</script>

<svelte:head>
  <title>{page.status || 500} — Namia Syariah</title>
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center p-4 bg-slate-100">
  <div class="panel max-w-lg w-full shadow-lg border-slate-300 text-center !mb-0 overflow-hidden">
    <div class="panel-heading panel-emerald !py-3 !px-4 flex items-center justify-center gap-2">
      <AlertTriangle class="w-4 h-4 text-amber-300" />
      <span class="text-xs font-bold uppercase tracking-wider text-white">
        {page.status === 404 ? "Halaman Tidak Ditemukan" : "Pemberitahuan Sistem"}
      </span>
    </div>

    <div class="panel-body !p-8 space-y-4 bg-white">
      <div class="text-4xl sm:text-5xl font-extrabold text-slate-800 font-mono">
        {page.status || 500}
      </div>

      <div class="space-y-1">
        <h2 class="text-base sm:text-lg font-bold text-slate-900">
          {page.status === 404 ? "Halaman yang Anda Cari Tidak Tersedia" : "Sistem Sedang Melakukan Penyesuaian"}
        </h2>
        <p class="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
          {page.error?.message || "Layanan tetap berjalan dengan perlindungan data transaksi syariah penuh. Silakan muat ulang atau kembali ke beranda."}
        </p>
      </div>

      <div class="well well-small !p-3 max-w-xs mx-auto text-[11px] text-slate-500 font-mono">
        Status Server: <strong class="text-emerald-700">ONLINE</strong> &bull; Enkripsi SSL Aktif
      </div>

      <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onclick={() => {
            if (typeof window !== "undefined") window.location.reload();
          }}
          class="btn btn-default font-medium inline-flex items-center gap-1.5 text-xs"
        >
          <RefreshCw class="w-3.5 h-3.5" />
          <span>Muat Ulang Halaman</span>
        </button>

        <a
          href="/"
          class="btn btn-success font-bold inline-flex items-center gap-1.5 text-xs px-4"
        >
          <Home class="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </a>
      </div>
    </div>
  </div>
</div>
