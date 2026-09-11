<script lang="ts">
  import {
    X,
    Lock,
    Mail,
    ArrowRight,
    ShieldCheck,
    UserCheck,
    Briefcase,
  } from "lucide-svelte";
  import { goto } from "$app/navigation";

  let { isOpen = $bindable(false) } = $props();

  let activeRole = $state<"investor" | "borrower">("investor");
  let email = $state("");
  let password = $state("");
  let isLoading = $state(false);
  let loginMessage = $state("");

  function handleSubmit(e: Event) {
    e.preventDefault();
    isLoading = true;
    setTimeout(() => {
      isLoading = false;
      const targetPortal = activeRole === "investor" ? "/auth/cms/lender" : "/auth/cms/borrower";
      loginMessage = `Login ${activeRole === "investor" ? "Investor" : "Peminjam Dana"} berhasil. Mengarahkan ke portal dashboard...`;
      setTimeout(() => {
        isOpen = false;
        loginMessage = "";
        goto(targetPortal);
      }, 700);
    }, 600);
  }

  $effect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") isOpen = false;
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="fixed inset-0 z-50 overflow-y-auto bg-black/60 flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    onclick={(e) => {
      if (e.target === e.currentTarget) isOpen = false;
    }}
    onkeydown={(e) => {
      if (e.key === "Escape") isOpen = false;
    }}
  >
    <div
      class="bg-white rounded-[3px] max-w-md w-full shadow-lg overflow-hidden border border-slate-300 relative font-sans"
    >
      <!-- Modal Header -->
      <div
        class="bg-[#0f172a] p-6 text-white relative border-b border-slate-700"
      >
        <button
          type="button"
          onclick={() => (isOpen = false)}
          class="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1 z-10"
          aria-label="Tutup Dialog"
        >
          <X class="w-5 h-5" />
        </button>
        <div
          class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] bg-slate-800 border border-slate-600 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2"
        >
          <ShieldCheck class="w-3.5 h-3.5" />
          <span>Portal Akses Mitra Namia Syariah</span>
        </div>
        <h3 class="text-xl font-bold text-white uppercase">
          Masuk ke Akun Anda
        </h3>
        <p class="text-xs text-slate-300 mt-1">
          Pilih peran akun Anda untuk mengelola portofolio atau permohonan
          pembiayaan.
        </p>
      </div>

      <!-- Role Selector Tabs -->
      <div
        class="grid grid-cols-2 p-2.5 bg-slate-100 border-b border-slate-300 gap-1.5"
      >
        <button
          type="button"
          onclick={() => (activeRole = "investor")}
          class="flex items-center justify-center gap-2 h-9 px-3 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border {activeRole ===
          'investor'
            ? 'bg-emerald-700 text-white border-emerald-700'
            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}"
        >
          <UserCheck class="w-3.5 h-3.5" />
          <span>Akun Investor</span>
        </button>
        <button
          type="button"
          onclick={() => (activeRole = "borrower")}
          class="flex items-center justify-center gap-2 h-9 px-3 rounded-[2px] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border {activeRole ===
          'borrower'
            ? 'bg-emerald-700 text-white border-emerald-700'
            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}"
        >
          <Briefcase class="w-3.5 h-3.5" />
          <span>Peminjam Dana</span>
        </button>
      </div>

      <!-- Form Body -->
      <form onsubmit={handleSubmit} class="p-6 space-y-4">
        {#if loginMessage}
          <div
            class="p-3 bg-emerald-50 border border-emerald-300 rounded-[2px] text-xs text-emerald-800 font-medium text-center"
          >
            {loginMessage}
          </div>
        {/if}

        <div class="space-y-1">
          <label for="login-email" class="text-xs font-bold text-slate-700"
            >Alamat Email</label
          >
          <div class="relative">
            <Mail
              class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              id="login-email"
              type="email"
              required
              bind:value={email}
              placeholder="nama@email.com"
              class="w-full h-9 pl-9 pr-3 bg-white border border-slate-300 rounded-[2px] text-xs focus:border-emerald-600 focus:outline-none text-slate-800"
            />
          </div>
        </div>

        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <label for="login-password" class="text-xs font-bold text-slate-700"
              >Password</label
            >
            <a
              href="#forgot"
              class="text-[11px] text-emerald-700 hover:underline"
              >Lupa Password?</a
            >
          </div>
          <div class="relative">
            <Lock
              class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              id="login-password"
              type="password"
              required
              bind:value={password}
              placeholder="••••••••"
              class="w-full h-9 pl-9 pr-3 bg-white border border-slate-300 rounded-[2px] text-xs focus:border-emerald-600 focus:outline-none text-slate-800"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          class="button-4-primary w-full text-xs py-2.5 px-4 rounded-[3px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {#if isLoading}
            <span>Memproses...</span>
          {:else}
            <span>Masuk ke Portal</span>
            <ArrowRight class="w-3.5 h-3.5" />
          {/if}
        </button>

        <div
          class="pt-3 border-t border-slate-200 text-center text-xs text-slate-500 space-y-2"
        >
          <div>
            Belum memiliki akun?
            <a
              href="/onboarding?type={activeRole}"
              onclick={() => (isOpen = false)}
              class="font-bold text-emerald-700 hover:underline ml-1"
            >
              Daftar Sekarang
            </a>
          </div>
          <div class="pt-1 border-t border-slate-100">
            <a
              href="/backoffice/auth"
              onclick={() => (isOpen = false)}
              class="text-[11px] text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 transition-colors"
            >
              <Lock class="w-3 h-3 text-slate-400" />
              <span>Akses Backoffice Internal</span>
            </a>
          </div>
        </div>
      </form>
    </div>
  </div>
{/if}
