<script lang="ts">
  import { onMount } from "svelte";
  import {
    BookOpen,
    Search,
    Clock,
    ChevronRight,
    Tag,
    Share2,
    X,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    User,
    Calendar,
    TrendingUp,
    Send,
    ShieldCheck,
    Bookmark,
    Mail,
  } from "lucide-svelte";
  import { cmsStore, fetchCmsContent } from "$lib/cms";
  import { API_BASE_URL, NAMIA_API_KEY } from "$lib/api";

  onMount(() => {
    fetchCmsContent();
  });

  interface BlogArticle {
    id: string;
    slug: string;
    title: string;
    category: string;
    author: string;
    authorRole: string;
    date: string;
    readTime: string;
    image: string;
    featured?: boolean;
    summary: string;
    takeaway: string;
    content: string[];
  }

  // Dynamic articles loaded directly from database and API
  let blogs = $derived<BlogArticle[]>(
    $cmsStore.blogPosts?.length
      ? $cmsStore.blogPosts.map((b) => ({
          id: String(b.id),
          slug: b.slug,
          title: b.title,
          category: b.category,
          author: b.author,
          authorRole: b.authorRole || "Dewan Redaksi Namia",
          date: b.publishedAt
            ? new Date(b.publishedAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Februari 2026",
          readTime: b.readTime || "5 min read",
          image: b.imageUrl || b.image || "/images/blog/grid/17.jpg",
          featured: b.featured ?? false,
          summary: b.summary || b.excerpt || "",
          takeaway: b.takeaway || b.summary || b.excerpt || "",
          content: Array.isArray(b.content) ? b.content : [b.content || ""],
        }))
      : [],
  );

  let searchQuery = $state("");
  let selectedCategory = $state("Semua");
  let activeArticle = $state<BlogArticle | null>(null);

  // Newsletter subscription state
  let newsletterEmail = $state("");
  let newsletterSuccess = $state(false);

  const categories = [
    "Semua",
    "Akad Syariah",
    "Bisnis UMKM",
    "Sukuk & Investasi",
    "Kemitraan",
    "Karir & Kultur",
    "Kisah Inspiratif",
  ];

  // Featured article is the designated hero story
  let featuredArticle = $derived.by(() => {
    return blogs.find((b) => b.featured) || blogs[0];
  });

  // Filtered article list
  let filteredBlogs = $derived.by(() => {
    return blogs.filter((b) => {
      if (selectedCategory !== "Semua" && b.category !== selectedCategory)
        return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          b.summary.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  });

  function handleNewsletterSubmit() {
    if (!newsletterEmail.trim()) return;
    newsletterSuccess = true;
  }
</script>

<svelte:head>
  <title>Namia Knowledge Hub & Blog | Literasi Fintech & Muamalah Syariah</title
  >
  <meta
    name="description"
    content="Artikel resmi, wawasan tim Namia Syariah, panduan muamalah syariah bebas riba, strategi permodalan UMKM halal, dan warta kemitraan fintech syariah terkini."
  />
</svelte:head>

<div class="space-y-0 font-sans">
  <!-- HERO JUMBOTRON SECTION -->
  <section
    class="bg-[#0f172a] text-white py-14 sm:py-16 border-b border-slate-700"
  >
    <div class="max-w-5xl mx-auto px-4 text-center space-y-6">
      <!-- Trust Badge -->
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] bg-slate-800 border border-slate-600 text-xs font-bold uppercase tracking-wider text-emerald-400"
      >
        <Sparkles class="w-3.5 h-3.5 text-emerald-400" />
        <span>Pusat Literasi & Wawasan &bull; Namia Knowledge Hub</span>
      </div>

      <!-- Main Headline -->
      <div class="space-y-3">
        <h1
          class="text-3xl sm:text-5xl font-bold tracking-tight uppercase leading-tight text-white"
        >
          Kabar Terkini, Riset & <br />
          <span class="text-emerald-400"> Edukasi Fintech Syariah </span>
        </h1>

        <p
          class="max-w-2xl mx-auto text-slate-300 text-xs sm:text-sm md:text-base font-normal leading-relaxed"
        >
          Kupasan mendalam seputar fiqih muamalah kontemporer, permodalan UMKM
          halal, panduan investasi riil bebas riba, dan berita resmi Namia
          Syariah.
        </p>
      </div>

      <!-- Quick Metrics Ribbon -->
      <div
        class="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-300 font-medium"
      >
        <div class="flex items-center gap-2">
          <BookOpen class="w-4 h-4 text-emerald-400" />
          <span>8 Artikel Terpublikasi</span>
        </div>
        <div class="flex items-center gap-2">
          <ShieldCheck class="w-4 h-4 text-emerald-400" />
          <span>Ditinjau Dewan Pengawas Syariah</span>
        </div>
        <div class="flex items-center gap-2">
          <TrendingUp class="w-4 h-4 text-emerald-400" />
          <span>Fokus Pemberdayaan UMKM Halal</span>
        </div>
      </div>
    </div>
  </section>

  <!-- FEATURED HERO ARTICLE SPOTLIGHT (EDITOR'S PICK) -->
  {#if featuredArticle && selectedCategory === "Semua" && !searchQuery.trim()}
    <section class="py-12 bg-[#F9F9F9] border-b border-[#ECECEC]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2 mb-4">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span
            class="text-xs font-bold uppercase tracking-wider text-slate-700"
          >
            Artikel Pilihan Redaksi (Editor's Pick)
          </span>
        </div>

        <div
          class="bg-white rounded-[3px] border border-slate-300 shadow-xs overflow-hidden"
        >
          <div class="grid grid-cols-1 lg:grid-cols-12 items-center">
            <!-- Cover Image (7 Cols) -->
            <div
              class="lg:col-span-7 relative h-72 sm:h-96 overflow-hidden bg-slate-900"
            >
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black/40 lg:hidden"></div>
              <span
                class="absolute top-4 left-4 px-3 py-1 rounded-[2px] bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider border border-emerald-600"
              >
                {featuredArticle.category}
              </span>
            </div>

            <!-- Content Details (5 Cols) -->
            <div class="lg:col-span-5 p-6 sm:p-10 space-y-5">
              <div class="flex items-center gap-3 text-xs text-slate-500">
                <span class="flex items-center gap-1">
                  <User class="w-3.5 h-3.5 text-emerald-700" />
                  <span>{featuredArticle.author}</span>
                </span>
                <span>&bull;</span>
                <span class="flex items-center gap-1">
                  <Clock class="w-3.5 h-3.5 text-slate-400" />
                  <span>{featuredArticle.readTime}</span>
                </span>
              </div>

              <h2
                class="text-xl sm:text-2xl font-bold text-slate-900 uppercase leading-snug"
              >
                {featuredArticle.title}
              </h2>

              <p
                class="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-4"
              >
                {featuredArticle.summary}
              </p>

              <!-- Key Takeaway Box -->
              <div
                class="p-3.5 bg-emerald-50 rounded-[2px] border-l-4 border-emerald-600 text-xs text-slate-700 italic"
              >
                "{featuredArticle.takeaway}"
              </div>

              <div
                class="pt-2 flex items-center justify-between border-t border-slate-200"
              >
                <span class="text-xs text-slate-500 font-mono"
                  >{featuredArticle.date}</span
                >
                <button
                  type="button"
                  onclick={() => (activeArticle = featuredArticle)}
                  class="button-4-primary text-xs py-2 px-4 rounded-[3px] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  {/if}

  <!-- SEARCH & CATEGORY FILTER SECTION -->
  <section
    class="py-4 bg-white border-b border-slate-300 sticky top-0 z-20 shadow-2xs"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-4">
        <!-- Category Chips -->
        <div
          class="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none"
        >
          {#each categories as c}
            <button
              type="button"
              onclick={() => (selectedCategory = c)}
              class="px-3 py-1.5 rounded-[3px] text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer border {selectedCategory ===
              c
                ? 'bg-emerald-700 text-white border-emerald-800'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'}"
            >
              {c}
            </button>
          {/each}
        </div>

        <!-- Search Bar -->
        <div class="relative w-full lg:w-80 shrink-0">
          <Search
            class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
          />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Cari judul, topik, atau penulis..."
            class="w-full pl-10 pr-9 py-1.5 bg-white border border-slate-300 rounded-[3px] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
          />
          {#if searchQuery}
            <button
              type="button"
              onclick={() => (searchQuery = "")}
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
              aria-label="Hapus kata kunci"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          {/if}
        </div>
      </div>

      <!-- Active Filter Status -->
      <div
        class="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500"
      >
        <div class="flex items-center gap-2">
          <span
            >Menampilkan <strong>{filteredBlogs.length}</strong> artikel</span
          >
          {#if selectedCategory !== "Semua"}
            <span>&bull;</span>
            <span class="text-emerald-700 font-semibold"
              >Kategori: {selectedCategory}</span
            >
          {/if}
          {#if searchQuery}
            <span>&bull;</span>
            <span>Kata kunci: "<em>{searchQuery}</em>"</span>
          {/if}
        </div>

        {#if selectedCategory !== "Semua" || searchQuery}
          <button
            type="button"
            onclick={() => {
              selectedCategory = "Semua";
              searchQuery = "";
            }}
            class="text-emerald-700 hover:underline font-semibold cursor-pointer"
          >
            Reset Filter
          </button>
        {/if}
      </div>
    </div>
  </section>

  <!-- EDITORIAL ARTICLES GRID -->
  <section class="py-16 bg-[#F9F9F9] border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {#if filteredBlogs.length === 0}
        <div
          class="bg-white rounded-[3px] border border-slate-300 p-12 text-center space-y-4 max-w-md mx-auto"
        >
          <div
            class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto"
          >
            <Search class="w-6 h-6" />
          </div>
          <h3 class="text-base font-bold text-slate-800 uppercase">
            Tidak Ditemukan Artikel
          </h3>
          <p class="text-xs text-slate-500 leading-relaxed">
            Tidak ada ulasan atau artikel yang sesuai dengan kriteria "{searchQuery}".
            Coba gunakan kata kunci lain atau pilih kategori yang tersedia.
          </p>
          <button
            type="button"
            onclick={() => {
              selectedCategory = "Semua";
              searchQuery = "";
            }}
            class="button-4 text-xs py-2 px-4 rounded-[3px]"
          >
            Tampilkan Semua Artikel
          </button>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {#each filteredBlogs as article}
            <article
              class="bg-white rounded-[3px] border border-slate-300 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <!-- Thumbnail Image -->
              <div class="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src={article.image}
                  alt={article.title}
                  class="w-full h-full object-cover"
                />
                <span
                  class="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-[2px] bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider"
                >
                  {article.category}
                </span>
                <span
                  class="absolute bottom-3 right-3 px-2 py-0.5 rounded-[2px] bg-black/70 text-slate-200 text-[10px] font-mono flex items-center gap-1"
                >
                  <Clock class="w-3 h-3 text-emerald-400" />
                  <span>{article.readTime}</span>
                </span>
              </div>

              <!-- Body Details -->
              <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div class="space-y-3">
                  <div
                    class="flex items-center gap-2 text-[11px] text-slate-500"
                  >
                    <span class="font-medium text-slate-700"
                      >{article.author}</span
                    >
                    <span>&bull;</span>
                    <span class="text-slate-400">{article.date}</span>
                  </div>

                  <h3 class="text-base font-bold text-slate-900 leading-snug">
                    {article.title}
                  </h3>

                  <p
                    class="text-xs text-slate-600 leading-relaxed line-clamp-3"
                  >
                    {article.summary}
                  </p>
                </div>

                <!-- Footer Card Action -->
                <div
                  class="pt-4 border-t border-slate-200 flex items-center justify-between"
                >
                  <span class="text-[11px] text-emerald-700 font-semibold"
                    >{article.authorRole}</span
                  >
                  <button
                    type="button"
                    onclick={() => (activeArticle = article)}
                    class="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Baca</span>
                    <ChevronRight class="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              </div>
            </article>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <!-- NEWSLETTER / BULETIN SYARIAH SUBSCRIPTION BANNER -->
  <section class="py-16 bg-white border-b border-[#ECECEC]">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
      <div
        class="w-12 h-12 rounded-[3px] bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs"
      >
        <Mail class="w-6 h-6" />
      </div>

      <div class="space-y-2">
        <span
          class="text-xs font-bold text-emerald-700 uppercase tracking-widest block font-['Raleway']"
          >Buletin Literasi Namia</span
        >
        <h3 class="text-2xl sm:text-3xl font-bold uppercase text-slate-900">
          Dapatkan Wawasan Ekonomi & Investasi Halal Terkini
        </h3>
        <p
          class="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto font-sans leading-relaxed"
        >
          Kirimkan analisis fiqih muamalah kontemporer, kurasi peluang proyek
          riil UMKM, dan tips finansial berkah langsung ke email Anda setiap
          bulan.
        </p>
      </div>

      {#if newsletterSuccess}
        <div
          class="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-[3px] max-w-md mx-auto text-xs space-y-1"
        >
          <div class="font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 class="w-4 h-4 text-emerald-600" />
            <span>Terima Kasih Telah Berlangganan!</span>
          </div>
          <p>
            Email konfirmasi telah kami kirimkan ke <strong
              >{newsletterEmail}</strong
            >. Insya Allah buletin perdana Anda segera tiba.
          </p>
        </div>
      {:else}
        <form
          onsubmit={(e) => {
            e.preventDefault();
            handleNewsletterSubmit();
          }}
          class="max-w-md mx-auto flex flex-col sm:flex-row gap-2"
        >
          <input
            type="email"
            required
            bind:value={newsletterEmail}
            placeholder="Ketikkan alamat email aktif Anda..."
            class="flex-1 bg-white border border-slate-300 rounded-[3px] px-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 outline-none"
          />
          <button
            type="submit"
            class="button-4-primary text-xs py-2 px-6 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send class="w-3.5 h-3.5" />
            <span>Langganan</span>
          </button>
        </form>
        <p class="text-[11px] text-slate-500">
          Privasi Anda terjaga. Kami tidak mengirimkan spam dan Anda dapat
          berhenti berlangganan kapan saja.
        </p>
      {/if}
    </div>
  </section>
</div>

<!-- COMPREHENSIVE ARTICLE DETAIL READER MODAL -->
{#if activeArticle}
  <div
    class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 flex items-center justify-center p-4 sm:p-6"
  >
    <div
      class="bg-white rounded-[3px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-slate-300 relative"
    >
      <!-- Modal Top Action Bar -->
      <div
        class="sticky top-0 z-10 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <span
            class="px-2.5 py-0.5 rounded-[2px] bg-emerald-50 text-emerald-800 font-bold text-[11px] uppercase tracking-wider border border-emerald-200"
          >
            {activeArticle.category}
          </span>
          <span class="text-xs text-slate-400">&bull;</span>
          <span class="text-xs text-slate-500">{activeArticle.readTime}</span>
        </div>

        <button
          type="button"
          onclick={() => (activeArticle = null)}
          class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-[2px] transition-colors cursor-pointer"
          aria-label="Tutup jendela artikel"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Article Header & Cover Photo -->
      <div class="p-6 sm:p-8 space-y-6">
        <div class="space-y-3">
          <h1
            class="text-xl sm:text-2xl font-bold text-slate-900 uppercase leading-snug"
          >
            {activeArticle.title}
          </h1>

          <!-- Author Box -->
          <div class="flex items-center gap-3 pt-2">
            <div
              class="w-10 h-10 rounded-[3px] bg-slate-100 border border-slate-300 flex items-center justify-center text-emerald-700"
            >
              <User class="w-5 h-5" />
            </div>
            <div class="text-xs">
              <span class="font-bold text-slate-900 block"
                >{activeArticle.author}</span
              >
              <span class="text-slate-500"
                >{activeArticle.authorRole} &bull; {activeArticle.date}</span
              >
            </div>
          </div>
        </div>

        <!-- Featured Banner Photo -->
        {#if activeArticle.image}
          <div
            class="rounded-[2px] overflow-hidden h-64 sm:h-80 w-full bg-slate-900 border border-slate-300"
          >
            <img
              src={activeArticle.image}
              alt={activeArticle.title}
              class="w-full h-full object-cover"
            />
          </div>
        {/if}

        <!-- Key Takeaway Callout Quote -->
        <div
          class="p-4 bg-emerald-50 rounded-[2px] border-l-4 border-emerald-600 text-xs sm:text-sm text-slate-800 space-y-1"
        >
          <div
            class="text-[10px] font-bold uppercase tracking-wider text-emerald-800"
          >
            Intisari Penting:
          </div>
          <p class="italic leading-relaxed font-serif">
            "{activeArticle.takeaway}"
          </p>
        </div>

        <!-- Full Formatted Article Paragraphs -->
        <div
          class="pt-2 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4 border-t border-slate-200 font-sans"
        >
          {#each activeArticle.content as p}
            <p>{p}</p>
          {/each}
        </div>

        <!-- Author & Disclaimer Note -->
        <div
          class="mt-8 pt-6 border-t border-slate-200 bg-slate-50 p-4 rounded-[3px] text-xs text-slate-600 space-y-2 border border-slate-200"
        >
          <div
            class="font-bold text-slate-700 uppercase text-[11px] flex items-center gap-1.5"
          >
            <ShieldCheck class="w-4 h-4 text-emerald-700" />
            <span>Kepatuhan Literasi Syariah Namia</span>
          </div>
          <p class="leading-relaxed">
            Artikel ini disusun semata-mata untuk tujuan edukasi dan literasi
            publik. Setiap transaksi pendanaan atau pembiayaan di platform Namia
            Syariah senantiasa mengacu pada akad resmi yang telah disetujui oleh
            Dewan Pengawas Syariah serta mematuhi peraturan perundang-undangan
            OJK yang berlaku.
          </p>
        </div>

        <!-- Modal Bottom Actions -->
        <div
          class="pt-4 flex items-center justify-between border-t border-slate-200"
        >
          <button
            type="button"
            onclick={() => {
              if (navigator.share) {
                navigator.share({
                  title: activeArticle?.title,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Tautan artikel berhasil disalin ke papan klip!");
              }
            }}
            class="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 class="w-4 h-4" />
            <span>Bagikan Artikel</span>
          </button>

          <button
            type="button"
            onclick={() => (activeArticle = null)}
            class="button-4-primary text-xs py-2 px-6 rounded-[3px] font-bold uppercase tracking-wider"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
