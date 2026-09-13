<script lang="ts">
  import { ArrowRight, ArrowUpRight, Calculator, SlidersHorizontal, MessageCircle, Store, Sprout, Volume2 } from "lucide-svelte";
  import SalamModal from "$lib/components/SalamModal.svelte";

  let intent = $state<"borrower" | "investor">("borrower");
  let intentHeading: HTMLHeadingElement;
  const journeys = {
    borrower: {
      label: "Saya butuh pembiayaan", title: "Ada rencana untuk usaha Anda?",
      description: "Mulai dari kebutuhan yang paling dekat. Pelajari pilihan akad dan dokumen sebelum mengajukan.",
      action: "Temukan pembiayaan saya", href: "/borrower",
      steps: ["Tentukan kebutuhan usaha", "Siapkan dokumen", "Ajukan untuk ditinjau"],
      note: "Sudah punya pengajuan?", portal: "/auth/cms/borrower", portalLabel: "Masuk ke akun pembiayaan"
    },
    investor: {
      label: "Saya ingin mendanai", title: "Beri ruang bagi usaha untuk tumbuh.",
      description: "Kenali usaha yang akan Anda dukung. Tinjau akad, jangka waktu, dan risikonya sebelum memilih.",
      action: "Jelajahi pendanaan", href: "/investor",
      steps: ["Kenali pilihan pendanaan", "Pelajari risiko & akad", "Lanjutkan melalui akun pendana"],
      note: "Sudah menjadi pendana?", portal: "/auth/cms/lender", portalLabel: "Masuk ke akun pendana"
    }
  };
  let journey = $derived(journeys[intent]);
  function chooseIntent(value: "borrower" | "investor", focus = false) {
    intent = value;
    if (focus) intentHeading?.focus();
  }
  function handleTabKey(event: KeyboardEvent) {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      intent = event.key === "Home" ? "borrower" : event.key === "End" ? "investor" : intent === "borrower" ? "investor" : "borrower";
      document.getElementById(`intent-${intent}`)?.focus();
    }
  }
</script>

<svelte:head>
  <title>Namia Syariah — Ruang untuk tumbuh bersama</title>
  <meta name="description" content="Rencana usaha dan niat baik bertemu di Namia. Pilih pembiayaan usaha atau pendanaan syariah, lalu mulai dengan langkah yang sesuai kebutuhan Anda." />
  <meta property="og:title" content="Namia Syariah — Ruang untuk tumbuh bersama" />
  <meta property="og:description" content="Pembiayaan untuk menggerakkan usaha. Pendanaan untuk menumbuhkan manfaat. Temukan langkah Anda di Namia Syariah." />
  <meta property="og:image" content="/images/products/namia_musyarakah_partner.jpg" />
</svelte:head>

<SalamModal />
<div class="home-page">
  <section class="welcome portal-container" aria-labelledby="welcome-title">
    <div class="welcome-topline">
      <span>Assalamu’alaikum. Selamat datang di Namia.</span>
      <button type="button" onclick={() => window.dispatchEvent(new Event("open-salam-modal"))} aria-label="Dengarkan salam pembuka"><Volume2 size={14} /> Dengarkan salam</button>
    </div>
    <div class="welcome-grid">
      <div class="welcome-copy">
        <span class="portal-kicker"><span class="small-leaf"></span> Keuangan syariah, untuk kehidupan nyata</span>
        <h1 id="welcome-title">Usaha bergerak.<br />Manfaat <em>bertumbuh.</em></h1>
        <p>Di balik setiap usaha, ada harapan yang layak diperjuangkan. Temukan ruang untuk membiayai rencana Anda, atau ikut menumbuhkan usaha orang lain.</p>
        <div class="welcome-actions">
          <a class="portal-button" href="#mulai" onclick={() => chooseIntent("borrower")}><Store size={17} /> Saya butuh pembiayaan <ArrowRight size={16} /></a>
          <a class="secondary-action" href="#mulai" onclick={() => chooseIntent("investor")}>Saya ingin mendanai <ArrowUpRight size={17} /></a>
        </div>
        <div class="welcome-footnote"><Sprout size={17} /><span>Rencana Anda. Pilihan Anda. Langkah bersama.</span></div>
      </div>
      <figure class="welcome-photo">
        <img src="/images/products/namia_musyarakah_partner.jpg" alt="Dua perempuan berbincang tentang rencana usaha di sebuah kedai kopi" width="1376" height="768" fetchpriority="high" />
        <div class="photo-label"><Sprout size={15} /> Tumbuh bersama Namia</div>
        <figcaption><span>Yang tumbuh bukan hanya usaha.</span><strong>Juga kesempatan untuk sesama.</strong><small>Ilustrasi kegiatan usaha</small></figcaption>
      </figure>
    </div>
  </section>

  <section id="mulai" class="start-section portal-container" aria-labelledby="start-title">
    <div class="desk-top"><span class="desk-label">Mulai dari sini</span><span class="desk-hint">Pilih yang sesuai dengan kebutuhan Anda</span></div>
    <div class="journey-desk">
      <div class="intent-tabs" role="tablist" aria-label="Tujuan Anda">
        {#each ["borrower", "investor"] as value}
          {@const key = value as "borrower" | "investor"}
          <button id="intent-{key}" type="button" role="tab" aria-selected={intent === key} aria-controls="journey-panel" tabindex={intent === key ? 0 : -1} class:chosen={intent === key} onclick={() => chooseIntent(key)} onkeydown={handleTabKey}>
            {#if key === "borrower"}<Store size={19} />{:else}<Sprout size={19} />{/if}
            {journeys[key].label}
          </button>
        {/each}
      </div>
      <div id="journey-panel" role="tabpanel" aria-labelledby="intent-{intent}" tabindex="0" class="journey-body">
        <div class="journey-intro">
          <h2 id="start-title" tabindex="-1" bind:this={intentHeading}>{journey.title}</h2>
          <p>{journey.description}</p>
          <a href={journey.href} class="portal-button">{journey.action}<ArrowRight size={17} /></a>
        </div>
        <div class="journey-route">
          <span class="route-label">Langkah Anda berikutnya</span>
          <ol>{#each journey.steps as step, index}<li><span>{index + 1}</span>{step}</li>{/each}</ol>
          <div class="returning-member"><span>{journey.note}</span><a href={journey.portal}>{journey.portalLabel}<ArrowUpRight size={14} /></a></div>
        </div>
      </div>
    </div>
  </section>

  <section class="tool-section portal-container" aria-labelledby="tools-title">
    <div class="section-intro"><div><span class="portal-kicker">Sebelum memutuskan</span><h2 id="tools-title">Biar langkah Anda lebih mantap.</h2></div><p>Luangkan waktu untuk memahami pilihan Anda.</p></div>
    <div class="tool-links">
      <a href="/aggregator"><span class="tool-icon"><SlidersHorizontal size={23} strokeWidth={1.5} /></span><div><h3>Bandingkan pilihan</h3><p>Lihat akad, tenor, dan biaya produk berdampingan.</p><span class="tool-link-label">Buka katalog <ArrowRight size={15} /></span></div></a>
      <a href="/calculators"><span class="tool-icon"><Calculator size={23} strokeWidth={1.5} /></span><div><h3>Hitung lebih dulu</h3><p>Simulasikan angsuran, bagi hasil, dan kemampuan bayar.</p><span class="tool-link-label">Buka kalkulator <ArrowRight size={15} /></span></div></a>
      <a href="/contacts"><span class="tool-icon"><MessageCircle size={23} strokeWidth={1.5} /></span><div><h3>Bicarakan kebutuhan</h3><p>Cari jawaban atau sampaikan pertanyaan kepada tim Namia.</p><span class="tool-link-label">Ke pusat bantuan <ArrowRight size={15} /></span></div></a>
    </div>
  </section>
</div>

<style>
  .home-page { background: var(--portal-canvas); padding-bottom: 64px; }
  .welcome-topline { display:flex; align-items:center; justify-content:space-between; padding:18px 0; border-bottom:1px solid var(--portal-border); color:var(--portal-muted); font-size:12px; }
  .welcome-topline button { display:flex; align-items:center; gap:6px; cursor:pointer; color:var(--portal-green); }
  .welcome-grid { display:grid; grid-template-columns:1.05fr 1fr; gap:64px; align-items:center; padding:48px 0 44px; }
  .welcome-copy .portal-kicker { display:flex; align-items:center; gap:7px; font-size:10px; }
  .small-leaf { display:inline-block; width:8px; height:12px; background:var(--portal-green); border-radius:8px 0 8px 0; }
  h1 { font-family:Georgia,"Times New Roman",serif; font-weight:400; color:var(--portal-ink); font-size:clamp(36px,4.15vw,59px); line-height:1.12; letter-spacing:-2px; margin:22px 0; }
  h1 em { color:var(--portal-green); font-weight:400; }
  .welcome-copy > p { max-width:470px; color:var(--portal-muted); line-height:1.85; font-size:15px; margin:0; }
  .welcome-actions { display:flex; flex-wrap:wrap; gap:18px; align-items:center; margin-top:27px; }
  .welcome-actions .portal-button { font-size:13px; padding:12px 15px; }
  .secondary-action { display:inline-flex; gap:7px; align-items:center; font-size:13px; font-weight:700; color:var(--portal-green); padding:7px 0; }
  .secondary-action:hover { text-decoration:underline; }
  .welcome-footnote { display:flex; align-items:center; gap:9px; margin-top:25px; color:var(--portal-muted); font-size:11px; }
  .welcome-photo { position:relative; border:1px solid #ccd4c9; padding:7px; background:white; border-radius:6px; box-shadow:0 3px 0 #e0e7dd; margin:0; }
  .welcome-photo img { width:100%; height:348px; object-fit:cover; object-position:52% center; border-radius:2px; }
  .welcome-photo figcaption { position:absolute; bottom:7px; left:7px; right:7px; padding:58px 23px 20px; background:linear-gradient(transparent,rgba(21,40,30,.88)); color:white; display:flex; flex-direction:column; font-size:14px; line-height:1.6; }
  .welcome-photo figcaption strong { font-family:Georgia,serif; font-size:23px; font-weight:400; }
  .welcome-photo figcaption small { color:#e3e8df; font-size:9px; margin-top:8px; }
  .photo-label { position:absolute; top:23px; left:23px; display:flex; align-items:center; gap:7px; background:#f3f6ee; color:var(--portal-green); padding:6px 10px; border:1px solid white; font-size:10px; border-radius:3px; }
  .start-section { scroll-margin-top:130px; }
  .desk-top { display:flex; align-items:center; justify-content:space-between; gap:12px; }
  .desk-label { padding:9px 17px; background:#e5ebdf; border:1px solid var(--portal-border); border-bottom:0; border-radius:5px 5px 0 0; font-size:11px; font-weight:700; color:var(--portal-green); }
  .desk-hint { font-size:11px; color:var(--portal-muted); }
  .journey-desk { background:white; border:1px solid #bac9bc; border-radius:0 5px 5px 5px; box-shadow:0 3px 0 #e4eade; }
  .intent-tabs { display:flex; background:linear-gradient(#f8faf6,#eaf0e6); border-bottom:1px solid var(--portal-border); padding:0 28px; gap:26px; }
  .intent-tabs button { display:flex; align-items:center; justify-content:center; gap:9px; padding:16px 4px; color:var(--portal-muted); font-size:14px; border-bottom:3px solid transparent; margin-bottom:-1px; cursor:pointer; }
  .intent-tabs button.chosen { color:var(--portal-green); border-bottom-color:var(--portal-green); font-weight:700; }
  .intent-tabs button:hover { color:var(--portal-green); }
  .journey-body { display:grid; grid-template-columns:1.15fr 1fr; gap:64px; padding:30px; }
  .journey-intro h2 { font-family:Georgia,serif; font-size:27px; font-weight:400; line-height:1.3; margin:0 0 10px; color:var(--portal-ink); }
  .journey-intro p { max-width:470px; color:var(--portal-muted); font-size:14px; line-height:1.7; margin:0 0 22px; }
  .journey-route { border-left:1px solid var(--portal-border); padding-left:34px; }
  .route-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--portal-muted); }
  .journey-route ol { display:grid; gap:12px; margin:14px 0 17px; padding:0; list-style:none; }
  .journey-route li { display:flex; align-items:center; gap:10px; font-size:12px; color:var(--portal-ink); }
  .journey-route li > span { display:flex; justify-content:center; align-items:center; width:22px; height:22px; border:1px solid var(--portal-border); background:#f4f7f0; color:var(--portal-green); border-radius:3px; font-family:Georgia,serif; }
  .returning-member { display:flex; flex-wrap:wrap; gap:5px; padding-top:14px; border-top:1px dashed var(--portal-border); font-size:10px; color:var(--portal-muted); }
  .returning-member a { display:inline-flex; align-items:center; gap:3px; font-weight:700; color:var(--portal-green); }
  .tool-section { padding-top:49px; }
  .section-intro { display:flex; align-items:flex-end; justify-content:space-between; gap:20px; margin-bottom:23px; }
  .section-intro h2 { font-family:Georgia,serif; font-size:28px; font-weight:400; color:var(--portal-ink); margin:9px 0 0; }
  .section-intro > p { font-size:11px; color:var(--portal-muted); margin:0 0 4px; }
  .tool-links { display:grid; grid-template-columns:repeat(3,1fr); border:1px solid var(--portal-border); background:white; border-radius:5px; }
  .tool-links > a { display:flex; align-items:flex-start; gap:15px; padding:24px; transition:background .15s; }
  .tool-links > a + a { border-left:1px solid var(--portal-border); }
  .tool-links > a:hover { background:#f1f6eb; }
  .tool-icon { color:var(--portal-green); padding-top:2px; }
  .tool-links h3 { font-size:14px; color:var(--portal-ink); margin:0 0 7px; }
  .tool-links p { font-size:12px; color:var(--portal-muted); line-height:1.7; margin:0 0 14px; }
  .tool-link-label { display:flex; align-items:center; gap:8px; font-size:11px; font-weight:700; color:var(--portal-green); }
  @media(max-width:1023px) { .welcome-grid{gap:30px}.welcome-photo img{height:340px}.welcome-actions{gap:9px} .journey-body{gap:28px}.journey-route{padding-left:25px}.tool-links>a{padding:20px 17px;gap:11px}.section-intro>p{display:none} }
  @media(max-width:700px) { .home-page{padding-bottom:36px}.welcome-topline{font-size:10px;gap:12px}.welcome-topline button{font-size:0}.welcome-grid{grid-template-columns:1fr;padding:30px 0;gap:25px}h1{font-size:43px;letter-spacing:-1.5px;margin:16px 0}.welcome-copy>p{font-size:14px}.welcome-actions{gap:14px}.welcome-footnote{margin-top:17px}.welcome-photo img{height:255px}.welcome-photo figcaption strong{font-size:21px}.desk-hint{font-size:10px;text-align:right;max-width:150px}.intent-tabs{padding:0 12px;gap:12px}.intent-tabs button{font-size:12px;gap:7px;flex:1}.journey-body{grid-template-columns:1fr;padding:23px;gap:23px}.journey-intro h2{font-size:25px}.journey-route{border-left:0;border-top:1px solid var(--portal-border);padding:20px 0 0}.tool-section{padding-top:33px}.section-intro h2{font-size:25px}.tool-links{grid-template-columns:1fr}.tool-links>a{padding:22px;gap:18px}.tool-links>a+a{border-left:0;border-top:1px solid var(--portal-border)} }
</style>
