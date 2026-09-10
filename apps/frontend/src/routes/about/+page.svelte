<script lang="ts">
  import { ShieldCheck, Award, Users, CheckCircle2, Building, HeartHandshake } from "lucide-svelte";

  const leaders = [
    {
      name: "Ir. M. Rois, M.Eng",
      role: "Komisaris Utama",
      category: "Komisaris",
      bio: "Pakar rekayasa sistem dan tata kelola bisnis dengan pengalaman lebih dari 25 tahun memimpin berbagai inisiatif korporasi dan pemberdayaan ekonomi umat."
    },
    {
      name: "Muhammad Syarif, S.E, M.M",
      role: "Direktur Utama",
      category: "Direksi",
      bio: "Praktisi perbankan dan keuangan syariah nasional dengan komitmen kuat memadukan kemajuan teknologi finansial dan prinsip muamalah murni."
    },
    {
      name: "Dr. H. Ahmad Fauzi, M.A",
      role: "Ketua Dewan Pengawas Syariah",
      category: "DPS",
      bio: "Akademisi dan anggota terafiliasi Dewan Syariah Nasional (DSN-MUI), memastikan setiap produk dan alur transaksi sesuai dengan Fatwa DSN-MUI."
    },
    {
      name: "Ustadz Ridwan Hakim, Lc., M.E.I",
      role: "Anggota Dewan Pengawas Syariah",
      category: "DPS",
      bio: "Lulusan Universitas Al-Azhar Kairo spesialisasi Fiqih Muamalah Kontemporer yang aktif mendampingi audit kepatuhan syariah berkala."
    }
  ];

  const values = [
    { title: "Shiddiq (Jujur)", desc: "Menjaga kejujuran dalam setiap pemaparan risiko dan data keuangan tanpa rekayasa." },
    { title: "Amanah (Dapat Dipercaya)", desc: "Memegang teguh kepercayaan pendana dan peminjam dalam mengelola dana halal." },
    { title: "Tabligh (Transparan)", desc: "Keterbukaan informasi akad, margin, bagi hasil, dan biaya tanpa ada klausul tersembunyi." },
    { title: "Fathonah (Cerdas & Profesional)", desc: "Menerapkan teknologi mutakhir dan analisis risiko mutakhir guna melindungi seluruh pihak." }
  ];
</script>

<svelte:head>
  <title>Tentang Kami — PT Syarfi Teknologi Finansial</title>
  <meta name="description" content="Profil perusahaan, visi misi, Dewan Direksi, dan Dewan Pengawas Syariah PT Syarfi Teknologi Finansial." />
</svelte:head>

<div class="space-y-16 pb-16">
  
  <!-- Hero Section -->
  <section class="bg-gradient-to-b from-emerald-50/70 to-white py-16 border-b border-slate-200/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold">
        <Building class="w-3.5 h-3.5 text-emerald-600" />
        <span>Profil Perusahaan</span>
      </div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
        Membangun Ekosistem Keuangan Berkah untuk Indonesia
      </h1>
      <p class="text-slate-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
        PT Syarfi Teknologi Finansial lahir dengan tekad mempertemukan para pelaku usaha UMKM produktif dengan masyarakat pemodal yang mendambakan investasi bebas riba.
      </p>
    </div>
  </section>

  <!-- Vision & Mission -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
          <ShieldCheck class="w-6 h-6" />
        </div>
        <h3 class="text-2xl font-bold text-slate-900">Visi Kami</h3>
        <p class="text-slate-600 text-sm leading-relaxed">
          Menjadi platform teknologi finansial syariah dan crowdfunding aggregator terdepan di Asia Tenggara yang paling amanah, transparan, serta berdaya jangkau luas dalam menumbuhkan ekonomi sektor riil umat.
        </p>
      </div>

      <div class="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
          <HeartHandshake class="w-6 h-6" />
        </div>
        <h3 class="text-2xl font-bold text-slate-900">Misi Kami</h3>
        <ul class="text-slate-600 text-sm space-y-2 leading-relaxed">
          <li class="flex items-start gap-2">
            <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Menyediakan akses pembiayaan modal kerja yang adil dan halal bagi pelaku UMKM.</span>
          </li>
          <li class="flex items-start gap-2">
            <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Memberikan sarana investasi alternatif berimbal hasil kompetitif bagi masyarakat luas.</span>
          </li>
          <li class="flex items-start gap-2">
            <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Mendorong literasi dan inklusi keuangan syariah berbasis teknologi mutakhir.</span>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Islamic Corporate Values -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-2xl mx-auto mb-10 space-y-2">
      <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Nilai-Nilai Luhur</span>
      <h2 class="text-3xl font-extrabold text-slate-900">4 Pilar Karakter Utama</h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each values as v}
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2.5">
          <h4 class="text-base font-bold text-slate-900">{v.title}</h4>
          <p class="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Dewan Direksi & Dewan Pengawas Syariah (DPS) -->
  <section id="dps" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
    <div class="text-center max-w-2xl mx-auto mb-12 space-y-2">
      <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Struktur Kepemimpinan</span>
      <h2 class="text-3xl font-extrabold text-slate-900">Dewan Pengawas & Direksi</h2>
      <p class="text-sm text-slate-600">Didukung para profesional berpengalaman serta ulama pakar Fiqih Muamalah.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each leaders as l}
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase {l.category === 'DPS' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}">
              {l.category}
            </span>
            <h4 class="text-base font-bold text-slate-900">{l.name}</h4>
            <p class="text-xs font-semibold text-emerald-700">{l.role}</p>
            <p class="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              {l.bio}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </section>

</div>
