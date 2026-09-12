<script lang="ts">
  import { Scale } from "lucide-svelte";
  import { cmsStore } from "$lib/cms";

  interface Props {
    quote?: string;
    origin?: string;
    class?: string;
  }

  let { quote, origin, class: className = "" }: Props = $props();

  let displayQuote = $derived(
    quote ||
      $cmsStore.siteSettings.quote ||
      'Rasulullah SAW bersabda: "Berdaganglah kamu sekalian, karena di dalamnya terdapat sembilan dari sepuluh pintu rezeki."',
  );

  let displayOrigin = $derived(
    origin || $cmsStore.siteSettings.quoteOrigin || "HR. Ahmad & Thabrani",
  );
</script>

<!-- HADITH QUOTE BANNER: AUTHENTIC WEB 2.0 / EARLY BOOTSTRAP WELL -->
<div class="well well-white !p-6 !mb-0 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left border-l-4 border-l-[#059669] shadow-xs {className}">
  <div class="w-12 h-12 rounded-[4px] bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-300">
    <Scale class="w-6 h-6" />
  </div>
  <div class="space-y-1 flex-1">
    <p class="text-sm sm:text-base italic text-slate-800 leading-relaxed font-serif mb-0">
      {displayQuote}
    </p>
    <span class="inline-block text-xs font-bold text-emerald-800 uppercase tracking-wider">
      {displayOrigin}
    </span>
  </div>
</div>
