<script lang="ts">
  import { onMount } from "svelte";
  import {
    ShieldCheck,
    Award,
    Users,
    CheckCircle2,
    Building2,
    HeartHandshake,
    Eye,
    Target,
    Compass,
    X,
    Image as ImageIcon,
    ArrowRight,
    Sparkles,
    Calendar,
    MapPin,
    ExternalLink,
    ChevronRight,
    FileText,
    Check,
    Clock,
    Globe2,
    Briefcase,
    Zap,
    Coins,
    Building,
    Trophy,
    Medal,
  } from "lucide-svelte";
  import { cmsStore, fetchCmsContent } from "$lib/cms";

  onMount(() => {
    fetchCmsContent();
  });

  let selectedProduct = $state<{
    name: string;
    image: string;
    color: string;
    desc: string;
    contract: string;
    modalImage?: string;
    tagline?: string;
  } | null>(null);

  // Dynamic products from CMS
  const productHighlights = $derived(
    $cmsStore.products?.length
      ? $cmsStore.products.slice(0, 4).map((p, idx) => ({
          name: p.name,
          color:
            idx === 0
              ? "from-teal-600 to-emerald-700"
              : idx === 1
                ? "from-blue-600 to-cyan-700"
                : idx === 2
                  ? "from-indigo-600 to-slate-800"
                  : "from-emerald-700 to-teal-800",
          image: p.logo || "/images/products/_1_barang.jpg",
          modalImage: p.logo || "/images/products/p_murabahah.jpg",
          contract: p.contractType,
          tagline: `Plafon s.d. Rp ${(p.maxAmount / 1_000_000).toLocaleString("id-ID")} Jt`,
          desc: p.description,
        }))
      : [],
  );

  const displayMissions = $derived(
    $cmsStore.missions?.length
      ? $cmsStore.missions.map((m, idx) => ({
          type: idx === 0 ? "VISI" : idx === 1 ? "MISI" : "NILAI",
          accent: idx === 0 ? "#1abc9c" : idx === 1 ? "#34495e" : "#e74c3c",
          icon: idx === 0 ? Eye : idx === 1 ? Target : Compass,
          title: m.title,
          content: m.content,
        }))
      : [],
  );

  // Dynamic activities from CMS
  const activities = $derived($cmsStore.activityDocs || []);

  // Dynamic awards from CMS
  const awards = $derived($cmsStore.awards || []);

  // Dynamic metrics from CMS
  const companyMetrics = $derived(
    $cmsStore.stats?.length
      ? $cmsStore.stats.slice(0, 4).map((s, idx) => ({
          label: s.label || s.title || "",
          value: s.value || s.amount || "",
          sub: s.sub || s.sublabel || s.subtitle || "",
          color:
            idx === 0
              ? "#1abc9c"
              : idx === 1
                ? "#3498db"
                : idx === 2
                  ? "#9b59b6"
                  : "#2ecc71",
        }))
      : [],
  );
</script>

<svelte:head>
  <title>Tentang Kami | Namia Syariah — Smart Growth, Halal Impact</title>
  <meta
    name="description"
    content="Sejarah singkat, visi misi nilai, dan profil PT Namia Finansial Teknologi (Namia Syariah). Platform P2P financing syariah terpercaya berizin & diawasi OJK berlandaskan prinsip An-Namaa'."
  />
</svelte:head>

<div class="space-y-0 font-sans">
  <!-- HERO SECTION WITH OPERATIONAL HEADQUARTERS IMAGE -->
  <section
    id="ikhtisar"
    class="relative min-h-[500px] flex items-center justify-center text-white overflow-hidden bg-cover bg-center"
    style="background-image: url('/images/about/menara_mth.jpg');"
  >
    <div class="absolute inset-0 bg-slate-950/85"></div>

    <div
      class="relative z-10 max-w-5xl mx-auto px-4 py-16 text-center space-y-6"
    >
      <!-- Trust Badge -->
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] bg-slate-900 border border-slate-700 text-xs font-bold uppercase tracking-wider text-emerald-300"
      >
        <Sparkles class="w-3.5 h-3.5 text-emerald-300" />
        <span>Mengenal Lebih Dekat &bull; PT Namia Finansial Teknologi</span>
      </div>

      <!-- Main Headline -->
      <div class="space-y-3">
        <h1
          class="text-3xl sm:text-5xl font-bold tracking-tight uppercase leading-tight text-white"
        >
          Fintech P2P Financing Syariah <br />
          <span class="text-emerald-400"> Terpercaya di Indonesia </span>
        </h1>

        <p
          class="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base font-normal leading-relaxed"
        >
          Menghubungkan permodalan halal global dengan ekosistem riil UMKM
          produktif untuk kebangkitan ekonomi umat secara adil, amanah, dan
          terbebas dari riba sejak 2017.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
        <a
          href="/team"
          class="button-4-primary text-xs uppercase tracking-wider py-2.5 px-5 rounded-[4px] flex items-center gap-2 font-bold"
        >
          <span>Temui Dewan & Tim Kami</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>

        <a
          href="/contacts"
          class="button-4-light text-xs py-2.5 px-5 rounded-[4px] flex items-center gap-2 font-bold uppercase tracking-wider cursor-pointer"
        >
          <Building2 class="w-4 h-4 text-slate-700" />
          <span>Hubungi Kantor Pusat</span>
        </a>
      </div>

      <!-- Floating Metrics Ribbon inside Hero -->
      <div class="pt-8 max-w-4xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div
            class="bg-slate-900 p-4 rounded-[4px] border border-slate-700 text-center"
          >
            <div
              class="text-xl sm:text-2xl font-bold font-['Raleway'] text-[#1abc9c]"
            >
              4 April 2017
            </div>
            <div
              class="text-[11px] text-slate-300 font-medium uppercase tracking-wider mt-0.5"
            >
              Tahun Berdiri
            </div>
          </div>
          <div
            class="bg-slate-900 p-4 rounded-[4px] border border-slate-700 text-center"
          >
            <div
              class="text-xl sm:text-2xl font-bold font-['Raleway'] text-white"
            >
              DSN-MUI & OJK
            </div>
            <div
              class="text-[11px] text-slate-300 font-medium uppercase tracking-wider mt-0.5"
            >
              Pengawasan Resmi
            </div>
          </div>
          <div
            class="bg-slate-900 p-4 rounded-[4px] border border-slate-700 text-center"
          >
            <div
              class="text-xl sm:text-2xl font-bold font-['Raleway'] text-emerald-400"
            >
              8.400+ Mitra
            </div>
            <div
              class="text-[11px] text-slate-300 font-medium uppercase tracking-wider mt-0.5"
            >
              Penerima Manfaat
            </div>
          </div>
          <div
            class="bg-slate-900 p-4 rounded-[4px] border border-slate-700 text-center"
          >
            <div
              class="text-xl sm:text-2xl font-bold font-['Raleway'] text-white"
            >
              100% Syariah
            </div>
            <div
              class="text-[11px] text-slate-300 font-medium uppercase tracking-wider mt-0.5"
            >
              Tanpa Riba & Keraguan
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 1: SEJARAH SINGKAT BERDIRINYA NAMIA -->
  <section id="sejarah" class="py-20 bg-white border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-[#1abc9c] uppercase tracking-widest block font-['Raleway']"
          >Latar Belakang & Pendirian</span
        >
        <h2
          class="text-2xl sm:text-3xl font-['Raleway'] font-bold text-[#333333] uppercase"
        >
          Sejarah Singkat Namia Syariah
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Lahir dari kepedulian terhadap kemandirian ekonomi umat dan tekad
          untuk membebaskan masyarakat dari jeratan riba berlandaskan filosofi
          An-Namaa'.
        </p>
      </div>

      <!-- Split Layout: Authentic Photo & Story Narration -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <!-- Left Column: HQ Image & Milestone Card -->
        <div class="lg:col-span-5 space-y-4">
          <div
            class="relative rounded-[4px] overflow-hidden border border-slate-300 bg-slate-100"
          >
            <img
              src="/images/about/menara_mth.jpg"
              alt="Kantor Operasional Namia Menara MTH"
              class="w-full h-80 object-cover"
            />
            <div class="absolute inset-0 bg-black/60"></div>

            <div class="absolute bottom-4 left-4 right-4 text-white">
              <span
                class="inline-block px-2.5 py-0.5 rounded-[2px] text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white mb-1.5"
              >
                Headquarters
              </span>
              <h4 class="font-bold text-base uppercase leading-tight">
                Menara MTH Lt. 10
              </h4>
              <p class="text-[11px] text-slate-300">
                Jl. MT Haryono Kav. 23, Tebet Barat, Jakarta Selatan
              </p>
            </div>
          </div>

          <div
            class="bg-slate-50 border border-slate-200 rounded-[4px] p-4 flex items-center justify-between text-xs text-slate-600"
          >
            <span class="font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar class="w-4 h-4 text-[#1abc9c]" /> Akta Pendirian:
            </span>
            <span class="font-semibold text-slate-700"
              >4 April 2017 di Jakarta</span
            >
          </div>
        </div>

        <!-- Right Column: Narrative Content -->
        <div
          class="lg:col-span-7 space-y-5 text-sm text-slate-600 leading-relaxed font-normal"
        >
          <p class="text-base text-slate-700 leading-relaxed font-normal">
            <strong class="text-slate-900 font-bold"
              >PT Namia Finansial Teknologi (Namia Syariah)</strong
            >
            didirikan pada tanggal
            <strong class="text-[#16a085]">4 April 2017</strong>
            oleh para profesional dan akademisi lulusan kampus terkemuka:
            <strong class="text-slate-900">Ir. Syauki, MBA</strong>,
            <strong class="text-slate-900">Kuseryansyah</strong>, dan
            <strong class="text-slate-900">Krisna Satria Gunawan</strong>.
          </p>

          <p>
            Pendirian platform ini berakar dari keprihatinan mendalam atas
            maraknya praktik pinjaman ribawi berbunga tinggi yang mencekik
            pelaku usaha mikro di Indonesia. Mengusung filosofi fiqih agung <em
              >An-Namaa'</em
            >
            (النَّمَاء — pertumbuhan produktif yang subur dan bebas riba) serta tagline
            resmi
            <strong class="text-[#16a085]">"Smart Growth, Halal Impact"</strong
            >, Namia menjadi jembatan amanah yang menghubungkan pemilik dana
            (*investor/lender*) dari berbagai belahan dunia dengan masyarakat
            Indonesia yang membutuhkan modal produktif.
          </p>

          <p>
            Seluruh transaksi pembiayaan disalurkan secara langsung ke sektor
            ekonomi riil, didukung pengawasan ketat dari Dewan Pengawas Syariah
            (DPS) yang bersertifikasi Dewan Syariah Nasional MUI serta memenuhi
            ketentuan regulasi Otoritas Jasa Keuangan (OJK).
          </p>

          <!-- 3 Founding Core Pillars -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div
              class="bg-slate-50 p-3.5 rounded-[3px] border border-slate-200/80"
            >
              <div
                class="font-bold text-xs uppercase text-slate-900 font-['Raleway']"
              >
                Bebas Riba
              </div>
              <div class="text-[11px] text-slate-500 mt-1">
                Menggantikan bunga ribawi dengan margin jual beli & bagi hasil
                adil.
              </div>
            </div>
            <div
              class="bg-slate-50 p-3.5 rounded-[3px] border border-slate-200/80"
            >
              <div
                class="font-bold text-xs uppercase text-slate-900 font-['Raleway']"
              >
                Sektor Riil
              </div>
              <div class="text-[11px] text-slate-500 mt-1">
                Hanya membiayai aset riil, barang modal, dan jasa yang
                produktif.
              </div>
            </div>
            <div
              class="bg-slate-50 p-3.5 rounded-[3px] border border-slate-200/80"
            >
              <div
                class="font-bold text-xs uppercase text-slate-900 font-['Raleway']"
              >
                Inklusi Global
              </div>
              <div class="text-[11px] text-slate-500 mt-1">
                Memfasilitasi investor diaspora hingga institusi secara digital
                24/7.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 2: VISI, MISI & NILAI DASAR PERUSAHAAN -->
  <section id="visimisi" class="py-20 bg-[#F9F9F9] border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-[#1abc9c] uppercase tracking-widest block font-['Raleway']"
          >Kompas Nilai Kami</span
        >
        <h2
          class="text-2xl sm:text-3xl font-['Raleway'] font-bold text-[#333333] uppercase"
        >
          Visi, Misi & Nilai Dasar
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Fondasi cita-cita luhur dan komitmen tata kelola yang melandasi setiap
          langkah perjalanan Namia Syariah.
        </p>
      </div>

      <!-- 3 Modern Mission Cards with Elevated Styling -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each displayMissions as m}
          <div
            class="bg-white rounded-[4px] p-8 border border-slate-200 shadow-xs hover:shadow-xl hover:border-[#1abc9c] transition-all flex flex-col justify-between space-y-6 group"
          >
            <div class="space-y-5">
              <div class="flex items-center justify-between">
                <span
                  class="text-xs font-['Raleway'] font-bold tracking-widest uppercase px-3 py-1 rounded-[2px] bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {m.type}
                </span>
                <div
                  class="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-[#1abc9c] group-hover:text-white transition-colors"
                >
                  <m.icon class="w-5 h-5" />
                </div>
              </div>

              <h3
                class="text-xl font-['Raleway'] font-bold text-slate-800 uppercase tracking-wide group-hover:text-[#16a085] transition-colors"
              >
                {m.title}
              </h3>

              <p
                class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal"
              >
                {m.content}
              </p>
            </div>

            <div
              class="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#1abc9c]"
            >
              <CheckCircle2 class="w-4 h-4" />
              <span>Komitmen Berkelanjutan Namia Syariah</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SECTION 3: 4 PILIHAN PRODUK SYARIAH UNGGULAN -->
  <section id="produk" class="py-20 bg-white border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-[#1abc9c] uppercase tracking-widest block font-['Raleway']"
          >Skema Muamalah</span
        >
        <h2
          class="text-2xl sm:text-3xl font-['Raleway'] font-bold text-[#333333] uppercase"
        >
          Produk Pembiayaan Syariah
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Dirancang untuk memenuhi kebutuhan berbagai skala usaha dengan akad
          muamalah yang sah menurut syariat Islam.
        </p>
      </div>

      <!-- Modern Product Grid with Real Photography -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each productHighlights as p}
          <div
            class="bg-white rounded-[4px] border border-slate-300 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div class="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={p.image}
                  alt={p.name}
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/50"></div>

                <span
                  class="absolute top-3 left-3 px-2.5 py-0.5 rounded-[2px] text-[10.5px] font-bold uppercase tracking-wider bg-white text-slate-800 border border-slate-300"
                >
                  Akad {p.contract}
                </span>

                <div class="absolute bottom-3 left-3 right-3 text-left">
                  <h3
                    class="text-lg font-bold text-white uppercase leading-tight"
                  >
                    {p.name}
                  </h3>
                  <div class="text-[11px] text-emerald-300 font-semibold">
                    {p.tagline}
                  </div>
                </div>
              </div>

              <div class="p-5 space-y-3">
                <p class="text-xs text-slate-600 leading-relaxed min-h-[55px]">
                  {p.desc}
                </p>
              </div>
            </div>

            <div class="p-5 pt-0 space-y-2">
              <button
                type="button"
                onclick={() => (selectedProduct = p)}
                class="w-full py-2.5 px-3 rounded-[3px] border border-slate-200 hover:border-[#1abc9c] text-slate-700 hover:text-[#1abc9c] hover:bg-teal-50/50 text-xs font-bold uppercase tracking-wider font-['Raleway'] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText class="w-3.5 h-3.5 text-[#1abc9c]" />
                <span>Lihat Detail Skema</span>
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SECTION 4: DOKUMENTASI KEGIATAN NAMIA -->
  <section
    id="dokumentasi"
    class="py-20 bg-[#F9F9F9] border-b border-[#ECECEC]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-[#1abc9c] uppercase tracking-widest block font-['Raleway']"
          >Rekam Jejak Operasional</span
        >
        <h2
          class="text-2xl sm:text-3xl font-['Raleway'] font-bold text-[#333333] uppercase"
        >
          Dokumentasi Kegiatan Namia Syariah
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Rangkuman dokumentasi sosialisasi, pengawasan Dewan Pengawas Syariah,
          dan kolaborasi ekosistem fintech nasional.
        </p>
      </div>

      <!-- Gallery Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each activities as act}
          <div
            class="group bg-white rounded-[4px] overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg hover:border-[#1abc9c] transition-all flex flex-col"
          >
            <div class="relative h-52 overflow-hidden bg-slate-100">
              <img
                src={act.photo}
                alt={act.title}
                class="w-full h-full object-cover"
              />
              <span
                class="absolute top-3 left-3 px-2.5 py-1 rounded-[2px] text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white border border-slate-700"
              >
                {act.tag}
              </span>
            </div>

            <div class="p-5 space-y-1.5 flex-1 flex flex-col justify-between">
              <div class="space-y-1">
                <h4
                  class="text-sm font-['Raleway'] font-bold text-slate-800 uppercase group-hover:text-[#16a085] transition-colors leading-snug"
                >
                  {act.title}
                </h4>
                <p class="text-xs text-slate-600 leading-relaxed font-light">
                  {act.desc}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SECTION 5: STATISTIK & PENGHARGAAN UNTUK NAMIA -->
  <section id="pencapaian" class="py-20 bg-white border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <!-- Metrics Ribbon -->
      <div
        class="bg-slate-900 text-white rounded-[4px] p-8 sm:p-12 border border-slate-700 shadow-xs"
      >
        <div class="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span
            class="text-xs font-bold text-emerald-400 uppercase tracking-widest block font-['Raleway']"
            >Metrik Pertumbuhan</span
          >
          <h3 class="text-2xl font-bold text-white uppercase">
            Capaian & Dampak Sosial
          </h3>
        </div>

        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-700"
        >
          {#each companyMetrics as met}
            <div class="space-y-1.5 pt-4 md:pt-0">
              <div
                class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
                style="color: {met.color};"
              >
                {met.value}
              </div>
              <h5 class="text-xs uppercase tracking-wider text-white font-bold">
                {met.label}
              </h5>
              <p class="text-[11px] text-slate-400 font-light">{met.sub}</p>
            </div>
          {/each}
        </div>
      </div>

      <!-- Awards Showcase -->
      <div class="space-y-10">
        <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
          <span
            class="text-xs font-bold text-emerald-700 uppercase tracking-widest block"
            >Apresiasi & Rekognisi</span
          >
          <h3 class="text-2xl sm:text-3xl font-bold text-[#333333] uppercase">
            Penghargaan untuk Namia Syariah
          </h3>
          <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
            Pengakuan industri fintech atas dedikasi dan kepatuhan syariah yang
            konsisten.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {#each awards as aw}
            <div
              class="bg-slate-50 rounded-[4px] p-6 border border-slate-300 text-center space-y-4 shadow-xs flex flex-col items-center"
            >
              <div
                class="h-20 w-20 rounded-[4px] bg-amber-50 border border-amber-200 p-4 flex items-center justify-center text-amber-500"
              >
                <Trophy class="w-10 h-10 text-amber-600" />
              </div>
              <div class="space-y-1.5">
                <h4
                  class="text-sm font-bold text-slate-800 uppercase leading-snug"
                >
                  {aw.name}
                </h4>
                <span
                  class="text-xs font-semibold text-emerald-800 uppercase tracking-wider block"
                  >{aw.org}</span
                >
                <p
                  class="text-xs text-slate-600 leading-relaxed pt-2 font-normal"
                >
                  {aw.desc || aw.description}
                </p>
              </div>
            </div>
          {/each}
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
          Mari Bertumbuh Bersama Namia Syariah
        </h3>
        <p class="text-xs sm:text-sm text-emerald-100">
          Jadilah bagian dari Smart Growth, Halal Impact melalui ekosistem
          pendanaan syariah yang amanah.
        </p>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <a
          href="/investor"
          class="px-5 py-2.5 rounded-[4px] bg-white text-emerald-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors shadow-xs flex items-center gap-1.5 border border-white"
        >
          <span>Mulai Mendanai</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
        <a
          href="/borrower"
          class="px-5 py-2.5 rounded-[4px] bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-900 transition-colors shadow-xs flex items-center gap-1.5 border border-emerald-700"
        >
          <span>Ajukan Modal</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </section>
</div>

<!-- MODAL POPUP FOR PRODUCT PREVIEW -->
{#if selectedProduct}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
  >
    <div
      class="bg-white rounded-[4px] max-w-2xl w-full p-5 sm:p-7 space-y-5 shadow-2xl border border-slate-300 relative"
    >
      <div
        class="flex items-center justify-between pb-3 border-b border-slate-100"
      >
        <div>
          <span
            class="text-xs font-bold text-emerald-700 uppercase tracking-wider block"
            >Skema Akad Syariah</span
          >
          <h3 class="text-lg font-bold font-['Raleway'] text-slate-900">
            {selectedProduct.name} (Akad {selectedProduct.contract})
          </h3>
        </div>
        <button
          type="button"
          onclick={() => (selectedProduct = null)}
          class="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-[2px] transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
        {selectedProduct.desc}
      </p>

      <div
        class="rounded-[2px] overflow-hidden border border-slate-200 bg-slate-50 max-h-[360px] flex items-center justify-center p-2"
      >
        <img
          src={selectedProduct.modalImage || selectedProduct.image}
          alt={selectedProduct.name}
          class="max-w-full max-h-[320px] object-contain"
        />
      </div>

      <div
        class="flex justify-between items-center pt-2 border-t border-slate-100"
      >
        <span class="text-xs text-slate-500">Diawasi oleh DPS DSN-MUI</span>
        <div class="flex gap-2">
          <button
            type="button"
            onclick={() => (selectedProduct = null)}
            class="h-10 px-4 rounded-[3px] border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 cursor-pointer"
          >
            Tutup
          </button>
          <a href="/borrower" class="btn-canvas btn-canvas-teal text-xs">
            <span>Ajukan Pembiayaan</span>
          </a>
        </div>
      </div>
    </div>
  </div>
{/if}
