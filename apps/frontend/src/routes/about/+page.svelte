<script lang="ts">
  import { onMount } from "svelte";
  import { ArrowRight, Building2 } from "lucide-svelte";
  import { cmsStore, fetchCmsContent } from "$lib/cms";
  onMount(() => { fetchCmsContent(); });
  const settings = $derived($cmsStore.siteSettings);
</script>

<svelte:head>
  <title>Tentang Namia | Profil & Tata Kelola</title>
  <meta name="description" content="Kenali perusahaan, prinsip kerja, tata kelola, dan kegiatan Namia Syariah." />
</svelte:head>

<div class="portal-page about-page">
  <div class="portal-container">
    <header class="page-intro">
      <p class="portal-kicker">Tentang Namia</p>
      <h1 class="portal-heading">Kenali tempat dana dan<br />usaha Anda bertemu.</h1>
      <p class="intro-copy">{settings.companyName} menghubungkan pendana dengan pelaku usaha melalui layanan pembiayaan syariah berbasis teknologi.</p>
    </header>
    <div class="company-layout">
      <aside class="directory portal-panel" aria-label="Profil singkat perusahaan">
        <div class="directory-title"><Building2 size={18} /> Profil perusahaan</div>
        <dl>
          <div><dt>Nama perusahaan</dt><dd>{settings.companyName}</dd></div>
          <div><dt>Berdiri</dt><dd>4 April 2017 · Jakarta</dd></div>
          <div><dt>Bidang layanan</dt><dd>Pendanaan & pembiayaan syariah</dd></div>
        </dl>
        <nav aria-label="Isi halaman tentang Namia">
          <a href="#prinsip">Prinsip perusahaan <span>↓</span></a>
          <a href="#tata-kelola">Tata kelola <span>↓</span></a>
          <a href="#kegiatan">Kegiatan perusahaan <span>↓</span></a>
        </nav>
      </aside>
      <div class="company-content">
        <section class="origin portal-panel" aria-labelledby="origin-title">
          <div class="origin-copy">
            <p class="portal-kicker">Berangkat dari kebutuhan usaha</p>
            <h2 id="origin-title">Ruang untuk tumbuh,<br />dengan prinsip yang jelas.</h2>
            <p>Usaha yang baik membutuhkan akses modal. Pemilik dana membutuhkan kejelasan tentang ke mana dananya disalurkan. Namia hadir untuk mempertemukan keduanya.</p>
            <p>Nama Namia berakar dari <em>An-Namaa'</em>, yang berarti pertumbuhan. Bagi kami, pertumbuhan dimulai dari kegiatan usaha yang nyata dan hubungan yang saling bertanggung jawab.</p>
          </div>
          <figure><img src="/images/about/menara_mth.jpg" alt="Gedung Menara MTH, kantor Namia" /><figcaption>Menara MTH · Jakarta Selatan</figcaption></figure>
        </section>
        <section id="prinsip" class="content-section" aria-labelledby="principles-title">
          <div class="section-heading"><h2 id="principles-title">Prinsip perusahaan</h2><span>Visi, misi & nilai</span></div>
          <div class="mission-list portal-panel">
            {#each $cmsStore.missions as mission}<article><h3>{mission.title}</h3><p>{mission.content}</p></article>{/each}
          </div>
        </section>
        <section id="tata-kelola" class="content-section" aria-labelledby="governance-title">
          <div class="section-heading"><h2 id="governance-title">Tata kelola</h2></div>
          <div class="governance portal-panel">
            <p>{settings.regulatoryDisclaimer}</p>
            <div class="governance-links">
              <a href="/team"><strong>Dewan & tim</strong><span>Kenali pengawas dan pengelola Namia.</span><ArrowRight size={18} /></a>
              <a href="/contacts#form-kontak"><strong>Layanan pengaduan</strong><span>Sampaikan pertanyaan atau kendala layanan.</span><ArrowRight size={18} /></a>
            </div>
          </div>
        </section>
        {#if $cmsStore.activityDocs.length}
          <section id="kegiatan" class="content-section" aria-labelledby="activities-title">
            <div class="section-heading"><h2 id="activities-title">Di dalam kegiatan Namia</h2><span>Dokumentasi</span></div>
            <div class="activity-grid">
              {#each $cmsStore.activityDocs as activity}
                <article class="activity portal-panel"><img src={activity.photo} alt={activity.title || activity.notes} loading="lazy" /><div><span class="small-label">{activity.tag || "Kegiatan"}</span><h3>{activity.title || activity.notes}</h3>{#if activity.desc}<p>{activity.desc}</p>{/if}</div></article>
              {/each}
            </div>
          </section>
        {/if}
        {#if $cmsStore.awards.length}
          <details class="awards portal-panel">
            <summary>Penghargaan & apresiasi <span class="small-label">{$cmsStore.awards.length} catatan</span></summary>
            <div class="award-list">{#each $cmsStore.awards as award}<article><h3>{award.name}</h3>{#if award.org}<span class="small-label">{award.org}</span>{/if}<p>{award.description || award.desc || ""}</p></article>{/each}</div>
          </details>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .about-page{padding:48px 0 72px}.page-intro{max-width:780px;margin-bottom:34px}.intro-copy{max-width:630px;margin:18px 0 0;color:#65736e;font-size:16px;line-height:1.75}.company-layout{display:grid;grid-template-columns:246px minmax(0,1fr);gap:28px;align-items:start}.directory{position:sticky;top:100px;overflow:hidden}.directory-title{display:flex;align-items:center;gap:9px;padding:16px 18px;background:#e8eee4;border-bottom:1px solid #cbd7c9;font-size:13px;font-weight:700}dl{padding:4px 18px 16px;margin:0}dl>div{padding-top:18px}dt{color:#65736e;font-size:12px;margin-bottom:5px}dd{margin:0;font-size:14px;line-height:1.5;font-weight:600}.directory nav{border-top:1px solid #dce4d8;padding:8px 18px}.directory nav a{display:flex;justify-content:space-between;gap:10px;padding:10px 0;color:#165b45;font-size:13px}.company-content{min-width:0}.origin{display:grid;grid-template-columns:1.25fr .75fr;overflow:hidden}.origin-copy{padding:28px}h2{font-family:Georgia,serif;font-size:27px;font-weight:400;line-height:1.25;margin:0;color:#233b35}.origin p:not(.portal-kicker),.governance>p{font-size:14px;line-height:1.8;color:#65736e;margin:16px 0 0}figure{margin:0;display:flex;flex-direction:column;background:#e7ece5;border-left:1px solid #dce4d8}figure img{width:100%;height:100%;max-height:380px;object-fit:cover;flex:1}figcaption{font-size:11px;padding:11px;color:#65736e}.content-section{margin-top:34px;scroll-margin-top:110px}.section-heading{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:15px}.section-heading h2{font-size:24px}.section-heading>span,.small-label{font-size:11px;color:#65736e}.mission-list{padding:0 24px}.mission-list article{display:grid;grid-template-columns:155px 1fr;gap:20px;padding:22px 0}.mission-list article+article{border-top:1px solid #e0e7dc}h3{font-family:Tahoma,Arial,sans-serif;font-size:14px;line-height:1.5;margin:0;font-weight:700;color:#233b35}.mission-list p{font-size:14px;line-height:1.7;color:#65736e;margin:0}.governance{padding:22px 24px}.governance>p{margin-top:0}.governance-links{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:20px;padding-top:20px;border-top:1px solid #e0e7dc}.governance-links a{display:grid;grid-template-columns:1fr auto;color:#165b45;gap:4px 10px;font-size:14px}.governance-links a span{grid-column:1;font-size:12px;line-height:1.5;color:#65736e}.governance-links a :global(svg){grid-column:2;grid-row:1 / 3;align-self:center}.activity-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.activity{overflow:hidden}.activity>img{height:132px;width:100%;object-fit:cover}.activity>div{padding:15px}.activity h3{margin-top:6px;font-size:13px}.activity p{color:#65736e;font-size:12px;line-height:1.65;margin:8px 0 0}.awards{margin-top:28px}.awards summary{padding:18px 22px;cursor:pointer;font-size:14px;font-weight:700}.awards summary span{margin-left:10px}.award-list{padding:0 22px}.award-list article{padding:18px 0;border-top:1px solid #dce4d8}.award-list p{color:#65736e;font-size:13px;line-height:1.7;margin-bottom:0}
  @media(max-width:1020px){.company-layout{grid-template-columns:205px minmax(0,1fr);gap:20px}.origin{grid-template-columns:1fr}.origin figure{display:none}.activity-grid{grid-template-columns:repeat(2,1fr)}.mission-list article{grid-template-columns:1fr;gap:8px}}
  @media(max-width:700px){.about-page{padding:30px 0 48px}.company-layout{grid-template-columns:1fr}.directory{position:static}.directory dl{display:grid;grid-template-columns:1fr 1fr;gap:0 16px}.directory nav{display:flex;flex-wrap:wrap;gap:0 20px}.directory nav a{gap:8px}.origin-copy{padding:22px}.governance-links{grid-template-columns:1fr;gap:18px}.section-heading>span{display:none}.activity-grid{gap:12px}.activity>div{padding:12px}.activity>img{height:112px}}
</style>
