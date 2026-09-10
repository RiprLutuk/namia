<script lang="ts">
  import { CheckCircle2, ArrowRight, FileCheck, Users, ShieldAlert, Sparkles } from "lucide-svelte";

  const steps = [
    { num: "01", title: "Registrasi & Pengajuan Online", desc: "Isi data diri, profil usaha, dan unggah dokumen pendukung melalui formulir e-KYC Syarfi." },
    { num: "02", title: "Verifikasi & Penilaian Risiko", desc: "Tim credit analyst dan surveyor Syarfi melakukan evaluasi kelayakan usaha dan kesesuaian syariah." },
    { num: "03", title: "Penerbitan Proyek di Platform", desc: "Proyek pembiayaan ditayangkan kepada ribuan investor syariah terdaftar untuk proses penggalangan dana." },
    { num: "04", title: "Akad Notariil & Ijab Qabul", desc: "Penandatanganan akad (Murabahah, Mudharabah, atau Ijarah) secara sah di hadapan notaris/digital signature." },
    { num: "05", title: "Pencairan Dana ke Rekening", desc: "Dana pembiayaan dicairkan langsung ke rekening usaha Anda untuk belanja modal produktif." }
  ];

  const requirements = [
    "Warga Negara Indonesia (WNI) berusia minimal 21 tahun",
    "Memiliki usaha halal yang telah berjalan aktif minimal 1 tahun",
    "Memiliki legalitas dasar (NIB, SIUP, atau Surat Keterangan Usaha)",
    "Memiliki rekening bank atas nama pribadi atau badan usaha",
    "Rekening koran 3-6 bulan terakhir dengan arus kas positif",
    "Objek pembiayaan tidak bertentangan dengan syariat Islam"
  ];
</script>

<svelte:head>
  <title>Panduan Penerima Pembiayaan UMKM — Syarfi</title>
  <meta name="description" content="Kembangkan usaha Anda dengan pembiayaan modal kerja syariah tanpa agunan ribawi. Proses cepat, adil, dan transparan." />
</svelte:head>

<div class="space-y-16 pb-16">
  
  <!-- Hero Section -->
  <section class="bg-gradient-to-b from-emerald-50/70 to-white py-16 border-b border-slate-200/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-semibold">
        <Sparkles class="w-3.5 h-3.5 text-emerald-600" />
        <span>Solusi Modal Usaha Halal</span>
      </div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
        Dapatkan Pembiayaan Modal Kerja Tanpa Riba
      </h1>
      <p class="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
        Tumbuhkan omzet bisnis UMKM Anda dengan dukungan ribuan pendana syariah. Margin disepakati jelas di awal, tanpa bunga berbunga dan tanpa denda yang memberatkan.
      </p>
      <div class="pt-2">
        <a
          href="/onboarding"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all"
        >
          <span>Ajukan Pembiayaan Sekarang</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      </div>
    </div>
  </section>

  <!-- Step by Step Process -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-2xl mx-auto mb-12 space-y-2">
      <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Alur Pengajuan</span>
      <h2 class="text-3xl font-extrabold text-slate-900">5 Langkah Mudah Memperoleh Modal</h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
      {#each steps as s}
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 relative">
          <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-sm shadow-sm">
            {s.num}
          </div>
          <h4 class="text-base font-bold text-slate-900 leading-snug">{s.title}</h4>
          <p class="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Criteria & Requirements -->
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xs space-y-6">
      <div class="space-y-2">
        <h3 class="text-2xl font-bold text-slate-900">Kriteria & Persyaratan Penerima Pembiayaan</h3>
        <p class="text-sm text-slate-600">Pastikan profil usaha Anda telah memenuhi kriteria dasar di bawah ini sebelum mengajukan:</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {#each requirements as req}
          <div class="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-800">
            <CheckCircle2 class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{req}</span>
          </div>
        {/each}
      </div>

      <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="text-xs text-slate-500">Sudah memenuhi semua kriteria di atas?</span>
        <a
          href="/onboarding"
          class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
        >
          Mulai Isi Formulir Pengajuan
        </a>
      </div>
    </div>
  </section>

</div>
