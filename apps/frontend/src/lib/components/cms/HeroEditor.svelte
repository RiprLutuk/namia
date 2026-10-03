<script lang="ts">
  import { Save } from "lucide-svelte";
  import type { HeroContent } from "$lib/cms";
  let {
    heroForm = $bindable(),
    onsave,
    busy = false,
  }: { heroForm: HeroContent; onsave: () => void; busy?: boolean } = $props();
</script>

<div class="space-y-6">
  <div
    class="p-5 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  >
    <div>
      <h2 class="text-lg font-bold font-['Raleway'] text-slate-900">
        Hero Section, Ticker, &amp; Tombol CTA
      </h2>
      <p class="text-xs text-slate-500">
        Atur teks pembuka, headline utama, pengumuman berjalan, dan target tautan tombol
        call-to-action.
      </p>
    </div>
    <button
      type="button"
      onclick={onsave}
      disabled={busy}
      class="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
    >
      <Save class="w-4 h-4" />
      <span>Simpan Perubahan Hero</span>
    </button>
  </div>

  <div class="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
    <div class="space-y-4 text-xs">
      <div>
        <label for="badgeText" class="block font-semibold text-slate-600 mb-1"
          >Teks Badge Atas</label
        >
        <input
          id="badgeText"
          type="text"
          bind:value={heroForm.badgeText}
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label for="heroTitle" class="block font-semibold text-slate-600 mb-1"
          >Headline Judul Hero</label
        >
        <textarea
          id="heroTitle"
          rows="2"
          bind:value={heroForm.title}
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500 font-bold"
        ></textarea>
      </div>

      <div>
        <label for="heroSubtitle" class="block font-semibold text-slate-600 mb-1"
          >Deskripsi Subtitle Hero</label
        >
        <textarea
          id="heroSubtitle"
          rows="3"
          bind:value={heroForm.subtitle}
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500 leading-relaxed"
        ></textarea>
      </div>

      <div>
        <label for="tickerText" class="block font-semibold text-slate-600 mb-1"
          >Pengumuman Ticker Berjalan</label
        >
        <input
          id="tickerText"
          type="text"
          bind:value={heroForm.tickerText}
          placeholder="Contoh: Penyaluran batch 12 dibuka dengan estimasi imbal hasil 14.5% p.a."
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-amber-300 outline-none focus:border-emerald-500"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
        <div class="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
          <label for="cta1Text" class="block font-semibold text-slate-600"
            >Tombol Utama (CTA 1)</label
          >
          <input
            id="cta1Text"
            type="text"
            bind:value={heroForm.primaryCtaText}
            class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 outline-none text-xs"
            placeholder="Mulai Danai (Investor)"
          />
          <input
            type="text"
            bind:value={heroForm.primaryCtaUrl}
            class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-500 outline-none text-xs"
            placeholder="/investor"
          />
        </div>

        <div class="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
          <label for="cta2Text" class="block font-semibold text-slate-600"
            >Tombol Kedua (CTA 2)</label
          >
          <input
            id="cta2Text"
            type="text"
            bind:value={heroForm.secondaryCtaText}
            class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 outline-none text-xs"
            placeholder="Ajukan Pembiayaan"
          />
          <input
            type="text"
            bind:value={heroForm.secondaryCtaUrl}
            class="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-500 outline-none text-xs"
            placeholder="/borrower"
          />
        </div>
      </div>
    </div>
  </div>
</div>
