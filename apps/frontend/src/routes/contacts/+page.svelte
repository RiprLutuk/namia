<script lang="ts">
  import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-svelte";

  let name = $state("");
  let email = $state("");
  let subject = $state("");
  let message = $state("");
  let submitted = $state(false);

  function handleContactSubmit() {
    if (!name || !email || !message) return;
    submitted = true;
  }
</script>

<svelte:head>
  <title>Hubungi Kami — PT Syarfi Teknologi Finansial</title>
  <meta name="description" content="Hubungi kantor pusat Syarfi di Menara MTH Jakarta Selatan atau kirimkan pertanyaan seputar pembiayaan syariah." />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
  
  <div class="text-center max-w-2xl mx-auto space-y-3">
    <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
      Hubungi Tim Layanan Syarfi
    </h1>
    <p class="text-slate-600 text-sm sm:text-base leading-relaxed">
      Memiliki pertanyaan mengenai permohonan pembiayaan UMKM, skema pendanaan sukuk, atau kemitraan institusi? Kami siap membantu.
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <!-- Contact Info Cards (5 Cols) -->
    <div class="lg:col-span-5 space-y-4">
      <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <MapPin class="w-5 h-5" />
        </div>
        <div class="space-y-1 text-xs">
          <h4 class="font-bold text-slate-900 text-sm">Kantor Pusat</h4>
          <p class="text-slate-600 leading-relaxed">
            Menara MTH Lt. 10, Jl. MT Haryono Kav 23, Tebet Barat, Jakarta Selatan 12820
          </p>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Phone class="w-5 h-5" />
        </div>
        <div class="space-y-1 text-xs">
          <h4 class="font-bold text-slate-900 text-sm">Telepon & WhatsApp</h4>
          <p class="text-slate-600 font-mono">(+62) 21 8378 2337</p>
          <p class="text-slate-400">Senin - Jumat (09.00 - 17.00 WIB)</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <Mail class="w-5 h-5" />
        </div>
        <div class="space-y-1 text-xs">
          <h4 class="font-bold text-slate-900 text-sm">Email Resmi</h4>
          <p class="text-slate-600 font-mono">salam@syarfi.id</p>
          <p class="text-slate-400">Dukungan teknis & layanan nasabah 24/7</p>
        </div>
      </div>
    </div>

    <!-- Contact Form (7 Cols) -->
    <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
      {#if submitted}
        <div class="text-center py-12 space-y-4">
          <div class="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-slate-900">Pesan Anda Telah Terkirim!</h3>
          <p class="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
            Terima kasih telah menghubungi Syarfi. Customer Relation Representative kami akan segera membalas melalui email atau WhatsApp.
          </p>
          <button
            type="button"
            onclick={() => { submitted = false; name = ""; email = ""; subject = ""; message = ""; }}
            class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
          >
            Kirim Pesan Lainnya
          </button>
        </div>
      {:else}
        <form onsubmit={(e) => { e.preventDefault(); handleContactSubmit(); }} class="space-y-4">
          <h3 class="text-lg font-bold text-slate-900">Kirim Pesan Langsung</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="contact-name" class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Nama Lengkap *</label>
              <input
                id="contact-name"
                type="text"
                required
                bind:value={name}
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
              />
            </div>

            <div>
              <label for="contact-email" class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Alamat Email *</label>
              <input
                id="contact-email"
                type="email"
                required
                bind:value={email}
                class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
              />
            </div>
          </div>

          <div>
            <label for="contact-subject" class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Topik / Subjek</label>
            <input
              id="contact-subject"
              type="text"
              bind:value={subject}
              placeholder="Contoh: Pertanyaan seputar pendaftaran borrower UMKM"
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
            />
          </div>

          <div>
            <label for="contact-message" class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Pesan Lengkap *</label>
            <textarea
              id="contact-message"
              rows="4"
              required
              bind:value={message}
              placeholder="Tuliskan pertanyaan atau kebutuhan Anda secara detail di sini..."
              class="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-hidden"
            ></textarea>
          </div>

          <button
            type="submit"
            class="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <Send class="w-3.5 h-3.5" />
            <span>Kirim Pesan Sekarang</span>
          </button>
        </form>
      {/if}
    </div>

  </div>

</div>
