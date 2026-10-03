<script lang="ts">
  import {
    Sparkles,
    Users,
    Save,
    ExternalLink,
    Layers,
    ShieldCheck,
    ArrowRight,
    Award,
    Flame,
    Percent,
  } from "lucide-svelte";
  import type { InvestorInfo } from "$lib/cms";
  let {
    investorForm = $bindable(),
    onsave,
    busy = false,
  }: { investorForm: InvestorInfo; onsave: () => void; busy?: boolean } = $props();
</script>

<div class="space-y-6">
  <!-- TOP BANNER -->
  <div
    class="p-5 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
  >
    <div>
      <div class="flex items-center gap-2 mb-1">
        <span
          class="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-700 text-white uppercase tracking-wider"
          >Portal Editor</span
        >
        <span class="text-xs text-slate-500 font-mono">/investor</span>
      </div>
      <h2 class="text-lg font-bold font-['Raleway'] text-slate-900">
        Manajemen Konten Portal Investor &amp; Lender
      </h2>
      <p class="text-xs text-slate-500">
        Kelola headline hero, 4 indikator metrik, 5 pilar keunggulan, 5 alur pendanaan, 4 proteksi
        risiko, dan banner CTA secara dinamis.
      </p>
    </div>
    <div class="flex items-center gap-3 shrink-0">
      <a
        href="/investor"
        target="_blank"
        class="px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5"
      >
        <span>Lihat Live</span>
        <ExternalLink class="w-3.5 h-3.5" />
      </a>
      <button
        type="button"
        onclick={onsave}
        disabled={busy}
        class="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
      >
        <Save class="w-4 h-4" />
        <span>Simpan Perubahan Investor</span>
      </button>
    </div>
  </div>

  <!-- SECTION 1: HERO & 4 METRIK UTAMA -->
  <div class="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
    <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
      <div>
        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
          1. Hero Masthead &amp; 4 Indikator Utama
        </h3>
        <p class="text-xs text-slate-500">
          Teks headline utama, trust badge, deskripsi pengantar, dan kartu ringkasan metrik hero.
        </p>
      </div>
      <Sparkles class="w-4 h-4 text-emerald-700" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
      <div>
        <label for="invHeroBadge" class="block font-semibold text-slate-600 mb-1">
          Badge Legalitas / OJK
        </label>
        <input
          id="invHeroBadge"
          type="text"
          bind:value={investorForm.heroBadge}
          class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500"
          placeholder="PLATFORM P2P FINANCING SYARIAH BERIZIN OJK"
        />
      </div>
      <div>
        <label for="invHeroBadgeContract" class="block font-semibold text-slate-600 mb-1">
          Badge Akad Utama
        </label>
        <input
          id="invHeroBadgeContract"
          type="text"
          bind:value={investorForm.heroBadgeContract}
          class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500"
          placeholder="MUDHARABAH & MUSYARAKAH"
        />
      </div>

      <div>
        <label for="invHeroTitle" class="block font-semibold text-slate-600 mb-1">
          Judul Baris 1
        </label>
        <input
          id="invHeroTitle"
          type="text"
          bind:value={investorForm.heroTitle}
          class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500"
          placeholder="Tumbuhkan Aset dengan"
        />
      </div>
      <div>
        <label for="invHeroHighlight" class="block font-semibold text-slate-600 mb-1">
          Judul Baris 2 (Sorotan Hijau)
        </label>
        <input
          id="invHeroHighlight"
          type="text"
          bind:value={investorForm.heroHighlight}
          class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-emerald-700 font-bold outline-none focus:border-emerald-500"
          placeholder="Imbal Hasil Halal & Berkah"
        />
      </div>

      <div class="sm:col-span-2">
        <label for="invHeroLead" class="block font-semibold text-slate-600 mb-1">
          Deskripsi Pengantar (Lead Paragraph)
        </label>
        <textarea
          id="invHeroLead"
          rows="3"
          bind:value={investorForm.heroLead}
          class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500"
          placeholder="Salurkan pendanaan langsung ke proyek UMKM produktif..."></textarea>
      </div>
    </div>

    <!-- 4 Indikator Metrik Ribbon -->
    <div class="pt-2 border-t border-slate-200/80">
      <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
        4 Kartu Ringkasan Metrik (Ribbon)
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label for="invReturn" class="block text-slate-500 font-medium mb-1">
            Est. Return / Thn
          </label>
          <input
            id="invReturn"
            type="text"
            bind:value={investorForm.heroReturnRange}
            class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-emerald-700 font-mono font-bold"
            placeholder="12% - 18%"
          />
        </div>
        <div>
          <label for="invMin" class="block text-slate-500 font-medium mb-1"> Min. Pendanaan </label>
          <input
            id="invMin"
            type="text"
            bind:value={investorForm.heroMinInvestment}
            class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
            placeholder="Rp 1.000.000"
          />
        </div>
        <div>
          <label for="invTkb" class="block text-slate-500 font-medium mb-1">
            TKB90 Terverifikasi
          </label>
          <input
            id="invTkb"
            type="text"
            bind:value={investorForm.heroTkb90}
            class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-emerald-700 font-mono font-bold"
            placeholder="98.4%"
          />
        </div>
        <div>
          <label for="invSharia" class="block text-slate-500 font-medium mb-1">
            Fatwa DSN-MUI
          </label>
          <input
            id="invSharia"
            type="text"
            bind:value={investorForm.heroShariaCompliance}
            class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold"
            placeholder="100% Sah"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- SECTION 2: 5 PILAR KEUNGGULAN PENDANAAN -->
  <div class="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
    <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
      <div>
        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
          2. 5 Pilar Keunggulan Pendanaan di Namia Syariah
        </h3>
        <p class="text-xs text-slate-500">
          Kartu fitur keunggulan yang tampil pada bagian atas halaman investor.
        </p>
      </div>
      <Award class="w-4 h-4 text-emerald-700" />
    </div>

    <div class="space-y-3">
      {#each investorForm.pillars as pillar, pIdx}
        <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5 text-xs">
          <div class="flex items-center justify-between text-slate-500 font-semibold">
            <span class="text-emerald-700 font-bold">Pilar #{pIdx + 1}</span>
            <span class="text-[11px] text-slate-500 font-mono">Index {pIdx}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label for="pillarBadge_{pIdx}" class="block text-slate-500 mb-1"
                >Badge Kategori</label
              >
              <input
                id="pillarBadge_{pIdx}"
                type="text"
                bind:value={pillar.badge}
                class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>
            <div>
              <label for="pillarTitle_{pIdx}" class="block text-slate-500 mb-1">Judul Pilar</label>
              <input
                id="pillarTitle_{pIdx}"
                type="text"
                bind:value={pillar.title}
                class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-xs"
              />
            </div>
            <div>
              <label for="pillarIcon_{pIdx}" class="block text-slate-500 mb-1">Path Icon</label>
              <input
                id="pillarIcon_{pIdx}"
                type="text"
                bind:value={pillar.icon}
                class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label for="pillarDesc_{pIdx}" class="block text-slate-500 mb-1">Deskripsi Pilar</label>
            <textarea
              id="pillarDesc_{pIdx}"
              rows="2"
              bind:value={pillar.desc}
              class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-xs"
            ></textarea>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- SECTION 3: 5 PRINSIP FUNDAMENTAL MUAMALAH -->
  <div class="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
    <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
      <div>
        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
          3. 5 Prinsip Fundamental Namia Syariah
        </h3>
        <p class="text-xs text-slate-500">
          Landasan nilai etis muamalah (Halal, Aman, Mudah, Cepat, Barakah).
        </p>
      </div>
      <ShieldCheck class="w-4 h-4 text-emerald-700" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {#each investorForm.coreValues as cv, cIdx}
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-emerald-700 font-bold">Prinsip #{cIdx + 1}</span>
          </div>
          <div>
            <label for="cvTitle_{cIdx}" class="block text-slate-500 text-[11px] mb-1"
              >Nama Nilai</label
            >
            <input
              id="cvTitle_{cIdx}"
              type="text"
              bind:value={cv.title}
              class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-xs"
            />
          </div>
          <div>
            <label for="cvDesc_{cIdx}" class="block text-slate-500 text-[11px] mb-1"
              >Penjelasan Singkat</label
            >
            <textarea
              id="cvDesc_{cIdx}"
              rows="2"
              bind:value={cv.desc}
              class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-xs"
            ></textarea>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- SECTION 4: 5 LANGKAH ALUR PENDANAAN -->
  <div class="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
    <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
      <div>
        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
          4. 5 Langkah Alur Melakukan Pendanaan
        </h3>
        <p class="text-xs text-slate-500">
          Instruksi langkah dari registrasi hingga penerimaan bagi hasil di akun.
        </p>
      </div>
      <Layers class="w-4 h-4 text-emerald-700" />
    </div>

    <div class="space-y-3">
      {#each investorForm.steps as st, sIdx}
        <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div class="sm:col-span-1">
              <label for="stepNum_{sIdx}" class="block text-slate-500 mb-1">Nomor Langkah</label>
              <input
                id="stepNum_{sIdx}"
                type="text"
                bind:value={st.num}
                class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-emerald-700 font-mono font-bold text-xs"
                placeholder="01"
              />
            </div>
            <div class="sm:col-span-3">
              <label for="stepTitle_{sIdx}" class="block text-slate-500 mb-1">Judul Langkah</label>
              <input
                id="stepTitle_{sIdx}"
                type="text"
                bind:value={st.title}
                class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-xs"
              />
            </div>
          </div>

          <div>
            <label for="stepDesc_{sIdx}" class="block text-slate-500 mb-1">Uraian Prosedur</label>
            <textarea
              id="stepDesc_{sIdx}"
              rows="2"
              bind:value={st.desc}
              class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-xs"
            ></textarea>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- SECTION 5: 4 JAMINAN MITIGASI RISIKO -->
  <div class="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
    <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
      <div>
        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
          5. 4 Lapisan Mitigasi Risiko &amp; Proteksi Modal
        </h3>
        <p class="text-xs text-slate-500">
          Aspek kehati-hatian (prudence) dan mitigasi risiko untuk meyakinkan calon investor.
        </p>
      </div>
      <ShieldCheck class="w-4 h-4 text-emerald-700" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {#each investorForm.safetyMeasures as sm, smIdx}
        <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-emerald-700 font-bold">Proteksi #{smIdx + 1}</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label for="smBadge_{smIdx}" class="block text-slate-500 text-[11px] mb-1"
                >Badge Proteksi</label
              >
              <input
                id="smBadge_{smIdx}"
                type="text"
                bind:value={sm.badge}
                class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
              />
            </div>
            <div>
              <label for="smTitle_{smIdx}" class="block text-slate-500 text-[11px] mb-1"
                >Judul Mitigasi</label
              >
              <input
                id="smTitle_{smIdx}"
                type="text"
                bind:value={sm.title}
                class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-xs"
              />
            </div>
          </div>
          <div>
            <label for="smDesc_{smIdx}" class="block text-slate-500 text-[11px] mb-1"
              >Uraian Jaminan</label
            >
            <textarea
              id="smDesc_{smIdx}"
              rows="2"
              bind:value={sm.desc}
              class="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-xs"
            ></textarea>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- SECTION 6: PROYEK PILIHAN HARI INI (FEATURED DEAL) -->
  {#if investorForm.featuredDeal}
    <div class="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
      <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
            6. Proyek Pilihan Hari Ini (Featured Deal Hero)
          </h3>
          <p class="text-xs text-slate-500">
            Kartu crowdfunding proyek unggulan yang tampil di samping headline hero.
          </p>
        </div>
        <Flame class="w-4 h-4 text-amber-400" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div class="sm:col-span-2">
          <label for="fdTitle" class="block text-slate-500 mb-1">Judul Proyek</label>
          <input
            id="fdTitle"
            type="text"
            bind:value={investorForm.featuredDeal.title}
            class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold text-xs"
          />
        </div>
        <div>
          <label for="fdBorrower" class="block text-slate-500 mb-1">Nama Calon Mitra</label>
          <input
            id="fdBorrower"
            type="text"
            bind:value={investorForm.featuredDeal.borrower}
            class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs"
          />
        </div>
        <div>
          <label for="fdTarget" class="block text-slate-500 mb-1">Target Plafon</label>
          <input
            id="fdTarget"
            type="text"
            bind:value={investorForm.featuredDeal.targetAmount}
            class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-xs"
          />
        </div>
        <div>
          <label for="fdPercent" class="block text-slate-500 mb-1">Persen Terkumpul (%)</label>
          <input
            id="fdPercent"
            type="number"
            bind:value={investorForm.featuredDeal.fundedPercent}
            class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-emerald-700 font-mono font-bold text-xs"
          />
        </div>
        <div>
          <label for="fdYield" class="block text-slate-500 mb-1">Est. Imbal Hasil (p.a.)</label>
          <input
            id="fdYield"
            type="text"
            bind:value={investorForm.featuredDeal.yieldRate}
            class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-emerald-700 font-mono font-bold text-xs"
          />
        </div>
        <div>
          <label for="fdTenor" class="block text-slate-500 mb-1">Tenor Proyek</label>
          <input
            id="fdTenor"
            type="text"
            bind:value={investorForm.featuredDeal.tenor}
            class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs"
          />
        </div>
        <div>
          <label for="fdContract" class="block text-slate-500 mb-1">Akad Fiqih</label>
          <input
            id="fdContract"
            type="text"
            bind:value={investorForm.featuredDeal.contract}
            class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs"
          />
        </div>
        <div>
          <label for="fdTime" class="block text-slate-500 mb-1">Sisa Waktu</label>
          <input
            id="fdTime"
            type="text"
            bind:value={investorForm.featuredDeal.timeLeft}
            class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-amber-400 text-xs"
          />
        </div>
      </div>
    </div>
  {/if}

  <!-- SECTION 7: MATRIKS KOMPARASI BENCHMARK -->
  {#if investorForm.benchmarkRows}
    <div class="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
      <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
            7. Matriks Komparasi Imbal Hasil vs Pasar
          </h3>
          <p class="text-xs text-slate-500">
            Tabel perbandingan keuntungan, pajak, dan risiko terhadap alternatif instrumen lain.
          </p>
        </div>
        <Percent class="w-4 h-4 text-emerald-700" />
      </div>

      <div class="space-y-3">
        {#each investorForm.benchmarkRows as row, rIdx}
          <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
            <div
              class="flex items-center justify-between font-bold {row.isHighlighted
                ? 'text-emerald-700'
                : 'text-slate-600'}"
            >
              <span>Baris #{rIdx + 1}: {row.instrument}</span>
              {#if row.isHighlighted}
                <span class="badge badge-success text-[9px]">SOROTAN UTAMA</span>
              {/if}
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div>
                <label for="bmInst_{rIdx}" class="block text-slate-500 text-[10px] mb-1"
                  >Nama Instrumen</label
                >
                <input
                  id="bmInst_{rIdx}"
                  type="text"
                  bind:value={row.instrument}
                  class="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                />
              </div>
              <div>
                <label for="bmYield_{rIdx}" class="block text-slate-500 text-[10px] mb-1"
                  >Est. Yield (p.a.)</label
                >
                <input
                  id="bmYield_{rIdx}"
                  type="text"
                  bind:value={row.yieldRange}
                  class="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-emerald-700 font-mono text-xs"
                />
              </div>
              <div>
                <label for="bmTax_{rIdx}" class="block text-slate-500 text-[10px] mb-1"
                  >Tarif Pajak</label
                >
                <input
                  id="bmTax_{rIdx}"
                  type="text"
                  bind:value={row.taxRate}
                  class="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                />
              </div>
              <div>
                <label for="bmStatus_{rIdx}" class="block text-slate-500 text-[10px] mb-1"
                  >Status Syariah</label
                >
                <input
                  id="bmStatus_{rIdx}"
                  type="text"
                  bind:value={row.shariaStatus}
                  class="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs"
                />
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- SECTION 8: TINGKATAN AKUN PENDANA (LENDER TIERS) -->
  {#if investorForm.lenderTiers}
    <div class="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
      <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
        <div>
          <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
            8. Tingkatan Akun Pendana (Lender Membership Tiers)
          </h3>
          <p class="text-xs text-slate-500">
            Paket tiering Retail, Prioritas, dan Institusi beserta batas minimal komitmen.
          </p>
        </div>
        <Users class="w-4 h-4 text-emerald-700" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {#each investorForm.lenderTiers as tier, tIdx}
          <div class="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-emerald-700 font-bold">{tier.level}</span>
              <span class="badge badge-inverse text-[9px]">{tier.badge}</span>
            </div>
            <div>
              <label for="tierName_{tIdx}" class="block text-slate-500 text-[10px] mb-1"
                >Nama Membership</label
              >
              <input
                id="tierName_{tIdx}"
                type="text"
                bind:value={tier.name}
                class="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-xs"
              />
            </div>
            <div>
              <label for="tierMin_{tIdx}" class="block text-slate-500 text-[10px] mb-1"
                >Minimal Alokasi</label
              >
              <input
                id="tierMin_{tIdx}"
                type="text"
                bind:value={tier.minCommitment}
                class="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono text-xs"
              />
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- SECTION 9: CTA BANNER BAWAH -->
  <div class="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
    <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
      <div>
        <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider">
          9. Banner Ajakan Bertindak (CTA Bawah)
        </h3>
        <p class="text-xs text-slate-500">
          Banner konversi di kaki halaman investor untuk mendorong pendaftaran.
        </p>
      </div>
      <ArrowRight class="w-4 h-4 text-emerald-700" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
      <div>
        <label for="invCtaTitle" class="block font-semibold text-slate-600 mb-1">
          Judul Banner CTA
        </label>
        <input
          id="invCtaTitle"
          type="text"
          bind:value={investorForm.ctaTitle}
          class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500"
          placeholder="Siap Memulai Pendanaan Syariah?"
        />
      </div>
      <div>
        <label for="invCtaSubtitle" class="block font-semibold text-slate-600 mb-1">
          Subjudul Banner CTA
        </label>
        <input
          id="invCtaSubtitle"
          type="text"
          bind:value={investorForm.ctaSubtitle}
          class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500"
          placeholder="Buka akun Anda dalam 3 menit..."
        />
      </div>

      <div>
        <label for="invCtaBtnText" class="block font-semibold text-slate-600 mb-1">
          Teks Tombol Aksi
        </label>
        <input
          id="invCtaBtnText"
          type="text"
          bind:value={investorForm.ctaButtonText}
          class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500"
          placeholder="Katalog Proyek Aktif"
        />
      </div>
      <div>
        <label for="invCtaBtnUrl" class="block font-semibold text-slate-600 mb-1">
          URL Tujuan Tombol
        </label>
        <input
          id="invCtaBtnUrl"
          type="text"
          bind:value={investorForm.ctaButtonUrl}
          class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono outline-none focus:border-emerald-500"
          placeholder="/aggregator"
        />
      </div>
    </div>
  </div>

  <!-- BOTTOM SAVE BAR -->
  <div
    class="p-4 bg-white border border-slate-200 rounded-lg flex items-center justify-between shadow-sm"
  >
    <div class="text-xs text-slate-500">
      Pastikan seluruh perubahan telah ditinjau sebelum menekan tombol simpan.
    </div>
    <button
      type="button"
      onclick={onsave}
      disabled={busy}
      class="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
    >
      <Save class="w-4 h-4" />
      <span>Simpan Perubahan Konten Investor</span>
    </button>
  </div>
</div>
