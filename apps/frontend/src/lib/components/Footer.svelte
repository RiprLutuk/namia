<script lang="ts">
  import { ShieldCheck, Mail, Phone, MapPin, Heart } from "lucide-svelte";
</script>

<footer class="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800">
  <!-- Top Islamic Quote Banner -->
  <div class="bg-emerald-950/60 border-b border-emerald-800/30 py-4 px-4 sm:px-6">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-center text-sm text-emerald-300">
      <span class="font-serif italic text-base">"Sebaik-baik Manusia adalah yang Paling Berguna Bagi Sesamanya"</span>
      <span class="text-xs text-emerald-400/80 font-medium">— HR. Ahmad</span>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
      
      <!-- Brand & Mission Column -->
      <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <span class="text-2xl font-bold tracking-tight text-white">
            Syarfi<span class="text-emerald-400">.</span>
          </span>
        </div>
        <p class="text-sm text-slate-400 leading-relaxed max-w-sm">
          Platform fintech crowdfunding dan aggregator produk keuangan syariah modern pertama yang menghubungkan ribuan pencari pembiayaan dengan mitra keuangan terpercaya tanpa riba, gharar, dan maisir.
        </p>
        <div class="pt-2 text-xs text-slate-400 flex flex-col gap-2">
          <div class="flex items-start gap-2.5">
            <MapPin class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Menara MTH Lt. 10, Jl. MT Haryono Kav 23, Jakarta 12820</span>
          </div>
          <div class="flex items-center gap-2.5">
            <Phone class="w-4 h-4 text-emerald-400 shrink-0" />
            <span>(+62) 21 8378 2337</span>
          </div>
          <div class="flex items-center gap-2.5">
            <Mail class="w-4 h-4 text-emerald-400 shrink-0" />
            <span>salam@syarfi.id</span>
          </div>
        </div>
      </div>

      <!-- Quick Links 1: Produk & Layanan -->
      <div class="space-y-3">
        <h4 class="text-sm font-semibold uppercase tracking-wider text-white">Produk Finansial</h4>
        <ul class="space-y-2 text-sm text-slate-400">
          <li><a href="/aggregator?category=p2p-lending" class="hover:text-emerald-400 transition-colors">P2P Lending Syariah</a></li>
          <li><a href="/aggregator?category=asuransi-syariah" class="hover:text-emerald-400 transition-colors">Asuransi Takaful</a></li>
          <li><a href="/aggregator?category=paylater-syariah" class="hover:text-emerald-400 transition-colors">Paylater Murabahah</a></li>
          <li><a href="/aggregator?category=reksa-dana-syariah" class="hover:text-emerald-400 transition-colors">Reksa Dana & Sukuk</a></li>
          <li><a href="/aggregator?category=pembiayaan-usaha" class="hover:text-emerald-400 transition-colors">Modal Kerja UMKM</a></li>
        </ul>
      </div>

      <!-- Quick Links 2: Solusi & Edukasi -->
      <div class="space-y-3">
        <h4 class="text-sm font-semibold uppercase tracking-wider text-white">Solusi & Alat</h4>
        <ul class="space-y-2 text-sm text-slate-400">
          <li><a href="/calculators" class="hover:text-emerald-400 transition-colors">Kalkulator Simulasi</a></li>
          <li><a href="/borrower" class="hover:text-emerald-400 transition-colors">Panduan Peminjam</a></li>
          <li><a href="/investor" class="hover:text-emerald-400 transition-colors">Panduan Investor</a></li>
          <li><a href="/blog" class="hover:text-emerald-400 transition-colors">Pusat Edukasi Syariah</a></li>
          <li><a href="/onboarding" class="hover:text-emerald-400 transition-colors">Simulasi KYC Onboarding</a></li>
        </ul>
      </div>

      <!-- Quick Links 3: Perusahaan & Kepatuhan -->
      <div class="space-y-3">
        <h4 class="text-sm font-semibold uppercase tracking-wider text-white">Korporasi</h4>
        <ul class="space-y-2 text-sm text-slate-400">
          <li><a href="/about" class="hover:text-emerald-400 transition-colors">Profil Dewan & Direksi</a></li>
          <li><a href="/about#dps" class="hover:text-emerald-400 transition-colors">Dewan Pengawas Syariah</a></li>
          <li><a href="/contacts" class="hover:text-emerald-400 transition-colors">Hubungi Kami</a></li>
          <li><a href="/about#awards" class="hover:text-emerald-400 transition-colors">Penghargaan & Prestasi</a></li>
        </ul>
      </div>

    </div>

    <!-- Regulatory Compliance Notice Box -->
    <div class="mt-12 pt-8 border-t border-slate-800">
      <div class="bg-slate-800/60 rounded-xl p-5 border border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-400 leading-relaxed">
        <div class="space-y-1">
          <span class="font-semibold text-slate-200 block">Pemberitahuan Regulasi & Kepatuhan Syariah:</span>
          <p>
            PT Syarfi Teknologi Finansial beroperasi dengan menjunjung tinggi prinsip kepatuhan regulasi Otoritas Jasa Keuangan (OJK). Seluruh instrumen pembiayaan dan kemitraan diawasi secara berkala oleh Dewan Pengawas Syariah (DPS) terafiliasi Dewan Syariah Nasional Majelis Ulama Indonesia (DSN-MUI).
          </p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <span class="px-2.5 py-1 rounded bg-slate-700 font-mono text-[11px] text-emerald-400 border border-emerald-500/30">OJK REGULATED</span>
          <span class="px-2.5 py-1 rounded bg-slate-700 font-mono text-[11px] text-emerald-400 border border-emerald-500/30">DSN-MUI COMPLIANT</span>
        </div>
      </div>
    </div>

    <!-- Bottom Copyright -->
    <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
      <p>© 2026 PT Syarfi Teknologi Finansial. All rights reserved.</p>
      <div class="flex items-center gap-1">
        <span>Dibangun dengan performa tinggi Bun, ElysiaJS & SvelteKit</span>
        <Heart class="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
      </div>
    </div>
  </div>
</footer>
