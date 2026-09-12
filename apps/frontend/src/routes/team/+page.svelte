<script lang="ts">
  import { onMount } from "svelte";
  import {
    X,
    ExternalLink,
    Award,
    ShieldCheck,
    Mail,
    Sparkles,
    ArrowRight,
    ChevronRight,
    GraduationCap,
    Building2,
    Briefcase,
    CheckCircle2,
    FileText,
    Globe2,
  } from "lucide-svelte";
  import { cmsStore, fetchCmsContent, type PersonilData } from "$lib/cms";

  onMount(() => {
    fetchCmsContent();
  });

  // Active member for modal detail
  let activeMember = $state<PersonilData | null>(null);

  // Dynamic team data loaded directly from backend database
  const allTeam = $derived($cmsStore.team || []);
  const advisoryBoards = $derived(
    allTeam.filter((m) => (m.job_level ?? (m as any).jobLevel) === 1),
  );
  const commissioners = $derived(
    allTeam.filter((m) => (m.job_level ?? (m as any).jobLevel) === 2),
  );
  const directors = $derived(
    allTeam.filter((m) => (m.job_level ?? (m as any).jobLevel) === 3),
  );
  const staffTeam = $derived(
    allTeam.filter((m) => (m.job_level ?? (m as any).jobLevel) === 4),
  );
</script>

<svelte:head>
  <title>Dewan & Tim Manajemen | Namia Syariah</title>
  <meta
    name="description"
    content="Sambutan CEO dan profil jajaran Dewan Pengawas Syariah, Dewan Komisaris, Direksi, serta Tim Manajemen PT Namia Finansial Teknologi."
  />
</svelte:head>

<div class="team-page">
  <!-- HERO SECTION: FULL-WIDTH TWITTER BOOTSTRAP 2.0 JUMBOTRON MASTHEAD -->
  <section class="jumbotron-masthead">
    <div class="container px-4">
      <div class="max-w-4xl mx-auto space-y-4 text-center">
        <!-- Trust Badge -->
        <div class="inline-flex items-center gap-2">
          <span class="badge badge-success px-3 py-1 font-bold text-xs">
            <Sparkles class="w-3.5 h-3.5 inline mr-1" />
            TATA KELOLA AMANAH &bull; DEWAN PROFESIONAL TERUJI
          </span>
          <span class="badge badge-inverse hidden sm:inline-block text-xs py-1 px-3 font-bold">
            GCG & ISO CERTIFIED
          </span>
        </div>

        <h1>
          Dikelola Para Profesional <br />
          <span class="text-emerald-700">Berpengalaman Kelas Dunia</span>
        </h1>

        <p class="lead max-w-2xl mx-auto">
          Sinergi para pakar perbankan syariah, mantan pengawas senior Bank Indonesia, dan technopreneur lulusan universitas terkemuka dunia untuk menjaga integritas dan pertumbuhan berkelanjutan Namia Syariah.
        </p>

        <!-- CTA Buttons -->
        <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a href="#sambutan" class="btn btn-primary btn-large font-bold">
            <span>Baca Sambutan CEO</span>
            <ArrowRight class="w-4 h-4 inline ml-1" />
          </a>
          <a href="#dps" class="btn btn-default btn-large font-bold">
            <ShieldCheck class="w-4 h-4 inline mr-1 text-emerald-600" />
            <span>Lihat Dewan Pengawas</span>
          </a>
        </div>

        <!-- Credential Badges in Inset Well -->
        <div class="pt-4 max-w-3xl mx-auto">
          <div class="well well-white mb-0 py-3 px-4 shadow-xs border border-slate-300">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center divide-x divide-slate-300">
              <div class="px-2">
                <div class="text-lg sm:text-xl font-bold text-emerald-700 font-mono">DSN-MUI</div>
                <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Sertifikasi Syariah</div>
              </div>
              <div class="px-2">
                <div class="text-lg sm:text-xl font-bold text-slate-800">30+ Tahun</div>
                <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Pengawas BI</div>
              </div>
              <div class="px-2">
                <div class="text-lg sm:text-xl font-bold text-emerald-700 font-mono">ITB, NTU, Iowa</div>
                <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Alumni Terbaik</div>
              </div>
              <div class="px-2">
                <div class="text-lg sm:text-xl font-bold text-slate-800">GCG & ISO</div>
                <div class="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Standarisasi Tata Kelola</div>
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
        <li class="active">Dewan & Tim Manajemen &bull; Tata Kelola Korporasi</li>
      </ul>
    </div>
  </div>

  <!-- SECTION 1: SAMBUTAN CEO DENGAN FRAMED PORTRAIT & SIGNATURE -->
  <section id="sambutan" class="py-12 bg-white border-b border-[#E5E5E5]">
    <div class="container space-y-8">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="label label-info text-xs uppercase tracking-wider mb-1">Pesan Dari Pimpinan</span>
        <h2 class="text-2xl font-bold text-slate-900 uppercase">Sambutan Chief Executive Officer</h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Amanah kepemimpinan dan komitmen Namia Syariah dalam mewujudkan ekosistem keuangan syariah yang berkeadilan.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Left: CEO Portrait in Early Bootstrap Thumbnail -->
        <div class="lg:col-span-4 space-y-3">
          <div class="panel panel-default mb-0 overflow-hidden shadow-sm">
            <div class="panel-heading bg-slate-50 font-bold text-xs uppercase flex items-center justify-between">
              <span>Chief Executive Officer</span>
              <span class="badge badge-success">CEO</span>
            </div>
            <div class="relative bg-slate-200">
              <img
                src="/images/team/p_syauqi_trim.jpg"
                alt="Ir. Syauki, MBA - CEO Namia Syariah"
                class="w-full h-auto object-cover"
              />
              <div class="absolute bottom-0 inset-x-0 bg-slate-900/85 text-white p-3 text-center">
                <span class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Chief Executive Officer</span>
                <h4 class="font-bold text-sm uppercase text-white mb-0">Ir. Syauki, MBA</h4>
              </div>
            </div>
          </div>

          <div class="well well-small space-y-2 text-xs mb-0">
            <div class="flex items-start gap-2 text-slate-700">
              <GraduationCap class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Teknik Kimia ITB & MBA Nanyang Technological University (Singapore)</span>
            </div>
            <div class="flex items-start gap-2 text-slate-700">
              <Briefcase class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>20+ Tahun Pengalaman Multinasional & Technopreneurship</span>
            </div>
          </div>
        </div>

        <!-- Right: Official CEO Letter in Panel -->
        <div class="lg:col-span-8 panel panel-default mb-0 shadow-sm">
          <div class="panel-heading bg-white pb-2">
            <h4 class="font-bold text-slate-900 text-sm uppercase mb-1">
              Bismillahhirrahmanirrahim
            </h4>
            <span class="text-xs text-slate-600 font-semibold">
              Assalamu'alaikum warahmatullahi wabarakatuh
            </span>
          </div>

          <div class="panel-body text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
            <p>
              Puji syukur kehadirat Allah SWT atas semua nikmat yang telah diberikan-Nya. Shalawat serta salam kita curahkan kepada junjungan kita Rasulullah Muhammad saw beserta keluarga, para sahabat dan ummatnya hingga akhir zaman.
            </p>

            <p>
              Sahabat Namia dan Rekan Mitra Terhormat, <strong>PT Namia Finansial Teknologi (Namia Syariah)</strong> adalah perusahaan fintech yang bergerak pada layanan pendanaan dan pembiayaan berbasis teknologi informasi syariah (<em>Sharia P2P Financing & Investment</em>). Namia memiliki visi untuk menjadi platform terdepan kelas dunia dalam ekosistem ekonomi syariah digital. Dengan tagline <strong class="text-emerald-700">"Smart Growth, Halal Impact"</strong>, Namia Syariah menghubungkan pendana dari berbagai belahan dunia dengan pelaku usaha riil dan UMKM produktif di Indonesia yang membutuhkan modal halal.
            </p>

            <p>
              Sebagai tonggak awal kebangkitan ekonomi umat, Namia memelopori pendanaan produktif dan inisiatif pembebasan dari jeratan pinjaman ribawi untuk memajukan kesejahteraan masyarakat. Untuk mempercepat pertumbuhannya, Namia bekerjasama dengan para pemangku kepentingan berpengalaman di bidang keuangan, baik regulator (OJK, Bank Indonesia, Kominfo) maupun asosiasi profesi (AFSI, Alumni ITB, Pagari).
            </p>

            <p>
              Sebagai strategi keunggulan tata kelola, Namia menerapkan adaptasi standardisasi internasional <strong>ISO 9001 (Kualitas), ISO 27001 (Keamanan Informasi)</strong>, dan <strong>ISO 26000 (Tanggung Jawab Sosial)</strong>. Untuk menjaring investasi, Namia memfokuskan penggalangan dana dari masyarakat luas serta diaspora Indonesia di luar negeri, kemudian menyalurkan pembiayaan secara produktif ke ekosistem UMKM lokal berpotensi tinggi.
            </p>
          </div>

          <div class="panel-footer bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <strong class="text-slate-800 block">Wassalamu'alaikum warahmatullahi wabarakatuh</strong>
              <span class="text-slate-500">Jakarta, PT Namia Finansial Teknologi</span>
            </div>
            <div class="text-right">
              <h5 class="font-bold text-slate-900 uppercase text-sm mb-0">Ir. Syauki, MBA</h5>
              <span class="badge badge-success text-[10px] uppercase">Chief Executive Officer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 2: DEWAN PENGAWAS SYARIAH (DPS) -->
  <section id="dps" class="py-12 bg-slate-50 border-b border-[#E5E5E5]">
    <div class="container space-y-8">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="label label-success text-xs uppercase tracking-wider mb-1">Kepatuhan Fatwa DSN-MUI</span>
        <h2 class="text-2xl font-bold text-slate-900 uppercase">Dewan Pengawas Syariah (DPS)</h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Mengawal dan mengawasi setiap transaksi agar senantiasa sesuai dengan prinsip-prinsip syariat Islam dan regulasi OJK.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {#each advisoryBoards as member}
          <div class="panel panel-default shadow-xs flex flex-col justify-between mb-0">
            <div>
              <div class="relative h-64 overflow-hidden bg-slate-100 border-b border-slate-200">
                <img
                  src={member.photo}
                  alt={member.fullname}
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/40"></div>
                <span class="absolute top-2 left-2 badge badge-success text-[10px] uppercase">
                  {member.job_title}
                </span>
                <div class="absolute bottom-2 left-3 right-3 text-left text-white">
                  <h3 class="text-base font-bold uppercase leading-tight mb-0">
                    {member.fullname}
                  </h3>
                  <div class="text-[11px] text-emerald-300 font-semibold mt-0.5">
                    {member.education}
                  </div>
                </div>
              </div>

              <div class="panel-body text-xs text-slate-600 leading-relaxed min-h-[60px]">
                <p class="line-clamp-3 mb-0">{member.biography}</p>
              </div>
            </div>

            <div class="panel-footer bg-slate-50 p-3">
              <button
                type="button"
                onclick={() => (activeMember = member)}
                class="btn btn-default btn-small w-100 flex items-center justify-center gap-1"
              >
                <span>Lihat Profil Lengkap</span>
                <ArrowRight class="w-3.5 h-3.5 inline text-emerald-600" />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SECTION 3: DEWAN KOMISARIS -->
  <section id="komisaris" class="py-12 bg-white border-b border-[#E5E5E5]">
    <div class="container space-y-8">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="label label-info text-xs uppercase tracking-wider mb-1">Pengawasan & Tata Kelola</span>
        <h2 class="text-2xl font-bold text-slate-900 uppercase">Dewan Komisaris</h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Memastikan pelaksanaan prinsip kehati-hatian, manajemen risiko terukur, dan perlindungan optimal bagi seluruh pihak.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {#each commissioners as member}
          <div class="panel panel-default shadow-xs flex flex-col justify-between mb-0">
            <div>
              <div class="relative h-64 overflow-hidden bg-slate-100 border-b border-slate-200">
                <img
                  src={member.photo}
                  alt={member.fullname}
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/40"></div>
                <span class="absolute top-2 left-2 badge badge-inverse text-[10px] uppercase">
                  {member.job_title}
                </span>
                <div class="absolute bottom-2 left-3 right-3 text-left text-white">
                  <h3 class="text-base font-bold uppercase leading-tight mb-0">
                    {member.fullname}
                  </h3>
                  <div class="text-[11px] text-emerald-300 font-semibold mt-0.5">
                    {member.education}
                  </div>
                </div>
              </div>

              <div class="panel-body text-xs text-slate-600 leading-relaxed min-h-[60px]">
                <p class="line-clamp-3 mb-0">{member.biography}</p>
              </div>
            </div>

            <div class="panel-footer bg-slate-50 p-3">
              <button
                type="button"
                onclick={() => (activeMember = member)}
                class="btn btn-default btn-small w-100 flex items-center justify-center gap-1"
              >
                <span>Lihat Profil Lengkap</span>
                <ArrowRight class="w-3.5 h-3.5 inline text-emerald-600" />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SECTION 4: DEWAN DIREKSI -->
  <section id="direksi" class="py-12 bg-slate-50 border-b border-[#E5E5E5]">
    <div class="container space-y-8">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="label label-success text-xs uppercase tracking-wider mb-1">Eksekutif & Kepemimpinan</span>
        <h2 class="text-2xl font-bold text-slate-900 uppercase">Dewan Direksi</h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Menggerakkan inovasi platform, kemitraan strategis, dan keandalan teknologi finansial terdepan di Indonesia.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {#each directors as member}
          <div class="panel panel-default shadow-xs flex flex-col justify-between mb-0">
            <div>
              <div class="relative h-64 overflow-hidden bg-slate-100 border-b border-slate-200">
                <img
                  src={member.photo}
                  alt={member.fullname}
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/40"></div>
                <span class="absolute top-2 left-2 badge badge-success text-[10px] uppercase">
                  {member.job_title}
                </span>
                <div class="absolute bottom-2 left-3 right-3 text-left text-white">
                  <h3 class="text-base font-bold uppercase leading-tight mb-0">
                    {member.fullname}
                  </h3>
                  <div class="text-[11px] text-emerald-300 font-semibold mt-0.5">
                    {member.education}
                  </div>
                </div>
              </div>

              <div class="panel-body text-xs text-slate-600 leading-relaxed min-h-[60px]">
                <p class="line-clamp-3 mb-0">{member.biography}</p>
              </div>
            </div>

            <div class="panel-footer bg-slate-50 p-3">
              <button
                type="button"
                onclick={() => (activeMember = member)}
                class="btn btn-default btn-small w-100 flex items-center justify-center gap-1"
              >
                <span>Lihat Profil Lengkap</span>
                <ArrowRight class="w-3.5 h-3.5 inline text-emerald-600" />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SECTION 5: TIM MANAJEMEN & OPERASIONAL -->
  <section id="manajemen" class="py-12 bg-white border-b border-[#E5E5E5]">
    <div class="container space-y-8">
      <div class="heading-block text-center max-w-2xl mx-auto">
        <span class="label label-inverse text-xs uppercase tracking-wider mb-1">Layanan Prima & Dedikasi</span>
        <h2 class="text-2xl font-bold text-slate-900 uppercase">Tim Operasional & Manajemen</h2>
        <p class="text-xs sm:text-sm text-slate-600">
          Mengawal kelancaran penyaluran pembiayaan, transparansi pelaporan dana investor, dan operasional kantor.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {#each staffTeam as member}
          <div class="panel panel-default shadow-xs flex flex-col justify-between mb-0">
            <div>
              <div class="relative h-56 overflow-hidden bg-slate-100 border-b border-slate-200">
                <img
                  src={member.photo}
                  alt={member.fullname}
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/40"></div>
                <span class="absolute top-2 left-2 badge badge-inverse text-[10px] uppercase">
                  {member.job_title}
                </span>
                <div class="absolute bottom-2 left-3 right-3 text-left text-white">
                  <h4 class="text-sm font-bold uppercase leading-tight mb-0">
                    {member.fullname}
                  </h4>
                  <div class="text-[11px] text-emerald-300 font-medium mt-0.5">
                    {member.education}
                  </div>
                </div>
              </div>

              <div class="panel-body text-xs text-slate-600 leading-relaxed min-h-[50px]">
                <p class="line-clamp-3 mb-0">{member.biography}</p>
              </div>
            </div>

            <div class="panel-footer bg-slate-50 p-3">
              <button
                type="button"
                onclick={() => (activeMember = member)}
                class="btn btn-default btn-small w-100 flex items-center justify-center gap-1"
              >
                <span>Lihat Profil Lengkap</span>
                <ArrowRight class="w-3.5 h-3.5 inline text-emerald-600" />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SOLID RETRO CTA BANNER -->
  <section class="py-8 text-white text-center" style="background: linear-gradient(180deg, #059669 0%, #047857 100%); border-top: 1px solid #065f46; border-bottom: 1px solid #065f46;">
    <div class="container flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-left space-y-1">
        <h3 class="text-xl font-bold uppercase tracking-wider text-white mb-0">
          Ingin Berkolaborasi Bersama Tim Namia?
        </h3>
        <p class="text-xs text-emerald-100 mb-0">
          Mulai langkah kebaikan dengan menjadi bagian dari permodalan halal atau ajukan pembiayaan usaha Anda.
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <a href="/investor" class="btn btn-default btn-large font-bold">
          <span>Mulai Mendanai</span>
          <ArrowRight class="w-4 h-4 inline ml-1 text-emerald-700" />
        </a>
        <a href="/borrower" class="btn btn-primary btn-large font-bold">
          <span>Ajukan Modal</span>
        </a>
      </div>
    </div>
  </section>
</div>

<!-- BIO MODAL DETAIL MATCHING BOOTSTRAP MODAL -->
{#if activeMember}
  <div class="modal-backdrop fade in" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 1040;"></div>
  <div class="modal" style="display: block; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 1050; max-width: 550px; width: 92%; background: #ffffff; border: 1px solid #999; border-radius: 6px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
    <div class="modal-header d-flex justify-content-between align-items-center py-2 px-3 border-b bg-slate-50">
      <div>
        <span class="badge badge-success text-[10px] uppercase">Profil Personil</span>
        <h4 class="modal-title font-bold text-slate-900 text-base mb-0">
          {activeMember.fullname}
        </h4>
      </div>
      <button
        type="button"
        class="close text-slate-400 hover:text-slate-700"
        onclick={() => (activeMember = null)}
        aria-label="Tutup"
      >
        &times;
      </button>
    </div>

    <div class="modal-body p-4 space-y-3 text-xs sm:text-sm text-slate-700">
      <div class="flex items-center gap-3">
        <img
          src={activeMember.photo}
          alt={activeMember.fullname}
          class="w-20 h-20 rounded border border-slate-300 object-cover shrink-0"
        />
        <div>
          <span class="badge badge-inverse text-[10px] uppercase">{activeMember.job_title}</span>
          <h5 class="font-bold text-slate-900 uppercase text-sm mt-1 mb-0">{activeMember.fullname}</h5>
          {#if activeMember.education}
            <span class="text-xs text-slate-500 block mt-0.5">{activeMember.education}</span>
          {/if}
        </div>
      </div>

      <div class="well well-small p-3 bg-slate-50 text-xs text-slate-700 leading-relaxed max-h-56 overflow-y-auto mb-0">
        <p class="mb-0">{activeMember.biography}</p>
      </div>
    </div>

    <div class="modal-footer py-2 px-3 border-t bg-slate-50 flex justify-between items-center">
      <span class="text-xs text-slate-500 font-mono">PT Namia Finansial Teknologi</span>
      <button
        type="button"
        class="btn btn-primary btn-small"
        onclick={() => (activeMember = null)}
      >
        Tutup
      </button>
    </div>
  </div>
{/if}
