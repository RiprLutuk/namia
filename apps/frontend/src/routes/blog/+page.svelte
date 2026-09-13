<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowRight, Search, Rss, Share2, X, Play, ExternalLink } from "lucide-svelte";
  import { cmsStore, fetchCmsContent } from "$lib/cms";
  let searchQuery = $state("");
  let selectedCategory = $state("Semua");
  let selectedSlug = $state("");
  let shareStatus = $state("");
  let reader = $state<HTMLDialogElement>();
  const articles = $derived($cmsStore.blogPosts.map(post => ({
    ...post, slug: post.slug || String(post.id), summary: post.summary || post.excerpt || "",
    image: post.imageUrl || post.coverImage || post.photo || post.image || "",
    paragraphs: Array.isArray(post.content) ? post.content : (post.content || "").split(/\n\s*\n/),
    dateLabel: formatDate(post.publishedAt || post.date || ""),
    readingTime: post.readTimeMinutes ? `${post.readTimeMinutes} menit baca` : (post.readTime || "").replace("min read", "menit baca"),
  })));
  const categories = $derived(["Semua", ...new Set(articles.map(article => article.category).filter(Boolean))]);
  const filteredArticles = $derived(articles.filter(article => (selectedCategory === "Semua" || article.category === selectedCategory) && `${article.title} ${article.summary} ${article.author} ${article.category}`.toLowerCase().includes(searchQuery.trim().toLowerCase())));
  const activeArticle = $derived(articles.find(article => article.slug === selectedSlug));
  const mediaCoverage = $derived($cmsStore.mediaCoverage || []);

  function formatDate(value: string) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  }
  function readHash() {
    try { selectedSlug = decodeURIComponent(window.location.hash.slice(1)); } catch { selectedSlug = ""; }
  }
  onMount(() => {
    fetchCmsContent();
    readHash();
    window.addEventListener("hashchange", readHash);
    return () => window.removeEventListener("hashchange", readHash);
  });
  $effect(() => {
    if (activeArticle && reader && !reader.open) reader.showModal();
    if (!activeArticle && reader?.open) reader.close();
  });
  function openArticle(slug: string) {
    selectedSlug = slug;
    shareStatus = "";
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${encodeURIComponent(slug)}`);
  }
  function closeArticle() {
    selectedSlug = "";
    if (window.location.hash) window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }
  async function shareArticle() {
    if (!activeArticle) return;
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: activeArticle.title, url });
      else { await navigator.clipboard.writeText(url); shareStatus = "Tautan artikel disalin."; }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) shareStatus = "Salin tautan artikel dari bilah alamat browser Anda.";
    }
  }
  function mediaUrl(media: { url?: string; link?: string; sourceUrl?: string }) {
    const url = media.url || media.link || media.sourceUrl || "";
    return /^https?:\/\//i.test(url) ? url : "";
  }
</script>

<svelte:head><title>Jurnal Namia | Panduan Usaha & Pendanaan</title><meta name="description" content="Baca panduan pembiayaan usaha, akad syariah, pendanaan, dan kabar Namia dalam satu jurnal." /></svelte:head>

<div class="portal-page blog-page">
  <div class="portal-container">
    <header class="page-intro"><div><p class="portal-kicker">Jurnal Namia</p><h1 class="portal-heading">Pahami dulu.<br />Melangkah lebih yakin.</h1><p class="intro-copy">Bacaan tentang akad, kesiapan usaha, dan pendanaan untuk membantu Anda mengambil keputusan.</p></div><a class="rss-link portal-button-secondary" href="/rss.xml" target="_blank" rel="noopener noreferrer"><Rss size={16} /> Ikuti lewat RSS</a></header>
    <div class="journal-layout">
      <div class="articles-column">
        <div class="search-panel portal-panel">
          <label class="search-field"><Search size={18} /><input type="search" bind:value={searchQuery} aria-label="Cari artikel" placeholder="Cari artikel, topik, atau penulis" /></label>
          <div class="category-filter" aria-label="Kategori artikel">{#each categories as category}<button type="button" class:active={selectedCategory === category} aria-pressed={selectedCategory === category} onclick={() => selectedCategory = category}>{category}</button>{/each}</div>
        </div>
        <div class="results-heading"><h2>Semua bacaan</h2><span aria-live="polite">{filteredArticles.length} artikel</span></div>
        <div class="article-list">
          {#each filteredArticles as article}
            <article class="article-row portal-panel">
              {#if article.image}<button type="button" class="article-image" onclick={() => openArticle(article.slug)} aria-label={`Baca ${article.title}`}><img src={article.image} alt="" loading="lazy" /></button>{/if}
              <div class="article-copy"><div class="article-meta"><span>{article.category}</span>{#if article.dateLabel}<span>{article.dateLabel}</span>{/if}</div><h3><button type="button" onclick={() => openArticle(article.slug)}>{article.title}</button></h3><p>{article.summary}</p><div class="article-bottom"><span>{article.author}{article.readingTime ? ` · ${article.readingTime}` : ""}</span><button type="button" onclick={() => openArticle(article.slug)} aria-label={`Baca artikel ${article.title}`}>Baca <ArrowRight size={15} /></button></div></div>
            </article>
          {:else}
            <div class="empty-state portal-panel"><h3>Belum ada bacaan yang cocok.</h3><p>Coba kata kunci lain atau tampilkan semua kategori.</p><button class="portal-button-secondary" type="button" onclick={() => { searchQuery = ""; selectedCategory = "Semua"; }}>Tampilkan semua artikel</button></div>
          {/each}
        </div>
      </div>
      <aside class="journal-aside">
        <section class="video-panel portal-panel"><div class="aside-title">Cerita dalam video</div><a href="https://www.youtube.com/watch?v=7cBJ5jQckcA" target="_blank" rel="noopener noreferrer" class="video-link"><img src="https://img.youtube.com/vi/7cBJ5jQckcA/hqdefault.jpg" alt="Video pengenalan Namia Syariah" loading="lazy" /><span class="play-label"><Play size={16} fill="currentColor" /> Tonton di YouTube <ExternalLink size={13} /></span></a><p>Mengenal layanan dan perjalanan Namia melalui video.</p></section>
        {#if mediaCoverage.length}
          <section class="media-panel portal-panel" id="liputan-media"><div class="aside-title">Namia dalam media</div><div class="media-list">{#each mediaCoverage as media}<article>{#if media.logo}<img src={media.logo} alt={media.name || media.source || "Media"} loading="lazy" />{/if}<span class="media-source">{media.source || media.name}{media.date ? ` · ${media.date}` : ""}</span><h3>{media.title || media.description}</h3>{#if mediaUrl(media)}<a href={mediaUrl(media)} target="_blank" rel="noopener noreferrer">Baca liputan <ExternalLink size={12} /></a>{/if}</article>{/each}</div></section>
        {/if}
      </aside>
    </div>
  </div>
</div>

<dialog bind:this={reader} class="article-reader" aria-labelledby="reader-title" onclose={closeArticle}>
  {#if activeArticle}
    <div class="reader-toolbar"><span>Jurnal Namia · {activeArticle.category}</span><button type="button" class="close-reader" onclick={() => reader?.close()} aria-label="Tutup artikel"><X size={20} /></button></div>
    <article class="reader-content"><p class="reader-meta">{activeArticle.dateLabel}{activeArticle.readingTime ? ` · ${activeArticle.readingTime}` : ""}</p><h2 id="reader-title">{activeArticle.title}</h2><p class="reader-author">{activeArticle.author}{activeArticle.authorRole ? ` · ${activeArticle.authorRole}` : ""}</p>{#if activeArticle.image}<img class="reader-image" src={activeArticle.image} alt="" />{/if}{#if activeArticle.takeaway}<aside class="takeaway"><strong>Inti bacaan</strong><p>{activeArticle.takeaway}</p></aside>{/if}<div class="article-body">{#each activeArticle.paragraphs as paragraph}<p>{paragraph}</p>{/each}</div><footer class="reader-footer"><button type="button" class="portal-button-secondary" onclick={shareArticle}><Share2 size={15} /> Bagikan artikel</button><span role="status">{shareStatus}</span></footer></article>
  {/if}
</dialog>

<style>
  .blog-page{padding:48px 0 72px}.page-intro{display:flex;align-items:flex-end;justify-content:space-between;gap:28px;margin-bottom:32px}.intro-copy{margin:18px 0 0;max-width:590px;font-size:16px;line-height:1.75;color:#65736e}.rss-link{white-space:nowrap}.journal-layout{display:grid;grid-template-columns:minmax(0,1fr) 282px;gap:28px;align-items:start}.articles-column{min-width:0}.search-panel{padding:18px;background:#eaf0e6}.search-field{display:flex;align-items:center;gap:10px;padding:0 14px;background:#fff;border:1px solid #b8c9b7;border-radius:4px;color:#65736e}.search-field input{border:0;background:transparent;min-width:0;width:100%;padding:13px 0;font:14px Tahoma,Arial,sans-serif;color:#233b35}.search-field:focus-within{outline:2px solid #165b45;outline-offset:2px}.search-field input:focus{outline:none}.category-filter{display:flex;flex-wrap:wrap;gap:6px;margin-top:13px}.category-filter button{border:1px solid transparent;border-radius:4px;background:transparent;padding:8px 10px;font:12px Tahoma,Arial,sans-serif;color:#53675c;cursor:pointer}.category-filter button.active{background:#fff;border-color:#bdccb7;color:#165b45;font-weight:700}.category-filter button:hover{background:#fff}.results-heading{display:flex;justify-content:space-between;align-items:center;margin:25px 0 14px}.results-heading h2{font:24px Georgia,serif;margin:0;color:#233b35}.results-heading>span{font-size:12px;color:#65736e}.article-list{display:grid;gap:14px}.article-row{display:flex;overflow:hidden}.article-image{width:190px;flex-shrink:0;padding:0;border:0;background:#e8eee4;cursor:pointer}.article-image img{width:100%;height:100%;min-height:220px;object-fit:cover}.article-copy{padding:22px;min-width:0;flex:1}.article-meta{display:flex;flex-wrap:wrap;gap:8px 14px;font-size:11px;color:#65736e}.article-meta span:first-child{color:#165b45;font-weight:700}.article-copy h3{margin:10px 0 0;font-family:Georgia,serif;font-size:21px;font-weight:400;line-height:1.4}.article-copy h3 button{text-align:left;font:inherit;color:#233b35;background:none;border:0;padding:0;cursor:pointer}.article-copy h3 button:hover{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px}.article-copy>p{font-size:13px;line-height:1.75;color:#65736e;margin:12px 0 18px}.article-bottom{display:flex;justify-content:space-between;align-items:center;gap:12px}.article-bottom>span{font-size:11px;line-height:1.6;color:#65736e}.article-bottom button{display:flex;align-items:center;gap:6px;border:0;background:none;color:#165b45;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap}.journal-aside{display:grid;gap:22px}.aside-title{padding:14px 17px;border-bottom:1px solid #d5dfd1;background:#e8eee3;font-size:13px;font-weight:700}.video-panel,.media-panel{overflow:hidden}.video-link{display:block;padding:14px 14px 0;color:#165b45}.video-link>img{width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:3px}.play-label{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:700;margin-top:12px}.video-panel>p{font-size:12px;line-height:1.7;color:#65736e;margin:10px 15px 17px}.media-list{padding:0 17px}.media-list article{padding:20px 0}.media-list article+article{border-top:1px solid #dde5d8}.media-list img{max-width:125px;height:25px;object-fit:contain;object-position:left;margin-bottom:12px}.media-source{display:block;font-size:10px;color:#65736e;line-height:1.7}.media-list h3{font-size:13px;line-height:1.6;margin:7px 0 0;color:#233b35}.media-list a{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#165b45;margin-top:12px}.empty-state{padding:35px;text-align:center}.empty-state h3{font:23px Georgia,serif}.empty-state p{font-size:14px;color:#65736e}.empty-state button{margin-top:8px}
  .article-reader{padding:0;border:1px solid #b6c8b3;border-radius:7px;width:min(820px,calc(100% - 32px));max-height:90dvh;background:#fff;color:#233b35;box-shadow:0 24px 100px #132e3444}.article-reader::backdrop{background:#172d26a6}.reader-toolbar{display:flex;align-items:center;justify-content:space-between;gap:15px;padding:12px 22px;background:#e8eee3;border-bottom:1px solid #cbd7c5;position:sticky;top:0;z-index:1;font-size:12px;font-weight:700}.close-reader{display:grid;place-items:center;width:36px;height:36px;border:1px solid #bccbb7;border-radius:4px;background:#fff;color:#165b45;cursor:pointer}.reader-content{padding:28px 42px 36px}.reader-meta,.reader-author{font-size:12px;line-height:1.7;color:#65736e}.reader-content h2{font:34px/1.25 Georgia,serif;color:#233b35;margin:14px 0}.reader-image{width:100%;max-height:330px;object-fit:cover;margin:24px 0;border-radius:4px}.takeaway{padding:19px 22px;background:#edf3e5;border-left:3px solid #8ea562}.takeaway strong{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#165b45}.takeaway p{font:17px/1.65 Georgia,serif;margin:8px 0 0}.article-body{font:16px/1.95 Tahoma,Arial,sans-serif;color:#44594f;padding-top:8px}.article-body p{margin:22px 0;white-space:pre-line}.reader-footer{border-top:1px solid #d7e1d2;padding-top:22px;display:flex;align-items:center;gap:16px;flex-wrap:wrap}.reader-footer>span{font-size:12px;color:#65736e}
  @media(max-width:1000px){.journal-layout{grid-template-columns:minmax(0,1fr) 245px;gap:20px}.article-row{display:block}.article-image{width:100%;height:170px}.article-image img{height:170px;min-height:0}.article-copy{padding:20px}}
  @media(max-width:700px){.blog-page{padding:30px 0 48px}.page-intro{display:block}.rss-link{margin-top:20px}.journal-layout{grid-template-columns:1fr}.journal-aside{grid-template-columns:1fr 1fr}.search-panel{padding:14px}.article-image{height:190px}.article-image img{height:190px}.reader-content{padding:20px 22px 28px}.reader-content h2{font-size:28px}.article-body{font-size:15px}.reader-toolbar{padding:10px 16px}}
  @media(max-width:480px){.journal-aside{grid-template-columns:1fr}.article-bottom{align-items:flex-end}.reader-content h2{font-size:25px}}
</style>
