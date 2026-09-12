<script lang="ts">
  import { onMount } from "svelte";
  import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Search,
    ExternalLink,
    MessageSquare,
    MessageCircle,
    Building2,
    ShieldCheck,
    HelpCircle,
    Sparkles,
    ArrowRight,
    X,
    Briefcase,
    FileText,
    Share2,
    AlertCircle,
  } from "lucide-svelte";
  import { cmsStore, fetchCmsContent } from "$lib/cms";
  import { API_BASE_URL, NAMIA_API_KEY } from "$lib/api";

  onMount(() => {
    fetchCmsContent();
  });

  let name = $state("");
  let email = $state("");
  let phone = $state("");
  let category = $state("Pertanyaan Umum");
  let subject = $state("");
  let message = $state("");
  let submitted = $state(false);

  // FAQ Filter State
  let activeFaqTab = $state<"all" | "borrower" | "investor">("all");
  let activeCategoryFilter = $state<string>("Semua");
  let searchQuery = $state("");
  let openFaqIds = $state<Set<number>>(new Set([1, 2]));

  function toggleFaq(id: number) {
    const next = new Set(openFaqIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    openFaqIds = next;
  }

  function expandAll() {
    const allIds = new Set<number>();
    filteredCategories.forEach((cat) =>
      cat.faqs.forEach((f) => allIds.add(f.id)),
    );
    openFaqIds = allIds;
  }

  function collapseAll() {
    openFaqIds = new Set();
  }

  // Derived filtered categories and questions directly from database via $cmsStore
  let allFaqs = $derived($cmsStore.faqs || []);

  let filteredCategories = $derived.by(() => {
    let list = allFaqs;

    if (activeFaqTab === "borrower") {
      list = list.filter((f) => !f.isInvestor);
    } else if (activeFaqTab === "investor") {
      list = list.filter((f) => f.isInvestor);
    }

    if (activeCategoryFilter !== "Semua") {
      list = list.filter(
        (f) => (f.categoryName || f.category) === activeCategoryFilter,
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (f) =>
          (f.question || f.q || "").toLowerCase().includes(q) ||
          (f.answer || f.a || "").toLowerCase().includes(q),
      );
    }

    // Group by category
    const map = new Map<string, any[]>();
    for (const f of list) {
      const cat = f.categoryName || f.category || "Umum";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push({
        id: f.id,
        question: f.question || f.q,
        answer: f.answer || f.a,
        isInvestor: f.isInvestor,
        categoryId: f.categoryId || 1,
      });
    }

    return Array.from(map.entries()).map(([catName, qas]) => ({
      id: qas[0]?.categoryId || 1,
      name: catName,
      isInvestor: qas[0]?.isInvestor ?? 0,
      faqs: qas,
    }));
  });

  // Total count of visible FAQs
  let totalVisibleFaqs = $derived.by(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.faqs.length, 0);
  });

  // Available unique category names based on tab
  let availableCategories = $derived.by(() => {
    let list = allFaqs;
    if (activeFaqTab === "borrower") {
      list = list.filter((f) => !f.isInvestor);
    } else if (activeFaqTab === "investor") {
      list = list.filter((f) => f.isInvestor);
    }
    const names = Array.from(
      new Set(list.map((f) => f.categoryName || f.category || "Umum")),
    );
    return ["Semua", ...names];
  });

  async function handleContactSubmit() {
    if (!name || !email || !message) return;
    try {
      await fetch(`${API_BASE_URL}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": NAMIA_API_KEY,
        },
        body: JSON.stringify({
          fullName: name,
          email,
          phone: phone || "080000000000",
          needCategory: category,
          targetAmount: 0,
          targetTenorMonths: 0,
          message: `${subject ? "[" + subject + "] " : ""}${message}`,
        }),
      });
      submitted = true;
    } catch (e) {
      submitted = true;
    }
  }
</script>

<svelte:head>
  <title>Pusat Bantuan, FAQ & Kontak Resmi | Namia Syariah</title>
  <meta
    name="description"
    content="Kanal kontak resmi dan pusat tanya jawab (FAQ) PT Namia Finansial Teknologi (Namia Syariah). Layanan konsultasi pendanaan dan pengajuan pembiayaan syariah."
  />
</svelte:head>

<div class="contacts-page">
  <!-- HERO SECTION: FULL-WIDTH TWITTER BOOTSTRAP 2.0 JUMBOTRON MASTHEAD -->
  <section class="jumbotron-masthead">
    <div class="container px-4">
      <div class="max-w-4xl mx-auto space-y-4 text-center">
        <!-- Trust Badge -->
        <div class="inline-flex items-center gap-2">
          <span class="badge badge-success px-3 py-1 font-bold text-xs">
            <Sparkles class="w-3.5 h-3.5 inline mr-1" />
            LAYANAN & BANTUAN RESMI &bull; PT NAMIA FINANSIAL TEKNOLOGI
          </span>
          <span class="badge badge-inverse hidden sm:inline-block text-xs py-1 px-3 font-bold">
            24/7 HELPDESK
          </span>
        </div>

        <h1>
          Pusat Bantuan, FAQ & <br />
          <span class="text-emerald-700">Kontak Resmi Namia</span>
        </h1>

        <p class="lead max-w-2xl mx-auto">
          Kami siap mendampingi perjalanan investasi halal dan permodalan usaha syariah Anda dengan pelayanan profesional, ramah, dan amanah.
        </p>

        <!-- Quick Metrics / Direct Contacts Ribbon inside Hero -->
        <div class="pt-4 max-w-4xl mx-auto">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <a
              href="tel:+622183782337"
              class="well well-white text-center p-3 mb-0 block border border-slate-300 shadow-xs hover:border-emerald-600 transition-colors"
            >
              <div class="w-7 h-7 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-1 text-emerald-700 mx-auto">
                <Phone class="w-3.5 h-3.5" />
              </div>
              <div class="text-xs sm:text-sm font-bold text-slate-800 font-mono">
                (+62) 21 8378 2337
              </div>
              <div class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                Telepon Kantor
              </div>
            </a>

            <a
              href="https://wa.me/6282297770619"
              target="_blank"
              rel="noopener noreferrer"
              class="well well-white text-center p-3 mb-0 block border border-slate-300 shadow-xs hover:border-emerald-600 transition-colors"
            >
              <div class="w-7 h-7 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-1 text-emerald-700 mx-auto">
                <MessageCircle class="w-3.5 h-3.5" />
              </div>
              <div class="text-xs sm:text-sm font-bold text-emerald-800 font-mono">
                +62 822-9777-0619
              </div>
              <div class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                WhatsApp CS Resmi
              </div>
            </a>

            <a
              href="mailto:salam@namia.id"
              class="well well-white text-center p-3 mb-0 block border border-slate-300 shadow-xs hover:border-emerald-600 transition-colors"
            >
              <div class="w-7 h-7 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-1 text-emerald-700 mx-auto">
                <Mail class="w-3.5 h-3.5" />
              </div>
              <div class="text-xs sm:text-sm font-bold text-slate-800 font-mono">
                salam@namia.id
              </div>
              <div class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                Email Resmi
              </div>
            </a>

            <a
              href="https://maps.google.com/maps?q=Menara%20MTH,%20Jakarta"
              target="_blank"
              rel="noopener noreferrer"
              class="well well-white text-center p-3 mb-0 block border border-slate-300 shadow-xs hover:border-emerald-600 transition-colors"
            >
              <div class="w-7 h-7 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-1 text-emerald-700 mx-auto">
                <MapPin class="w-3.5 h-3.5" />
              </div>
              <div class="text-xs sm:text-sm font-bold text-slate-800">
                Menara MTH Lt. 10
              </div>
              <div class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                Tebet, Jakarta Selatan
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- BREADCRUMB SUB-BAR -->
  <div class="bg-slate-100 border-b border-slate-200 py-2">
    <div class="container px-4">
      <ul class="breadcrumb mb-0">
        <li><a href="/">Beranda</a> <span class="divider">/</span></li>
        <li class="active">Pusat Bantuan, FAQ & Kontak Resmi &bull; PT Namia Finansial Teknologi</li>
      </ul>
    </div>
  </div>

  <!-- 4 DIRECT SERVICE CHANNELS -->
  <section class="py-12 bg-white border-b border-[#E5E5E5]">
    <div class="container space-y-8">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="label label-info text-xs uppercase tracking-wider mb-1">Saluran Bantuan Terpadu</span>
        <h2 class="text-2xl font-bold text-slate-900 uppercase">Pilih Layanan Sesuai Kebutuhan</h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Temukan kanal perwakilan tim Namia Syariah yang tepat untuk mempercepat penanganan informasi atau pertanyaan Anda.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Channel 1: Borrower Support -->
        <div class="panel panel-default p-4 space-y-3 flex flex-col justify-between mb-0 shadow-xs">
          <div class="space-y-2">
            <div class="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <Briefcase class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 uppercase">
              Layanan Penerima Dana
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-0">
              Bantuan pengajuan permodalan UMKM, penjelasan skema akad Murabahah/Ijarah, dan cek status verifikasi proposal.
            </p>
          </div>
          <div class="pt-2 border-t border-slate-100">
            <a href="/borrower" class="btn btn-default btn-mini w-100 font-bold uppercase">
              <span>Panduan Pembiayaan &rarr;</span>
            </a>
          </div>
        </div>

        <!-- Channel 2: Investor Support -->
        <div class="panel panel-default p-4 space-y-3 flex flex-col justify-between mb-0 shadow-xs">
          <div class="space-y-2">
            <div class="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <ShieldCheck class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 uppercase">
              Layanan Pendana (Investor)
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-0">
              Konsultasi portofolio proyek riil, bantuan pendaftaran akun diaspora internasional, dan jadwal pengembalian bagi hasil.
            </p>
          </div>
          <div class="pt-2 border-t border-slate-100">
            <a href="/investor" class="btn btn-default btn-mini w-100 font-bold uppercase">
              <span>Panduan Pendanaan &rarr;</span>
            </a>
          </div>
        </div>

        <!-- Channel 3: Institutional Partnership -->
        <div class="panel panel-default p-4 space-y-3 flex flex-col justify-between mb-0 shadow-xs">
          <div class="space-y-2">
            <div class="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <Building2 class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 uppercase">
              Kemitraan & Kelembagaan
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-0">
              Kerja sama korporasi, perbankan syariah, lembaga wakaf/sosial, institusi pendidikan, dan media partner.
            </p>
          </div>
          <div class="pt-2 border-t border-slate-100">
            <a href="mailto:salam@namia.id?subject=Kemitraan%20Kelembagaan%20Namia" class="btn btn-default btn-mini w-100 font-bold uppercase">
              <span>Kirim Proposal &rarr;</span>
            </a>
          </div>
        </div>

        <!-- Channel 4: Customer Care & Whistleblowing -->
        <div class="panel panel-default p-4 space-y-3 flex flex-col justify-between mb-0 shadow-xs">
          <div class="space-y-2">
            <div class="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <HelpCircle class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 uppercase">
              Pengaduan & Kepatuhan
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-0">
              Kanal resmi pengaduan konsumen berkeadilan dan kepatuhan syariah yang diawasi langsung DPS DSN-MUI.
            </p>
          </div>
          <div class="pt-2 border-t border-slate-100">
            <a href="#form-kontak" class="btn btn-default btn-mini w-100 font-bold uppercase">
              <span>Tulis Pengaduan &rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ SECTION WITH SMART SEARCH & TAB FILTERS -->
  <section id="faq" class="py-12 bg-slate-50 border-b border-[#E5E5E5]">
    <div class="container space-y-8">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="label label-success text-xs uppercase tracking-wider mb-1">Pertanyaan yang Sering Diajukan</span>
        <h2 class="text-2xl font-bold text-slate-900 uppercase">Pusat Informasi & FAQ</h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Temukan jawaban cepat atas pertanyaan seputar tata kelola, akad muamalah, proses seleksi mitra, dan keamanan dana di Namia Syariah.
        </p>
      </div>

      <!-- FAQ Search Bar & Main Segment Tabs -->
      <div class="panel panel-default p-4 shadow-xs space-y-3 mb-0">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <!-- Segment Tabs -->
          <div class="btn-group">
            <button
              type="button"
              onclick={() => {
                activeFaqTab = "all";
                activeCategoryFilter = "Semua";
              }}
              class="btn btn-small {activeFaqTab === 'all' ? 'btn-primary' : 'btn-default'}"
            >
              Semua Pertanyaan
            </button>
            <button
              type="button"
              onclick={() => {
                activeFaqTab = "borrower";
                activeCategoryFilter = "Semua";
              }}
              class="btn btn-small {activeFaqTab === 'borrower' ? 'btn-primary' : 'btn-default'}"
            >
              Pengguna Dana (Borrower)
            </button>
            <button
              type="button"
              onclick={() => {
                activeFaqTab = "investor";
                activeCategoryFilter = "Semua";
              }}
              class="btn btn-small {activeFaqTab === 'investor' ? 'btn-primary' : 'btn-default'}"
            >
              Pendana (Investor)
            </button>
          </div>

          <!-- Live Search Input -->
          <div class="relative w-full md:w-72">
            <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Cari topik atau kata kunci..."
              class="form-control input-sm pl-8 pr-7 w-100 text-xs"
            />
            {#if searchQuery}
              <button
                type="button"
                onclick={() => (searchQuery = "")}
                class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                aria-label="Hapus pencarian"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            {/if}
          </div>
        </div>

        <!-- Sub-Category Filter Chips & Controls -->
        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-xs">
          <div class="flex flex-wrap items-center gap-1">
            <span class="font-bold text-slate-600 uppercase text-[11px] mr-1">Kategori:</span>
            {#each availableCategories as c}
              <button
                type="button"
                onclick={() => (activeCategoryFilter = c)}
                class="btn btn-mini {activeCategoryFilter === c ? 'btn-inverse' : 'btn-default'}"
              >
                {c}
              </button>
            {/each}
          </div>

          <div class="flex items-center gap-2 text-[11px] text-slate-500">
            <span>Menampilkan <strong>{totalVisibleFaqs}</strong> tanya-jawab</span>
            <span>&bull;</span>
            <button
              type="button"
              onclick={expandAll}
              class="text-emerald-700 hover:underline font-semibold"
            >
              Buka Semua
            </button>
            <span>/</span>
            <button
              type="button"
              onclick={collapseAll}
              class="text-slate-600 hover:underline"
            >
              Tutup Semua
            </button>
          </div>
        </div>
      </div>

      <!-- FAQ Category Groups & Accordion Lists -->
      <div class="space-y-6">
        {#if filteredCategories.length === 0}
          <div class="well text-center p-8 space-y-2 mb-0">
            <Search class="w-8 h-8 text-slate-400 mx-auto" />
            <h4 class="text-sm font-bold text-slate-800 uppercase mb-0">
              Tidak Ditemukan Pertanyaan
            </h4>
            <p class="text-xs text-slate-500 max-w-md mx-auto mb-2">
              Tidak ada hasil yang sesuai dengan kata kunci "{searchQuery}". Silakan coba kata kunci lain atau gunakan formulir di bawah untuk menanyakan langsung.
            </p>
            <button
              type="button"
              onclick={() => {
                searchQuery = "";
                activeCategoryFilter = "Semua";
              }}
              class="btn btn-default btn-small"
            >
              Reset Filter Pencarian
            </button>
          </div>
        {:else}
          {#each filteredCategories as cat}
            <div class="space-y-3">
              <div class="flex items-center justify-between pb-1 border-b border-slate-300">
                <div class="flex items-center gap-2">
                  <span class="badge badge-success text-[10px]">KATEGORI</span>
                  <h3 class="text-sm font-bold text-slate-900 uppercase mb-0">
                    {cat.name}
                  </h3>
                  <span class="label {cat.isInvestor ? 'label-info' : 'label-default'} text-[10px]">
                    {cat.isInvestor ? "Investor" : "Borrower"}
                  </span>
                </div>
                <span class="text-xs text-slate-500 font-mono">({cat.faqs.length} pertanyaan)</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                {#each cat.faqs as item}
                  <div class="panel panel-default mb-0 shadow-2xs">
                    <button
                      type="button"
                      onclick={() => toggleFaq(item.id)}
                      class="w-100 p-3 text-left flex items-start justify-between gap-2 bg-white hover:bg-slate-50 transition-colors"
                    >
                      <span class="text-xs font-bold text-slate-800 leading-snug">
                        {item.question}
                      </span>
                      <div class="w-4 h-4 flex items-center justify-center shrink-0 text-slate-400">
                        {#if openFaqIds.has(item.id)}
                          <ChevronUp class="w-3.5 h-3.5 text-emerald-600" />
                        {:else}
                          <ChevronDown class="w-3.5 h-3.5" />
                        {/if}
                      </div>
                    </button>

                    {#if openFaqIds.has(item.id)}
                      <div class="p-3 text-xs text-slate-600 leading-relaxed border-t border-slate-200 bg-slate-50">
                        {@html item.answer}
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </section>

  <!-- INTEGRATED CONTACT FORM & OFFICE MAP LOCATION -->
  <section id="form-kontak" class="py-12 bg-white border-b border-[#E5E5E5]">
    <div class="container space-y-8">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="label label-info text-xs uppercase tracking-wider mb-1">Komunikasi Langsung</span>
        <h2 class="text-2xl font-bold text-slate-900 uppercase">Kirim Pesan & Kunjungi Kantor Kami</h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Silakan isi formulir di bawah ini atau kunjungi kantor operasional kami di jam kerja untuk berdiskusi tatap muka.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left: Direct Inquiry Form -->
        <div class="lg:col-span-7 panel panel-default p-5 sm:p-6 shadow-sm mb-0">
          {#if submitted}
            <div class="text-center py-8 space-y-3">
              <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
                <CheckCircle2 class="w-6 h-6" />
              </div>
              <h3 class="text-xl font-bold text-slate-900 uppercase mb-0">
                Pesan Anda Berhasil Terkirim!
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Jazakallahu khairan. Tim Customer Care Namia Syariah telah menerima pesan Anda dan akan menghubungi Anda kembali dalam kurun waktu 1x24 jam kerja.
              </p>
              <div class="pt-2">
                <button
                  type="button"
                  onclick={() => {
                    submitted = false;
                    name = "";
                    email = "";
                    phone = "";
                    subject = "";
                    message = "";
                  }}
                  class="btn btn-primary btn-small"
                >
                  Kirim Pesan Lainnya
                </button>
              </div>
            </div>
          {:else}
            <form
              onsubmit={(e) => {
                e.preventDefault();
                handleContactSubmit();
              }}
              class="space-y-3"
            >
              <div class="pb-2 border-b border-slate-200">
                <h3 class="text-base font-bold text-slate-900 uppercase mb-0">
                  Formulir Pesan Nasabah
                </h3>
                <span class="text-xs text-slate-500">
                  Semua informasi Anda dijamin kerahasiaannya sesuai ketentuan perlindungan data pribadi.
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="form-group mb-0">
                  <label for="contact-name" class="control-label text-xs font-bold uppercase">
                    Nama Lengkap *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    bind:value={name}
                    placeholder="Nama lengkap Anda"
                    class="form-control input-sm text-xs"
                  />
                </div>

                <div class="form-group mb-0">
                  <label for="contact-email" class="control-label text-xs font-bold uppercase">
                    Alamat Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    bind:value={email}
                    placeholder="nama@domain.com"
                    class="form-control input-sm text-xs"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="form-group mb-0">
                  <label for="contact-phone" class="control-label text-xs font-bold uppercase">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    bind:value={phone}
                    placeholder="0812xxxxxxx"
                    class="form-control input-sm text-xs"
                  />
                </div>

                <div class="form-group mb-0">
                  <label for="contact-category" class="control-label text-xs font-bold uppercase">
                    Kategori Keperluan
                  </label>
                  <select
                    id="contact-category"
                    bind:value={category}
                    class="form-control input-sm text-xs"
                  >
                    <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                    <option value="Pengajuan Pembiayaan (Borrower)">Pengajuan Pembiayaan (Borrower)</option>
                    <option value="Konsultasi Pendanaan (Investor)">Konsultasi Pendanaan (Investor)</option>
                    <option value="Kemitraan Strategis & Korporasi">Kemitraan Strategis & Korporasi</option>
                    <option value="Pengaduan & Pelayanan Konsumen">Pengaduan & Pelayanan Konsumen</option>
                  </select>
                </div>
              </div>

              <div class="form-group mb-0">
                <label for="contact-subject" class="control-label text-xs font-bold uppercase">
                  Subjek Pertanyaan
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  bind:value={subject}
                  placeholder="Contoh: Konsultasi Pembiayaan Modal Kerja Usaha Roti"
                  class="form-control input-sm text-xs"
                />
              </div>

              <div class="form-group mb-0">
                <label for="contact-message" class="control-label text-xs font-bold uppercase">
                  Pesan Lengkap *
                </label>
                <textarea
                  id="contact-message"
                  rows="4"
                  required
                  bind:value={message}
                  placeholder="Tuliskan secara rinci pertanyaan, kebutuhan pembiayaan, atau masukan Anda..."
                  class="form-control text-xs"
                ></textarea>
              </div>

              <div class="pt-2 flex items-center justify-between">
                <span class="text-[11px] text-slate-500">* Wajib diisi</span>
                <button
                  type="submit"
                  class="btn btn-primary btn-small font-bold uppercase flex items-center gap-1.5"
                >
                  <Send class="w-3.5 h-3.5 inline" />
                  <span>Kirimkan Pesan</span>
                </button>
              </div>
            </form>
          {/if}
        </div>

        <!-- Right: Office Address & Maps Card -->
        <div class="lg:col-span-5 space-y-4">
          <div class="panel panel-default overflow-hidden shadow-xs mb-0">
            <div class="relative h-40 overflow-hidden bg-slate-100 border-b border-slate-200">
              <img
                src="/images/about/menara_mth.jpg"
                alt="Menara MTH Kantor Pusat Namia"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black/40"></div>
              <div class="absolute bottom-2 left-3 right-3 text-white">
                <span class="badge badge-success text-[10px] uppercase">
                  Kantor Pusat Operasional
                </span>
                <h4 class="font-bold text-sm uppercase mt-1 mb-0">
                  PT Namia Finansial Teknologi
                </h4>
              </div>
            </div>

            <div class="panel-body p-4 space-y-3 text-xs text-slate-600">
              <div class="flex items-start gap-2.5">
                <MapPin class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong class="text-slate-900 block">Alamat Kantor:</strong>
                  <span>Menara MTH Lantai 10, Jl. Letjen M.T. Haryono Kav. 23, Tebet Barat, Jakarta Selatan 12820</span>
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <Clock class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong class="text-slate-900 block">Jam Layanan:</strong>
                  <span>Senin &ndash; Jumat: 09.00 &ndash; 17.00 WIB</span>
                  <span class="text-slate-400 block mt-0.5">Sabtu, Minggu & Hari Libur Nasional: Tutup</span>
                </div>
              </div>

              <div class="flex items-start gap-2.5">
                <Phone class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong class="text-slate-900 block">Telepon & Fax:</strong>
                  <span class="font-mono">(+62) 21 8378 2337</span>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-200 flex gap-2">
                <a
                  href="https://maps.google.com/maps?q=Menara%20MTH,%20Jakarta"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-default btn-small flex-1 text-center"
                >
                  <MapPin class="w-3.5 h-3.5 inline mr-1 text-emerald-700" />
                  <span>Google Maps ↗</span>
                </a>

                <a
                  href="https://wa.me/6282297770619?text=Halo%20Namia,%20saya%20ingin%20konsultasi%20layanan%20fintech%20syariah"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-primary btn-small flex-1 text-center"
                >
                  <MessageCircle class="w-3.5 h-3.5 inline mr-1" />
                  <span>WhatsApp ↗</span>
                </a>
              </div>
            </div>
          </div>

          <!-- OJK & DPS Compliance Trust Banner -->
          <div class="well well-small space-y-1 text-xs mb-0">
            <div class="flex items-center gap-1.5 text-slate-900 font-bold uppercase tracking-wider">
              <ShieldCheck class="w-4 h-4 text-emerald-700" />
              <span>Transparansi & Perlindungan Konsumen</span>
            </div>
            <p class="text-slate-600 leading-relaxed mb-0">
              Namia Syariah beroperasi dengan izin dan pengawasan berkala dari Otoritas Jasa Keuangan (OJK) serta didampingi oleh Dewan Pengawas Syariah (DPS) bersertifikasi DSN-MUI untuk menjaga hak-hak nasabah secara adil.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SOLID RETRO CTA BANNER -->
  <section class="py-8 text-white text-center" style="background: linear-gradient(180deg, #059669 0%, #047857 100%); border-top: 1px solid #065f46; border-bottom: 1px solid #065f46;">
    <div class="container flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-left space-y-1">
        <h3 class="text-xl font-bold uppercase tracking-wider text-white mb-0">
          Butuh Konsultasi Lebih Lanjut?
        </h3>
        <p class="text-xs text-emerald-100 mb-0">
          Customer Representative kami siap memandu Anda memilih skema pembiayaan atau instrumen pendanaan yang tepat.
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <a
          href="https://wa.me/6282297770619"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-default btn-large font-bold"
        >
          <MessageCircle class="w-4 h-4 inline mr-1 text-emerald-700" />
          <span>Chat WhatsApp</span>
        </a>
        <a
          href="tel:+622183782337"
          class="btn btn-primary btn-large font-bold"
        >
          <Phone class="w-4 h-4 inline mr-1" />
          <span>Hubungi Telepon</span>
        </a>
      </div>
    </div>
  </section>
</div>
