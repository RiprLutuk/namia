<script lang="ts">
  import { cmsStore } from "$lib/cms";

  interface Props {
    title?: string;
    subtitle?: string;
    showRegulators?: boolean;
    showPartners?: boolean;
    class?: string;
  }

  let {
    title = "Terdaftar, Berizin & Diawasi",
    subtitle = "Penyelenggaraan fintech P2P financing syariah berizin penuh di bawah regulasi OJK serta diawasi langsung oleh Dewan Pengawas Syariah DSN-MUI.",
    showRegulators = true,
    showPartners = true,
    class: className = "",
  }: Props = $props();

  let supervise = $derived(
    $cmsStore.supervise?.length
      ? $cmsStore.supervise
      : [
          {
            id: 1,
            name: "Otoritas Jasa Keuangan (OJK)",
            image: "/images/home/logo-ojk-indonesia.png",
            role: "Regulator & Pengawas",
          },
          {
            id: 2,
            name: "Asosiasi Fintech Syariah Indonesia (AFSI)",
            image: "/images/home/logofintechsyariah.png",
            role: "Asosiasi Resmi",
          },
          {
            id: 3,
            name: "Kementerian Komunikasi dan Informatika",
            image: "/images/home/logo-kominfo.png",
            role: "Penyelenggara Sistem Elektronik",
          },
          {
            id: 4,
            name: "Dewan Syariah Nasional Majelis Ulama Indonesia (DSN-MUI)",
            image: "/images/home/logo-mui-s.png",
            role: "Dewan Pengawas Syariah",
          },
        ],
  );

  let clients = $derived(
    $cmsStore.clients?.length
      ? $cmsStore.clients
      : [
          { id: 1, name: "Bank Syariah Indonesia", picture: "/images/home/bsi.png" },
          { id: 2, name: "BCA Syariah", picture: "/images/home/bcasyariah.png" },
          { id: 3, name: "Bank Muamalat", picture: "/images/home/muamalat.png" },
        ],
  );
</script>

<!-- EKOSISTEM, LEGALITAS & KEMITRAAN TERPERCAYA (Early 2000s / Bootstrap 2.0 Authentic Panel Design) -->
<section class="py-12 sm:py-16 bg-white border-b border-slate-300 overflow-hidden {className}">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
    
    {#if showRegulators}
      <!-- Top: Terdaftar, Berizin & Diawasi (Official Regulatory & Sharia Compliance Grid) -->
      <div>
        <div class="heading-block text-center mb-8">
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <span class="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-4xl mx-auto block leading-relaxed font-normal">
            {subtitle}
          </span>
        </div>

        <!-- 4 Compliance Authority Cards (Authentic 2000s Bootstrap Panels, Sharp Corners) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {#each supervise as s, idx}
            <div class="panel !mb-0 border border-slate-300 rounded-[3px] bg-white shadow-2xs hover:border-slate-400 hover:shadow-xs transition-all flex flex-col justify-between overflow-hidden group">
              <!-- 2000s Bootstrap Panel Heading -->
              <div class="panel-heading flex items-center justify-between py-2 px-3.5 bg-gradient-to-b from-white to-slate-100 border-b border-slate-300 rounded-none">
                <span class="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-sans">
                  {idx === 0 ? 'Regulator OJK' : idx === 1 ? 'Fintech Syariah' : idx === 2 ? 'Kemenkominfo' : 'Dewan Syariah'}
                </span>
                <span class="label {idx === 0 || idx === 3 ? 'label-success' : 'label-info'} text-[10px] uppercase font-mono font-bold tracking-tight rounded-[2px] px-2 py-0.5 shadow-2xs">
                  {idx === 0 ? 'POJK 10' : idx === 1 ? 'Anggota Resmi' : idx === 2 ? 'PSE Terdaftar' : 'DSN-MUI'}
                </span>
              </div>

              <!-- Panel Body with Big Prominent Logo Stage -->
              <div class="p-5 sm:p-6 flex flex-col items-center justify-center flex-1 bg-white text-center">
                <div class="h-20 sm:h-24 w-full flex items-center justify-center mb-3">
                  <img
                    src={s.image || (s as any).logo}
                    alt={s.name}
                    class="max-h-16 sm:max-h-20 max-w-[170px] sm:max-w-[200px] w-auto h-auto object-contain filter group-hover:scale-105 transition-transform duration-150"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <!-- Entity Name & Role -->
                <h4 class="text-sm font-bold text-slate-900 leading-snug tracking-tight">
                  {s.name}
                </h4>
                <p class="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                  {s.role || "Lembaga Resmi"}
                </p>
              </div>

              <!-- 2000s Panel Footer Verification Bar -->
              <div class="panel-footer py-2 px-3 bg-gradient-to-b from-slate-50 to-slate-100 border-t border-slate-300 rounded-none text-center">
                <span class="text-[11px] font-mono font-semibold text-slate-700">
                  {idx === 0 ? '✓ Berizin Penuh & Diawasi' : idx === 1 ? '✓ Anggota Terdaftar AFSI' : idx === 2 ? '✓ Terverifikasi PSE Kominfo' : '✓ Pengawasan Syariah DSN-MUI'}
                </span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if showPartners}
      <!-- Bottom: Mitra Perbankan & Rantai Pasok Korporasi (Classic 2000s Marquee Strip) -->
      <div class="pt-8 {showRegulators ? 'border-t border-slate-300' : ''}">
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-1">
            <span class="label label-inverse text-[10px] uppercase font-mono tracking-wider rounded-[2px] px-2 py-0.5">
              Ekosistem & Kemitraan
            </span>
            <span class="text-xs text-slate-500 font-mono">B2B & Banking Network</span>
          </div>
          <h3 class="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Mitra Perbankan & Rantai Pasok Korporasi
          </h3>
        </div>

        <!-- Authentic 2000s Marquee Strip (Sharp Beveled Borders) -->
        <div class="marquee-container py-3.5 bg-gradient-to-b from-slate-50 to-slate-100/60 border-y border-slate-300 relative">
          <div class="marquee-content items-center">
            <!-- Track 1 -->
            <div class="flex items-center gap-10 sm:gap-14 shrink-0 pr-10 sm:pr-14">
              {#each [...clients, ...clients] as client}
                <div class="h-12 sm:h-14 w-32 sm:w-40 flex items-center justify-center shrink-0">
                  <img
                    src={client.picture || (client as any).logo || (client as any).image}
                    alt={client.name}
                    class="max-h-11 sm:max-h-13 max-w-[125px] sm:max-w-[155px] w-auto h-auto object-contain mix-blend-multiply opacity-80 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-200"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              {/each}
            </div>

            <!-- Track 2 -->
            <div class="flex items-center gap-10 sm:gap-14 shrink-0 pr-10 sm:pr-14" aria-hidden="true">
              {#each [...clients, ...clients] as client}
                <div class="h-12 sm:h-14 w-32 sm:w-40 flex items-center justify-center shrink-0">
                  <img
                    src={client.picture || (client as any).logo || (client as any).image}
                    alt={client.name}
                    class="max-h-11 sm:max-h-13 max-w-[125px] sm:max-w-[155px] w-auto h-auto object-contain mix-blend-multiply opacity-80 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-200"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              {/each}
            </div>
          </div>
        </div>
      </div>
    {/if}

  </div>
</section>
