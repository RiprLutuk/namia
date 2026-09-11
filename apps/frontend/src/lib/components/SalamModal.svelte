<script lang="ts">
  import { onMount } from "svelte";
  import { Volume2, VolumeX, X } from "lucide-svelte";

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
    // Clear old blocking session flag so user can see the modal
    sessionStorage.removeItem("namia_salam_shown");

    // Show modal on homepage mount
    showModal = true;

    // Small delay to ensure audio element is ready and bound
    const startTimer = setTimeout(() => {
      playAudio();
    }, 400);

    // Fallback interaction listener: if browser blocked initial autoplay,
    // start playing on the very first click/tap anywhere on the screen
    const handleGesture = () => {
      if (showModal && (!isPlaying || autoplayBlocked)) {
        playAudio();
      }
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    };
    window.addEventListener("pointerdown", handleGesture, { once: true });
    window.addEventListener("keydown", handleGesture, { once: true });

    // Global event listener to allow re-opening from anywhere
    const handleCustomOpen = () => {
      showModal = true;
      playAudio();
    };
    window.addEventListener("open-salam-modal", handleCustomOpen);

    return () => {
      clearTimeout(startTimer);
      if (autoCloseTimer) clearTimeout(autoCloseTimer);
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("keydown", handleGesture);
      window.removeEventListener("open-salam-modal", handleCustomOpen);
      stopAudio();
    };
  });
</script>

<audio
  bind:this={audioEl}
  src="/res/sound/salam.mp3"
  preload="auto"
  onended={handleAudioEnded}
  onplay={() => (isPlaying = true)}
  onpause={() => (isPlaying = false)}
></audio>

{#if showModal}
  <!-- Backdrop without blur -->
  <div
    class="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4 font-sans"
    role="dialog"
    aria-modal="true"
    aria-label="Ucapan Salam Selamat Datang Namia Syariah"
  >
    <!-- Modal Card -->
    <div
      class="relative bg-white rounded-[3px] max-w-md w-full p-6 sm:p-8 shadow-lg border border-slate-300 flex flex-col items-center text-center space-y-4"
    >
      <!-- Close button -->
      <button
        type="button"
        onclick={closeModal}
        class="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        aria-label="Tutup"
      >
        <X class="w-5 h-5" />
      </button>

      <!-- Bismillah Graphic -->
      <div class="pt-2">
        <img
          src="/images/home/bismillah.png"
          alt="Bismillahir Rahmanir Rahim"
          class="max-h-14 sm:max-h-16 w-auto object-contain mx-auto"
        />
      </div>

      <!-- Assalamu'alaikum Graphic -->
      <div>
        <img
          src="/images/home/assalamualaikum-green.png"
          alt="Assalamu'alaikum Warahmatullahi Wabarakatuh"
          class="max-h-14 sm:max-h-16 w-auto object-contain mx-auto"
        />
      </div>

      <p class="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
        Selamat datang di <strong>Namia Syariah</strong> —
        <em>Smart Growth, Halal Impact</em>. Platform P2P financing & investasi
        produktif berlandaskan filosofi An-Namaa' tanpa riba.
      </p>

      <!-- Audio Playback Status Badge -->
      {#if isPlaying}
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800"
        >
          <Volume2 class="w-3.5 h-3.5 text-emerald-700" />
          <span>Memutar Audio Salam...</span>
        </div>
      {:else if autoplayBlocked}
        <button
          type="button"
          onclick={playAudio}
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Volume2 class="w-3.5 h-3.5" />
          <span>Klik untuk Putar Audio Salam</span>
        </button>
      {/if}

      <!-- Action buttons -->
      <div class="flex items-center gap-3 pt-2 w-full justify-center">
        {#if isPlaying}
          <button
            type="button"
            onclick={stopAudio}
            class="button-4 text-xs py-2 px-4 rounded-[3px] flex items-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider"
          >
            <VolumeX class="w-3.5 h-3.5 text-slate-500" />
            <span>Matikan Suara</span>
          </button>
        {:else}
          <button
            type="button"
            onclick={playAudio}
            class="button-4 text-xs py-2 px-4 rounded-[3px] flex items-center gap-1.5 cursor-pointer font-bold uppercase tracking-wider"
          >
            <Volume2 class="w-3.5 h-3.5 text-emerald-700" />
            <span>Putar Ulang</span>
          </button>
        {/if}

        <button
          type="button"
          onclick={closeModal}
          class="button-4-primary text-xs py-2 px-6 rounded-[3px] font-bold uppercase tracking-wider cursor-pointer"
        >
          <span>Lanjutkan</span>
        </button>
      </div>
    </div>
  </div>
{/if}
