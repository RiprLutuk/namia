<script lang="ts">
  import {
    Mail,
    Phone,
    MapPin,
    ChevronDown,
    CheckCircle,
    Send,
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

<footer class="bg-slate-50/80 text-slate-600 mt-auto border-t border-slate-200">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
      <!-- Brand & Mission Column -->
      <div class="lg:col-span-2 space-y-4">
        <a href="/" class="inline-block">
          <Logo size="md" variant="dark" showBadge={true} showOjk={false} />
        </a>
        <p class="text-xs text-slate-700 leading-relaxed">
          <strong class="text-emerald-800 font-bold text-sm tracking-tight"
            >{$cmsStore.siteSettings.tagline ||
              "Smart Growth, Halal Impact."}</strong
          ><br />
          <span class="text-slate-500"
            >Platform Financial Technology P2P Financing Syariah Terpercaya
            berlandaskan filosofi An-Namaa' (pertumbuhan riil & produktif),
            bebas riba, gharar, dan maysir.</span
          >
        </p>

        <div
          class="pt-2 text-xs text-slate-600 flex flex-col gap-2.5 bg-[url('/images/world-map.png')] bg-no-repeat bg-contain"
        >
          <div class="flex items-start gap-2.5">
            <MapPin class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong class="text-slate-800"
                >{$cmsStore.siteSettings.companyName ||
                  "PT Namia Finansial Teknologi"}</strong
              ><br />
              {$cmsStore.siteSettings.address ||
                "Menara MTH 10th floor, Jl. MT Haryono Kav 23, Jakarta 12820"}
            </div>
          </div>
          <div class="flex items-center gap-2.5">
            <Phone class="w-4 h-4 text-emerald-600 shrink-0" />
            <span
              ><strong class="text-slate-800">Phone:</strong>
              {$cmsStore.siteSettings.phone || "(+62) 21 8378 2337"} &middot;
              <strong class="text-slate-800">Fax:</strong>
              {$cmsStore.siteSettings.fax || "(+62) 21 8378 2338"}</span
            >
          </div>
          <div class="flex items-center gap-2.5">
            <Mail class="w-4 h-4 text-emerald-600 shrink-0" />
            <span
              ><strong class="text-slate-800">Email:</strong>
              <a
                href="mailto:{$cmsStore.siteSettings.email || 'salam@namia.id'}"
                class="text-emerald-700 font-medium hover:underline"
                >{$cmsStore.siteSettings.email || "salam@namia.id"}</a
              ></span
            >
          </div>
        </div>
      </div>

      <!-- Quick Links 1: Produk & Layanan -->
      <div class="space-y-3">
        <h4
          class="text-xs font-['Raleway'] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between"
        >
          <span>Produk Namia</span>
        </h4>
        <ul class="space-y-2 text-xs text-slate-600">
          <li>
            <a href="/borrower" class="hover:text-emerald-700 transition-colors"
              >Pembiayaan Barang (Murabahah)</a
            >
          </li>
          <li>
            <a href="/borrower" class="hover:text-emerald-700 transition-colors"
              >Pembiayaan Jasa (Ijarah)</a
            >
          </li>
          <li>
            <a href="/borrower" class="hover:text-emerald-700 transition-colors"
              >Pembiayaan Usaha (Musyarakah)</a
            >
          </li>
          <li>
            <a href="/borrower" class="hover:text-emerald-700 transition-colors"
              >Pembiayaan Sosial (Qardh)</a
            >
          </li>
          <li>
            <a href="/borrower" class="hover:text-emerald-700 transition-colors"
              >Pembiayaan Pergi Riba</a
            >
          </li>
        </ul>
      </div>

      <!-- Quick Links 2: Pendanaan & Finansial -->
      <div class="space-y-3">
        <h4
          class="text-xs font-['Raleway'] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between"
        >
          <span>Layanan Finansial</span>
        </h4>
        <ul class="space-y-2 text-xs text-slate-600">
          <li>
            <a href="/investor" class="hover:text-emerald-700 transition-colors"
              >Mulai Jadi Pendana (Investor)</a
            >
          </li>
          <li>
            <a href="/borrower" class="hover:text-emerald-700 transition-colors"
              >Ajukan Pembiayaan Usaha</a
            >
          </li>
          <li>
            <a
              href="/calculators"
              class="hover:text-emerald-700 transition-colors"
              >Kalkulator Simulasi Cicilan</a
            >
          </li>
          <li>
            <a
              href="/aggregator"
              class="hover:text-emerald-700 transition-colors"
              >Katalog Aggregator Produk</a
            >
          </li>
          <li>
            <a href="/blog" class="hover:text-emerald-700 transition-colors"
              >Edukasi & Fiqih Muamalah</a
            >
          </li>
        </ul>
      </div>

      <!-- Newsletter Column -->
      <div class="space-y-3">
        <h4
          class="text-xs font-['Raleway'] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2"
        >
          Berlangganan
        </h4>
        <p class="text-xs text-slate-500 leading-relaxed">
          Berlangganan Newsletter kami untuk mendapatkan informasi terbaru
          langsung ke email Anda:
        </p>
        <form onsubmit={handleSubscribe} class="space-y-2">
          <div class="flex rounded-[4px] overflow-hidden">
            <input
              type="email"
              bind:value={newsletterEmail}
              required
              placeholder="Alamat Email Anda"
              class="w-full px-3 py-2 text-xs bg-white border border-slate-300 border-r-0 rounded-l-[4px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
            <button
              type="submit"
              class="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider rounded-r-[4px] transition-colors cursor-pointer shrink-0 border border-emerald-800"
            >
              Berlanggan
            </button>
          </div>
        </form>
        {#if newsletterSuccess}
          <div
            class="p-2.5 bg-emerald-50 border border-emerald-200 rounded-[4px] text-xs text-emerald-800 flex items-center gap-1.5"
          >
            <CheckCircle class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Terima kasih telah berlangganan info Namia Syariah!</span>
          </div>
        {/if}
      </div>
    </div>

    <!-- Sangkalan Resiko (Risk Disclaimer POJK 77 matching old web 2 columns) -->
    <div class="mt-12 pt-8 border-t border-[#ECECEC]">
      <h5
        class="text-xs font-['Raleway'] font-bold uppercase tracking-wider text-[#333333] mb-4"
      >
        Sangkalan Resiko:
      </h5>
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] text-[#777777] leading-relaxed text-justify"
      >
        {#if $cmsStore.riskDisclaimers && $cmsStore.riskDisclaimers.length > 0}
          {@const half = Math.ceil($cmsStore.riskDisclaimers.length / 2)}
          <div class="space-y-3">
            {#each $cmsStore.riskDisclaimers.slice(0, half) as disc, idx}
              <p>
                {idx + 1}. {disc.replace(/^\d+\.\s*/, "")}
              </p>
            {/each}
          </div>
          <div class="space-y-3">
            {#each $cmsStore.riskDisclaimers.slice(half) as disc, idx}
              <p>
                {half + idx + 1}. {disc.replace(/^\d+\.\s*/, "")}
              </p>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Regulators Badges -->
    <div
      class="mt-8 pt-6 border-t border-[#ECECEC] flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div class="flex items-center gap-6 flex-wrap justify-center">
        <span class="text-xs text-[#777777] font-medium"
          >Terdaftar & Diawasi oleh:</span
        >
        {#if $cmsStore.supervise && $cmsStore.supervise.length > 0}
          {#each $cmsStore.supervise as sup}
            <img
              src={sup.image}
              alt={sup.name}
              title={sup.name}
              class="h-8 w-auto object-contain filter grayscale hover:grayscale-0 transition-all opacity-75 hover:opacity-100"
            />
          {/each}
        {:else}
          <img
            src="/images/home/logo-ojk-indonesia.png"
            alt="Otoritas Jasa Keuangan"
            class="h-8 w-auto object-contain filter grayscale hover:grayscale-0 transition-all opacity-75 hover:opacity-100"
          />
          <img
            src="/images/home/logofintechsyariah.png"
            alt="Asosiasi Fintech Syariah Indonesia"
            class="h-8 w-auto object-contain filter grayscale hover:grayscale-0 transition-all opacity-75 hover:opacity-100"
          />
          <img
            src="/images/home/logo-kominfo.png"
            alt="Kominfo"
            class="h-8 w-auto object-contain filter grayscale hover:grayscale-0 transition-all opacity-75 hover:opacity-100"
          />
          <img
            src="/images/home/logo-mui-s.png"
            alt="DSN-MUI"
            class="h-8 w-auto object-contain filter grayscale hover:grayscale-0 transition-all opacity-75 hover:opacity-100"
          />
        {/if}
      </div>
    </div>
  </div>

  <!-- Bottom Dark Copyrights Bar matching Canvas -->
  <div class="bg-[#1e293b] text-slate-400 py-8 border-t border-slate-800">
    <div
      class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
    >
      <div>
        <p>
          Copyrights &copy; 2018 - 2026 PT Namia Finansial Teknologi. All Rights
          Reserved.
        </p>
        <div class="flex gap-2 mt-1 text-slate-400">
          <a href="/contacts" class="hover:underline hover:text-white"
            >Hubungi Kami</a
          >
          <span>/</span>
          <a href="/about" class="hover:underline hover:text-white"
            >Terms of Use</a
          >
          <span>/</span>
          <a href="/about" class="hover:underline hover:text-white"
            >Privacy Policy</a
          >
        </div>
      </div>

      <!-- Social Icons -->
      <div class="flex items-center gap-3">
        <a
          href="https://www.facebook.com/namia.id/"
          target="_blank"
          rel="noopener noreferrer"
          class="w-8 h-8 rounded-[4px] bg-slate-800 hover:bg-emerald-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
          aria-label="Facebook"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"
            ><path
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
            /></svg
          >
        </a>
        <a
          href="https://twitter.com/namia_id"
          target="_blank"
          rel="noopener noreferrer"
          class="w-8 h-8 rounded-[4px] bg-slate-800 hover:bg-emerald-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
          aria-label="Twitter"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"
            ><path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            /></svg
          >
        </a>
        <a
          href="https://www.instagram.com/namia.id/"
          target="_blank"
          rel="noopener noreferrer"
          class="w-8 h-8 rounded-[4px] bg-slate-800 hover:bg-emerald-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
          aria-label="Instagram"
        >
          <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"
            ><path
              d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
            /></svg
          >
        </a>
      </div>
    </div>
  </div>
</footer>
