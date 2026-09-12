<script lang="ts">
  import { onMount } from "svelte";
  import {
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    TrendingUp,
    Sparkles,
    Calculator,
    Coins,
    Award,
    ChevronDown,
    Lock,
    Scale,
    Users,
    ChevronRight,
    Star,
    Clock,
    FileText,
    Building2,
    Check
  } from "lucide-svelte";
  import { cmsStore, fetchCmsContent } from "$lib/cms";
  import LiveStatsStrip from "$lib/components/LiveStatsStrip.svelte";
  import HadithQuote from "$lib/components/HadithQuote.svelte";
  import TrustEcosystem from "$lib/components/TrustEcosystem.svelte";
  import InvestmentCalculator from "$lib/components/calculators/InvestmentCalculator.svelte";

  onMount(() => {
    fetchCmsContent();
  });

  // CMS dynamic state
  let investorInfo = $derived($cmsStore.investorInfo);
  let liveDeals = $derived(investorInfo?.liveDeals || []);
  let lenderTiers = $derived(investorInfo?.lenderTiers || []);
  let steps = $derived(investorInfo?.steps || []);
  let safetyMeasures = $derived(investorInfo?.safetyMeasures || []);
  let testimonials = $derived(
    ($cmsStore.testimonials || []).filter((t) => t.type === "investor")
  );

  let faqs = $derived(
    $cmsStore.faqs?.length
      ? $cmsStore.faqs
          .filter((f) => f.isInvestor)
          .map((f) => ({ q: f.question || (f as any).q, a: f.answer || (f as any).a }))
      : []
  );

  // Filters & Tabs
  let selectedDealFilter = $state<string>("all");
  let openFaqIndex = $state<number | null>(0);

  let filteredDeals = $derived(
    selectedDealFilter === "all"
      ? liveDeals
      : liveDeals.filter((d) =>
          d.contract.toLowerCase().includes(selectedDealFilter.toLowerCase())
        )
  );

  // Hero Quick Estimator State (Matching Homepage Estimator Theme)
  let heroAmount = $state<number>(25_000_000);
  let heroTenor = $state<number>(6);
  let heroRate = $state<number>(16.0);

  let heroProfit = $derived(
    Math.round(heroAmount * (heroRate / 100) * (heroTenor / 12))
  );
  let heroTotalReturn = $derived(heroAmount + heroProfit);

  function formatRp(val: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  }

  // 3-step escrow flow
  const escrowStages = [
    {
      num: "01",
      title: "Lender / Investor",
      desc: "Transfer via Virtual Account Bank Syariah resmi atas nama masing-masing pengguna."
    },
    {
      num: "02",
      title: "Rekening Escrow Penampung",
      desc: "Bank Syariah Indonesia (BSI) / Bank Muamalat. Kas penampung terpisah penuh dari aset PT."
    },
    {
      num: "03",
      title: "UMKM Terverifikasi",
      desc: "Penyaluran bertahap seusai verifikasi invoice & kesepakatan akad muamalah sah."
    }
  ];
</script>

<svelte:head>
  <title>Portal Pendanaan & Investor Syariah | Namia Syariah — Smart Growth, Halal Impact</title>
  <meta
    name="description"
    content="Portal investasi & pendanaan produktif syariah berizin OJK. Imbal hasil 12%-18% p.a. bebas riba dengan proteksi escrow bank syariah dan pengawasan DPS DSN-MUI."
  />
</svelte:head>

<div class="investor-page space-y-0">
  <!-- 1. HERO UNIT: ICONIC TWITTER BOOTSTRAP 2 / WEB 2.0 JUMBOTRON MASTHEAD (IDENTICAL TO HOMEPAGE) -->
  <section class="jumbotron-masthead !text-left relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <!-- Authentic Web 2.0 Corner Ribbon anchored to Content Container -->
      <div class="ribbon-corner-container hidden md:block">
        <div class="ribbon-web20">Pendanaan Halal</div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- LEFT COLUMN: VALUE PROPOSITION & ACTION (7 cols) -->
        <div class="lg:col-span-7 space-y-6 text-left">
          <!-- Regulatory & Trust Badges -->
          <div class="inline-flex flex-wrap items-center gap-2">
            <span class="badge badge-inverse text-xs py-1 px-3 font-bold inline-flex items-center gap-1.5 shadow-xs">
              <Award class="w-3.5 h-3.5 text-amber-400 inline" />
              {investorInfo?.heroBadgeContract || "FATWA DSN-MUI NO. 117"}
            </span>
            <span class="badge badge-info hidden sm:inline-flex text-xs py-1 px-3 font-bold shadow-xs">
              ISO 27001 SECURE
            </span>
            <span class="badge badge-success hidden sm:inline-flex text-xs py-1 px-3 font-bold shadow-xs">
              {investorInfo?.heroBadge || "BERIZIN & DIAWASI OJK"}
            </span>
          </div>

          <!-- Headline & Subtitle -->
          <div class="space-y-3">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              {investorInfo?.heroTitle || "Tumbuhkan Aset dengan"} <br />
              <span class="text-emerald-700">{investorInfo?.heroHighlight || "Imbal Hasil Halal & Berkah"}</span>
            </h1>
            <p class="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-none">
              {investorInfo?.heroLead || "Salurkan pendanaan langsung ke proyek UMKM produktif pilihan. Nikmati imbal hasil kompetitif hingga 18% p.a. dengan transparansi akad syariah tanpa riba, diawasi langsung oleh DSN-MUI."}
            </p>
          </div>

          <!-- 3-Item Feature Highlight Cards in Clean Style (Identical to Homepage) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div class="p-3 bg-white border border-slate-200 rounded-md shadow-2xs">
              <div class="text-[11px] font-bold uppercase tracking-wide text-emerald-700 flex items-center gap-1.5">
                <Coins class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Imbal Hasil</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 mt-1 font-mono">
                {investorInfo?.heroReturnRange || "12% - 18% p.a."}
              </div>
              <div class="text-[11px] text-slate-600 font-medium">Bagi hasil riil proyek</div>
            </div>
            <div class="p-3 bg-white border border-slate-200 rounded-md shadow-2xs">
              <div class="text-[11px] font-bold uppercase tracking-wide text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Minimal Alokasi</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-slate-900 mt-1 font-mono">
                {investorInfo?.heroMinInvestment || "Rp 1.000.000"}
              </div>
              <div class="text-[11px] text-slate-600 font-medium">Mudah & inklusif</div>
            </div>
            <div class="p-3 bg-white border border-slate-200 rounded-md shadow-2xs">
              <div class="text-[11px] font-bold uppercase tracking-wide text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Kelancaran TKB90</span>
              </div>
              <div class="text-sm sm:text-base font-extrabold text-emerald-800 mt-1 font-mono">
                {investorInfo?.heroTkb90 || "100%"}
              </div>
              <div class="text-[11px] text-slate-600 font-medium">NPF Terjaga 0.00%</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
            <a
              href="#bursa-proyek"
              class="btn btn-primary btn-large font-bold inline-flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
            >
              <span>Katalog Proyek Siap Didanai</span>
              <ArrowRight class="w-4 h-4" />
            </a>
            <a
              href="#kalkulator-interaktif"
              class="btn btn-default btn-large font-bold inline-flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
            >
              <Calculator class="w-4 h-4 text-slate-700" />
              <span>Simulasi Portofolio</span>
            </a>
          </div>

          <!-- Trust Badges Under Hero -->
          <div class="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-xs text-slate-600 pt-2 border-t border-slate-300">
            <span class="inline-flex items-center gap-1.5 text-slate-700 font-medium">
              <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Akad Muamalah Riil</span>
            </span>
            <span class="inline-flex items-center gap-1.5 text-slate-700 font-medium">
              <Lock class="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Rekening Escrow Bank Syariah</span>
            </span>
            <span class="inline-flex items-center gap-1.5 text-slate-700 font-medium">
              <Award class="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Diawasi DPS DSN-MUI</span>
            </span>
          </div>
        </div>

        <!-- RIGHT COLUMN: INTERACTIVE QUICK ESTIMATOR WIDGET (5 cols, Identical styling to Homepage) -->
        <div class="lg:col-span-5 text-left">
          <div class="panel !mb-0 shadow-lg border border-slate-300 rounded-lg overflow-hidden bg-white text-slate-800">
            <!-- Early Bootstrap 2 Panel Header -->
            <div class="bg-slate-100 border-b border-slate-300 py-2.5 px-4 flex items-center justify-between">
              <span class="text-xs sm:text-sm font-bold text-slate-800 uppercase flex items-center gap-1.5">
                <Calculator class="w-4 h-4 text-emerald-700 inline" />
                Kalkulator Cepat Pendanaan
              </span>
              <span class="badge badge-success text-[10px] font-mono font-bold uppercase">
                Imbal Hasil s/d 18%
              </span>
            </div>

            <div class="panel-body !p-5 space-y-4 text-slate-800 bg-white">
              <div class="space-y-3.5">
                <div>
                  <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                    <span>Nominal Alokasi Pendanaan:</span>
                    <span class="font-bold text-emerald-700 font-mono text-sm">
                      {formatRp(heroAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max="100000000"
                    step="1000000"
                    bind:value={heroAmount}
                    class="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded"
                  />
                  <div class="flex justify-between text-[10px] text-slate-600 font-mono font-medium">
                    <span>Rp 1 Jt</span>
                    <span>Rp 50 Jt</span>
                    <span>Rp 100 Jt</span>
                  </div>
                </div>

                <div>
                  <span class="block text-xs font-semibold text-slate-700 mb-1">Pilihan Tenor:</span>
                  <div class="grid grid-cols-3 gap-1.5">
                    {#each [3, 6, 12] as t}
                      <button
                        type="button"
                        class="btn btn-small font-bold text-xs {heroTenor === t ? 'btn-primary active' : 'btn-default'}"
                        onclick={() => heroTenor = t}
                      >
                        {t} Bulan
                      </button>
                    {/each}
                  </div>
                </div>

                <!-- Simulation Output Box -->
                <div class="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
                  <div class="flex justify-between text-slate-600">
                    <span>Estimasi Imbal Hasil ({heroRate}% p.a.):</span>
                    <span class="font-bold text-emerald-700 font-mono">+{formatRp(heroProfit)}</span>
                  </div>
                  <div class="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1.5">
                    <span>Total Pengembalian:</span>
                    <span class="font-mono text-emerald-800 text-sm">{formatRp(heroTotalReturn)}</span>
                  </div>
                </div>

                <a
                  href="#bursa-proyek"
                  class="btn btn-primary btn-large font-bold w-full text-center flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Pilih Proyek & Danai Sekarang</span>
                  <ArrowRight class="w-4 h-4" />
                </a>

                <p class="text-[10.5px] text-slate-500 text-center mb-0">
                  *Simulasi proyeksi matematis berdasarkan rata-rata imbal hasil riil proyek Namia Syariah.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 2. REUSABLE LIVE STATS STRIP (IDENTICAL TO HOMEPAGE) -->
  <LiveStatsStrip />

  <!-- 3. REUSABLE HADITH / FIQIH QUOTE BANNER -->
  <section class="py-8 sm:py-10 bg-[#f8fafc] border-b border-slate-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <HadithQuote
        quote="Rasulullah SAW bersabda: 'Sebaik-baik manusia adalah yang paling bermanfaat bagi sesamanya.' Menyalurkan modal produktif untuk menggerakkan UMKM adalah ikhtiar melipatgandakan manfaat dan keberkahan harta."
        origin="HR. Ahmad & Thabrani — Fiqih Muamalah Syariah"
      />
    </div>
  </section>

  <!-- 4. BURSA INVESTASI AKTIF (KATALOG PROSPEKTUS PROYEK) -->
  <section id="bursa-proyek" class="py-12 sm:py-16 bg-white border-b border-slate-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="heading-block text-center mb-8">
        <h2>Katalog Prospektus Proyek Siap Didanai</h2>
        <span>Daftar proyek UMKM produktif yang telah lolos credit scoring 5C dan siap menerima alokasi dana secara transparan</span>
      </div>

      <!-- Filter Tabs & Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div class="flex flex-wrap items-center gap-1.5">
          {#each [
            { id: "all", label: "Semua Akad" },
            { id: "murabahah", label: "Murabahah" },
            { id: "supply chain", label: "Supply Chain" },
            { id: "musyarakah", label: "Musyarakah" },
            { id: "ijarah", label: "Ijarah" }
          ] as cat}
            <button
              type="button"
              class="btn btn-small font-bold text-xs {selectedDealFilter === cat.id ? 'btn-primary' : 'btn-default'}"
              onclick={() => selectedDealFilter = cat.id}
            >
              {cat.label}
            </button>
          {/each}
        </div>
        <div class="text-xs text-slate-500 font-mono">
          Menampilkan <strong class="text-slate-800">{filteredDeals.length}</strong> proyek aktif
        </div>
      </div>

      <!-- Clean 2000s Table of Projects -->
      <div class="overflow-x-auto border border-slate-300 rounded-[3px] shadow-2xs">
        <table class="table table-bordered table-striped text-xs mb-0 bg-white">
          <thead class="bg-slate-100 text-slate-700 uppercase font-mono tracking-wider text-[11px]">
            <tr>
              <th class="py-3 px-3 text-left">ID Proyek</th>
              <th class="py-3 px-3 text-left">Nama Proyek & Calon Mitra</th>
              <th class="py-3 px-3 text-left">Sektor Usaha</th>
              <th class="py-3 px-3 text-left">Plafon Target</th>
              <th class="py-3 px-3 text-left">Progres Pendanaan</th>
              <th class="py-3 px-3 text-center">Tenor</th>
              <th class="py-3 px-3 text-center">Est. Bagi Hasil</th>
              <th class="py-3 px-3 text-center">Rating 5C</th>
              <th class="py-3 px-3 text-center">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 font-sans">
            {#each filteredDeals as deal}
              <tr class="hover:bg-emerald-50/40 transition-colors">
                <td class="py-3 px-3 font-mono font-bold text-slate-700">{deal.id}</td>
                <td class="py-3 px-3">
                  <div class="font-bold text-slate-900 text-xs">{deal.title}</div>
                  <div class="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span>{deal.borrower}</span>
                    <span>&bull;</span>
                    <span class="text-emerald-700 font-semibold">{deal.contract}</span>
                  </div>
                </td>
                <td class="py-3 px-3 text-slate-700">{deal.sector}</td>
                <td class="py-3 px-3 font-mono font-bold text-slate-900">{deal.targetAmount}</td>
                <td class="py-3 px-3">
                  <div class="flex items-center gap-2">
                    <div class="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div class="bg-emerald-600 h-1.5 rounded-full" style="width: {deal.fundedPercent}%"></div>
                    </div>
                    <span class="font-mono text-[11px] font-bold text-emerald-800">{deal.fundedPercent}%</span>
                  </div>
                </td>
                <td class="py-3 px-3 text-center font-mono font-bold text-slate-800">{deal.tenor}</td>
                <td class="py-3 px-3 text-center font-mono font-bold text-emerald-700">{deal.yieldRate}</td>
                <td class="py-3 px-3 text-center">
                  <span class="badge badge-success text-[10px] font-mono font-bold px-2 py-0.5">
                    {deal.rating}
                  </span>
                </td>
                <td class="py-3 px-3 text-center">
                  <a href="/aggregator" class="btn btn-primary btn-mini font-bold inline-flex items-center gap-1">
                    <span>Danai</span>
                    <ArrowRight class="w-3 h-3" />
                  </a>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <div class="text-center pt-2">
        <a href="/aggregator" class="btn btn-default btn-large font-bold inline-flex items-center gap-2">
          <span>Lihat Semua Proyek Aktif di Katalog Lengkap</span>
          <ChevronRight class="w-4 h-4 text-emerald-700" />
        </a>
      </div>
    </div>
  </section>

  <!-- 5. REUSABLE KALKULATOR INVESTASI (IDENTICAL COMPONENT TO HOMEPAGE) -->
  <section id="kalkulator-interaktif" class="py-12 sm:py-16 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#ffffff] border-b border-slate-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="heading-block text-center mb-8">
        <h2>Simulasi Portofolio & Imbal Hasil Syariah</h2>
        <span>Kalkulasikan proyeksi pengembalian modal dan arus kas masuk secara presisi berdasarkan akad bagi hasil mudharabah</span>
      </div>

      <InvestmentCalculator />
    </div>
  </section>

  <!-- 6. ARSITEKTUR ESCROW & SEGREGASI DANA (CLEAN WEB 2.0 WHITE & SLATE STYLE) -->
  <section id="arsitektur-escrow" class="py-12 sm:py-16 bg-white border-b border-slate-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="heading-block text-center mb-8">
        <h2>Arsitektur Pengamanan Dana & Rekening Escrow Terpisah</h2>
        <span>Dana pendana tidak pernah bercampur dengan kas operasional PT Namia Finansial Teknologi. Setiap rupiah tersimpan aman dalam escrow bank syariah resmi.</span>
      </div>

      <!-- 3 Flow Stages Diagram -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {#each escrowStages as stage}
          <div class="panel !mb-0 border border-slate-300 rounded-[3px] bg-slate-50 p-5 text-center relative shadow-2xs">
            <div class="w-8 h-8 rounded-full bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center mx-auto mb-2">
              {stage.num}
            </div>
            <h4 class="font-bold text-sm text-slate-900 uppercase tracking-tight">{stage.title}</h4>
            <p class="text-xs text-slate-600 mt-1 mb-0">{stage.desc}</p>
          </div>
        {/each}
      </div>

      <!-- 4 Security Pillar Features Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {#each safetyMeasures as feat}
          <div class="p-4 bg-slate-50 border border-slate-200 rounded-[3px] space-y-1.5">
            <span class="badge badge-inverse text-[10px] uppercase font-bold font-mono px-2 py-0.5">
              {feat.badge}
            </span>
            <h5 class="text-xs font-bold text-slate-900 uppercase mt-1 mb-0">{feat.title}</h5>
            <p class="text-[11px] text-slate-600 mb-0">{feat.desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- 7. TINGKATAN AKUN PENDANA & PRIVILESE KHUSUS -->
  <section id="tingkatan-lender" class="py-12 sm:py-16 bg-[#f8fafc] border-b border-slate-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="heading-block text-center mb-8">
        <h2>Tingkatan Akun Pendana & Privilese Khusus</h2>
        <span>Tingkatkan portofolio Anda untuk memperoleh akses eksklusif, fitur auto-allocation, dan dukungan dedicated manager</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each lenderTiers as tier}
          <div class="panel !mb-0 border border-slate-300 rounded-[3px] overflow-hidden bg-white shadow-2xs flex flex-col justify-between">
            <div>
              <div
                class="p-4 text-center text-white"
                style="background: {tier.badge.includes('BRONZE') ? '#334155' : tier.badge.includes('SILVER') ? '#065f46' : '#92400e'};"
              >
                <span class="text-[10px] font-mono uppercase font-bold tracking-widest block opacity-90">{tier.badge}</span>
                <h4 class="text-base font-bold uppercase text-white mt-0.5 mb-1">{tier.name}</h4>
                <div class="text-xs font-mono font-bold bg-black/20 py-1 px-3 rounded inline-block">
                  Komitmen: {tier.minCommitment}
                </div>
              </div>
              <div class="p-5 space-y-3 text-xs">
                <div class="font-bold text-slate-700 uppercase text-[11px] border-b border-slate-200 pb-1">
                  Fasilitas & Privilese:
                </div>
                <ul class="space-y-2 text-slate-600">
                  {#each tier.features as perk}
                    <li class="flex items-start gap-2">
                      <Check class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </li>
                  {/each}
                </ul>
              </div>
            </div>
            <div class="p-4 bg-slate-50 border-t border-slate-200">
              <a href="/onboarding" class="btn btn-default btn-small font-bold w-full text-center block">
                Buka Akun {tier.name} &rarr;
              </a>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- 8. 5 LANGKAH MEMULAI PENDANAAN -->
  <section id="alur-kerja" class="py-12 sm:py-16 bg-white border-b border-slate-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="heading-block text-center mb-8">
        <h2>5 Langkah Memulai Pendanaan di Namia Syariah</h2>
        <span>Alur pendanaan sederhana, aman, dan 100% terintegrasi secara digital dari pendaftaran hingga penerimaan bagi hasil.</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {#each steps as step}
          <div class="panel !mb-0 border border-slate-300 rounded-[3px] bg-slate-50 p-4 flex flex-col justify-between shadow-2xs">
            <div class="space-y-2">
              <div class="flex items-center justify-between pb-2 border-b border-slate-200">
                <span class="font-mono text-xs font-bold text-slate-900">{step.num}</span>
                <span class="badge badge-success text-[10px] uppercase font-bold font-mono">Langkah {step.step}</span>
              </div>
              <h5 class="text-xs font-bold text-slate-900 uppercase leading-snug">{step.title}</h5>
            </div>
            <p class="text-[11px] text-slate-600 mt-2 pt-2 border-t border-slate-200 leading-relaxed mb-0">
              {step.desc}
            </p>
          </div>
        {/each}
      </div>

      <div class="text-center pt-2">
        <a href="/onboarding" class="btn btn-primary btn-large font-bold inline-flex items-center gap-2">
          <span>Buka Akun & Mulai Danai Sekarang</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      </div>
    </div>
  </section>

  <!-- 9. REUSABLE TRUST ECOSYSTEM (LOGOS REGULATOR OJK, DSN-MUI, AFSI, KOMINFO & MITRA BANK SYARIAH) -->
  <TrustEcosystem
    title="Terdaftar, Berizin & Diawasi Resmi"
    subtitle="Penyelenggaraan pendanaan syariah berizin penuh di bawah regulasi OJK serta diawasi langsung oleh Dewan Pengawas Syariah DSN-MUI bersama mitra perbankan syariah terkemuka."
  />

  <!-- 10. TESTIMONI PENDANA -->
  <section id="testimoni-lender" class="py-12 sm:py-16 bg-[#f8fafc] border-b border-slate-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div class="heading-block text-center mb-8">
        <h2>Suara & Pengalaman Para Pendana</h2>
        <span>Dengarkan kisah para profesional dan institusi yang telah merasakan keberkahan dan transparansi imbal hasil di Namia Syariah.</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each testimonials as t}
          <div class="panel !mb-0 border border-slate-300 rounded-[3px] bg-white p-5 flex flex-col justify-between shadow-2xs space-y-4">
            <div>
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <div class="flex items-center gap-1 text-amber-500">
                  {#each Array(5) as _}
                    <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {/each}
                </div>
                <span class="badge badge-success text-[10px] uppercase font-bold font-mono">
                  {t.type === 'investor' ? 'Lender Terverifikasi' : 'Mitra Terverifikasi'}
                </span>
              </div>
              <p class="text-xs text-slate-700 italic leading-relaxed pt-3 mb-0">
                "{t.content}"
              </p>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <div class="font-bold text-slate-900">{t.name}</div>
                <div class="text-[11px] text-slate-500">{t.businessName || t.role}</div>
              </div>
              {#if t.fundedAmount}
                <div class="text-right">
                  <div class="text-[10px] text-slate-500 uppercase font-mono">Portofolio</div>
                  <div class="font-mono font-bold text-emerald-700 text-xs">{t.fundedAmount}</div>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- 11. FAQ PENDANAAN SYARIAH -->
  <section id="edukasi-faq" class="py-12 sm:py-16 bg-white border-b border-slate-300">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
      <div class="heading-block text-center mb-8">
        <h2>Pertanyaan Umum Seputar Pendanaan Syariah</h2>
        <span>Pelajari mekanisme perlindungan modal, perpajakan, dan keabsahan hukum muamalah di Namia Syariah.</span>
      </div>

      <div class="space-y-3">
        {#each faqs as faq, idx}
          <div class="panel !mb-0 border border-slate-300 rounded-[3px] bg-white overflow-hidden shadow-2xs">
            <button
              type="button"
              class="w-full py-3.5 px-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between gap-3 bg-slate-50/50 hover:bg-slate-100 transition-colors"
              onclick={() => openFaqIndex = openFaqIndex === idx ? null : idx}
            >
              <span>{faq.q}</span>
              <ChevronDown class="w-4 h-4 text-slate-500 transition-transform {openFaqIndex === idx ? 'rotate-180 text-emerald-700' : ''}" />
            </button>
            {#if openFaqIndex === idx}
              <div class="p-4 text-xs text-slate-700 leading-relaxed border-t border-slate-200 bg-white">
                {faq.a}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- 12. SOLID RETRO CTA BANNER (IDENTICAL TO HOMEPAGE & SUBPAGE) -->
  <section class="py-8 text-white text-center" style="background: linear-gradient(180deg, #059669 0%, #047857 100%); border-top: 1px solid #065f46; border-bottom: 1px solid #065f46;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-left space-y-1">
        <h3 class="text-xl font-bold uppercase tracking-wider text-white mb-0">
          {investorInfo?.ctaTitle || "Siap Memulai Pendanaan Syariah?"}
        </h3>
        <p class="text-xs text-emerald-100 mb-0">
          {investorInfo?.ctaSubtitle || "Buka akun Anda dalam 3 menit dan pilih proyek UMKM produktif dengan imbal hasil berkah."}
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <a href={investorInfo?.ctaButtonUrl || "/aggregator"} class="btn btn-default btn-large font-bold">
          <span>{investorInfo?.ctaButtonText || "Katalog Proyek Aktif"}</span>
          <ArrowRight class="w-4 h-4 inline ml-1 text-emerald-700" />
        </a>
      </div>
    </div>
  </section>
</div>
