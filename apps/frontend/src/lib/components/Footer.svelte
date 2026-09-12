<script lang="ts">
  import {
    Mail,
    Phone,
    MapPin,
    ChevronDown,
    CheckCircle,
    Send,
    ShieldCheck,
    Lock,
    Rss,
    ExternalLink
  } from "lucide-svelte";
  import Logo from "$lib/components/Logo.svelte";
  import { cmsStore } from "$lib/cms";
  import { API_BASE_URL, NAMIA_API_KEY } from "$lib/api";

  let isRiskOpen = $state(false);
  let newsletterEmail = $state("");
  let newsletterSuccess = $state(false);

  async function handleSubscribe(e: Event) {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await fetch(`${API_BASE_URL}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": NAMIA_API_KEY,
        },
        body: JSON.stringify({
          fullName: "Subscriber",
          email: newsletterEmail,
          phone: "080000000000",
          needCategory: "Newsletter",
          targetAmount: 0,
          targetTenorMonths: 0,
          message: "Langganan newsletter berkala via footer",
        }),
      });
      newsletterSuccess = true;
      setTimeout(() => {
        newsletterSuccess = false;
        newsletterEmail = "";
      }, 4000);
    } catch (e) {
      newsletterSuccess = true;
    }
  }
</script>

<footer class="bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] text-slate-700 mt-auto border-t-2 border-[#059669] shadow-inner">
  <!-- Main Footer Content -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
      <!-- Brand & Mission Column -->
      <div class="lg:col-span-2 space-y-4">
        <a href="/" class="inline-block">
          <Logo size="md" variant="dark" showBadge={true} showOjk={false} />
        </a>
        <p class="text-xs text-slate-600 leading-relaxed">
          <strong class="text-emerald-800 font-bold text-sm tracking-tight">
            {$cmsStore.siteSettings.tagline || "Smart Growth, Halal Impact."}
          </strong><br />
          Platform Financial Technology P2P Financing Syariah terpercaya di Indonesia
          berlandaskan filosofi An-Namaa' (pertumbuhan riil & produktif), bebas riba, gharar, dan maysir.
        </p>

        <div class="text-xs text-slate-600 space-y-1.5 pt-1">
          <div class="flex items-start gap-2">
            <MapPin class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong class="text-slate-900">
                {$cmsStore.siteSettings.companyName || "PT Namia Finansial Teknologi"}
              </strong><br />
              {$cmsStore.siteSettings.address || "Menara MTH 10th floor, Jl. MT Haryono Kav 23, Jakarta 12820"}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Phone class="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Telepon:</strong> {$cmsStore.siteSettings.phone || "(+62) 21 8378 2337"} &middot; 
              <strong>Fax:</strong> {$cmsStore.siteSettings.fax || "(+62) 21 8378 2338"}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <Mail class="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Email:</strong>
              <a href="mailto:{$cmsStore.siteSettings.email || 'salam@namia.id'}" class="text-emerald-800 font-semibold hover:underline">
                {$cmsStore.siteSettings.email || "salam@namia.id"}
              </a>
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Links 1: Produk & Layanan -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
          <span>Produk Finansial</span>
        </h4>
        <ul class="space-y-1.5 text-xs text-slate-600">
          <li>
            <a href="/borrower" class="hover:text-emerald-800 transition-colors flex items-center gap-1">
              <span>&rsaquo;</span>
              <span>Pembiayaan Barang (Murabahah)</span>
            </a>
          </li>
          <li>
            <a href="/borrower" class="hover:text-emerald-800 transition-colors flex items-center gap-1">
              <span>&rsaquo;</span>
              <span>Pembiayaan Jasa (Ijarah)</span>
            </a>
          </li>
          <li>
            <a href="/borrower" class="hover:text-emerald-800 transition-colors flex items-center gap-1">
              <span>&rsaquo;</span>
              <span>Pembiayaan Modal (Musyarakah)</span>
            </a>
          </li>
          <li>
            <a href="/borrower" class="hover:text-emerald-800 transition-colors flex items-center gap-1">
              <span>&rsaquo;</span>
              <span>Pembiayaan Kebajikan (Qardh)</span>
            </a>
          </li>
          <li>
            <a href="/aggregator" class="hover:text-emerald-800 transition-colors flex items-center gap-1">
              <span>&rsaquo;</span>
              <span>Katalog Fintech Aggregator</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Quick Links 2: Pusat Bantuan & Edukasi -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
          <span>Bantuan & Edukasi</span>
        </h4>
        <ul class="space-y-1.5 text-xs text-slate-600">
          <li>
            <a href="/investor" class="hover:text-emerald-800 transition-colors flex items-center gap-1">
              <span>&rsaquo;</span>
              <span>Panduan Pendana (Lender)</span>
            </a>
          </li>
          <li>
            <a href="/borrower" class="hover:text-emerald-800 transition-colors flex items-center gap-1">
              <span>&rsaquo;</span>
              <span>Panduan Penerima Dana (UMKM)</span>
            </a>
          </li>
          <li>
            <a href="/calculators" class="hover:text-emerald-800 transition-colors flex items-center gap-1">
              <span>&rsaquo;</span>
              <span>Kalkulator Simulasi Cicilan</span>
            </a>
          </li>
          <li>
            <a href="/blog" class="hover:text-emerald-800 transition-colors flex items-center gap-1">
              <span>&rsaquo;</span>
              <span>Edukasi Fiqih & Muamalah</span>
            </a>
          </li>
          <li>
            <a href="/contacts" class="hover:text-emerald-800 transition-colors flex items-center gap-1">
              <span>&rsaquo;</span>
              <span>Tanya Jawab (FAQ) & Hubungi</span>
            </a>
          </li>
          <li>
            <a href="/rss.xml" target="_blank" class="hover:text-emerald-800 transition-colors flex items-center gap-1 font-semibold text-amber-700">
              <span>&rsaquo;</span>
              <span>Sindikasi Berita (RSS 2.0)</span>
            </a>
          </li>
          <li>
            <a href="/sitemap.xml" target="_blank" class="hover:text-emerald-800 transition-colors flex items-center gap-1">
              <span>&rsaquo;</span>
              <span>Peta Situs (Sitemap XML)</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Newsletter Subscription Column -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1.5 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
          <span>Warta Berkala</span>
        </h4>
        <p class="text-xs text-slate-600 leading-relaxed">
          Dapatkan ringkasan proyek pembiayaan halal dan artikel muamalah langsung di inbox Anda:
        </p>

        <form onsubmit={handleSubscribe} class="space-y-2">
          <div class="flex">
            <input
              type="email"
              bind:value={newsletterEmail}
              required
              placeholder="Alamat email Anda"
              class="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-l-[4px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
            <button
              type="submit"
              class="btn btn-success !rounded-l-none text-xs px-3"
              aria-label="Kirim Langganan"
            >
              <Send class="w-3.5 h-3.5" />
            </button>
          </div>

          {#if newsletterSuccess}
            <div class="alert alert-success text-xs py-1.5 px-2.5 !mb-0 flex items-center gap-1.5">
              <CheckCircle class="w-3.5 h-3.5 shrink-0" />
              <span>Jazakallah khair! Anda telah terdaftar.</span>
            </div>
          {/if}
        </form>

        <div class="pt-2 text-[11px] text-slate-500">
          <span class="flex items-center gap-1">
            <Lock class="w-3 h-3 text-slate-400" />
            <span>Privasi terjaga, tanpa spam komersial.</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Mandatory Risk Disclosure Accordion (OJK POJK 10/2022) -->
    <div class="mt-8 pt-6 border-t border-slate-300/80">
      <div class="well well-small bg-white/70 border-slate-300">
        <button
          type="button"
          onclick={() => (isRiskOpen = !isRiskOpen)}
          class="w-full flex items-center justify-between text-left text-xs font-bold text-slate-800 cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-amber-600" />
            <span>PERINGATAN RISIKO FINANSIAL P2P LENDING (POJK NO. 10/POJK.05/2022)</span>
          </div>
          <ChevronDown class="w-4 h-4 text-slate-500 transition-transform {isRiskOpen ? 'rotate-180' : ''}" />
        </button>

        {#if isRiskOpen}
          <div class="mt-3 text-[11px] text-slate-600 leading-relaxed space-y-2 border-t border-slate-200 pt-3">
            <p>
              1. Layanan Pendanaan Bersama Berbasis Teknologi Informasi merupakan kesepakatan perdata antara Pemberi Dana dengan Penerima Dana, sehingga segala risiko yang timbul ditanggung sepenuhnya oleh masing-masing pihak.
            </p>
            <p>
              2. Risiko pendanaan atau gagal bayar ditanggung sepenuhnya oleh Pemberi Dana. Penyelenggara tidak menanggung kerugian finansial yang timbul dari kesepakatan tersebut.
            </p>
            <p>
              3. Penyelenggara dengan persetujuan dari Pengguna dapat memfasilitasi mitigasi risiko melalui pengalihan hak tagih, asuransi syariah, atau agunan riil sesuai fatwa DSN-MUI No. 117/DSN-MUI/II/2018.
            </p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Nostalgic Early Web 2000s & Early Bootstrap Badges Strip -->
    <div class="mt-6 pt-4 border-t border-slate-300 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
      <!-- Copyright & Info -->
      <div class="flex flex-wrap items-center gap-2 text-[11px]">
        <span>&copy; {new Date().getFullYear()} <strong>PT Namia Finansial Teknologi</strong>. Hak Cipta Dilindungi.</span>
        <span>&bull;</span>
        <a href="/about" class="hover:underline text-slate-600">Kebijakan Privasi</a>
        <span>&bull;</span>
        <a href="/contacts" class="hover:underline text-slate-600">Syarat &amp; Ketentuan</a>
        <span>&bull;</span>
        <a href="/backoffice/auth" class="hover:underline text-slate-400">Portal Admin</a>
      </div>

      <!-- Early 2000s Trust Badges & Web Standards -->
      <div class="flex items-center gap-2">
        <!-- XHTML 1.0 Badge -->
        <span class="inline-flex items-center border border-slate-400 rounded-[2px] overflow-hidden text-[9px] font-mono shadow-2xs">
          <span class="bg-slate-700 text-white px-1.5 py-0.5 font-bold">W3C</span>
          <span class="bg-slate-200 text-slate-800 px-1 py-0.5">XHTML 1.0</span>
        </span>

        <!-- 256-Bit SSL Badge -->
        <span class="inline-flex items-center border border-emerald-600 rounded-[2px] overflow-hidden text-[9px] font-mono shadow-2xs">
          <span class="bg-emerald-700 text-white px-1.5 py-0.5 font-bold">SSL</span>
          <span class="bg-emerald-100 text-emerald-900 px-1 py-0.5">256-Bit</span>
        </span>

        <!-- DSN MUI Badge -->
        <span class="inline-flex items-center border border-amber-600 rounded-[2px] overflow-hidden text-[9px] font-mono shadow-2xs">
          <span class="bg-amber-600 text-white px-1.5 py-0.5 font-bold">DSN-MUI</span>
          <span class="bg-amber-100 text-amber-900 px-1 py-0.5">Halal</span>
        </span>

        <!-- Early Web Resolution Stamp -->
        <span class="text-[10px] text-slate-400 hidden xl:inline font-mono">
          [Optimal: 1024&times;768+]
        </span>
      </div>
    </div>
  </div>
</footer>
