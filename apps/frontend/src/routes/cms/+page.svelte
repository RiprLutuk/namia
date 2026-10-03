<script lang="ts">
  import CmsShell from "$lib/components/cms/CmsShell.svelte";
  import CmsOverview from "$lib/components/cms/CmsOverview.svelte";
  import CollectionView from "$lib/components/cms/CollectionView.svelte";
  import EditorDialog from "$lib/components/cms/EditorDialog.svelte";
  import BrandingEditor from "$lib/components/cms/BrandingEditor.svelte";
  import HeroEditor from "$lib/components/cms/HeroEditor.svelte";
  import InvestorEditor from "$lib/components/cms/InvestorEditor.svelte";

  import AccountAccess from "$lib/components/AccountAccess.svelte";
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { cmsNavigation, type CmsTab } from "$lib/components/cms/navigation";
  import { page } from "$app/state";
  import {
    cmsStore,
    fetchCmsContent,
    updateSiteSettings,
    updateHeroContent,
    updateStat,
    createStat,
    deleteStat,
    createProduct,
    updateProduct,
    deleteProduct,
    createArticle,
    updateArticle,
    deleteArticle,
    createPersonil,
    updatePersonil,
    deletePersonil,
    createFaq,
    updateFaq,
    deleteFaq,
    createTestimonial,
    deleteTestimonial,
    updateInvestorInfo,
    resetCmsToDefaults,
    type ProductData,
    type StatData,
    type BlogPostData,
    type PersonilData,
    type FaqData,
    type TestimonialData,
    type InvestorInfo,
  } from "$lib/cms";
  import { Sparkles, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-svelte";

  let activeTab = $state<CmsTab>("overview");
  $effect(() => {
    const tab = page.url.searchParams.get("tab");
    activeTab = cmsNavigation.flatMap((group) => [...group.items]).some((item) => item.id === tab)
      ? (tab as CmsTab)
      : "overview";
  });
  function selectTab(tab: CmsTab) {
    activeTab = tab;
    void goto(`/cms?tab=${tab}`, { replaceState: true, noScroll: true });
  }

  // Notification Toast
  let toast = $state<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  let toastTimer: ReturnType<typeof setTimeout>;

  onDestroy(() => clearTimeout(toastTimer));

  function showToast(message: string, type: "success" | "error" | "info" = "success") {
    clearTimeout(toastTimer);
    toast = { message, type };
    toastTimer = setTimeout(() => {
      toast = null;
    }, 4000);
  }

  // Local editable copies of site settings, hero & investor
  let settingsForm = $state({ ...$cmsStore.siteSettings });
  let heroForm = $state({ ...$cmsStore.heroContent });
  let investorForm = $state<InvestorInfo>(JSON.parse(JSON.stringify($cmsStore.investorInfo || {})));

  // Keep local copies in sync when store changes initially
  $effect(() => {
    settingsForm = { ...$cmsStore.siteSettings };
    heroForm = { ...$cmsStore.heroContent };
    if ($cmsStore.investorInfo) {
      investorForm = JSON.parse(JSON.stringify($cmsStore.investorInfo));
    }
  });

  // Modals for editing/creating items
  let editingProduct = $state<ProductData | null>(null);
  let isNewProductModal = $state(false);
  let newProduct = $state<Omit<ProductData, "id">>({
    name: "",
    provider: "Namia Syariah",
    categoryId: 1,
    categorySlug: "p2p-lending",
    adminFee: 0,
    rating: 0,
    slug: "",
    contractType: "Murabahah",
    tagline: "",
    description: "",
    minAmount: 5_000_000,
    maxAmount: 50_000_000,
    minTenorMonths: 3,
    maxTenorMonths: 12,
    interestRateAnnual: 8.5,
    logo: "/images/products/namia_murabahah_goods.jpg",
    features: ["Bebas Riba & Denda", "Proses Cepat 1-3 Hari"],
    status: "active",
    applyUrl: "/borrower",
  });

  // Stat Modal
  let editingStat = $state<StatData | null>(null);
  let isNewStatModal = $state(false);
  let newStat = $state<Omit<StatData, "id">>({
    metricKey: "tkb90",
    label: "Tingkat Keberhasilan Bayar (TKB90)",
    value: "100%",
    sublabel: "Mitigasi risiko teruji",
    category: "borrower",
    icon: "ShieldCheck",
    order: 1,
  });

  // Article Modal
  let editingArticle = $state<BlogPostData | null>(null);
  let isNewArticleModal = $state(false);
  let newArticle = $state<Omit<BlogPostData, "id">>({
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    coverImage: "/images/blog/grid/17.jpg",
    category: "Akad Syariah",
    author: "Tim Ahli Namia Syariah",
    publishedAt: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    tags: ["fintech", "syariah", "edukasi"],
  });

  // FAQ Modal
  let editingFaq = $state<FaqData | null>(null);
  let isNewFaqModal = $state(false);
  let newFaq = $state<Omit<FaqData, "id">>({
    category: "borrower",
    question: "",
    answer: "",
    order: 1,
  });

  // Testimonial Modal
  let isNewTestimonialModal = $state(false);
  let newTestimonial = $state<Omit<TestimonialData, "id">>({
    name: "",
    businessName: "",
    role: "borrower",
    content: "",
    rating: 5,
    fundedAmount: "Rp 50.000.000",
    avatar: "/images/team/p_putri_sq.jpeg",
  });

  // Team Member Modal
  let editingPersonil = $state<PersonilData | null>(null);
  let isNewPersonilModal = $state(false);
  let newPersonil = $state<Omit<PersonilData, "id">>({
    fullname: "",
    job_title: "",
    job_level: 1,
    education: "",
    photo: "/images/team/p_endi_dps_sq.jpeg",
    biography: "",
  });

  onMount(() => {
    void fetchCmsContent(true);
  });

  const handleSaveSettings = withMutation(async () => {
    await updateSiteSettings(settingsForm);
    showToast("Identitas dan kontak berhasil disimpan.");
  });
  const handleSaveHero = withMutation(async () => {
    await updateHeroContent(heroForm);
    showToast("Konten beranda berhasil disimpan.");
  });
  const handleSaveInvestor = withMutation(async () => {
    await updateInvestorInfo(investorForm);
    showToast("Halaman pendanaan berhasil disimpan.");
  });
  const handleResetDefaults = withMutation(async () => {
    if (
      !confirm("Pulihkan semua konten website ke kondisi awal? Perubahan konten Anda akan diganti.")
    )
      return;
    await resetCmsToDefaults();
    showToast("Konten awal berhasil dipulihkan.");
  });
  async function handleRefresh() {
    await fetchCmsContent(true);
    showToast(
      $cmsStore.error ? "Konten gagal dimuat. Coba lagi." : "Konten berhasil dimuat ulang.",
      $cmsStore.error ? "error" : "info",
    );
  }

  let mutationPending = $state(false);
  function withMutation<Args extends unknown[]>(operation: (...args: Args) => Promise<void>) {
    return async (...args: Args) => {
      if (mutationPending) return;
      mutationPending = true;
      try {
        await operation(...args);
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Perubahan gagal disimpan.", "error");
      } finally {
        mutationPending = false;
      }
    };
  }

  // Helpers for Products
  const handleSaveNewProduct = withMutation(async () => {
    if (!newProduct.name || !newProduct.description) {
      alert("Nama dan deskripsi produk wajib diisi!");
      return;
    }
    const slug = newProduct.slug || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await createProduct({ ...newProduct, slug });
    isNewProductModal = false;
    showToast(`Produk "${newProduct.name}" berhasil ditambahkan!`);
  });

  const handleUpdateProduct = withMutation(async () => {
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, editingProduct);
    editingProduct = null;
    showToast("Produk berhasil diperbarui!");
  });

  const handleDeleteProduct = withMutation(async (id: number, name: string) => {
    if (confirm(`Hapus produk "${name}"?`)) {
      await deleteProduct(id);
      showToast(`Produk "${name}" berhasil dihapus.`);
    }
  });

  // Helpers for Stats
  const handleSaveNewStat = withMutation(async () => {
    await createStat(newStat);
    isNewStatModal = false;
    showToast("Metrik statistik baru berhasil ditambahkan!");
  });

  const handleUpdateStat = withMutation(async () => {
    if (!editingStat) return;
    await updateStat(editingStat.id, editingStat);
    editingStat = null;
    showToast("Metrik statistik berhasil diperbarui!");
  });

  const handleDeleteStat = withMutation(async (id: number) => {
    if (confirm("Hapus metrik statistik ini?")) {
      await deleteStat(id);
      showToast("Metrik statistik berhasil dihapus.");
    }
  });

  // Helpers for Articles
  const handleSaveNewArticle = withMutation(async () => {
    if (!newArticle.title || !newArticle.content) {
      alert("Judul dan isi artikel wajib diisi!");
      return;
    }
    const slug = newArticle.slug || newArticle.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await createArticle({ ...newArticle, slug });
    isNewArticleModal = false;
    showToast(`Artikel "${newArticle.title}" berhasil dipublikasikan!`);
  });

  const handleUpdateArticle = withMutation(async () => {
    if (!editingArticle) return;
    await updateArticle(editingArticle.id, editingArticle);
    editingArticle = null;
    showToast("Artikel berhasil diperbarui!");
  });

  const handleDeleteArticle = withMutation(async (id: number, title: string) => {
    if (confirm(`Hapus artikel "${title}"?`)) {
      await deleteArticle(id);
      showToast(`Artikel "${title}" berhasil dihapus.`);
    }
  });

  // Helpers for FAQs
  const handleSaveNewFaq = withMutation(async () => {
    if (!newFaq.question || !newFaq.answer) {
      alert("Pertanyaan dan jawaban FAQ wajib diisi!");
      return;
    }
    await createFaq(newFaq);
    isNewFaqModal = false;
    showToast("FAQ baru berhasil ditambahkan!");
  });

  const handleUpdateFaq = withMutation(async () => {
    if (!editingFaq) return;
    await updateFaq(editingFaq.id, editingFaq);
    editingFaq = null;
    showToast("FAQ berhasil diperbarui!");
  });

  const handleDeleteFaq = withMutation(async (id: number) => {
    if (confirm("Hapus FAQ ini?")) {
      await deleteFaq(id);
      showToast("FAQ berhasil dihapus.");
    }
  });

  // Helpers for Testimonials
  const handleSaveNewTestimonial = withMutation(async () => {
    if (!newTestimonial.name || !newTestimonial.content) {
      alert("Nama dan isi ulasan testimoni wajib diisi!");
      return;
    }
    await createTestimonial(newTestimonial);
    isNewTestimonialModal = false;
    showToast(`Testimoni dari "${newTestimonial.name}" berhasil ditambahkan!`);
  });

  const handleDeleteTestimonial = withMutation(async (id: number, name: string) => {
    if (confirm(`Hapus ulasan testimoni dari "${name}"?`)) {
      await deleteTestimonial(id);
      showToast("Testimoni berhasil dihapus.");
    }
  });

  // Helpers for Team
  const handleSaveNewPersonil = withMutation(async () => {
    if (!newPersonil.fullname || !newPersonil.job_title) {
      alert("Nama lengkap dan jabatan wajib diisi!");
      return;
    }
    await createPersonil(newPersonil);
    isNewPersonilModal = false;
    showToast(`Personil "${newPersonil.fullname}" berhasil ditambahkan!`);
  });

  const handleUpdatePersonil = withMutation(async () => {
    if (!editingPersonil) return;
    await updatePersonil(editingPersonil.id, editingPersonil);
    editingPersonil = null;
    showToast("Data personil berhasil diperbarui!");
  });

  const handleDeletePersonil = withMutation(async (id: number, fullname: string) => {
    if (confirm(`Hapus personil "${fullname}"?`)) {
      await deletePersonil(id);
      showToast(`Personil "${fullname}" berhasil dihapus.`);
    }
  });
</script>

<svelte:head>
  <title>Ruang Editor · Namia Syariah</title>
  <!-- Strict Anti-Crawler Meta Tags: Google & Bing Disallowed -->
  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
  <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
</svelte:head>
<AccountAccess role="admin">
  {#if !$cmsStore.isLoaded || $cmsStore.isSyncing}
    <p class="p-8" role="status">Memuat konten terbaru…</p>
  {:else if $cmsStore.error}
    <div class="p-8" role="alert">
      <p>Konten belum dapat dimuat dari server.</p>
      <button type="button" onclick={() => fetchCmsContent(true)}>Coba lagi</button>
    </div>
  {:else}
    <CmsShell bind:activeTab onrefresh={handleRefresh} onreset={handleResetDefaults}>
      <!-- TOAST FEEDBACK -->
      {#if toast}
        <div
          role="status"
          aria-live="polite"
          class="fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-sm border text-sm font-medium animate-in slide-in-from-bottom-5 {toast.type ===
          'success'
            ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
            : toast.type === 'error'
              ? 'bg-rose-900 text-rose-100 border-rose-700'
              : 'bg-white text-slate-800 border-slate-200'}"
        >
          {#if toast.type === "success"}
            <CheckCircle2 class="w-5 h-5 text-emerald-700 shrink-0" />
          {:else if toast.type === "error"}
            <AlertCircle class="w-5 h-5 text-rose-400 shrink-0" />
          {:else}
            <Sparkles class="w-5 h-5 text-amber-400 shrink-0" />
          {/if}
          <span>{toast.message}</span>
        </div>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 0: DASHBOARD OVERVIEW -->
      <!-- ========================================================= -->
      {#if activeTab === "overview"}
        <CmsOverview
          counts={{
            products: $cmsStore.products.length,
            articles: $cmsStore.blogPosts.length,
            faqs: $cmsStore.faqs.length,
            team: $cmsStore.team.length,
          }}
          onselect={selectTab}
          onproduct={() => (isNewProductModal = true)}
          onarticle={() => (isNewArticleModal = true)}
        />
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 1: IDENTITAS & LEGALITAS -->
      <!-- ========================================================= -->
      {#if activeTab === "branding"}<BrandingEditor
          bind:settingsForm
          onsave={handleSaveSettings}
          busy={mutationPending}
        />{/if}

      <!-- ========================================================= -->
      <!-- TAB 2: HERO & TICKER -->
      <!-- ========================================================= -->
      {#if activeTab === "hero"}<HeroEditor
          bind:heroForm
          onsave={handleSaveHero}
          busy={mutationPending}
        />{/if}

      <!-- ========================================================= -->
      <!-- TAB: PORTAL PENDANAAN INVESTOR -->
      <!-- ========================================================= -->
      {#if activeTab === "investor"}<InvestorEditor
          bind:investorForm
          onsave={handleSaveInvestor}
          busy={mutationPending}
        />{/if}

      <!-- ========================================================= -->
      <!-- TAB 3: METRIK & STATISTIK -->
      <!-- ========================================================= -->
      {#if activeTab === "stats"}
        <CollectionView
          title="Statistik"
          description="Kelola angka dan keterangan yang ditampilkan di website."
          items={$cmsStore.stats}
          searchText={(item) => `${item.label} ${item.value}`}
          oncreate={() => (isNewStatModal = true)}
          createLabel="Tambah Statistik"
        >
          {#snippet row(item)}
            <div class="entry-copy">
              <div class="entry-meta">{item.value || item.amount} {item.unit || ""}</div>
              <h2>{item.label || item.title}</h2>
              <p class="line-clamp-2">{item.sublabel || item.subtitle || ""}</p>
            </div>
            <div class="entry-actions">
              <button
                aria-label={`Edit ${item.label}`}
                onclick={() => (editingStat = JSON.parse(JSON.stringify(item)))}>Edit</button
              ><button
                class="danger"
                disabled={mutationPending}
                onclick={() => handleDeleteStat(item.id)}>Hapus</button
              >
            </div>
          {/snippet}
        </CollectionView>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 4: PRODUK PEMBIAYAAN -->
      <!-- ========================================================= -->
      {#if activeTab === "products"}
        <CollectionView
          title="Produk pembiayaan"
          description="Atur informasi produk, akad, dan kisaran pembiayaan."
          items={$cmsStore.products}
          searchText={(item) => `${item.name} ${item.contractType} ${item.provider}`}
          oncreate={() => (isNewProductModal = true)}
          createLabel="Tambah Produk"
        >
          {#snippet row(item)}
            <div class="entry-copy">
              <div class="entry-meta">{item.contractType} · {item.provider}</div>
              <h2>{item.name}</h2>
              <p class="line-clamp-2">{item.description}</p>
            </div>
            <div class="entry-actions">
              <button
                aria-label={`Edit ${item.name}`}
                onclick={() => (editingProduct = JSON.parse(JSON.stringify(item)))}>Edit</button
              ><button
                class="danger"
                disabled={mutationPending}
                onclick={() => handleDeleteProduct(item.id, item.name)}>Hapus</button
              >
            </div>
          {/snippet}
        </CollectionView>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 5: ARTIKEL & BLOG -->
      <!-- ========================================================= -->
      {#if activeTab === "articles"}
        <CollectionView
          title="Artikel & blog"
          description="Kelola tulisan edukasi dan kabar Namia."
          items={$cmsStore.blogPosts}
          searchText={(item) => `${item.title} ${item.category} ${item.author}`}
          oncreate={() => (isNewArticleModal = true)}
          createLabel="Tulis Artikel Baru"
        >
          {#snippet row(item)}
            <div class="entry-copy">
              <div class="entry-meta">{item.category} · {item.author}</div>
              <h2>{item.title}</h2>
              <p class="line-clamp-2">{item.excerpt}</p>
            </div>
            <div class="entry-actions">
              <button
                aria-label={`Edit ${item.title}`}
                onclick={() => (editingArticle = JSON.parse(JSON.stringify(item)))}>Edit</button
              ><button
                class="danger"
                disabled={mutationPending}
                onclick={() => handleDeleteArticle(item.id, item.title)}>Hapus</button
              >
            </div>
          {/snippet}
        </CollectionView>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 6: DEWAN & TIM PERSONIL -->
      <!-- ========================================================= -->
      {#if activeTab === "team"}
        <CollectionView
          title="Dewan & tim"
          description="Perbarui profil, jabatan, dan pengalaman tim Namia."
          items={$cmsStore.team}
          searchText={(item) => `${item.fullname} ${item.job_title} ${item.department}`}
          oncreate={() => (isNewPersonilModal = true)}
          createLabel="Tambah Personil"
        >
          {#snippet row(item)}
            <div class="entry-copy">
              <div class="entry-meta">{item.job_title || item.jobTitle}</div>
              <h2>{item.fullname || item.fullName}</h2>
              <p class="line-clamp-2">{item.biography}</p>
            </div>
            <div class="entry-actions">
              <button
                aria-label={`Edit ${item.fullname}`}
                onclick={() => (editingPersonil = JSON.parse(JSON.stringify(item)))}>Edit</button
              ><button
                class="danger"
                disabled={mutationPending}
                onclick={() => handleDeletePersonil(item.id, item.fullname)}>Hapus</button
              >
            </div>
          {/snippet}
        </CollectionView>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 7: FAQS -->
      <!-- ========================================================= -->
      {#if activeTab === "faqs"}
        <CollectionView
          title="FAQ"
          description="Bantu pengunjung menemukan jawaban yang jelas."
          items={$cmsStore.faqs}
          searchText={(item) => `${item.question} ${item.answer} ${item.category}`}
          oncreate={() => (isNewFaqModal = true)}
          createLabel="Tambah FAQ Baru"
        >
          {#snippet row(item)}
            <div class="entry-copy">
              <div class="entry-meta">{item.categoryName || item.category}</div>
              <h2>{item.question}</h2>
              <p class="line-clamp-2">{item.answer}</p>
            </div>
            <div class="entry-actions">
              <button
                aria-label={`Edit ${item.question}`}
                onclick={() => (editingFaq = JSON.parse(JSON.stringify(item)))}>Edit</button
              ><button
                class="danger"
                disabled={mutationPending}
                onclick={() => handleDeleteFaq(item.id)}>Hapus</button
              >
            </div>
          {/snippet}
        </CollectionView>
      {/if}

      <!-- ========================================================= -->
      <!-- TAB 8: TESTIMONI -->
      <!-- ========================================================= -->
      {#if activeTab === "testimonials"}
        <CollectionView
          title="Testimoni"
          description="Kelola pengalaman yang dibagikan mitra Namia."
          items={$cmsStore.testimonials}
          searchText={(item) => `${item.name} ${item.businessName} ${item.content}`}
          oncreate={() => (isNewTestimonialModal = true)}
          createLabel="Tambah Testimoni"
        >
          {#snippet row(item)}
            <div class="entry-copy">
              <div class="entry-meta">{item.businessName} · {item.role}</div>
              <h2>{item.name}</h2>
              <p class="line-clamp-2">{item.content}</p>
            </div>
            <div class="entry-actions">
              <button
                class="danger"
                disabled={mutationPending}
                onclick={() => handleDeleteTestimonial(item.id, item.name)}>Hapus</button
              >
            </div>
          {/snippet}
        </CollectionView>
      {/if}
    </CmsShell>

    <!-- ========================================================= -->
    <!-- MODAL DIALOGS FOR CREATING/EDITING CONTENT -->
    <!-- ========================================================= -->

    <!-- 1. PRODUCT CREATE / EDIT MODAL -->
    {#if isNewProductModal || editingProduct}
      {@const isEdit = !!editingProduct}
      {@const target = editingProduct ?? newProduct}
      <EditorDialog
        title={isEdit ? "Edit Produk Pembiayaan" : "Tambah Produk Pembiayaan"}
        onclose={() => {
          isNewProductModal = false;
          editingProduct = null;
        }}
        onsave={isEdit ? handleUpdateProduct : handleSaveNewProduct}
        saveLabel={isEdit ? "Simpan Perubahan" : "Tambahkan Produk"}
        busy={mutationPending}
      >
        <div class="space-y-3 text-xs">
          <div>
            <label for="cms-field-1" class="block font-semibold text-slate-700 mb-1"
              >Nama Produk</label
            >
            <input
              id="cms-field-1"
              type="text"
              bind:value={target.name}
              placeholder="Contoh: Pembiayaan Pengadaan Barang"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:border-emerald-600 outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="cms-field-2" class="block font-semibold text-slate-700 mb-1"
                >Jenis Akad Syariah</label
              >
              <select
                id="cms-field-2"
                bind:value={target.contractType}
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:border-emerald-600 outline-none"
              >
                <option value="Murabahah">Murabahah (Jual Beli)</option>
                <option value="Musyarakah">Musyarakah (Kemitraan Modal)</option>
                <option value="Ijarah">Ijarah (Sewa / Manfaat)</option>
                <option value="Qardh">Qardh al-Hasan (Sosial/Kebajikan)</option>
                <option value="Mudharabah">Mudharabah (Bagi Hasil)</option>
              </select>
            </div>
            <div>
              <label for="cms-field-3" class="block font-semibold text-slate-700 mb-1"
                >Margin / Bagi Hasil (% p.a.)</label
              >
              <input
                id="cms-field-3"
                type="number"
                step="0.1"
                bind:value={target.interestRateAnnual}
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:border-emerald-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label for="cms-field-4" class="block font-semibold text-slate-700 mb-1"
              >Deskripsi Produk</label
            >
            <textarea
              id="cms-field-4"
              rows="3"
              bind:value={target.description}
              placeholder="Uraikan peruntukan modal dan manfaat bagi mitra..."
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:border-emerald-600 outline-none"
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="cms-field-5" class="block font-semibold text-slate-700 mb-1"
                >Plafon Minimal (Rp)</label
              >
              <input
                id="cms-field-5"
                type="number"
                bind:value={target.minAmount}
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
              />
            </div>
            <div>
              <label for="cms-field-6" class="block font-semibold text-slate-700 mb-1"
                >Plafon Maksimal (Rp)</label
              >
              <input
                id="cms-field-6"
                type="number"
                bind:value={target.maxAmount}
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="cms-field-7" class="block font-semibold text-slate-700 mb-1"
                >Tenor Minimal (Bulan)</label
              >
              <input
                id="cms-field-7"
                type="number"
                bind:value={target.minTenorMonths}
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
              />
            </div>
            <div>
              <label for="cms-field-8" class="block font-semibold text-slate-700 mb-1"
                >Tenor Maksimal (Bulan)</label
              >
              <input
                id="cms-field-8"
                type="number"
                bind:value={target.maxTenorMonths}
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
              />
            </div>
          </div>

          <div>
            <label for="cms-field-9" class="block font-semibold text-slate-700 mb-1"
              >URL Gambar / Foto Produk</label
            >
            <input
              id="cms-field-9"
              type="text"
              bind:value={target.logo}
              placeholder="/images/products/namia_murabahah_goods.jpg"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>
        </div>
      </EditorDialog>
    {/if}

    <!-- 2. STAT MODAL -->
    {#if isNewStatModal || editingStat}
      {@const isEdit = !!editingStat}
      {@const target = editingStat ?? newStat}
      <EditorDialog
        title={isEdit ? "Edit Statistik" : "Tambah Statistik"}
        onclose={() => {
          isNewStatModal = false;
          editingStat = null;
        }}
        onsave={isEdit ? handleUpdateStat : handleSaveNewStat}
        saveLabel={isEdit ? "Simpan Perubahan" : "Tambahkan Statistik"}
        busy={mutationPending}
      >
        <div class="space-y-3 text-xs">
          <div>
            <label for="cms-field-10" class="block font-semibold text-slate-700 mb-1"
              >Key Metrik</label
            >
            <input
              id="cms-field-10"
              type="text"
              bind:value={target.metricKey}
              placeholder="tkb90, total_funded, dll"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>
          <div>
            <label for="cms-field-11" class="block font-semibold text-slate-700 mb-1"
              >Nilai Tampilan (Headline Value)</label
            >
            <input
              id="cms-field-11"
              type="text"
              bind:value={target.value}
              placeholder="Contoh: 100% atau Rp 48,5 Miliar"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-bold text-slate-900 outline-none"
            />
          </div>
          <div>
            <label for="cms-field-12" class="block font-semibold text-slate-700 mb-1"
              >Label Deskriptif</label
            >
            <input
              id="cms-field-12"
              type="text"
              bind:value={target.label}
              placeholder="Contoh: Tingkat Keberhasilan Bayar (TKB90)"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>
          <div>
            <label for="cms-field-13" class="block font-semibold text-slate-700 mb-1"
              >Sublabel Keterangan</label
            >
            <input
              id="cms-field-13"
              type="text"
              bind:value={target.sublabel}
              placeholder="Contoh: Mitigasi risiko teruji per Desember 2025"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>
        </div>
      </EditorDialog>
    {/if}

    <!-- 3. ARTICLE MODAL -->
    {#if isNewArticleModal || editingArticle}
      {@const isEdit = !!editingArticle}
      {@const target = editingArticle ?? newArticle}
      <EditorDialog
        title={isEdit ? "Edit Artikel" : "Tambah Artikel"}
        onclose={() => {
          isNewArticleModal = false;
          editingArticle = null;
        }}
        onsave={isEdit ? handleUpdateArticle : handleSaveNewArticle}
        saveLabel={isEdit ? "Simpan Perubahan" : "Tambahkan Artikel"}
        busy={mutationPending}
      >
        <div class="space-y-3 text-xs">
          <div>
            <label for="cms-field-14" class="block font-semibold text-slate-700 mb-1"
              >Judul Artikel</label
            >
            <input
              id="cms-field-14"
              type="text"
              bind:value={target.title}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:border-emerald-600 outline-none font-bold"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="cms-field-15" class="block font-semibold text-slate-700 mb-1"
                >Kategori</label
              >
              <select
                id="cms-field-15"
                bind:value={target.category}
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
              >
                <option value="Akad Syariah">Akad Syariah</option>
                <option value="Bisnis UMKM">Bisnis UMKM</option>
                <option value="Sukuk & Investasi">Sukuk & Investasi</option>
                <option value="Kemitraan">Kemitraan</option>
                <option value="Karir & Kultur">Karir & Kultur</option>
                <option value="Kisah Inspiratif">Kisah Inspiratif</option>
              </select>
            </div>
            <div>
              <label for="cms-field-16" class="block font-semibold text-slate-700 mb-1"
                >Penulis / Penanggung Jawab</label
              >
              <input
                id="cms-field-16"
                type="text"
                bind:value={target.author}
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
              />
            </div>
          </div>

          <div>
            <label for="cms-field-17" class="block font-semibold text-slate-700 mb-1"
              >Ringkasan Intisari (Excerpt)</label
            >
            <textarea
              id="cms-field-17"
              rows="2"
              bind:value={target.excerpt}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            ></textarea>
          </div>

          <div>
            <label for="cms-field-18" class="block font-semibold text-slate-700 mb-1"
              >Konten Lengkap (Paragraf terpisah 2x enter)</label
            >
            <textarea
              id="cms-field-18"
              rows="8"
              bind:value={target.content}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none font-mono text-[11px]"
            ></textarea>
          </div>

          <div>
            <label for="cms-field-19" class="block font-semibold text-slate-700 mb-1"
              >URL Cover Image</label
            >
            <input
              id="cms-field-19"
              type="text"
              bind:value={target.coverImage}
              placeholder="/images/blog/grid/17.jpg"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>
        </div>
      </EditorDialog>
    {/if}

    <!-- 4. FAQ MODAL -->
    {#if isNewFaqModal || editingFaq}
      {@const isEdit = !!editingFaq}
      {@const target = editingFaq ?? newFaq}
      <EditorDialog
        title={isEdit ? "Edit FAQ" : "Tambah FAQ"}
        onclose={() => {
          isNewFaqModal = false;
          editingFaq = null;
        }}
        onsave={isEdit ? handleUpdateFaq : handleSaveNewFaq}
        saveLabel={isEdit ? "Simpan Perubahan" : "Tambahkan FAQ"}
        busy={mutationPending}
      >
        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="cms-field-20" class="block font-semibold text-slate-700 mb-1"
                >Kategori Sasaran</label
              >
              <select
                id="cms-field-20"
                bind:value={target.category}
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
              >
                <option value="borrower">Penerima Pembiayaan (Borrower)</option>
                <option value="investor">Pendana / Investor</option>
                <option value="syariah">Kaidah Fiqih Syariah</option>
              </select>
            </div>
            <div>
              <label for="cms-field-21" class="block font-semibold text-slate-700 mb-1"
                >Urutan Tampil</label
              >
              <input
                id="cms-field-21"
                type="number"
                bind:value={target.order}
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
              />
            </div>
          </div>

          <div>
            <label for="cms-field-22" class="block font-semibold text-slate-700 mb-1"
              >Pertanyaan</label
            >
            <input
              id="cms-field-22"
              type="text"
              bind:value={target.question}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none font-bold"
            />
          </div>

          <div>
            <label for="cms-field-23" class="block font-semibold text-slate-700 mb-1"
              >Jawaban Lengkap</label
            >
            <textarea
              id="cms-field-23"
              rows="4"
              bind:value={target.answer}
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            ></textarea>
          </div>
        </div>
      </EditorDialog>
    {/if}

    <!-- 5. TESTIMONIAL MODAL -->
    {#if isNewTestimonialModal}
      {@const target = newTestimonial}
      <EditorDialog
        title="Tambah Testimoni"
        onclose={() => {
          isNewTestimonialModal = false;
        }}
        onsave={handleSaveNewTestimonial}
        saveLabel="Tambahkan Testimoni"
        busy={mutationPending}
      >
        <div class="space-y-3 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="cms-field-24" class="block font-semibold text-slate-700 mb-1"
                >Nama Mitra / Pengguna</label
              >
              <input
                id="cms-field-24"
                type="text"
                bind:value={newTestimonial.name}
                placeholder="Contoh: Hendra Kurniawan"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
              />
            </div>
            <div>
              <label for="cms-field-25" class="block font-semibold text-slate-700 mb-1"
                >Nama Usaha / Profesi</label
              >
              <input
                id="cms-field-25"
                type="text"
                bind:value={newTestimonial.businessName}
                placeholder="Contoh: CV Logam Presisi Nusantara"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="cms-field-26" class="block font-semibold text-slate-700 mb-1"
                >Peran Pengguna</label
              >
              <select
                id="cms-field-26"
                bind:value={newTestimonial.role}
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
              >
                <option value="borrower">Penerima Pembiayaan (Borrower)</option>
                <option value="investor">Pendana (Investor)</option>
              </select>
            </div>
            <div>
              <label for="cms-field-27" class="block font-semibold text-slate-700 mb-1"
                >Rating Bintang (1-5)</label
              >
              <input
                id="cms-field-27"
                type="number"
                min="1"
                max="5"
                bind:value={newTestimonial.rating}
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
              />
            </div>
          </div>

          <div>
            <label for="cms-field-28" class="block font-semibold text-slate-700 mb-1"
              >Nominal Pembiayaan (Opsional)</label
            >
            <input
              id="cms-field-28"
              type="text"
              bind:value={newTestimonial.fundedAmount}
              placeholder="Rp 75.000.000 (Murabahah)"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>

          <div>
            <label for="cms-field-29" class="block font-semibold text-slate-700 mb-1"
              >Isi Testimoni / Pengalaman</label
            >
            <textarea
              id="cms-field-29"
              rows="3"
              bind:value={newTestimonial.content}
              placeholder="Ceritakan kepuasan bermuamalah tanpa riba di Namia Syariah..."
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            ></textarea>
          </div>
        </div>
      </EditorDialog>
    {/if}

    <!-- 6. PERSONIL MODAL -->
    {#if isNewPersonilModal || editingPersonil}
      {@const isEdit = !!editingPersonil}
      {@const target = editingPersonil ?? newPersonil}
      <EditorDialog
        title={isEdit ? "Edit Personil" : "Tambah Personil"}
        onclose={() => {
          isNewPersonilModal = false;
          editingPersonil = null;
        }}
        onsave={isEdit ? handleUpdatePersonil : handleSaveNewPersonil}
        saveLabel={isEdit ? "Simpan Perubahan" : "Tambahkan Personil"}
        busy={mutationPending}
      >
        <div class="space-y-3 text-xs">
          <div>
            <label for="cms-field-30" class="block font-semibold text-slate-700 mb-1"
              >Nama Lengkap &amp; Gelar</label
            >
            <input
              id="cms-field-30"
              type="text"
              bind:value={target.fullname}
              placeholder="DR. H. Endy M. Astiwara, MA"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none font-bold"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label for="cms-field-31" class="block font-semibold text-slate-700 mb-1"
                >Jabatan Resmi</label
              >
              <input
                id="cms-field-31"
                type="text"
                bind:value={target.job_title}
                placeholder="Dewan Pengawas Syariah"
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
              />
            </div>
            <div>
              <label for="cms-field-32" class="block font-semibold text-slate-700 mb-1"
                >Level Jabatan</label
              >
              <select
                id="cms-field-32"
                bind:value={target.job_level}
                class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
              >
                <option value={1}>1: Dewan Pengawas Syariah (DPS)</option>
                <option value={2}>2: Dewan Komisaris</option>
                <option value={3}>3: Jajaran Direksi</option>
                <option value={4}>4: Tim Operasional &amp; Manajemen</option>
              </select>
            </div>
          </div>

          <div>
            <label for="cms-field-33" class="block font-semibold text-slate-700 mb-1"
              >Latar Belakang Pendidikan</label
            >
            <input
              id="cms-field-33"
              type="text"
              bind:value={target.education}
              placeholder="UIN Syarif Hidayatullah Jakarta & Univ. Muhammadiyah"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>

          <div>
            <label for="cms-field-34" class="block font-semibold text-slate-700 mb-1"
              >URL Foto Profil</label
            >
            <input
              id="cms-field-34"
              type="text"
              bind:value={target.photo}
              placeholder="/images/team/p_endi_dps_sq.jpeg"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            />
          </div>

          <div>
            <label for="cms-field-35" class="block font-semibold text-slate-700 mb-1"
              >Biografi &amp; Pengalaman</label
            >
            <textarea
              id="cms-field-35"
              rows="4"
              bind:value={target.biography}
              placeholder="Tuliskan riwayat karir, sertifikasi, dan peran di Namia Syariah..."
              class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md outline-none"
            ></textarea>
          </div>
        </div>
      </EditorDialog>
    {/if}
  {/if}
</AccountAccess>
