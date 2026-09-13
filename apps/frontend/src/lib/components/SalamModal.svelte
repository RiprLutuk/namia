<script lang="ts">
  import { onMount } from "svelte";
  import { Volume2, VolumeX } from "lucide-svelte";

  let showModal = $state(false);
  let audioEl: HTMLAudioElement | null = null;
  let isPlaying = $state(false);
  let autoplayBlocked = $state(false);
  let autoCloseTimer: ReturnType<typeof setTimeout> | null = null;

  function playAudio() {
    if (!audioEl) return;
    audioEl.currentTime = 0;
    const promise = audioEl.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          isPlaying = true;
          autoplayBlocked = false;
        })
        .catch((err) => {
          console.warn("Autoplay blocked, waiting for user gesture:", err);
          autoplayBlocked = true;
          isPlaying = false;
        });
    }
  }

  function stopAudio() {
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }
    isPlaying = false;
  }

  function toggleAudio() {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  }

  function closeModal() {
    showModal = false;
    stopAudio();
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
    }
  }

  function handleAudioEnded() {
    isPlaying = false;
    // Auto-close modal smoothly 1.5 seconds after salam finishes
    autoCloseTimer = setTimeout(() => {
      closeModal();
    }, 1500);
  }

  onMount(() => {
    // Global event listener to allow re-opening from anywhere
    const handleCustomOpen = () => {
      showModal = true;
      playAudio();
    };
    window.addEventListener("open-salam-modal", handleCustomOpen);

    return () => {
      if (autoCloseTimer) clearTimeout(autoCloseTimer);
      window.removeEventListener("open-salam-modal", handleCustomOpen);
      stopAudio();
    };
  });
</script>

<audio
  bind:this={audioEl}
  src="/res/sound/salam.mp3"
  preload="none"
  onended={handleAudioEnded}
  onplay={() => (isPlaying = true)}
  onpause={() => (isPlaying = false)}
></audio>

{#if showModal}
  <!-- Backdrop -->
  <div
    class="modal-backdrop-web20"
    role="dialog"
    aria-modal="true"
    aria-label="Ucapan Salam Selamat Datang Namia Syariah"
  >
    <!-- Modal Window (Early Bootstrap Dialog) -->
    <div class="modal-content-web20 max-w-md animate-in fade-in zoom-in-95 duration-150">
      <!-- 1. MODAL HEADER -->
      <div class="modal-header-web20">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block shadow-xs"></span>
          <h3 class="!text-xs font-bold uppercase tracking-wider text-slate-800">
            Selamat Datang di Namia Syariah
          </h3>
        </div>
        <button
          type="button"
          class="close-btn"
          onclick={closeModal}
          aria-label="Tutup"
        >
          &times;
        </button>
      </div>

      <!-- 2. MODAL BODY -->
      <div class="modal-body-web20 text-center py-6 px-6 space-y-4">
        <!-- Single Pristine Green Calligraphy -->
        <div class="py-1">
          <img
            src="/images/home/assalamualaikum-green.png"
            alt="Assalamu'alaikum Warahmatullahi Wabarakatuh"
            class="max-h-14 sm:max-h-16 w-auto object-contain mx-auto"
          />
        </div>

        <div class="space-y-1.5">
          <h4 class="text-sm font-bold text-slate-800 tracking-tight">
            Assalamu'alaikum Warahmatullahi Wabarakatuh
          </h4>
          <p class="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
            Platform pendanaan produktif dan investasi syariah terpercaya berlandaskan filosofi <em>An-Namaa'</em> tanpa riba.
          </p>
        </div>

        <!-- Single Clean Audio Pill Button -->
        <div class="pt-1">
          <button
            type="button"
            onclick={toggleAudio}
            class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all shadow-2xs cursor-pointer {isPlaying ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'}"
          >
            {#if isPlaying}
              <span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <Volume2 class="w-3.5 h-3.5 text-emerald-600" />
              <span>Memutar Audio Salam...</span>
            {:else}
              <Volume2 class="w-3.5 h-3.5 text-emerald-700" />
              <span>Putar Audio Salam</span>
            {/if}
          </button>
        </div>
      </div>

      <!-- 3. MODAL FOOTER -->
      <div class="modal-footer-web20 flex items-center justify-between !py-2.5 !px-4 bg-slate-50 border-t border-slate-200">
        <button
          type="button"
          onclick={closeModal}
          class="btn btn-small btn-default text-xs"
        >
          Tutup
        </button>

        <button
          type="button"
          onclick={closeModal}
          class="btn btn-small btn-success font-bold text-xs inline-flex items-center gap-1.5 px-4 shadow-xs"
        >
          <span>Lanjutkan ke Beranda</span>
          <span class="text-sm font-normal">&rarr;</span>
        </button>
      </div>
    </div>
  </div>
{/if}
