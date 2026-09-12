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
          image: p.logo || "/images/products/namia_murabahah_goods.jpg",
          modalImage: p.logo || "/images/products/namia_murabahah_goods.jpg",
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

<div class="about-page">
  <!-- HERO SECTION: FULL-WIDTH TWITTER BOOTSTRAP 2.0 JUMBOTRON MASTHEAD -->
  <section class="jumbotron-masthead">
    <div class="container px-4">
      <div class="max-w-4xl mx-auto space-y-4 text-center">
        <!-- Trust Badge -->
        <div class="inline-flex items-center gap-2">
          <span class="badge badge-success px-3 py-1 font-bold text-xs">
            <Sparkles class="w-3.5 h-3.5 inline mr-1" />
            MENGENAL LEBIH DEKAT &bull; PT NAMIA FINANSIAL TEKNOLOGI
          </span>
          <span class="badge badge-inverse hidden sm:inline-block text-xs py-1 px-3 font-bold">
            SEJAK 2017
          </span>
        </div>

        <h1>
          Fintech P2P Financing Syariah <br />
          <span class="text-emerald-700">Terpercaya di Indonesia</span>
        </h1>

        <p class="lead max-w-2xl mx-auto">
          Menghubungkan permodalan halal global dengan ekosistem riil UMKM produktif untuk kebangkitan ekonomi umat secara adil, amanah, dan terbebas dari riba sejak 2017.
        </p>

        <!-- CTA Buttons Early Bootstrap 2 Style -->
        <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a href="/team" class="btn btn-primary btn-large font-bold">
            <span>Temui Dewan & Tim Kami</span>
            <ArrowRight class="w-4 h-4 inline ml-1" />
          </a>
          <a href="/contacts" class="btn btn-default btn-large font-bold">
            <Building2 class="w-4 h-4 inline mr-1 text-slate-700" />
            <span>Hubungi Kantor Pusat</span>
          </a>
        </div>

        <!-- Corporate Milestones Ribbon in Inset Well -->
        <div class="pt-4 max-w-3xl mx-auto">
          <div class="well well-white mb-0 py-3 px-4 shadow-xs border border-slate-300">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center divide-x divide-slate-300">
              <div class="px-2">
                <div class="text-lg sm:text-xl font-bold text-emerald-700 font-mono">4 April 2017</div>
                <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Tahun Berdiri</div>
              </div>
              <div class="px-2">
                <div class="text-lg sm:text-xl font-bold text-slate-800">DSN-MUI & OJK</div>
                <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Pengawasan Resmi</div>
              </div>
              <div class="px-2">
                <div class="text-lg sm:text-xl font-bold text-emerald-700 font-mono">8.400+ Mitra</div>
                <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Penerima Manfaat</div>
              </div>
              <div class="px-2">
                <div class="text-lg sm:text-xl font-bold text-slate-800">100% Syariah</div>
                <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Tanpa Riba & Keraguan</div>
              </div>
            </div>
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
        <li class="active">Tentang Kami &bull; Profil PT Namia Finansial Teknologi</li>
      </ul>
    </div>
  </div>

  <!-- SECTION 1: SEJARAH SINGKAT BERDIRINYA NAMIA -->
  <section id="sejarah" class="py-12 bg-white border-b border-[#E5E5E5]">
    <div class="container space-y-8">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="label label-info text-xs uppercase tracking-wider mb-1">Latar Belakang & Pendirian</span>
        <h2 class="text-2xl font-bold text-slate-900 uppercase">Sejarah Singkat Namia Syariah</h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Lahir dari kepedulian terhadap kemandirian ekonomi umat dan tekad untuk membebaskan masyarakat dari jeratan riba berlandaskan filosofi An-Namaa'.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- Left: HQ Photo Frame & Akta Card -->
        <div class="lg:col-span-5 space-y-3">
          <div class="panel panel-default mb-0 overflow-hidden shadow-sm">
            <div class="panel-heading font-bold text-xs uppercase flex items-center justify-between">
              <span>Kantor Pusat Operasional</span>
              <span class="badge badge-success">HQ TEBET</span>
            </div>
            <div class="relative bg-slate-200">
              <img
                src="/images/about/menara_mth.jpg"
                alt="Kantor Operasional Namia Menara MTH"
                class="w-full h-64 object-cover"
              />
              <div class="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white p-3 text-xs">
                <strong class="block text-sm">Menara MTH Lt. 10</strong>
                <span class="text-slate-300">Jl. Letjen MT Haryono Kav. 23, Tebet Barat, Jakarta Selatan</span>
              </div>
            </div>
          </div>

          <div class="well well-small flex items-center justify-between text-xs mb-0">
            <span class="font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar class="w-4 h-4 text-emerald-600 inline" /> Akta Pendirian Resmi:
            </span>
            <span class="label label-default font-mono">4 April 2017 &bull; Jakarta</span>
          </div>
        </div>

        <!-- Right: Narrative Content -->
        <div class="lg:col-span-7 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          <div class="alert alert-info py-2 px-3 mb-2 text-xs">
            <strong>PT Namia Finansial Teknologi (Namia Syariah)</strong> resmi berdiri pada <strong>4 April 2017</strong> di Jakarta dengan komitmen penuh pada fiqih muamalah Islam.
          </div>

          <p>
            Platform ini didirikan oleh para profesional senior perbankan syariah dan akademisi berprestasi lulusan universitas terkemuka dunia:
            <strong>Ir. Syauki, MBA</strong>, <strong>Kuseryansyah</strong>, dan <strong>Krisna Satria Gunawan</strong>.
          </p>

          <p>
            Pendirian Namia berakar dari keprihatinan mendalam atas maraknya praktik pinjaman ribawi berbunga tinggi yang mencekik pelaku UMKM produktif di Indonesia.
            Mengusung filosofi fiqih agung <em>An-Namaa'</em> (النَّمَاء — pertumbuhan produktif yang subur, berkah, dan bebas riba) serta tagline resmi
            <strong class="text-emerald-700">"Smart Growth, Halal Impact"</strong>, Namia menjadi jembatan amanah antara pemilik dana (<em>investor/lender</em>) dari dalam maupun luar negeri dengan para pelaku usaha riil Indonesia.
          </p>

          <p>
            Seluruh transaksi disalurkan secara langsung ke sektor riil yang nyata, didukung pengawasan ketat dari Dewan Pengawas Syariah (DPS) bersertifikasi DSN-MUI serta regulasi Otoritas Jasa Keuangan (OJK).
          </p>

          <!-- 3 Founding Core Pillars in Mini Wells -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div class="well well-small mb-0 text-center">
              <div class="font-bold text-xs uppercase text-slate-900">Bebas Riba</div>
              <div class="text-[11px] text-slate-600 mt-1">Menggantikan bunga ribawi dengan jual beli & bagi hasil adil.</div>
            </div>
            <div class="well well-small mb-0 text-center">
              <div class="font-bold text-xs uppercase text-slate-900">Sektor Riil</div>
              <div class="text-[11px] text-slate-600 mt-1">Hanya membiayai aset riil, barang modal, dan jasa produktif.</div>
            </div>
            <div class="well well-small mb-0 text-center">
              <div class="font-bold text-xs uppercase text-slate-900">Inklusi Global</div>
              <div class="text-[11px] text-slate-600 mt-1">Memfasilitasi investor diaspora hingga institusi secara 24/7.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 2: VISI, MISI & NILAI DASAR PERUSAHAAN -->
  <section id="visimisi" class="py-12 bg-slate-50 border-b border-[#E5E5E5]">
    <div class="container space-y-8">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="label label-success text-xs uppercase tracking-wider mb-1">Kompas Nilai Kami</span>
        <h2 class="text-2xl font-bold text-slate-900 uppercase">Visi, Misi & Nilai Dasar</h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Fondasi cita-cita luhur dan komitmen tata kelola yang melandasi setiap langkah perjalanan Namia Syariah.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each displayMissions as m}
          <div class="panel panel-default shadow-xs flex flex-col justify-between mb-0">
            <div class="panel-heading bg-white flex items-center justify-between">
              <span class="badge badge-success font-bold">{m.type}</span>
              <div class="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-700">
                <m.icon class="w-4 h-4" />
              </div>
            </div>
            <div class="panel-body space-y-3 flex-1">
              <h3 class="text-base font-bold text-slate-900 uppercase">
                {m.title}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {m.content}
              </p>
            </div>
            <div class="panel-footer bg-slate-50 text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 inline text-emerald-600" />
              <span>Komitmen Berkelanjutan Namia Syariah</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SECTION 3: 4 PILIHAN PRODUK SYARIAH UNGGULAN -->
  <section id="produk" class="py-12 bg-white border-b border-[#E5E5E5]">
    <div class="container space-y-8">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="label label-info text-xs uppercase tracking-wider mb-1">Skema Muamalah</span>
        <h2 class="text-2xl font-bold text-slate-900 uppercase">Produk Pembiayaan Syariah</h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Dirancang untuk memenuhi kebutuhan berbagai skala usaha dengan akad muamalah yang sah menurut syariat Islam.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {#each productHighlights as p}
          <div class="panel panel-default shadow-xs flex flex-col justify-between mb-0">
            <div>
              <div class="relative h-40 overflow-hidden bg-slate-100 border-b border-slate-200">
                <img
                  src={p.image}
                  alt={p.name}
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/40"></div>
                <span class="absolute top-2 left-2 badge badge-success text-[10px] uppercase">
                  Akad {p.contract}
                </span>
                <div class="absolute bottom-2 left-3 right-3 text-left">
                  <h3 class="text-base font-bold text-white uppercase leading-tight">
                    {p.name}
                  </h3>
                  <div class="text-[11px] text-emerald-300 font-semibold">
                    {p.tagline}
                  </div>
                </div>
              </div>

              <div class="panel-body text-xs text-slate-600 leading-relaxed min-h-[60px]">
                {p.desc}
              </div>
            </div>

            <div class="panel-footer bg-slate-50 p-3">
              <button
                type="button"
                onclick={() => (selectedProduct = p)}
                class="btn btn-default btn-small w-100 flex items-center justify-center gap-1"
              >
                <FileText class="w-3.5 h-3.5 inline text-emerald-600" />
                <span>Lihat Detail Skema</span>
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SECTION 4: DOKUMENTASI KEGIATAN OPERASIONAL -->
  <section id="dokumentasi" class="py-12 bg-slate-50 border-b border-[#E5E5E5]">
    <div class="container space-y-8">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="label label-inverse text-xs uppercase tracking-wider mb-1">Rekam Jejak Lapangan</span>
        <h2 class="text-2xl font-bold text-slate-900 uppercase">Dokumentasi Kegiatan Namia Syariah</h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Rangkuman dokumentasi sosialisasi, pengawasan Dewan Pengawas Syariah, dan kolaborasi ekosistem fintech nasional.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {#each activities as act}
          <div class="panel panel-default shadow-xs mb-0 overflow-hidden flex flex-col justify-between">
            <div>
              <div class="relative h-48 overflow-hidden bg-slate-100 border-b border-slate-200">
                <img
                  src={act.photo}
                  alt={act.title}
                  class="w-full h-full object-cover"
                />
                <span class="absolute top-2 left-2 badge badge-inverse text-[10px] uppercase">
                  {act.tag}
                </span>
              </div>
              <div class="panel-body space-y-2">
                <h4 class="text-sm font-bold text-slate-900 uppercase leading-snug">
                  {act.title}
                </h4>
                <p class="text-xs text-slate-600 leading-relaxed font-normal">
                  {act.desc}
                </p>
              </div>
            </div>
            <div class="panel-footer bg-slate-50 text-[11px] text-slate-500 py-2">
              <span>Dokumentasi Resmi PT Namia Finansial Teknologi</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SECTION 5: STATISTIK & PENGHARGAAN UNTUK NAMIA -->
  <section id="pencapaian" class="py-12 bg-white border-b border-[#E5E5E5]">
    <div class="container space-y-10">
      <!-- Metrics Inset Ribbon -->
      <div class="well well-dark p-6 sm:p-8">
        <div class="text-center max-w-lg mx-auto mb-6 space-y-1">
          <span class="badge badge-success text-xs font-bold uppercase tracking-wider">Metrik Pertumbuhan</span>
          <h3 class="text-2xl font-bold text-white uppercase">Capaian & Dampak Sosial</h3>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-700">
          {#each companyMetrics as met}
            <div class="space-y-1 pt-3 md:pt-0">
              <div class="text-2xl sm:text-3xl font-extrabold tracking-tight" style="color: {met.color};">
                {met.value}
              </div>
              <h5 class="text-xs uppercase tracking-wider text-white font-bold">
                {met.label}
              </h5>
              <p class="text-[11px] text-slate-400">{met.sub}</p>
            </div>
          {/each}
        </div>
      </div>

      <!-- Awards Showcase Early Bootstrap Panels -->
      <div class="space-y-6">
        <div class="heading-block text-center max-w-2xl mx-auto">
          <span class="label label-warning text-xs uppercase tracking-wider mb-1">Apresiasi & Rekognisi</span>
          <h3 class="text-2xl font-bold text-slate-900 uppercase">Penghargaan untuk Namia Syariah</h3>
          <p class="text-xs sm:text-sm text-slate-600">
            Pengakuan industri fintech atas dedikasi dan kepatuhan syariah yang konsisten.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {#each awards as aw}
            <div class="panel panel-default text-center p-5 space-y-3 shadow-xs mb-0">
              <div class="h-16 w-16 rounded bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 mx-auto">
                <Trophy class="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h4 class="text-sm font-bold text-slate-900 uppercase">
                  {aw.name}
                </h4>
                <span class="badge badge-success text-[10px] uppercase mt-1">
                  {aw.org}
                </span>
                <p class="text-xs text-slate-600 leading-relaxed pt-2">
                  {aw.desc || aw.description}
                </p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- SOLID RETRO CTA BANNER -->
  <section class="py-8 text-white text-center" style="background: linear-gradient(180deg, #059669 0%, #047857 100%); border-top: 1px solid #065f46; border-bottom: 1px solid #065f46;">
    <div class="container flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-left space-y-1">
        <h3 class="text-xl font-bold uppercase tracking-wider text-white mb-0">
          Mari Bertumbuh Bersama Namia Syariah
        </h3>
        <p class="text-xs text-emerald-100 mb-0">
          Jadilah bagian dari Smart Growth, Halal Impact melalui ekosistem pendanaan syariah yang amanah.
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <a href="/investor" class="btn btn-default btn-large font-bold">
          <span>Mulai Mendanai</span>
          <ArrowRight class="w-4 h-4 inline ml-1 text-emerald-700" />
        </a>
        <a href="/borrower" class="btn btn-primary btn-large font-bold">
          <span>Ajukan Modal Usaha</span>
        </a>
      </div>
    </div>
  </section>
</div>

<!-- RETRO BOOTSTRAP 2 MODAL FOR PRODUCT SCHEME PREVIEW -->
{#if selectedProduct}
  <div class="modal-backdrop fade in" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1040;"></div>
  <div class="modal" style="display: block; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1050; max-width: 650px; width: 92%; background: #ffffff; border: 1px solid #999; border-radius: 6px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
    <div class="modal-header d-flex justify-content-between align-items-center py-2 px-3 border-b bg-slate-50">
      <div>
        <span class="badge badge-success text-[10px] uppercase">Skema Akad Syariah</span>
        <h4 class="modal-title font-bold text-slate-900 text-base mb-0">
          {selectedProduct.name} (Akad {selectedProduct.contract})
        </h4>
      </div>
      <button
        type="button"
        class="close text-slate-400 hover:text-slate-700"
        onclick={() => (selectedProduct = null)}
        aria-label="Tutup"
      >
        &times;
      </button>
    </div>

    <div class="modal-body p-4 space-y-3 text-xs sm:text-sm text-slate-700">
      <p class="leading-relaxed mb-2">
        {selectedProduct.desc}
      </p>

      <div class="well well-small text-center p-2 bg-slate-100 border border-slate-300">
        <img
          src={selectedProduct.modalImage || selectedProduct.image}
          alt={selectedProduct.name}
          class="max-w-full max-h-[280px] object-contain mx-auto"
        />
      </div>

      <div class="alert alert-info py-2 px-3 text-xs mb-0">
        <CheckCircle2 class="w-4 h-4 inline mr-1 text-info" />
        Diawasi dan disahkan oleh Dewan Pengawas Syariah DSN-MUI serta berizin resmi OJK.
      </div>
    </div>

    <div class="modal-footer py-2 px-3 border-t bg-slate-50 flex justify-between items-center">
      <span class="text-xs text-slate-500 font-mono">PT Namia Finansial Teknologi</span>
      <div class="flex gap-2">
        <button
          type="button"
          class="btn btn-default btn-small"
          onclick={() => (selectedProduct = null)}
        >
          Tutup
        </button>
        <a href="/borrower" class="btn btn-primary btn-small">
          <span>Ajukan Pembiayaan</span>
        </a>
      </div>
    </div>
  </div>
{/if}
