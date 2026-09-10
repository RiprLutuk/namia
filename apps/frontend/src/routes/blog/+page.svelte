<script lang="ts">
  import { BookOpen, Search, Clock, ChevronRight, Tag } from "lucide-svelte";

  const blogs = [
    {
      id: "1",
      slug: "memahami-perbedaan-riba-dan-margin-murabahah",
      title: "Memahami Perbedaan Mendasar Antara Bunga Riba dan Margin Murabahah",
      category: "Akad Syariah",
      author: "Dewan Syariah Syarfi",
      date: "12 Februari 2026",
      readTime: "5 min read",
      summary: "Banyak masyarakat awam yang mengira margin bank syariah sama dengan bunga bank konvensional. Simak kupasan mendalam mengenai rukun jual beli dan fatwa DSN-MUI yang melandasinya.",
      content: "Dalam muamalah Islam, pertukaran uang dengan uang yang menghasilkan pertambahan tanpa adanya komoditas atau jasa yang ditransaksikan terkategori sebagai Riba Fadhl atau Riba Nasiah. Berbeda halnya dengan akad Murabahah, di mana lembaga keuangan bertindak sebagai penjual yang membeli komoditas riil terlebih dahulu, kemudian menjualnya kepada nasabah dengan harga pokok ditambah margin keuntungan yang disepakati bersama secara transparan di awal."
    },
    {
      id: "2",
      slug: "tips-mengajukan-pembiayaan-umkm-lolos-analisis-risiko",
      title: "5 Tips Strategis Agar Pengajuan Pembiayaan Modal Kerja UMKM Disetujui",
      category: "Bisnis UMKM",
      author: "Tim Analis Risiko Syarfi",
      date: "28 Januari 2026",
      readTime: "7 min read",
      summary: "Pelajari cara menyusun pembukuan arus kas sederhana dan menjaga rasio kapasitas pembayaran agar permohonan modal kerja Anda cepat disetujui tanpa agunan sertifikat.",
      content: "Salah satu indikator vital yang diperiksa oleh analis kredit syariah adalah arus kas (cash flow) usaha selama minimal 6 bulan terakhir. Pisahkan rekening pribadi dan rekening usaha, catat setiap transaksi secara tertib, dan pastikan rasio beban hutang (Debt Service Ratio) usaha Anda tidak melampaui 35% dari omzet bersih bulanan."
    },
    {
      id: "3",
      slug: "potensi-sukuk-ritel-sebagai-investasi-aman-bebas-riba",
      title: "Mengenal Sukuk Ritel: Investasi Aman Berbasis Aset Riil Negara dan Korporasi",
      category: "Sukuk & Investasi",
      author: "Divisi Riset Syariah",
      date: "15 Januari 2026",
      readTime: "6 min read",
      summary: "Sukuk bukanlah surat hutang biasa, melainkan sertifikat kepemilikan bersama atas underlying asset yang disewakan atau dikerjasamakan secara halal.",
      content: "Sukuk atau obligasi syariah menggunakan akad Ijarah (sewa) atau Wakalah (perwakilan investasi). Imbal hasil yang diterima investor berasal dari uang sewa atas aset riil yang disewakan kepada pengguna aset. Hal ini menjamin keamanan dana karena ada underlying asset nyata yang menjadi dasar penerbitan instrumen."
    }
  ];

  let searchQuery = $state("");
  let selectedCategory = $state("Semua");
  let activeArticle = $state<any>(null);

  const categories = ["Semua", "Akad Syariah", "Bisnis UMKM", "Sukuk & Investasi"];

  let filteredBlogs = $derived.by(() => {
    return blogs.filter(b => {
      if (selectedCategory !== "Semua" && b.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return b.title.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q);
      }
      return true;
    });
  });
</script>

<svelte:head>
  <title>Pusat Literasi & Blog Keuangan Syariah — Syarfi</title>
  <meta name="description" content="Artikel edukasi, panduan muamalah, wawasan bisnis UMKM, dan fatwa DSN-MUI terlengkap." />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
  
  <!-- Header -->
  <div class="space-y-3">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold">
      <BookOpen class="w-3.5 h-3.5 text-emerald-600" />
      <span>Pusat Edukasi & Literasi Keuangan</span>
    </div>
    <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
      Blog & Wawasan Muamalah Syariah
    </h1>
    <p class="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
      Tingkatkan literasi finansial halal Anda melalui artikel panduan, fatwa DSN-MUI, tips pengelolaan modal usaha, dan wawasan investasi syariah.
    </p>
  </div>

  <!-- Search & Category Filters -->
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
    <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
      {#each categories as c}
        <button
          type="button"
          onclick={() => selectedCategory = c}
          class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all {selectedCategory === c ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'}"
        >
          {c}
        </button>
      {/each}
    </div>

    <div class="relative w-full sm:w-72">
      <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Cari artikel edukasi..."
        class="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
      />
    </div>
  </div>

  <!-- Articles Grid -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    {#each filteredBlogs as article}
      <article class="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 group">
        <div class="space-y-3">
          <div class="flex items-center justify-between text-[11px] text-slate-400">
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/50">
              {article.category}
            </span>
            <span class="flex items-center gap-1">
              <Clock class="w-3 h-3" />
              <span>{article.readTime}</span>
            </span>
          </div>

          <h3 class="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
            {article.title}
          </h3>

          <p class="text-xs text-slate-600 leading-relaxed line-clamp-3">
            {article.summary}
          </p>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[11px] text-slate-400">{article.date}</span>
          <button
            type="button"
            onclick={() => activeArticle = article}
            class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Baca Selengkapnya</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </article>
    {/each}
  </div>

  <!-- Article Detail Modal -->
  {#if activeArticle}
    <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-5">
        <div class="flex justify-between items-start">
          <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs">
            {activeArticle.category}
          </span>
          <button
            type="button"
            onclick={() => activeArticle = null}
            class="text-slate-400 hover:text-slate-700 text-sm font-semibold"
          >
            ✕ Tutup
          </button>
        </div>

        <h2 class="text-2xl font-bold text-slate-900">{activeArticle.title}</h2>
        <div class="text-xs text-slate-400 flex items-center gap-3">
          <span>Oleh: {activeArticle.author}</span>
          <span>•</span>
          <span>{activeArticle.date}</span>
        </div>

        <div class="pt-4 border-t border-slate-100 text-sm text-slate-700 leading-relaxed space-y-4">
          <p>{activeArticle.content}</p>
        </div>
      </div>
    </div>
  {/if}

</div>
