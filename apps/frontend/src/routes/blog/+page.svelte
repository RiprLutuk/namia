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
    Rss
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
          date: (() => {
            try {
              const d = b.publishedAt ? new Date(b.publishedAt) : null;
              return d && !isNaN(d.getTime())
                ? d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                : "Februari 2026";
            } catch {
              return "Februari 2026";
            }
          })(),
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
  <title>Namia Knowledge Hub & Blog | Literasi Fintech & Muamalah Syariah</title>
  <meta
    name="description"
    content="Artikel resmi, wawasan tim Namia Syariah, panduan muamalah syariah bebas riba, strategi permodalan UMKM halal, dan warta kemitraan fintech syariah terkini."
  />
</svelte:head>

<div class="blog-page space-y-0 font-sans">
  <!-- PAGE HEADER WITH AUTHENTIC EARLY BOOTSTRAP 2.0 SUBHEAD JUMBOTRON -->
  <section class="jumbotron-subhead">
    <div class="container px-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-1.5">
          <div class="flex items-center gap-2">
            <span class="badge badge-success text-[10px] uppercase font-bold">
              Namia Knowledge Hub
            </span>
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              class="rss-badge"
              title="Berlangganan Sindikasi RSS 2.0"
            >
              <Rss class="w-3 h-3 inline" />
              <span>RSS 2.0</span>
            </a>
          </div>
          <h1>Edukasi, Berita &amp; Literasi Syariah</h1>
          <p>
            Kupasan fiqih muamalah kontemporer, tips permodalan UMKM, dan warta resmi platform
          </p>
        </div>

        <!-- Early Bootstrap Breadcrumb -->
        <ul class="breadcrumb mb-0 text-slate-800 self-start md:self-auto">
          <li><a href="/">Beranda</a> <span class="divider">/</span></li>
          <li class="active">Blog Edukasi</li>
        </ul>
      </div>
    </div>
  </section>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- SEARCH & CATEGORY BAR (EARLY BOOTSTRAP PANEL) -->
    <div class="panel shadow-xs !mb-0">
      <div class="panel-body !p-4 bg-slate-50 space-y-3">
        <div class="flex flex-col md:flex-row items-center justify-between gap-3">
          <!-- Category Pills -->
          <div class="flex flex-wrap gap-1.5 items-center">
            {#each categories as c}
              <button
                type="button"
                onclick={() => (selectedCategory = c)}
                class="btn btn-mini {selectedCategory === c ? 'btn-success' : 'btn-default'}"
              >
                {c}
              </button>
            {/each}
          </div>

          <!-- Search Input -->
          <div class="relative w-full md:w-72 shrink-0">
            <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Cari artikel, topik, atau penulis..."
              class="w-full pl-8 pr-8 py-1.5 bg-white border border-slate-300 rounded-[4px] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
            {#if searchQuery}
              <button
                type="button"
                onclick={() => (searchQuery = "")}
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
              >
                &times;
              </button>
            {/if}
          </div>
        </div>

        <!-- Filter Stats Strip -->
        <div class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200">
          <div class="flex items-center gap-2">
            <span>Ditemukan <strong>{filteredBlogs.length}</strong> artikel</span>
            {#if selectedCategory !== "Semua"}
              <span>&bull;</span>
              <span class="label label-success">{selectedCategory}</span>
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
              class="text-xs text-slate-500 hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          {/if}
        </div>
      </div>
    </div>

    <!-- FEATURED ARTICLE SPOTLIGHT -->
    {#if featuredArticle && selectedCategory === "Semua" && !searchQuery.trim()}
      <div class="panel ribbon-wrapper shadow-xs !mb-0">
        <div class="ribbon-tag">Pilihan Redaksi</div>
        <div class="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div class="lg:col-span-7 relative h-72 sm:h-84 overflow-hidden bg-slate-900">
            <img
              src={featuredArticle.image}
              alt={featuredArticle.title}
              class="w-full h-full object-cover"
            />
            <div class="absolute bottom-3 left-3">
              <span class="badge badge-inverse">
                {featuredArticle.category}
              </span>
            </div>
          </div>

          <div class="lg:col-span-5 p-6 space-y-4 bg-white">
            <div class="flex items-center gap-2 text-xs text-slate-500">
              <span class="font-bold text-slate-800">{featuredArticle.author}</span>
              <span>&bull;</span>
              <span>{featuredArticle.date}</span>
              <span>&bull;</span>
              <span class="font-mono text-emerald-700">{featuredArticle.readTime}</span>
            </div>

            <h2 class="text-xl font-bold text-slate-900 leading-snug">
              {featuredArticle.title}
            </h2>

            <p class="text-xs text-slate-600 leading-relaxed line-clamp-3">
              {featuredArticle.summary}
            </p>

            <div class="well well-small !p-3 !mb-0 text-xs italic text-slate-700 border-l-4 border-l-emerald-600 bg-emerald-50/50">
              "{featuredArticle.takeaway}"
            </div>

            <div class="pt-2 flex items-center justify-between border-t border-slate-200">
              <span class="text-[11px] text-slate-500">{featuredArticle.authorRole}</span>
              <button
                type="button"
                onclick={() => (activeArticle = featuredArticle)}
                class="btn btn-small btn-success font-bold"
              >
                <span>Baca Selengkapnya</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- ARTICLES GRID -->
    {#if filteredBlogs.length === 0}
      <div class="well well-large text-center py-12 space-y-3 bg-white">
        <BookOpen class="w-10 h-10 text-slate-400 mx-auto" />
        <h3 class="text-base font-bold text-slate-800">Tidak ada artikel yang cocok</h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto">
          Coba gunakan kata kunci lain atau pilih kategori yang tersedia.
        </p>
        <button
          type="button"
          onclick={() => {
            selectedCategory = "Semua";
            searchQuery = "";
          }}
          class="btn btn-small btn-success font-bold mt-2"
        >
          Tampilkan Semua Artikel
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredBlogs as article}
          <article class="panel flex flex-col justify-between shadow-xs hover:border-emerald-600 transition-colors !mb-0">
            <!-- Thumbnail Image -->
            <div class="relative h-48 overflow-hidden bg-slate-100 border-b border-slate-200">
              <img
                src={article.image}
                alt={article.title}
                class="w-full h-full object-cover"
              />
              <span class="absolute top-2.5 left-2.5 badge badge-inverse text-[10px]">
                {article.category}
              </span>
              <span class="absolute bottom-2.5 right-2.5 badge badge-inverse text-[10px] flex items-center gap-1 font-mono">
                <Clock class="w-3 h-3 text-emerald-400" />
                <span>{article.readTime}</span>
              </span>
            </div>

            <!-- Body Details -->
            <div class="p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
              <div class="space-y-2">
                <div class="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span class="font-bold text-slate-700">{article.author}</span>
                  <span>&bull;</span>
                  <span>{article.date}</span>
                </div>

                <h3 class="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                  {article.title}
                </h3>

                <p class="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {article.summary}
                </p>
              </div>

              <!-- Footer -->
              <div class="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span class="text-[11px] text-emerald-800 font-semibold">{article.authorRole}</span>
                <button
                  type="button"
                  onclick={() => (activeArticle = article)}
                  class="btn btn-mini btn-default font-bold"
                >
                  <span>Baca</span>
                  <ChevronRight class="w-3 h-3 text-emerald-700" />
                </button>
              </div>
            </div>
          </article>
        {/each}
      </div>
    {/if}

    <!-- NEWSLETTER BOX (EARLY BOOTSTRAP WELL) -->
    <div class="well well-white !p-8 text-center space-y-4 max-w-3xl mx-auto border-emerald-300">
      <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
        <Mail class="w-5 h-5" />
      </div>

      <div class="space-y-1">
        <span class="label label-success text-[10px] uppercase">Warta Literasi Syariah</span>
        <h3 class="text-xl font-bold text-slate-900 uppercase">
          Dapatkan Kupasan Finansial Halal Berkala
        </h3>
        <p class="text-xs text-slate-600 max-w-lg mx-auto">
          Analisis fiqih muamalah kontemporer, kurasi peluang proyek riil UMKM, dan tips finansial berkah langsung ke email Anda.
        </p>
      </div>

      {#if newsletterSuccess}
        <div class="alert alert-success text-xs py-2 max-w-md mx-auto">
          Jazakallah khair! Anda telah terdaftar dalam warta berkala Namia Syariah.
        </div>
      {:else}
        <form
          onsubmit={(e) => {
            e.preventDefault();
            handleNewsletterSubmit();
          }}
          class="max-w-md mx-auto flex gap-2"
        >
          <input
            type="email"
            required
            bind:value={newsletterEmail}
            placeholder="Alamat email aktif Anda..."
            class="flex-1 bg-white border border-slate-300 rounded-[4px] px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
          />
          <button type="submit" class="btn btn-success btn-small font-bold">
            <Send class="w-3.5 h-3.5" />
            <span>Langganan</span>
          </button>
        </form>
      {/if}
    </div>
  </div>
</div>

<!-- ARTICLE DETAIL READER MODAL -->
{#if activeArticle}
  <div class="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
    <div class="panel max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl !mb-0 border-slate-400">
      <!-- Modal Header -->
      <div class="panel-heading panel-emerald flex items-center justify-between !py-3 !px-5 sticky top-0 z-10">
        <div class="flex items-center gap-2">
          <span class="badge badge-inverse text-[10px]">{activeArticle.category}</span>
          <span class="text-xs text-emerald-100 font-mono">{activeArticle.readTime}</span>
        </div>
        <button
          type="button"
          onclick={() => (activeArticle = null)}
          class="text-white hover:text-emerald-200 font-bold text-lg cursor-pointer"
          aria-label="Tutup"
        >
          &times;
        </button>
      </div>

      <!-- Article Content -->
      <div class="p-6 sm:p-8 space-y-5 bg-white">
        <div class="space-y-2">
          <h1 class="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {activeArticle.title}
          </h1>

          <div class="flex items-center gap-2 text-xs text-slate-500">
            <span class="font-bold text-slate-800">{activeArticle.author}</span>
            <span>&bull;</span>
            <span>{activeArticle.authorRole}</span>
            <span>&bull;</span>
            <span>{activeArticle.date}</span>
          </div>
        </div>

        {#if activeArticle.image}
          <div class="rounded-[3px] overflow-hidden h-64 sm:h-72 w-full bg-slate-900 border border-slate-300">
            <img
              src={activeArticle.image}
              alt={activeArticle.title}
              class="w-full h-full object-cover"
            />
          </div>
        {/if}

        <!-- Key Takeaway -->
        <div class="well well-small !p-3.5 !mb-0 border-l-4 border-l-emerald-600 text-xs italic text-slate-800 bg-emerald-50/60">
          <strong class="not-italic text-emerald-900 uppercase block text-[10px] mb-0.5">Intisari Penting:</strong>
          "{activeArticle.takeaway}"
        </div>

        <!-- Body Paragraphs -->
        <div class="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3.5 pt-2 border-t border-slate-200">
          {#each activeArticle.content as p}
            <p>{p}</p>
          {/each}
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="panel-footer flex items-center justify-between bg-slate-50">
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
              alert("Tautan artikel disalin!");
            }
          }}
          class="btn btn-small flex items-center gap-1.5"
        >
          <Share2 class="w-3.5 h-3.5" />
          <span>Bagikan</span>
        </button>

        <button
          type="button"
          onclick={() => (activeArticle = null)}
          class="btn btn-small btn-success font-bold"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
{/if}
