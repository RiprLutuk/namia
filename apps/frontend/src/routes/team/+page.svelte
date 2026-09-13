<script lang="ts">
  import { onMount } from "svelte";
  import { Users, ArrowRight, GraduationCap } from "lucide-svelte";
  import { cmsStore, fetchCmsContent } from "$lib/cms";
  onMount(() => { fetchCmsContent(); });
  let selectedLevel = $state(0);
  const team = $derived($cmsStore.team || []);
  const welcome = $derived($cmsStore.siteSettings.ceoWelcome);
  const groups = [
    { level: 1, id: "dps", title: "Dewan Pengawas Syariah", label: "Pengawas Syariah", description: "Mengawasi kesesuaian akad dan pelaksanaan layanan dengan prinsip syariah." },
    { level: 2, id: "komisaris", title: "Dewan Komisaris", label: "Komisaris", description: "Mengawasi pengelolaan perusahaan dan memberi arahan kepada direksi." },
    { level: 3, id: "direksi", title: "Direksi", label: "Direksi", description: "Bertanggung jawab atas arah perusahaan, operasional, dan teknologi." },
    { level: 4, id: "manajemen", title: "Tim Manajemen", label: "Manajemen", description: "Mendampingi penilaian pembiayaan, hubungan pendana, dan layanan harian." },
  ];
  const visibleGroups = $derived(groups.filter(group => selectedLevel === 0 || group.level === selectedLevel).map(group => ({ ...group, members: team.filter(member => (member.job_level ?? member.jobLevel) === group.level) })).filter(group => group.members.length));
</script>

<svelte:head><title>Dewan & Tim | Namia Syariah</title><meta name="description" content="Kenali Dewan Pengawas Syariah, komisaris, direksi, dan tim yang mengelola layanan Namia." /></svelte:head>

<div class="portal-page team-page">
  <div class="portal-container">
    <header class="page-intro"><div><p class="portal-kicker">Dewan & tim</p><h1 class="portal-heading">Orang-orang di balik<br />setiap tanggung jawab.</h1><p class="intro-copy">Kenali siapa yang mengawasi, mengambil keputusan, dan mendampingi layanan Anda.</p></div><a href="/contacts" class="portal-button-secondary">Hubungi tim layanan <ArrowRight size={16} /></a></header>
    <div class="team-toolbar portal-panel">
      <span class="directory-label"><Users size={17} /> Direktori tim</span>
      <div class="team-filters" aria-label="Filter bagian tim"><button type="button" class:active={selectedLevel === 0} aria-pressed={selectedLevel === 0} onclick={() => selectedLevel = 0}>Semua</button>{#each groups as group}<button type="button" class:active={selectedLevel === group.level} aria-pressed={selectedLevel === group.level} onclick={() => selectedLevel = group.level}>{group.label}</button>{/each}</div>
      <span class="team-count" aria-live="polite">{visibleGroups.reduce((total, group) => total + group.members.length, 0)} profil</span>
    </div>
    {#each visibleGroups as group}
      <section id={group.id} class="team-section" aria-labelledby={`heading-${group.id}`}>
        <div class="group-heading"><h2 id={`heading-${group.id}`}>{group.title}</h2><p>{group.description}</p></div>
        <div class="member-grid">{#each group.members as member}<article class="member portal-panel"><div class="member-top"><img src={member.photo} alt={member.fullname || member.fullName} loading="lazy" /><div><p class="member-role">{member.job_title || member.jobTitle}</p><h3>{member.fullname || member.fullName}</h3></div></div><details><summary>Profil & pengalaman</summary><div class="biography"><p>{member.biography}</p>{#if member.education}<div class="education"><GraduationCap size={17} /><span>{member.education}</span></div>{/if}</div></details></article>{/each}</div>
      </section>
    {:else}<div class="empty-state portal-panel"><p>Profil pada bagian ini belum tersedia.</p><button type="button" class="portal-button-secondary" onclick={() => selectedLevel = 0}>Lihat semua bagian</button></div>{/each}
    {#if welcome?.paragraphs?.length}<details id="sambutan" class="welcome portal-panel"><summary><div><span class="portal-kicker">Dari pimpinan</span><h2>{welcome.title || "Sambutan direksi"}</h2><p>{welcome.ceoName} · {welcome.ceoTitle}</p></div><span class="read-letter">Baca sambutan</span></summary><div class="letter"><div class="letter-body">{#each welcome.paragraphs as paragraph}<p>{paragraph}</p>{/each}<footer><strong>{welcome.ceoName}</strong><span>{welcome.speechDate}</span></footer></div></div></details>{/if}
  </div>
</div>

<style>
  .team-page{padding:48px 0 72px}.page-intro{display:flex;align-items:flex-end;justify-content:space-between;gap:28px;margin-bottom:32px}.intro-copy{margin:18px 0 0;max-width:560px;color:#65736e;font-size:16px;line-height:1.75}.page-intro>a{flex-shrink:0}.team-toolbar{display:flex;align-items:center;gap:20px;padding:13px 18px;background:#e9eee5}.directory-label{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;white-space:nowrap}.team-filters{display:flex;flex-wrap:wrap;gap:5px}.team-filters button{padding:9px 12px;font-size:12px;border:1px solid transparent;border-radius:4px;color:#53675c;background:transparent;cursor:pointer}.team-filters button:hover{background:#fff}.team-filters button.active{background:#fff;color:#165b45;border-color:#b9cbb7;box-shadow:0 1px 2px #233b350a;font-weight:700}.team-count{margin-left:auto;font-size:12px;color:#65736e;white-space:nowrap}.team-section{display:grid;grid-template-columns:245px minmax(0,1fr);gap:30px;padding:34px 0;border-bottom:1px solid #d4ded0;scroll-margin-top:110px}.group-heading h2{font-family:Georgia,serif;font-size:25px;font-weight:400;line-height:1.3;margin:0;color:#233b35}.group-heading p{font-size:13px;line-height:1.75;color:#65736e;margin-top:12px}.member-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start}.member{overflow:hidden}.member-top{display:flex;gap:17px;padding:20px;align-items:center;min-height:150px}.member-top img{width:88px;height:110px;border-radius:3px;object-fit:cover;object-position:top;background:#e6ece3;border:1px solid #d3ddcf}.member-role{color:#65736e;font-size:11px;line-height:1.55;margin:0 0 8px}.member h3{color:#233b35;font-family:Tahoma,Arial,sans-serif;font-size:15px;font-weight:700;line-height:1.5;margin:0}.member summary{font-size:12px;color:#165b45;border-top:1px solid #e0e7dc;background:#fafcf8;padding:13px 20px;cursor:pointer;font-weight:600}.biography{padding:0 20px 20px;font-size:13px;line-height:1.75;color:#65736e}.education{display:flex;gap:9px;padding-top:12px;border-top:1px solid #e0e7dc;font-size:12px}.education :global(svg){flex-shrink:0;margin-top:2px}.welcome{margin-top:32px;scroll-margin-top:110px}.welcome summary{padding:26px 30px;cursor:pointer;display:flex;justify-content:space-between;gap:24px;align-items:center}.welcome h2{font-family:Georgia,serif;font-size:24px;font-weight:400;margin:5px 0 8px}.welcome summary p{font-size:12px;color:#65736e;margin:0}.read-letter{color:#165b45;font-size:13px;font-weight:600}.read-letter::after{content:" +"}.welcome[open] .read-letter::after{content:" −"}.letter{border-top:1px solid #d4ded0;padding:12px 30px 30px}.letter-body{max-width:730px;font-size:15px;line-height:1.9;color:#53675c}.letter footer{display:flex;flex-direction:column;font-size:13px;margin-top:25px}.empty-state{margin-top:24px;padding:30px;text-align:center}
  @media(max-width:1050px){.team-section{grid-template-columns:190px minmax(0,1fr);gap:22px}.member-top{gap:12px;padding:16px}.member-top img{width:66px;height:90px}.member h3{font-size:13px}.team-toolbar{flex-wrap:wrap;gap:10px}.team-count{margin-left:0}.team-filters{flex:1}}
  @media(max-width:750px){.team-page{padding:30px 0 48px}.page-intro{display:block}.page-intro>a{margin-top:20px}.team-section{grid-template-columns:1fr;gap:15px;padding:28px 0}.group-heading p{margin:8px 0 0}.team-toolbar{gap:8px}.directory-label{width:calc(100% - 70px)}.team-count{order:1;margin-left:auto}.team-filters{order:2;flex-basis:100%}.team-filters button{padding:8px 9px}.member-grid{gap:12px}.member-top{display:block}.member-top img{width:100%;height:160px;margin-bottom:12px;object-position:center 20%}.member-role{min-height:35px}.member summary{padding:13px}.biography{padding:0 13px 14px}.welcome summary{padding:22px}.welcome summary .read-letter{font-size:12px;min-width:72px}.letter{padding:10px 22px 24px}}
  @media(max-width:380px){.member-grid{grid-template-columns:1fr}.member-top{display:flex}.member-top img{width:80px;height:105px;margin:0}.member-role{min-height:0}}
</style>
