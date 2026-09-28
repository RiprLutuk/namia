<script lang="ts">
  let { class: className = "" }: { class?: string; stats?: unknown } = $props();
</script>

<section
  class="border-y border-slate-300 bg-slate-50 py-5 {className}"
  aria-label="Status statistik"
>
  <div class="max-w-7xl mx-auto px-6">
    <strong>Statistik operasional belum tersedia.</strong>
    <p>
      Angka pencairan, kualitas pembiayaan, dan jumlah pengguna akan ditampilkan setelah sumber data
      terverifikasi tersambung.
    </p>
  </div>
</section>
