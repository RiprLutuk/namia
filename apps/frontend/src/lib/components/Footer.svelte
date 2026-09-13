<script lang="ts">
  import { ArrowRight, Rss } from "lucide-svelte";
  import Logo from "$lib/components/Logo.svelte";
  import { cmsStore } from "$lib/cms";
  import { API_BASE_URL, NAMIA_API_KEY } from "$lib/api";
  let email = $state("");
  let subscriptionState = $state<"idle" | "loading" | "success" | "error">("idle");
  async function subscribe(event: SubmitEvent) {
    event.preventDefault();
    if (subscriptionState === "loading") return;
    subscriptionState = "loading";
    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: "POST", headers: { "Content-Type": "application/json", "x-api-key": NAMIA_API_KEY },
        body: JSON.stringify({ fullName: "Subscriber", email: email.trim(), phone: "080000000000", needCategory: "Newsletter", targetAmount: 0, targetTenorMonths: 0, message: "Permintaan langganan warta berkala melalui footer" })
      });
      const result = await response.json();
      if (!response.ok || result.success === false) throw new Error("Subscription failed");
      subscriptionState = "success";
      email = "";
    } catch { subscriptionState = "error"; }
  }
</script>

<footer class="site-footer"><div class="portal-container">
  <div class="footer-main">
    <div class="footer-brand"><a href="/" aria-label="Namia Syariah beranda"><Logo size="sm" showOjk={false}/></a><p>Mempertemukan rencana usaha<br/>dengan niat untuk memberi manfaat.</p><a class="contact-email" href="mailto:{$cmsStore.siteSettings.email || 'salam@namia.id'}">{$cmsStore.siteSettings.email || 'salam@namia.id'}</a><span class="office-hours">{$cmsStore.siteSettings.operatingHours}</span></div>
    <nav aria-label="Tautan layanan"><h2>Layanan Anda</h2><a href="/borrower">Pembiayaan usaha</a><a href="/investor">Pendanaan syariah</a><a href="/aggregator">Katalog & perbandingan</a><a href="/calculators">Kalkulator finansial</a><a href="/onboarding">Formulir pengajuan</a></nav>
    <nav aria-label="Tautan informasi"><h2>Kenali Namia</h2><a href="/about">Profil perusahaan</a><a href="/team">Dewan pengawas & tim</a><a href="/blog">Wawasan & berita</a><a href="/contacts">Kontak & pertanyaan umum</a><a href="/rss.xml" class="rss-link"><Rss size={12}/> RSS artikel</a></nav>
    <div class="newsletter"><h2>Kabar baik, secukupnya.</h2><p>Daftarkan email untuk menerima warta Namia.</p><form onsubmit={subscribe}><label for="newsletter-email" class="sr-only">Email untuk warta Namia</label><input id="newsletter-email" type="email" autocomplete="email" placeholder="Alamat email Anda" bind:value={email} required disabled={subscriptionState === 'loading'}/><button type="submit" aria-label="Daftar warta Namia" disabled={subscriptionState === 'loading'}><ArrowRight size={17}/></button></form><div aria-live="polite" class="subscription-status" class:error={subscriptionState === 'error'}>{#if subscriptionState === 'success'}Permintaan langganan diterima. Terima kasih.{:else if subscriptionState === 'error'}Belum terkirim. Periksa koneksi lalu coba lagi.{:else if subscriptionState === 'loading'}Mengirim permintaan…{/if}</div></div>
  </div>
  <details class="risk-disclosure"><summary>Pahami risiko sebelum mendanai atau mengajukan pembiayaan</summary><div><p>Pendanaan memiliki risiko gagal bayar dan kehilangan dana. Pelajari informasi produk, akad, serta kewajiban masing-masing pihak sebelum mengambil keputusan.</p><p>Sesuaikan pembiayaan dengan kemampuan bayar. Hasil simulasi merupakan perkiraan dan bukan persetujuan pembiayaan atau jaminan imbal hasil.</p><a href="/contacts">Tanyakan hal yang belum jelas kepada tim Namia →</a></div></details>
  <div class="footer-bottom"><span>© {new Date().getFullYear()} {$cmsStore.siteSettings.companyName || 'PT Namia Finansial Teknologi'}</span><span>Smart Growth, Halal Impact.</span><a href="/backoffice/auth">Portal admin</a></div>
</div></footer>

<style>
  .site-footer{background:#eaf0e4;border-top:1px solid #c5d3bd;color:#52645a;padding:37px 0 0}.footer-main{display:grid;grid-template-columns:1.2fr 1fr 1fr 1.15fr;gap:38px}.footer-brand p{font-size:12px;line-height:1.8;margin:17px 0 12px}.contact-email{font-size:12px;font-weight:700;color:#165b45}.office-hours{display:block;font-size:10px;margin-top:6px}.footer-main h2{font-family:Tahoma,Arial,sans-serif;font-size:12px;font-weight:700;color:#233b35;margin:0 0 13px}.footer-main nav>a{display:block;font-size:11px;padding:4px 0}.footer-main a:hover{text-decoration:underline}.rss-link{display:flex!important;align-items:center;gap:5px}.newsletter p{font-size:11px;line-height:1.8;margin-bottom:12px}.newsletter form{display:flex;background:#fff;border:1px solid #b9cbb2;border-radius:4px;overflow:hidden}.newsletter input{width:100%;min-width:0;background:transparent;border:0;font-size:11px;min-height:39px!important;padding:8px 10px}.newsletter button{background:#165b45;color:white;padding:10px;cursor:pointer}.newsletter button:disabled{opacity:.5;cursor:wait}.subscription-status{font-size:11px;color:#165b45;min-height:25px;margin-top:6px}.subscription-status.error{color:#9a342c}.risk-disclosure{border-top:1px solid #cbd8c3;border-bottom:1px solid #cbd8c3;margin-top:26px;font-size:11px}.risk-disclosure summary{cursor:pointer;padding:15px 0;font-weight:600}.risk-disclosure>div{max-width:850px;padding:0 0 17px;line-height:1.8}.risk-disclosure p{margin-bottom:10px}.risk-disclosure a{color:#165b45;text-decoration:underline}.footer-bottom{display:flex;flex-wrap:wrap;align-items:center;gap:20px;justify-content:space-between;padding:19px 0;font-size:9px;color:#65736e}.footer-bottom a{color:#52645a}@media(max-width:1000px){.footer-main{gap:25px;grid-template-columns:1.1fr 1fr 1fr}.newsletter{grid-column:1/-1;max-width:420px}}@media(max-width:620px){.footer-main{grid-template-columns:1fr 1fr;gap:28px 20px}.footer-brand{grid-column:1/-1}.footer-brand p{margin-top:12px}.newsletter{max-width:none}.footer-bottom{gap:8px 20px;padding:17px 0}.footer-bottom>span:first-child{width:100%}.site-footer{padding-top:28px}}
</style>
