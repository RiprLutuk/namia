<script lang="ts">
  import { Save } from "lucide-svelte";
  import type { SiteSettings } from "$lib/cms";
  let {
    settingsForm = $bindable(),
    onsave,
    busy = false,
  }: { settingsForm: SiteSettings; onsave: () => void; busy?: boolean } = $props();
</script>

<div class="space-y-6">
  <div
    class="p-5 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  >
    <div>
      <h2 class="text-lg font-bold font-['Raleway'] text-slate-900">
        Identitas Brand &amp; Legalitas Platform
      </h2>
      <p class="text-xs text-slate-500">
        Kelola nama entitas hukum, tagline resmi, kontak kantor, alamat lengkap, dan kutipan hadits.
      </p>
    </div>
    <button
      type="button"
      onclick={onsave}
      disabled={busy}
      class="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
    >
      <Save class="w-4 h-4" />
      <span>Simpan Perubahan Branding</span>
    </button>
  </div>

  <div class="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
      <div>
        <label for="brandName" class="block font-semibold text-slate-600 mb-1"
          >Nama Brand Platform</label
        >
        <input
          id="brandName"
          type="text"
          bind:value={settingsForm.brandName}
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label for="companyName" class="block font-semibold text-slate-600 mb-1"
          >Nama Entitas Badan Hukum</label
        >
        <input
          id="companyName"
          type="text"
          bind:value={settingsForm.companyName}
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500"
        />
      </div>

      <div class="md:col-span-2">
        <label for="tagline" class="block font-semibold text-slate-600 mb-1">Tagline Resmi</label>
        <input
          id="tagline"
          type="text"
          bind:value={settingsForm.tagline}
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-emerald-700 font-bold outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label for="phone" class="block font-semibold text-slate-600 mb-1">Telepon Kantor</label>
        <input
          id="phone"
          type="text"
          bind:value={settingsForm.phone}
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label for="email" class="block font-semibold text-slate-600 mb-1">Email Resmi</label>
        <input
          id="email"
          type="email"
          bind:value={settingsForm.email}
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500"
        />
      </div>

      <div class="md:col-span-2">
        <label for="address" class="block font-semibold text-slate-600 mb-1"
          >Alamat Kantor Lengkap</label
        >
        <textarea
          id="address"
          rows="2"
          bind:value={settingsForm.address}
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500"
        ></textarea>
      </div>

      <div class="md:col-span-2 pt-2 border-t border-slate-200">
        <label for="quote" class="block font-semibold text-slate-600 mb-1"
          >Kutipan Hadits Utama Beranda</label
        >
        <textarea
          id="quote"
          rows="2"
          bind:value={settingsForm.quote}
          class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none focus:border-emerald-500 italic"
        ></textarea>
        <div class="mt-2 flex items-center gap-2">
          <span class="text-slate-500 text-xs">Sumber Kutipan:</span>
          <input
            type="text"
            bind:value={settingsForm.quoteOrigin}
            class="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 outline-none"
            placeholder="HR. Ahmad & Thabrani"
          />
        </div>
      </div>
    </div>
  </div>
</div>
