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

<div class="space-y-0 font-sans">
  <!-- HERO JUMBOTRON SECTION -->
  <section
    id="ikhtisar"
    class="bg-[#0f172a] text-white py-16 sm:py-20 border-b border-slate-700"
  >
    <div class="max-w-5xl mx-auto px-4 text-center space-y-7">
      <!-- Trust Badge -->
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-[3px] bg-slate-800 border border-slate-600 text-xs font-bold uppercase tracking-wider text-emerald-400"
      >
        <Sparkles class="w-3.5 h-3.5 text-emerald-400" />
        <span>Tata Kelola Amanah &bull; Dewan Profesional Teruji</span>
      </div>

      <!-- Main Headline -->
      <div class="space-y-3">
        <h1
          class="text-3xl sm:text-5xl font-bold tracking-tight uppercase leading-tight text-white"
        >
          Dikelola Para Profesional <br />
          <span class="text-emerald-400"> Berpengalaman Kelas Dunia </span>
        </h1>

        <p
          class="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base font-normal leading-relaxed"
        >
          Sinergi para pakar perbankan syariah, mantan pengawas senior Bank
          Indonesia, dan technopreneur lulusan universitas terkemuka dunia untuk
          menjaga integritas dan pertumbuhan berkelanjutan Namia Syariah.
        </p>
      </div>

      <!-- Action Buttons -->
      <div
        class="pt-2 flex flex-wrap items-center justify-center gap-3 font-['Raleway']"
      >
        <a
          href="#sambutan"
          class="button-4-primary text-xs py-3 px-6 rounded-[3px] font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Baca Sambutan CEO</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>

        <a
          href="#dps"
          class="button-4 text-xs py-3 px-5 rounded-[3px] font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
        >
          <ShieldCheck class="w-4 h-4 text-emerald-600" />
          <span>Lihat Dewan Pengawas</span>
        </a>
      </div>

      <!-- Credential Badges -->
      <div class="pt-6 max-w-4xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div
            class="bg-slate-800 p-4 rounded-[3px] border border-slate-700 text-center"
          >
            <div class="text-lg sm:text-xl font-bold text-emerald-400">
              DSN-MUI
            </div>
            <div
              class="text-[11px] text-slate-300 font-semibold uppercase tracking-wider mt-0.5"
            >
              Sertifikasi Syariah Resmi
            </div>
          </div>
          <div
            class="bg-slate-800 p-4 rounded-[3px] border border-slate-700 text-center"
          >
            <div class="text-lg sm:text-xl font-bold text-white">30+ Tahun</div>
            <div
              class="text-[11px] text-slate-300 font-semibold uppercase tracking-wider mt-0.5"
            >
              Pengawas Bank Indonesia
            </div>
          </div>
          <div
            class="bg-slate-800 p-4 rounded-[3px] border border-slate-700 text-center"
          >
            <div class="text-lg sm:text-xl font-bold text-emerald-400">
              ITB, NTU, Iowa
            </div>
            <div
              class="text-[11px] text-slate-300 font-semibold uppercase tracking-wider mt-0.5"
            >
              Alumni Kampus Terbaik
            </div>
          </div>
          <div
            class="bg-slate-800 p-4 rounded-[3px] border border-slate-700 text-center"
          >
            <div class="text-lg sm:text-xl font-bold text-white">GCG & ISO</div>
            <div
              class="text-[11px] text-slate-300 font-semibold uppercase tracking-wider mt-0.5"
            >
              Standarisasi Kualitas
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 1: SAMBUTAN CEO DENGAN FRAMED PORTRAIT & SIGNATURE -->
  <section id="sambutan" class="py-20 bg-white border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-[#1abc9c] uppercase tracking-widest block font-['Raleway']"
          >Pesan Dari Pimpinan</span
        >
        <h2
          class="text-2xl sm:text-3xl font-['Raleway'] font-bold text-[#333333] uppercase"
        >
          Sambutan Chief Executive Officer
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Amanah kepemimpinan dan komitmen Namia Syariah dalam mewujudkan
          ekosistem keuangan syariah yang berkeadilan.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <!-- Left Column: CEO Portrait & Credentials -->
        <div class="lg:col-span-4 space-y-4">
          <div
            class="border border-slate-200 p-2.5 bg-slate-50 rounded-[4px] shadow-sm"
          >
            <div class="relative overflow-hidden rounded-[2px] bg-slate-200">
              <img
                src="/images/team/p_syauqi_trim.jpg"
                alt="Ir. Syauki, MBA - CEO Namia Syariah"
                class="w-full h-auto object-cover"
              />
              <div
                class="absolute bottom-3 left-3 right-3 bg-slate-900 text-white p-3 rounded-[3px] text-center border border-slate-700"
              >
                <span
                  class="text-[10px] uppercase font-bold text-[#1abc9c] tracking-wider block"
                  >Chief Executive Officer</span
                >
                <h4 class="font-['Raleway'] font-bold text-sm uppercase">
                  Ir. Syauki, MBA
                </h4>
              </div>
            </div>
          </div>

          <!-- Academic & Leadership Credentials -->
          <div
            class="bg-slate-50 border border-slate-200 rounded-[4px] p-4 space-y-2.5 text-xs"
          >
            <div class="flex items-start gap-2 text-slate-700">
              <GraduationCap class="w-4 h-4 text-[#1abc9c] shrink-0 mt-0.5" />
              <span
                >Teknik Kimia ITB & MBA Nanyang Technological University
                (Singapore)</span
              >
            </div>
            <div class="flex items-start gap-2 text-slate-700">
              <Briefcase class="w-4 h-4 text-[#1abc9c] shrink-0 mt-0.5" />
              <span>20+ Tahun Pengalaman Multinasional & Technopreneurship</span
              >
            </div>
          </div>
        </div>

        <!-- Right Column: Official CEO Letter -->
        <div
          class="lg:col-span-8 bg-slate-50/60 border border-slate-200 rounded-[4px] p-6 sm:p-8 space-y-4 text-slate-700 text-sm leading-relaxed font-normal"
        >
          <div class="space-y-1 pb-3 border-b border-slate-200">
            <p class="font-bold text-slate-900 text-base">
              Bismillahhirrahmanirrahim
            </p>
            <p class="font-semibold text-slate-700">
              Assalamu'alaikum warahmatullahi wabarakatuh
            </p>
          </div>

          <p>
            Puji syukur kehadirat Allah SWT atas semua nikmat yang telah
            diberikan-Nya. Shalawat serta salam kita curahkan kepada junjungan
            kita Rasulullah Muhammad saw beserta keluarga, para sahabat dan
            ummatnya hingga akhir zaman.
          </p>

          <p>
            Sahabat Namia dan Rekan Mitra Terhormat, <strong
              class="text-slate-900"
              >PT Namia Finansial Teknologi (Namia Syariah)</strong
            >
            adalah perusahaan fintech yang bergerak pada layanan pendanaan dan pembiayaan
            berbasis teknologi informasi syariah (<em
              >Sharia P2P Financing & Investment</em
            >). Namia memiliki visi untuk menjadi platform terdepan kelas dunia
            dalam ekosistem ekonomi syariah digital. Dengan tagline
            <strong class="text-[#16a085]">"Smart Growth, Halal Impact"</strong
            >, Namia Syariah menghubungkan pendana dari berbagai belahan dunia
            dengan pelaku usaha riil dan UMKM produktif di Indonesia yang
            membutuhkan modal halal.
          </p>

          <p>
            Sebagai tonggak awal kebangkitan ekonomi umat, Namia memelopori
            pendanaan produktif dan inisiatif pembebasan dari jeratan pinjaman
            ribawi untuk memajukan kesejahteraan masyarakat. Untuk mempercepat
            pertumbuhannya, Namia bekerjasama dengan para pemangku kepentingan
            berpengalaman di bidang keuangan, baik regulator (OJK, Bank
            Indonesia, Kominfo) maupun asosiasi profesi (AFSI, Alumni ITB,
            Pagari).
          </p>

          <p>
            Sebagai strategi keunggulan tata kelola, Namia menerapkan adaptasi
            standardisasi internasional <strong class="text-slate-900"
              >ISO 9001 (Kualitas), ISO 27001 (Keamanan Informasi)</strong
            >, dan
            <strong class="text-slate-900"
              >ISO 26000 (Tanggung Jawab Sosial)</strong
            >. Untuk menjaring investasi, Namia memfokuskan penggalangan dana
            dari masyarakat luas serta diaspora Indonesia di luar negeri,
            kemudian menyalurkan pembiayaan secara produktif ke ekosistem UMKM
            lokal berpotensi tinggi.
          </p>

          <div
            class="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div class="space-y-1">
              <p class="font-semibold text-slate-800">
                Wassalamu'alaikum warahmatullahi wabarakatuh
              </p>
              <p class="text-xs text-slate-500">
                Jakarta, PT Namia Finansial Teknologi
              </p>
            </div>
            <div class="text-right sm:text-right">
              <h5
                class="text-base font-['Raleway'] font-bold text-slate-900 uppercase"
              >
                Ir. Syauki, MBA
              </h5>
              <span
                class="text-xs font-semibold text-[#16a085] uppercase tracking-wider"
                >Chief Executive Officer</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 2: DEWAN PENGAWAS SYARIAH (DPS) -->
  <section id="dps" class="py-20 bg-[#F9F9F9] border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-[#1abc9c] uppercase tracking-widest block font-['Raleway']"
          >Kepatuhan Fatwa DSN-MUI</span
        >
        <h2
          class="text-2xl sm:text-3xl font-['Raleway'] font-bold text-[#333333] uppercase"
        >
          Dewan Pengawas Syariah
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Mengawal dan mengawasi setiap transaksi agar senantiasa sesuai dengan
          prinsip-prinsip syariat Islam dan regulasi OJK.
        </p>
      </div>

      <!-- DPS Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {#each advisoryBoards as member}
          <div
            class="bg-white rounded-[3px] border border-slate-300 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div class="relative h-72 overflow-hidden bg-slate-100">
                <img
                  src={member.photo}
                  alt={member.fullname}
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/50"></div>
                <div class="absolute top-3 left-3">
                  <span
                    class="px-2.5 py-1 rounded-[2px] text-[10.5px] font-bold uppercase tracking-wider bg-emerald-700 text-white"
                  >
                    {member.job_title}
                  </span>
                </div>
                <div class="absolute bottom-3 left-4 right-4 text-white">
                  <h3 class="text-lg font-bold uppercase leading-snug">
                    {member.fullname}
                  </h3>
                  <div class="text-xs text-emerald-300 font-medium">
                    {member.education}
                  </div>
                </div>
              </div>

              <div class="p-5 space-y-3">
                <p class="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {member.biography}
                </p>
              </div>
            </div>

            <div class="p-5 pt-0">
              <button
                type="button"
                onclick={() => (activeMember = member)}
                class="button-4 w-full py-2 px-3 rounded-[3px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Lihat Profil Lengkap</span>
                <ArrowRight class="w-3.5 h-3.5 text-emerald-600" />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SECTION 3: DEWAN KOMISARIS -->
  <section id="komisaris" class="py-20 bg-white border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-emerald-700 uppercase tracking-widest block font-['Raleway']"
          >Pengawasan & Tata Kelola Perusahaan</span
        >
        <h2 class="text-2xl sm:text-3xl font-bold text-[#333333] uppercase">
          Dewan Komisaris
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Memastikan pelaksanaan prinsip kehati-hatian, manajemen risiko
          terukur, dan perlindungan optimal bagi seluruh pihak.
        </p>
      </div>

      <!-- Commissioners Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {#each commissioners as member}
          <div
            class="bg-white rounded-[3px] border border-slate-300 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div class="relative h-72 overflow-hidden bg-slate-100">
                <img
                  src={member.photo}
                  alt={member.fullname}
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/50"></div>
                <div class="absolute top-3 left-3">
                  <span
                    class="px-2.5 py-1 rounded-[2px] text-[10.5px] font-bold uppercase tracking-wider bg-slate-900 text-white"
                  >
                    {member.job_title}
                  </span>
                </div>
                <div class="absolute bottom-3 left-4 right-4 text-white">
                  <h3 class="text-lg font-bold uppercase leading-snug">
                    {member.fullname}
                  </h3>
                  <div class="text-xs text-emerald-300 font-medium">
                    {member.education}
                  </div>
                </div>
              </div>

              <div class="p-5 space-y-3">
                <p class="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {member.biography}
                </p>
              </div>
            </div>

            <div class="p-5 pt-0">
              <button
                type="button"
                onclick={() => (activeMember = member)}
                class="button-4 w-full py-2 px-3 rounded-[3px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Lihat Profil Lengkap</span>
                <ArrowRight class="w-3.5 h-3.5 text-emerald-600" />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SECTION 4: DEWAN DIREKSI -->
  <section id="direksi" class="py-20 bg-[#F9F9F9] border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-emerald-700 uppercase tracking-widest block font-['Raleway']"
          >Eksekutif & Kepemimpinan Operasional</span
        >
        <h2 class="text-2xl sm:text-3xl font-bold text-[#333333] uppercase">
          Dewan Direksi
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Menggerakkan inovasi platform, kemitraan strategis, dan keandalan
          teknologi finansial terdepan di Indonesia.
        </p>
      </div>

      <!-- Directors Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {#each directors as member}
          <div
            class="bg-white rounded-[3px] border border-slate-300 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div class="relative h-72 overflow-hidden bg-slate-100">
                <img
                  src={member.photo}
                  alt={member.fullname}
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/50"></div>
                <div class="absolute top-3 left-3">
                  <span
                    class="px-2.5 py-1 rounded-[2px] text-[10.5px] font-bold uppercase tracking-wider bg-emerald-700 text-white"
                  >
                    {member.job_title}
                  </span>
                </div>
                <div class="absolute bottom-3 left-4 right-4 text-white">
                  <h3 class="text-lg font-bold uppercase leading-snug">
                    {member.fullname}
                  </h3>
                  <div class="text-xs text-emerald-300 font-medium">
                    {member.education}
                  </div>
                </div>
              </div>

              <div class="p-5 space-y-3">
                <p class="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {member.biography}
                </p>
              </div>
            </div>

            <div class="p-5 pt-0">
              <button
                type="button"
                onclick={() => (activeMember = member)}
                class="button-4 w-full py-2 px-3 rounded-[3px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Lihat Profil Lengkap</span>
                <ArrowRight class="w-3.5 h-3.5 text-emerald-600" />
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- SECTION 5: TIM MANAJEMEN & OPERASIONAL -->
  <section id="manajemen" class="py-20 bg-white border-b border-[#ECECEC]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div class="heading-block text-center max-w-3xl mx-auto space-y-2">
        <span
          class="text-xs font-bold text-emerald-700 uppercase tracking-widest block font-['Raleway']"
          >Layanan Prima & Dedikasi Harian</span
        >
        <h2 class="text-2xl sm:text-3xl font-bold text-[#333333] uppercase">
          Tim Operasional & Manajemen
        </h2>
        <p class="text-xs sm:text-sm text-[#666666] leading-relaxed">
          Mengawal kelancaran penyaluran pembiayaan, transparansi pelaporan dana
          investor, dan operasional kantor.
        </p>
      </div>

      <!-- Staff Team Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {#each staffTeam as member}
          <div
            class="bg-white rounded-[3px] border border-slate-300 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div class="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={member.photo}
                  alt={member.fullname}
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/50"></div>
                <div class="absolute top-3 left-3">
                  <span
                    class="px-2.5 py-1 rounded-[2px] text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-white"
                  >
                    {member.job_title}
                  </span>
                </div>
                <div class="absolute bottom-3 left-4 right-4 text-white">
                  <h4 class="text-base font-bold uppercase leading-snug">
                    {member.fullname}
                  </h4>
                  <div class="text-[11px] text-emerald-300 font-medium">
                    {member.education}
                  </div>
                </div>
              </div>

              <div class="p-5 space-y-2">
                <p class="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {member.biography}
                </p>
              </div>
            </div>

            <div class="p-5 pt-0">
              <button
                type="button"
                onclick={() => (activeMember = member)}
                class="button-4 w-full py-2 px-3 rounded-[3px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Lihat Profil Lengkap</span>
                <ArrowRight class="w-3.5 h-3.5 text-emerald-600" />
              </button>
            </div>
          </div>
        {/each}
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
      <div class="space-y-1.5 font-sans">
        <h3
          class="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white"
        >
          Ingin Berkolaborasi Bersama Tim Namia?
        </h3>
        <p class="text-xs sm:text-sm text-emerald-100">
          Mulai langkah kebaikan dengan menjadi bagian dari permodalan halal
          atau ajukan pembiayaan usaha Anda.
        </p>
      </div>

      <div class="flex items-center gap-3 shrink-0">
        <a
          href="/investor"
          class="px-5 py-2.5 rounded-[3px] bg-white text-emerald-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors shadow-xs flex items-center gap-1.5 border border-white"
        >
          <span>Mulai Mendanai</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
        <a
          href="/borrower"
          class="px-5 py-2.5 rounded-[3px] bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5 border border-slate-700"
        >
          <span>Ajukan Modal</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </section>
</div>

<!-- BIO MODAL DETAIL MATCHING BOOTSTRAP PANEL -->
{#if activeMember}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60"
  >
    <div
      class="bg-white rounded-[3px] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-xl border border-slate-300 relative"
    >
      <button
        type="button"
        onclick={() => (activeMember = null)}
        class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-[2px] transition-colors cursor-pointer"
        aria-label="Tutup"
      >
        <X class="w-5 h-5" />
      </button>

      <div
        class="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left"
      >
        <img
          src={activeMember.photo}
          alt={activeMember.fullname}
          class="w-24 h-24 sm:w-28 sm:h-28 rounded-[2px] object-cover border border-slate-300 shadow-xs shrink-0"
        />
        <div class="space-y-1">
          <span
            class="text-xs font-bold text-emerald-700 uppercase tracking-wider block"
            >Profil Personil</span
          >
          <h3 class="text-xl font-bold text-slate-900 uppercase">
            {activeMember.fullname}
          </h3>
          <p class="text-xs font-semibold text-slate-500">
            {activeMember.job_title}
          </p>
          {#if activeMember.education}
            <p class="text-xs text-slate-500 font-normal pt-1">
              {activeMember.education}
            </p>
          {/if}
        </div>
      </div>

      <div
        class="p-4 bg-slate-50 rounded-[3px] border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-60 overflow-y-auto"
      >
        <p>{activeMember.biography}</p>
      </div>

      <div
        class="flex justify-between items-center pt-2 border-t border-slate-200"
      >
        <span class="text-xs text-slate-500 font-medium"
          >PT Namia Finansial Teknologi</span
        >
        <button
          type="button"
          onclick={() => (activeMember = null)}
          class="button-4-primary text-xs py-2 px-6 rounded-[3px] cursor-pointer font-bold uppercase tracking-wider"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
{/if}
