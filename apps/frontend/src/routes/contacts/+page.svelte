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

<div class="space-y-0 font-sans">
  <!-- HERO JUMBOTRON SECTION -->
  <section
    class="bg-[#0f172a] text-white py-16 sm:py-20 border-b border-slate-700"
  >
    <div class="max-w-5xl mx-auto px-4 text-center space-y-6">
      <!-- Trust Badge -->
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] bg-slate-800 border border-slate-600 text-xs font-bold uppercase tracking-wider text-emerald-400"
      >
        <Sparkles class="w-3.5 h-3.5 text-emerald-400" />
        <span>Layanan & Bantuan Resmi &bull; PT Namia Finansial Teknologi</span>
      </div>

      <!-- Main Headline -->
      <div class="space-y-3">
        <h1
          class="text-3xl sm:text-5xl font-bold tracking-tight uppercase leading-tight text-white"
        >
          Pusat Bantuan, FAQ & <br />
          <span class="text-emerald-400"> Kontak Resmi Namia </span>
        </h1>

        <p
          class="max-w-2xl mx-auto text-slate-300 text-xs sm:text-sm md:text-base font-normal leading-relaxed"
        >
          Kami siap mendampingi perjalanan investasi halal dan permodalan usaha
          syariah Anda dengan pelayanan profesional, ramah, dan amanah.
        </p>
      </div>

      <!-- Quick Metrics / Direct Contacts Ribbon -->
      <div
        class="pt-6 max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        <a
          href="tel:+622183782337"
          class="flex flex-col items-center justify-center p-4 rounded-[3px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 shadow-xs transition-colors text-center cursor-pointer"
        >
          <div
            class="w-8 h-8 rounded-[3px] bg-slate-700 border border-slate-600 flex items-center justify-center mb-2 text-emerald-400"
          >
            <Phone class="w-4 h-4" />
          </div>
          <div
            class="text-xs sm:text-sm lg:text-[15px] font-bold text-white whitespace-nowrap tracking-tight"
          >
            (+62) 21 8378 2337
          </div>
          <div
            class="text-[10px] sm:text-[11px] text-slate-300 font-semibold uppercase tracking-wider mt-0.5 whitespace-nowrap"
          >
            Telepon Kantor
          </div>
        </a>

        <a
          href="https://wa.me/6282297770619"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center justify-center p-4 rounded-[3px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 shadow-xs transition-colors text-center cursor-pointer"
        >
          <div
            class="w-8 h-8 rounded-[3px] bg-slate-700 border border-slate-600 flex items-center justify-center mb-2 text-emerald-400"
          >
            <MessageCircle class="w-4 h-4" />
          </div>
          <div
            class="text-xs sm:text-sm lg:text-[15px] font-bold text-emerald-400 whitespace-nowrap tracking-tight"
          >
            +62 822-9777-0619
          </div>
          <div
            class="text-[10px] sm:text-[11px] text-slate-300 font-semibold uppercase tracking-wider mt-0.5 whitespace-nowrap"
          >
            WhatsApp CS Namia
          </div>
        </a>

        <a
          href="mailto:salam@namia.id"
          class="flex flex-col items-center justify-center p-4 rounded-[3px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 shadow-xs transition-colors text-center cursor-pointer"
        >
          <div
            class="w-8 h-8 rounded-[3px] bg-slate-700 border border-slate-600 flex items-center justify-center mb-2 text-emerald-400"
          >
            <Mail class="w-4 h-4" />
          </div>
          <div
            class="text-xs sm:text-sm lg:text-[15px] font-bold text-white whitespace-nowrap tracking-tight"
          >
            salam@namia.id
          </div>
          <div
            class="text-[10px] sm:text-[11px] text-slate-300 font-semibold uppercase tracking-wider mt-0.5 whitespace-nowrap"
          >
            Email Resmi
          </div>
        </a>

        <a
          href="https://maps.google.com/maps?q=Menara%20MTH,%20Jakarta"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center justify-center p-4 rounded-[3px] bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 shadow-xs transition-colors text-center cursor-pointer"
        >
          <div
            class="w-8 h-8 rounded-[3px] bg-slate-700 border border-slate-600 flex items-center justify-center mb-2 text-emerald-400"
          >
            <MapPin class="w-4 h-4" />
          </div>
          <div
            class="text-xs sm:text-sm lg:text-[15px] font-bold text-white whitespace-nowrap tracking-tight"
          >
            Menara MTH Lt. 10
          </div>
          <div
            class="text-[10px] sm:text-[11px] text-slate-300 font-semibold uppercase tracking-wider mt-0.5 whitespace-nowrap"
          >
            Tebet, Jakarta Selatan
          </div>
        </a>
      </div>
    </div>
  </section>

  <!-- 4 DIRECT SERVICE CHANNELS -->
  <section class="py-16 bg-white border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-emerald-700 uppercase tracking-widest block font-['Raleway']"
          >Saluran Bantuan Terpadu</span
        >
        <h2 class="text-2xl sm:text-3xl font-bold text-[#333333] uppercase">
          Pilih Layanan Sesuai Kebutuhan
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Temukan kanal perwakilan tim Namia Syariah yang tepat untuk
          mempercepat penanganan informasi atau pertanyaan Anda.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Channel 1: Borrower Support -->
        <div
          class="bg-slate-50 rounded-[3px] border border-slate-300 p-6 space-y-4 hover:bg-white hover:border-emerald-600 transition-colors flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div
              class="w-10 h-10 rounded-[3px] bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200"
            >
              <Briefcase class="w-5 h-5" />
            </div>
            <h3 class="text-base font-bold text-slate-900 uppercase">
              Layanan Penerima Dana
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              Bantuan pengajuan permodalan UMKM, penjelasan skema akad
              Murabahah/Ijarah, dan cek status verifikasi proposal.
            </p>
          </div>
          <div class="pt-3 border-t border-slate-200 space-y-2">
            <a
              href="/borrower"
              class="text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Panduan Pembiayaan</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <!-- Channel 2: Investor Support -->
        <div
          class="bg-slate-50 rounded-[3px] border border-slate-300 p-6 space-y-4 hover:bg-white hover:border-emerald-600 transition-colors flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div
              class="w-10 h-10 rounded-[3px] bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200"
            >
              <ShieldCheck class="w-5 h-5" />
            </div>
            <h3 class="text-base font-bold text-slate-900 uppercase">
              Layanan Pendana (Investor)
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              Konsultasi portofolio proyek riil, bantuan pendaftaran akun
              diaspora internasional, dan jadwal pengembalian bagi hasil.
            </p>
          </div>
          <div class="pt-3 border-t border-slate-200 space-y-2">
            <a
              href="/investor"
              class="text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Panduan Pendanaan</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <!-- Channel 3: Institutional Partnership -->
        <div
          class="bg-slate-50 rounded-[3px] border border-slate-300 p-6 space-y-4 hover:bg-white hover:border-emerald-600 transition-colors flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div
              class="w-10 h-10 rounded-[3px] bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200"
            >
              <Building2 class="w-5 h-5" />
            </div>
            <h3 class="text-base font-bold text-slate-900 uppercase">
              Kemitraan & Kelembagaan
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              Kerja sama korporasi, perbankan syariah, lembaga wakaf/sosial,
              institusi pendidikan, dan media partner.
            </p>
          </div>
          <div class="pt-3 border-t border-slate-200 space-y-2">
            <a
              href="mailto:salam@namia.id?subject=Kemitraan%20Kelembagaan%20Namia"
              class="text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Kirim Proposal</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <!-- Channel 4: Customer Care & Whistleblowing -->
        <div
          class="bg-slate-50 rounded-[3px] border border-slate-300 p-6 space-y-4 hover:bg-white hover:border-emerald-600 transition-colors flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div
              class="w-10 h-10 rounded-[3px] bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200"
            >
              <HelpCircle class="w-5 h-5" />
            </div>
            <h3 class="text-base font-bold text-slate-900 uppercase">
              Pengaduan & Kepatuhan
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              Kanal resmi pengaduan konsumen berkeadilan dan kepatuhan syariah
              yang diawasi langsung DPS DSN-MUI.
            </p>
          </div>
          <div class="pt-3 border-t border-slate-200 space-y-2">
            <a
              href="#form-kontak"
              class="text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Tulis Pengaduan</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ SECTION WITH SMART SEARCH & TAB FILTERS -->
  <section id="faq" class="py-20 bg-[#F9F9F9] border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-emerald-700 uppercase tracking-widest block font-['Raleway']"
          >Pertanyaan yang Sering Diajukan</span
        >
        <h2 class="text-2xl sm:text-3xl font-bold text-[#333333] uppercase">
          Pusat Informasi & FAQ
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Temukan jawaban cepat atas pertanyaan seputar tata kelola, akad
          muamalah, proses seleksi mitra, dan keamanan dana di Namia Syariah.
        </p>
      </div>

      <!-- FAQ Search Bar & Main Segment Tabs -->
      <div
        class="bg-white p-5 sm:p-6 rounded-[3px] border border-slate-300 shadow-xs space-y-5"
      >
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <!-- Segment Tabs -->
          <div
            class="inline-flex p-1 bg-slate-100 rounded-[3px] gap-1 border border-slate-300"
          >
            <button
              type="button"
              onclick={() => {
                activeFaqTab = "all";
                activeCategoryFilter = "Semua";
              }}
              class="px-4 py-2 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer {activeFaqTab ===
              'all'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-700 hover:text-slate-900'}"
            >
              Semua Pertanyaan
            </button>
            <button
              type="button"
              onclick={() => {
                activeFaqTab = "borrower";
                activeCategoryFilter = "Semua";
              }}
              class="px-4 py-2 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer {activeFaqTab ===
              'borrower'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-700 hover:text-slate-900'}"
            >
              Pengguna Dana (Borrower)
            </button>
            <button
              type="button"
              onclick={() => {
                activeFaqTab = "investor";
                activeCategoryFilter = "Semua";
              }}
              class="px-4 py-2 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer {activeFaqTab ===
              'investor'
                ? 'bg-emerald-700 text-white'
                : 'text-slate-700 hover:text-slate-900'}"
            >
              Pendana (Investor)
            </button>
          </div>

          <!-- Live Search Input -->
          <div class="relative w-full md:w-80">
            <Search
              class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              bind:value={searchQuery}
              placeholder="Cari topik atau kata kunci..."
              class="w-full pl-10 pr-9 py-2 bg-white border border-slate-300 rounded-[3px] text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition-colors"
            />
            {#if searchQuery}
              <button
                type="button"
                onclick={() => (searchQuery = "")}
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                aria-label="Hapus pencarian"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            {/if}
          </div>
        </div>

        <!-- Sub-Category Filter Chips & Controls -->
        <div
          class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200"
        >
          <div class="flex flex-wrap items-center gap-1.5">
            <span
              class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1"
              >Kategori:</span
            >
            {#each availableCategories as c}
              <button
                type="button"
                onclick={() => (activeCategoryFilter = c)}
                class="px-2.5 py-1 rounded-[2px] text-[11px] font-medium transition-colors cursor-pointer border {activeCategoryFilter ===
                c
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'}"
              >
                {c}
              </button>
            {/each}
          </div>

          <div class="flex items-center gap-3 text-xs text-slate-500">
            <span
              >Menampilkan <strong>{totalVisibleFaqs}</strong> tanya-jawab</span
            >
            <span>&bull;</span>
            <button
              type="button"
              onclick={expandAll}
              class="text-emerald-700 hover:underline font-semibold cursor-pointer"
            >
              Buka Semua
            </button>
            <span>/</span>
            <button
              type="button"
              onclick={collapseAll}
              class="text-slate-600 hover:underline cursor-pointer"
            >
              Tutup Semua
            </button>
          </div>
        </div>
      </div>

      <!-- FAQ Category Groups & Accordion Lists -->
      <div class="space-y-10">
        {#if filteredCategories.length === 0}
          <div
            class="bg-white rounded-[3px] border border-slate-300 p-12 text-center space-y-3"
          >
            <div
              class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto"
            >
              <Search class="w-6 h-6" />
            </div>
            <h4 class="text-base font-bold text-slate-800 uppercase">
              Tidak Ditemukan Pertanyaan
            </h4>
            <p class="text-xs text-slate-500 max-w-md mx-auto">
              Tidak ada hasil yang sesuai dengan kata kunci "{searchQuery}".
              Silakan coba kata kunci lain atau gunakan formulir di bawah untuk
              menanyakan langsung.
            </p>
            <button
              type="button"
              onclick={() => {
                searchQuery = "";
                activeCategoryFilter = "Semua";
              }}
              class="button-4 text-xs mt-2"
            >
              Reset Filter Pencarian
            </button>
          </div>
        {:else}
          {#each filteredCategories as cat}
            <div class="space-y-4">
              <div
                class="flex items-center justify-between pb-2 border-b-2 border-slate-300"
              >
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <h3
                    class="text-base sm:text-lg font-bold text-slate-900 uppercase"
                  >
                    Kategori: {cat.name}
                  </h3>
                  <span
                    class="text-xs px-2 py-0.5 rounded-[2px] bg-slate-200 text-slate-800 font-semibold border border-slate-300"
                  >
                    {cat.isInvestor ? "Investor" : "Borrower"}
                  </span>
                </div>
                <span class="text-xs text-slate-500 font-medium"
                  >({cat.faqs.length} pertanyaan)</span
                >
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {#each cat.faqs as item}
                  <div
                    class="bg-white rounded-[3px] border transition-colors {openFaqIds.has(
                      item.id,
                    )
                      ? 'border-emerald-600 shadow-xs'
                      : 'border-slate-300'}"
                  >
                    <button
                      type="button"
                      onclick={() => toggleFaq(item.id)}
                      class="w-full px-5 py-3.5 text-left flex items-start justify-between gap-3 cursor-pointer {openFaqIds.has(
                        item.id,
                      )
                        ? 'bg-slate-50'
                        : 'bg-white hover:bg-slate-50'} transition-colors"
                    >
                      <span
                        class="text-xs sm:text-sm font-bold text-slate-800 leading-snug"
                      >
                        {item.question}
                      </span>
                      <div
                        class="w-5 h-5 rounded-[2px] flex items-center justify-center shrink-0 {openFaqIds.has(
                          item.id,
                        )
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-200 text-slate-600'}"
                      >
                        {#if openFaqIds.has(item.id)}
                          <ChevronUp class="w-3.5 h-3.5" />
                        {:else}
                          <ChevronDown class="w-3.5 h-3.5" />
                        {/if}
                      </div>
                    </button>

                    {#if openFaqIds.has(item.id)}
                      <div
                        class="px-5 pb-5 pt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200 bg-white space-y-2"
                      >
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
  <section id="form-kontak" class="py-20 bg-white border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-emerald-700 uppercase tracking-widest block font-['Raleway']"
          >Komunikasi Langsung</span
        >
        <h2 class="text-2xl sm:text-3xl font-bold text-[#333333] uppercase">
          Kirim Pesan & Kunjungi Kantor Kami
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Silakan isi formulir di bawah ini atau kunjungi kantor operasional
          kami di jam kerja untuk berdiskusi tatap muka.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <!-- Left: Direct Inquiry Form (7 Cols) -->
        <div
          class="lg:col-span-7 bg-white rounded-[3px] border border-slate-300 p-6 sm:p-8 shadow-xs"
        >
          {#if submitted}
            <div class="text-center py-12 space-y-4">
              <div
                class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300"
              >
                <CheckCircle2 class="w-8 h-8" />
              </div>
              <h3 class="text-2xl font-bold text-slate-900 uppercase">
                Pesan Anda Berhasil Terkirim!
              </h3>
              <p
                class="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed"
              >
                Jazakallahu khairan. Tim Customer Care Namia Syariah telah
                menerima pesan Anda dan akan menghubungi Anda kembali dalam
                kurun waktu 1x24 jam kerja melalui email atau nomor telepon yang
                Anda cantumkan.
              </p>
              <div class="pt-4">
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
                  class="button-4-primary text-xs py-2.5 px-6 rounded-[3px]"
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
              class="space-y-4"
            >
              <div class="space-y-1 pb-2 border-b border-slate-200">
                <h3 class="text-lg font-bold text-slate-900 uppercase">
                  Formulir Pesan Nasabah
                </h3>
                <p class="text-xs text-slate-500">
                  Semua informasi Anda dijamin kerahasiaannya sesuai ketentuan
                  perlindungan data pribadi.
                </p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    for="contact-name"
                    class="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1"
                  >
                    Nama Lengkap *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    bind:value={name}
                    placeholder="Nama lengkap Anda"
                    class="w-full bg-white border border-slate-300 rounded-[3px] px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label
                    for="contact-email"
                    class="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1"
                  >
                    Alamat Email *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    bind:value={email}
                    placeholder="nama@domain.com"
                    class="w-full bg-white border border-slate-300 rounded-[3px] px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    for="contact-phone"
                    class="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1"
                  >
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    bind:value={phone}
                    placeholder="0812xxxxxxx"
                    class="w-full bg-white border border-slate-300 rounded-[3px] px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label
                    for="contact-category"
                    class="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1"
                  >
                    Kategori Keperluan
                  </label>
                  <select
                    id="contact-category"
                    bind:value={category}
                    class="w-full bg-white border border-slate-300 rounded-[3px] px-3.5 py-2 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none transition-colors"
                  >
                    <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                    <option value="Pengajuan Pembiayaan (Borrower)"
                      >Pengajuan Pembiayaan (Borrower)</option
                    >
                    <option value="Konsultasi Pendanaan (Investor)"
                      >Konsultasi Pendanaan (Investor)</option
                    >
                    <option value="Kemitraan Strategis & Korporasi"
                      >Kemitraan Strategis & Korporasi</option
                    >
                    <option value="Pengaduan & Pelayanan Konsumen"
                      >Pengaduan & Pelayanan Konsumen</option
                    >
                  </select>
                </div>
              </div>

              <div>
                <label
                  for="contact-subject"
                  class="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1"
                >
                  Subjek Pertanyaan
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  bind:value={subject}
                  placeholder="Contoh: Konsultasi Pembiayaan Modal Kerja Usaha Roti"
                  class="w-full bg-white border border-slate-300 rounded-[3px] px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  for="contact-message"
                  class="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1"
                >
                  Pesan Lengkap *
                </label>
                <textarea
                  id="contact-message"
                  rows="4"
                  required
                  bind:value={message}
                  placeholder="Tuliskan secara rinci pertanyaan, kebutuhan pembiayaan, atau masukan Anda..."
                  class="w-full bg-white border border-slate-300 rounded-[3px] px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:outline-none transition-colors"
                ></textarea>
              </div>

              <div class="pt-2 flex items-center justify-between">
                <span class="text-[11px] text-slate-500">* Wajib diisi</span>
                <button
                  type="submit"
                  class="button-4-primary text-xs py-2.5 px-6 rounded-[3px] flex items-center gap-2 cursor-pointer font-bold uppercase tracking-wider"
                >
                  <Send class="w-3.5 h-3.5" />
                  <span>Kirimkan Pesan</span>
                </button>
              </div>
            </form>
          {/if}
        </div>

        <!-- Right: Office Address & Maps Card (5 Cols) -->
        <div class="lg:col-span-5 space-y-5">
          <!-- Headquarters Detail Box -->
          <div
            class="bg-white rounded-[3px] border border-slate-300 overflow-hidden shadow-xs"
          >
            <div class="relative h-44 overflow-hidden bg-slate-100">
              <img
                src="/images/about/menara_mth.jpg"
                alt="Menara MTH Kantor Pusat Namia"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-black/50"></div>
              <div class="absolute bottom-3 left-4 right-4 text-white">
                <span
                  class="px-2 py-0.5 rounded-[2px] bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider"
                >
                  Kantor Pusat Operasional
                </span>
                <h4 class="font-bold text-base uppercase mt-1">
                  PT Namia Finansial Teknologi
                </h4>
              </div>
            </div>

            <div class="p-5 space-y-4 text-xs text-slate-600">
              <div class="flex items-start gap-3">
                <MapPin class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong class="text-slate-900 block">Alamat Kantor:</strong>
                  <span
                    >Menara MTH Lantai 10, Jl. Letjen M.T. Haryono Kav. 23,
                    Tebet Barat, Jakarta Selatan 12820</span
                  >
                </div>
              </div>

              <div class="flex items-start gap-3">
                <Clock class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong class="text-slate-900 block">Jam Layanan:</strong>
                  <span>Senin &ndash; Jumat: 09.00 &ndash; 17.00 WIB</span>
                  <span class="text-slate-400 block mt-0.5"
                    >Sabtu, Minggu & Hari Libur Nasional: Tutup</span
                  >
                </div>
              </div>

              <div class="flex items-start gap-3">
                <Phone class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong class="text-slate-900 block">Telepon & Fax:</strong>
                  <span class="font-mono">(+62) 21 8378 2337</span>
                </div>
              </div>

              <div
                class="pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-2.5"
              >
                <a
                  href="https://maps.google.com/maps?q=Menara%20MTH,%20Jakarta"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="button-4 flex-1 py-2 px-3 rounded-[3px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <MapPin class="w-3.5 h-3.5 text-emerald-700" />
                  <span>Google Maps ↗</span>
                </a>

                <a
                  href="https://wa.me/6282297770619?text=Halo%20Namia,%20saya%20ingin%20konsultasi%20layanan%20fintech%20syariah"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="button-4-primary flex-1 py-2 px-3 rounded-[3px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <MessageCircle class="w-3.5 h-3.5" />
                  <span>WhatsApp ↗</span>
                </a>
              </div>
            </div>
          </div>

          <!-- OJK & DPS Compliance Trust Banner -->
          <div
            class="bg-slate-50 rounded-[3px] border border-slate-300 p-5 space-y-2 text-xs"
          >
            <div
              class="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider"
            >
              <ShieldCheck class="w-4 h-4 text-emerald-700" />
              <span>Transparansi & Perlindungan Konsumen</span>
            </div>
            <p class="text-slate-600 leading-relaxed">
              Namia Syariah beroperasi dengan izin dan pengawasan berkala dari
              Otoritas Jasa Keuangan (OJK) serta didampingi oleh Dewan Pengawas
              Syariah (DPS) bersertifikasi DSN-MUI untuk menjaga hak-hak nasabah
              secara adil.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- BOTTOM FULL-WIDTH SOLID CTA BANNER -->
  <section
    class="bg-[#059669] py-10 sm:py-12 text-white border-t border-b border-[#047857]"
  >
    <div
      class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
    >
      <div class="space-y-1.5">
        <h3
          class="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white"
        >
          Butuh Konsultasi Lebih Lanjut?
        </h3>
        <p class="text-xs sm:text-sm text-emerald-100">
          Customer Representative kami siap memandu Anda memilih skema
          pembiayaan atau instrumen pendanaan yang tepat.
        </p>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <a
          href="https://wa.me/6282297770619"
          target="_blank"
          rel="noopener noreferrer"
          class="px-5 py-2.5 rounded-[3px] bg-white text-emerald-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors shadow-xs flex items-center gap-1.5 border border-white"
        >
          <MessageCircle class="w-4 h-4" />
          <span>Chat WhatsApp</span>
        </a>
        <a
          href="tel:+622183782337"
          class="px-5 py-2.5 rounded-[3px] bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5 border border-slate-700"
        >
          <Phone class="w-3.5 h-3.5" />
          <span>Hubungi Telepon</span>
        </a>
      </div>
    </div>
  </section>
</div>
