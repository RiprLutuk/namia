<script lang="ts">
  import { TrendingUp, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Scale, Heart } from "lucide-svelte";
  import InvestmentCalculator from "$lib/components/calculators/InvestmentCalculator.svelte";

  const benefits = [
    {
      title: "Bagi Hasil Kompetitif",
      desc: "Proyeksi imbal hasil bersih hingga 10% - 15% p.a yang berasal dari keuntungan riil usaha yang didanai."
    },
    {
      title: "Akad Muamalah Murni",
      desc: "Seluruh portofolio menggunakan akad syariah terverifikasi DPS (Mudharabah, Musyarakah, Wakalah bil Ujrah)."
    },
    {
      title: "Mitigasi Risiko Berlapis",
      desc: "Analisis kredit ketat, jaminan fidusia/giro mundur, serta proteksi asuransi kredit syariah untuk meminimalkan gagal bayar."
    },
    {
      title: "Pemberdayaan Sektor Riil",
      desc: "Dana Anda berputar langsung membantu pedagang, petani, dan wirausaha lokal meningkatkan kapasitas produksinya."
    }
  ];
</script>

<svelte:head>
  <title>Panduan Pendana & Investor Syariah — Syarfi</title>
  <meta name="description" content="Salurkan dana ke sektor riil produktif dengan imbal hasil bagi hasil menarik tanpa riba. Terdaftar OJK dan diawasi DPS." />
</svelte:head>

<div class="space-y-16 pb-16">
  
  <!-- Hero Section -->
  <section class="bg-gradient-to-b from-sky-50/70 to-white py-16 border-b border-slate-200/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 text-sky-800 text-xs font-semibold">
        <TrendingUp class="w-3.5 h-3.5 text-sky-600" />
        <span>Pendanaan Halal Berkelanjutan</span>
      </div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
        Investasi Berkah, Tumbuh Bersama Sektor Riil
      </h1>
      <p class="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
        Raih imbal hasil bagi hasil yang adil sekaligus menjadi bagian dari kebangkitan ekonomi UMKM Indonesia tanpa rasa cemas akan riba.
      </p>
      <div class="pt-2">
        <a
          href="/aggregator?category=reksa-dana-syariah"
          class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-md transition-all"
        >
          <span>Eksplorasi Proyek Pendanaan</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      </div>
    </div>
  </section>

  <!-- Benefits Grid -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-2xl mx-auto mb-12 space-y-2">
      <span class="text-xs font-bold uppercase tracking-wider text-sky-700">Keunggulan Menjadi Pendana</span>
      <h2 class="text-3xl font-extrabold text-slate-900">Mengapa Memilih Syarfi?</h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each benefits as b}
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div class="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <CheckCircle2 class="w-5 h-5" />
          </div>
          <h4 class="text-base font-bold text-slate-900">{b.title}</h4>
          <p class="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Interactive Investment Calculator -->
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center max-w-xl mx-auto mb-8 space-y-2">
      <h3 class="text-2xl font-bold text-slate-900">Hitung Potensi Imbal Hasil Anda</h3>
      <p class="text-xs text-slate-500">Gunakan simulator untuk menghitung proyeksi akumulasi bagi hasil modal Anda.</p>
    </div>
    <InvestmentCalculator />
  </section>

</div>
