<script lang="ts">
  import { MessageSquare, X, Send, User } from "lucide-svelte";
  import { t } from "$lib/i18n";

  let isOpen = $state(false);
  let messageText = $state("");
  let messages = $state<
    Array<{ sender: "bot" | "user"; text: string; time: string }>
  >([
    {
      sender: "bot",
      text: "Assalamu'alaikum! Selamat datang di layanan informasi Namia Syariah. Ada yang bisa kami bantu seputar pendanaan atau pembiayaan syariah hari ini?",
      time: "Sekarang",
    },
  ]);

  const quickQuestions = [
    "Bagaimana cara mulai mendanai?",
    "Apa syarat pengajuan pembiayaan?",
    "Berapa minimal investasi di Namia?",
    "Apakah Namia berizin & diawasi OJK?",
  ];

  function handleSend(text?: string) {
    const q = text || messageText.trim();
    if (!q) return;

    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    messages.push({ sender: "user", text: q, time: now });
    if (!text) messageText = "";

    // Authentic Namia Syariah Customer Service Guidance
    setTimeout(() => {
      let reply =
        "Terima kasih atas pertanyaannya. Tim Namia Syariah siap membantu Anda.";
      const lower = q.toLowerCase();

      if (
        lower.includes("mulai mendanai") ||
        lower.includes("investor") ||
        lower.includes("investasi")
      ) {
        reply =
          "Untuk menjadi Pendana (Funder) di Namia, Anda cukup mendaftar akun, melengkapi e-KYC secara digital, dan memilih proyek pembiayaan UMKM yang sedang dibuka dengan akad Mudharabah/Musyarakah berimbal hasil kompetitif.";
      } else if (
        lower.includes("syarat") ||
        lower.includes("pembiayaan") ||
        lower.includes("pinjam") ||
        lower.includes("peminjam")
      ) {
        reply =
          "Syarat utama pembiayaan: Usaha produktif berbadan hukum atau UMKM terverifikasi, rekening koran 6 bulan terakhir, legalitas usaha, dan sektor kegiatan halal bebas dari unsur riba, maysir, dan gharar.";
      } else if (lower.includes("minimal")) {
        reply =
          "Minimal pendanaan di Namia mulai dari Rp 1.000.000 (Satu Juta Rupiah) untuk memudahkan inklusi finansial syariah bagi seluruh lapisan masyarakat.";
      } else if (
        lower.includes("ojk") ||
        lower.includes("izin") ||
        lower.includes("aman") ||
        lower.includes("legal")
      ) {
        reply =
          "Namia berizin dan diawasi oleh Otoritas Jasa Keuangan (OJK), serta diawasi oleh Dewan Pengawas Syariah (DPS) yang direkomendasikan oleh DSN-MUI.";
      } else if (
        lower.includes("kontak") ||
        lower.includes("kantor") ||
        lower.includes("alamat")
      ) {
        reply =
          "Kantor operasional Namia berlokasi di Menara MTH Lantai 10, Jl. MT Haryono Kav 23, Jakarta Selatan 12820. Telepon: (+62) 21 8378 2337 atau email: salam@namia.id.";
      } else {
        reply =
          "Pertanyaan Anda telah kami catat. Anda juga dapat membaca rangkuman informasi di menu FAQ & Kontak atau menghubungi tim representatif kami via WhatsApp dan email.";
      }

      messages.push({
        sender: "bot",
        text: reply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }, 450);
  }
</script>

<!-- Early Bootstrap Floating Chat Trigger -->
<div class="fixed bottom-6 right-6 z-50 font-sans">
  {#if !isOpen}
    <button
      type="button"
      onclick={() => (isOpen = true)}
      class="button-4-primary flex items-center gap-2 px-3.5 py-2 rounded-[3px] shadow-sm cursor-pointer text-xs font-bold uppercase tracking-wider"
      aria-label={$t.chat.button}
    >
      <MessageSquare class="w-4 h-4" />
      <span>{$t.chat.button}</span>
    </button>
  {:else}
    <!-- Clean Early Bootstrap Style Chat Window -->
    <div
      class="bg-white rounded-[3px] shadow-lg border border-slate-300 w-[340px] sm:w-[370px] h-[480px] flex flex-col overflow-hidden"
    >
      <!-- Clean Header -->
      <div
        class="bg-[#0f172a] text-white px-4 py-3 flex items-center justify-between border-b border-slate-700"
      >
        <div class="flex items-center gap-2.5">
          <div
            class="w-7 h-7 rounded-[2px] bg-slate-800 border border-slate-600 flex items-center justify-center text-emerald-400 shrink-0"
          >
            <MessageSquare class="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 class="text-xs font-bold text-white uppercase tracking-wide">
              {$t.chat.title}
            </h4>
            <div class="flex items-center gap-1.5 text-[10px] text-slate-300">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>{$t.chat.subtitle}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onclick={() => (isOpen = false)}
          class="w-6 h-6 rounded-[2px] hover:bg-slate-800 flex items-center justify-center transition-colors text-slate-400 hover:text-white cursor-pointer"
          aria-label="Tutup"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Messages Body -->
      <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        {#each messages as msg}
          <div
            class="flex flex-col {msg.sender === 'user'
              ? 'items-end'
              : 'items-start'}"
          >
            <div
              class="max-w-[85%] rounded-[3px] px-3 py-2 text-xs leading-relaxed {msg.sender ===
              'user'
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-slate-800 border border-slate-300'}"
            >
              {msg.text}
            </div>
            <span class="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
          </div>
        {/each}
      </div>

      <!-- Quick Question Buttons in Bootstrap Style -->
      <div
        class="px-3 py-2 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none"
      >
        {#each quickQuestions as qq}
          <button
            type="button"
            onclick={() => handleSend(qq)}
            class="text-[11px] px-2.5 py-1 rounded-[2px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors border border-slate-300 cursor-pointer"
          >
            {qq}
          </button>
        {/each}
      </div>

      <!-- Input Bar -->
      <form
        onsubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        class="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          bind:value={messageText}
          placeholder={$t.chat.placeholder}
          class="flex-1 h-9 bg-white border border-slate-300 rounded-[2px] px-3 text-xs text-slate-800 focus:border-emerald-600 focus:outline-none transition-colors"
        />
        <button
          type="submit"
          class="button-4-primary w-9 h-9 rounded-[2px] flex items-center justify-center cursor-pointer shrink-0"
          aria-label={$t.chat.send}
        >
          <Send class="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  {/if}
</div>
