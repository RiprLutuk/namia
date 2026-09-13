<script lang="ts">
  import { onMount } from "svelte";
  import { Search, Phone, Mail, MessageCircle, MapPin, Send, CheckCircle2, ArrowRight } from "lucide-svelte";
  import { cmsStore, fetchCmsContent } from "$lib/cms";
  import { API_BASE_URL, NAMIA_API_KEY } from "$lib/api";
  onMount(() => { fetchCmsContent(); });
  const settings = $derived($cmsStore.siteSettings);
  const whatsappUrl = $derived(`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`);
  const phoneUrl = $derived(`tel:${settings.phone.replace(/[^\d+]/g, "")}`);
  let searchQuery = $state("");
  let audience = $state("all");
  let activeCategory = $state("Semua");
  let openFaqIds = $state(new Set<number>());
  const faqs = $derived($cmsStore.faqs.map(faq => ({ ...faq, question: faq.question || faq.q || "", answer: faq.answer || faq.a || "", category: faq.categoryName || faq.category || "Umum" })));
  const audienceFaqs = $derived(faqs.filter(faq => audience === "all" || (audience === "investor" ? Boolean(faq.isInvestor) : !faq.isInvestor)));
  const categories = $derived(["Semua", ...new Set(audienceFaqs.map(faq => faq.category))]);
  const filteredFaqs = $derived(audienceFaqs.filter(faq => (activeCategory === "Semua" || faq.category === activeCategory) && `${faq.question} ${faq.answer.replace(/<[^>]*>/g, " ")}`.toLowerCase().includes(searchQuery.trim().toLowerCase())));
  function changeAudience(value: string) { audience = value; activeCategory = "Semua"; }
  function toggleFaq(id: number) { const next = new Set(openFaqIds); next.has(id) ? next.delete(id) : next.add(id); openFaqIds = next; }

  let name = $state("");
  let email = $state("");
  let phone = $state("");
  let category = $state("Pertanyaan Umum");
  let subject = $state("");
  let message = $state("");
  let submitting = $state(false);
  let submitted = $state(false);
  let submitError = $state("");
  async function handleContactSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (submitting) return;
    submitting = true;
    submitError = "";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json", "x-api-key": NAMIA_API_KEY },
        body: JSON.stringify({ fullName: name.trim(), email: email.trim(), phone: phone.trim(), needCategory: category, notes: `${subject.trim() ? `[${subject.trim()}] ` : ""}${message.trim()}` }),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error("Pesan belum tersimpan");
      submitted = true;
    } catch {
      submitError = "Pesan belum terkirim. Isi formulir Anda tetap tersimpan di halaman ini. Coba kirim lagi atau hubungi kami melalui WhatsApp.";
    } finally { clearTimeout(timeout); submitting = false; }
  }
  function resetForm() { submitted = false; name = ""; email = ""; phone = ""; subject = ""; message = ""; submitError = ""; }
</script>

<svelte:head><title>Pusat Bantuan & Kontak | Namia Syariah</title><meta name="description" content="Temukan jawaban tentang pendanaan dan pembiayaan, hubungi layanan Namia, atau kirim pertanyaan dan pengaduan." /></svelte:head>

<div class="portal-page contacts-page">
  <div class="portal-container">
    <header class="page-intro"><p class="portal-kicker">Pusat bantuan</p><h1 class="portal-heading">Ada yang perlu dibicarakan?<br />Kami siap mendengarkan.</h1><p class="intro-copy">Cari jawaban singkat atau ceritakan kebutuhan Anda kepada tim layanan Namia.</p></header>
    <div class="help-layout">
      <section id="faq" class="faq-section" aria-labelledby="faq-title">
        <div class="faq-tools portal-panel">
          <div class="panel-caption"><h2 id="faq-title">Temukan jawaban Anda</h2><span>Pertanyaan umum</span></div>
          <div class="search-content"><label class="search-field"><Search size={18} /><input type="search" bind:value={searchQuery} aria-label="Cari pertanyaan" placeholder="Misalnya: akad, dokumen, pencairan" /></label><div class="audience-filter" aria-label="Jenis pertanyaan"><button type="button" class:active={audience === "all"} aria-pressed={audience === "all"} onclick={() => changeAudience("all")}>Semua</button><button type="button" class:active={audience === "borrower"} aria-pressed={audience === "borrower"} onclick={() => changeAudience("borrower")}>Pembiayaan</button><button type="button" class:active={audience === "investor"} aria-pressed={audience === "investor"} onclick={() => changeAudience("investor")}>Pendanaan</button></div><label class="category-select">Topik<select bind:value={activeCategory}>{#each categories as item}<option value={item}>{item}</option>{/each}</select></label></div>
        </div>
        <div class="faq-controls"><span aria-live="polite">{filteredFaqs.length} jawaban</span><div><button type="button" onclick={() => openFaqIds = new Set(filteredFaqs.map(faq => faq.id))}>Buka semua</button><span> / </span><button type="button" onclick={() => openFaqIds = new Set()}>Tutup semua</button></div></div>
        <div class="faq-list portal-panel">
          {#each filteredFaqs as faq}
            <article class="faq-item"><h3><button type="button" aria-expanded={openFaqIds.has(faq.id)} aria-controls={`answer-${faq.id}`} onclick={() => toggleFaq(faq.id)}><span>{faq.question}</span><span class="faq-toggle" aria-hidden="true">{openFaqIds.has(faq.id) ? "−" : "+"}</span></button></h3><div id={`answer-${faq.id}`} class="faq-answer" hidden={!openFaqIds.has(faq.id)}>{@html faq.answer}</div></article>
          {:else}<div class="empty-state"><h3>Jawaban belum ditemukan.</h3><p>Coba kata kunci lain atau kirim pertanyaan melalui formulir.</p><button type="button" class="portal-button-secondary" onclick={() => { searchQuery = ""; audience = "all"; activeCategory = "Semua"; }}>Tampilkan semua jawaban</button></div>{/each}
        </div>
      </section>
      <aside class="contact-sidebar">
        <section class="direct-contact portal-panel"><div class="panel-caption"><h2>Bicara langsung</h2></div><div class="contact-options"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} /><span><strong>WhatsApp</strong><small>{settings.whatsapp}</small></span><ArrowRight size={15} /></a><a href={phoneUrl}><Phone size={18} /><span><strong>Telepon</strong><small>{settings.phone}</small></span><ArrowRight size={15} /></a><a href={`mailto:${settings.email}`}><Mail size={18} /><span><strong>Email</strong><small>{settings.email}</small></span><ArrowRight size={15} /></a></div><div class="service-hours"><strong>Jam layanan</strong><p>{settings.operatingHours}</p></div></section>
        <a href="#form-kontak" class="message-shortcut"><span><strong>Ingin menjelaskan lebih rinci?</strong><small>Kirim pertanyaan atau pengaduan.</small></span><ArrowRight size={18} /></a>
      </aside>
    </div>
    <section id="form-kontak" class="message-section" aria-labelledby="form-title">
      <div class="form-intro"><p class="portal-kicker">Tulis kepada kami</p><h2 id="form-title">Ceritakan kebutuhan Anda.</h2><p>Untuk konsultasi pendanaan, pembiayaan usaha, kemitraan, atau kendala layanan. Pilih topik agar pesan Anda lebih mudah ditindaklanjuti.</p><div class="office"><MapPin size={20} /><div><strong>{settings.companyName}</strong><p>{settings.address}</p><a href={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}`} target="_blank" rel="noopener noreferrer">Lihat lokasi kantor ↗</a></div></div></div>
      <div class="form-panel portal-panel">
        {#if submitted}
          <div class="success-state" role="status"><CheckCircle2 size={36} /><h3>Pesan Anda telah diterima.</h3><p>Terima kasih sudah bercerita. Tim kami dapat menghubungi Anda melalui kontak yang Anda cantumkan.</p><button type="button" class="portal-button-secondary" onclick={resetForm}>Kirim pesan lain</button></div>
        {:else}
          <form onsubmit={handleContactSubmit}>
            <div class="form-heading"><h3>Formulir pesan</h3><span>Kolom bertanda * wajib diisi</span></div>
            <div class="field-grid"><label>Nama lengkap *<input name="name" autocomplete="name" required minlength="3" maxlength="128" bind:value={name} placeholder="Nama Anda" /></label><label>Email *<input name="email" type="email" autocomplete="email" required bind:value={email} placeholder="nama@email.com" /></label><label>Nomor telepon / WhatsApp *<input name="phone" type="tel" autocomplete="tel" required minlength="8" maxlength="20" bind:value={phone} placeholder="08xxxxxxxxxx" /></label><label>Topik pesan<select bind:value={category}><option>Pertanyaan Umum</option><option>Pengajuan Pembiayaan (Borrower)</option><option>Konsultasi Pendanaan (Investor)</option><option>Kemitraan Strategis & Korporasi</option><option>Pengaduan & Pelayanan Konsumen</option></select></label></div>
            <label>Subjek <span class="optional">(opsional)</span><input bind:value={subject} placeholder="Ringkasan kebutuhan Anda" /></label><label>Pesan *<textarea rows="5" required bind:value={message} placeholder="Ceritakan kebutuhan atau kendala Anda. Jangan sertakan PIN, kata sandi, atau kode OTP."></textarea></label>
            {#if submitError}<div class="submit-error" role="alert">{submitError} <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Buka WhatsApp ↗</a></div>{/if}
            <div class="form-footer"><span>Kontak Anda digunakan untuk menindaklanjuti pesan ini.</span><button type="submit" class="portal-button" disabled={submitting}><Send size={16} />{submitting ? "Mengirim pesan…" : "Kirim pesan"}</button></div>
          </form>
        {/if}
      </div>
    </section>
  </div>
</div>

<style>
  .contacts-page{padding:48px 0 72px}.page-intro{margin-bottom:32px;max-width:800px}.intro-copy{font-size:16px;line-height:1.75;color:#65736e;margin:18px 0 0}.help-layout{display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:28px;align-items:start}.faq-section{min-width:0;scroll-margin-top:110px}.faq-tools{overflow:hidden}.panel-caption{display:flex;justify-content:space-between;align-items:center;gap:15px;padding:15px 20px;background:#e8eee3;border-bottom:1px solid #ccd9c7}.panel-caption h2{font:700 14px/1.5 Tahoma,Arial,sans-serif;margin:0;color:#233b35}.panel-caption>span{font-size:11px;color:#65736e}.search-content{padding:20px;display:flex;flex-wrap:wrap;align-items:center;gap:14px}.search-field{display:flex;align-items:center;gap:10px;padding:0 13px;flex-basis:100%;border:1px solid #bccbb7;border-radius:4px;color:#65736e;background:#fff}.search-field input{border:0;background:transparent;width:100%;min-width:0;padding:13px 0;font:14px Tahoma,Arial,sans-serif;color:#233b35}.search-field:focus-within{outline:2px solid #165b45;outline-offset:2px}.search-field input:focus{outline:none}.audience-filter{display:flex;gap:5px;flex-wrap:wrap}.audience-filter button{border:1px solid transparent;border-radius:4px;padding:9px 11px;background:#f1f5ec;color:#53675c;font-size:12px;cursor:pointer}.audience-filter button.active{border-color:#afc3a6;background:#dfecb9;color:#165b45;font-weight:700}.category-select{display:flex;gap:8px;align-items:center;font-size:12px;color:#65736e;margin-left:auto}.category-select select{max-width:185px;padding:8px 10px;border:1px solid #c4d2bd;background:#fff;border-radius:4px;font-size:12px;color:#233b35}.faq-controls{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:17px 0 12px;font-size:11px;color:#65736e}.faq-controls button{font:inherit;border:0;background:none;color:#165b45;padding:5px 0;cursor:pointer}.faq-list{overflow:hidden}.faq-item+.faq-item{border-top:1px solid #dae3d4}.faq-item h3{margin:0}.faq-item h3 button{display:flex;justify-content:space-between;align-items:center;gap:20px;width:100%;padding:19px 22px;text-align:left;border:0;background:#fff;color:#233b35;font:600 14px/1.6 Tahoma,Arial,sans-serif;cursor:pointer}.faq-item h3 button:hover{background:#f7faf3}.faq-toggle{font-size:22px;font-weight:400;color:#165b45}.faq-answer{padding:0 22px 22px;font-size:14px;line-height:1.85;color:#53675c}.faq-answer :global(p){margin:0 0 10px}.faq-answer :global(a){color:#165b45;text-decoration:underline}.faq-answer :global(ul),.faq-answer :global(ol){padding-left:22px}.contact-sidebar{display:grid;gap:18px}.direct-contact{overflow:hidden}.contact-options{padding:0 18px}.contact-options a{display:flex;gap:12px;align-items:center;padding:19px 0;color:#165b45}.contact-options a+a{border-top:1px solid #dce5d7}.contact-options a>span{flex:1;min-width:0}.contact-options strong{font-size:13px;display:block}.contact-options small{font-size:12px;color:#65736e;display:block;margin-top:4px;overflow-wrap:anywhere}.service-hours{padding:16px 18px;background:#f5f8f0;border-top:1px solid #d5e0cf;font-size:12px}.service-hours strong{color:#233b35}.service-hours p{line-height:1.7;color:#65736e;margin:6px 0 0}.message-shortcut{display:flex;align-items:center;gap:15px;padding:18px;background:#e6edda;border:1px solid #cbd8bd;border-radius:5px;color:#165b45}.message-shortcut>span{flex:1}.message-shortcut strong{display:block;font-size:13px;line-height:1.6}.message-shortcut small{display:block;font-size:12px;color:#65736e;line-height:1.6;margin-top:5px}.message-section{display:grid;grid-template-columns:330px minmax(0,1fr);gap:50px;align-items:start;margin-top:50px;padding-top:36px;border-top:1px solid #cdd9c7;scroll-margin-top:110px}.form-intro h2{font:30px/1.3 Georgia,serif;margin:10px 0 15px;color:#233b35}.form-intro>p:not(.portal-kicker){font-size:14px;line-height:1.85;color:#65736e}.office{display:flex;gap:12px;border-top:1px solid #d5dfcf;margin-top:25px;padding-top:24px;color:#165b45}.office :global(svg){flex-shrink:0;margin-top:2px}.office strong{font-size:12px}.office p{font-size:13px;line-height:1.7;color:#65736e;margin:8px 0 12px}.office a{font-size:12px;color:#165b45;text-decoration:underline;text-underline-offset:3px}.form-panel{padding:26px}.form-heading{display:flex;justify-content:space-between;align-items:center;gap:14px;padding-bottom:20px;margin-bottom:20px;border-bottom:1px solid #d8e2d2}.form-heading h3{font-size:15px;margin:0;color:#233b35}.form-heading>span{font-size:11px;color:#65736e}.field-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 18px}.form-panel label{display:block;font-size:12px;font-weight:700;color:#233b35;margin-bottom:18px}.form-panel input,.form-panel select,.form-panel textarea{display:block;box-sizing:border-box;width:100%;min-width:0;margin-top:8px;padding:11px 12px;border:1px solid #bbcdb5;border-radius:4px;background:#fff;color:#233b35;font:13px/1.6 Tahoma,Arial,sans-serif;box-shadow:inset 0 1px 2px #233b3508}.form-panel textarea{resize:vertical;min-height:135px}.optional{font-weight:400;color:#65736e}.form-footer{display:flex;align-items:center;justify-content:space-between;gap:20px;padding-top:6px}.form-footer>span{max-width:245px;font-size:11px;line-height:1.7;color:#65736e}.form-footer button{white-space:nowrap}.submit-error{padding:13px 15px;border:1px solid #d6afa1;border-radius:4px;background:#fff6ef;font-size:13px;line-height:1.7;color:#824530;margin-bottom:14px}.submit-error a{text-decoration:underline;color:#824530}.success-state{padding:36px 12px;text-align:center;color:#165b45}.success-state :global(svg){margin:0 auto}.success-state h3{font:27px Georgia,serif;margin:18px 0 12px;color:#233b35}.success-state p{max-width:420px;margin:0 auto 22px;color:#65736e;font-size:14px;line-height:1.8}.empty-state{padding:30px;text-align:center}.empty-state h3{font:24px Georgia,serif}.empty-state p{font-size:13px;line-height:1.8;color:#65736e}
  @media(max-width:1020px){.help-layout{grid-template-columns:minmax(0,1fr) 255px;gap:20px}.category-select{margin-left:0}.message-section{grid-template-columns:270px minmax(0,1fr);gap:28px}.field-grid{grid-template-columns:1fr}.form-heading{display:block}.form-heading>span{display:block;margin-top:7px}}
  @media(max-width:700px){.contacts-page{padding:30px 0 48px}.help-layout{grid-template-columns:1fr}.contact-sidebar{grid-template-columns:1fr}.contact-options{display:flex;gap:16px;flex-wrap:wrap}.contact-options a{flex:1 1 150px}.contact-options a+a{border-top:0}.contact-options a>:global(svg:last-child){display:none}.message-section{grid-template-columns:1fr;gap:22px;margin-top:35px;padding-top:28px}.form-intro .office{margin-top:18px;padding-top:18px}.form-panel{padding:20px}.field-grid{grid-template-columns:1fr 1fr;gap:0 14px}.panel-caption>span{display:none}.search-content{padding:16px}.faq-item h3 button{padding:17px}.faq-answer{padding:0 17px 20px}.form-footer{align-items:flex-start}.form-footer>span{max-width:170px}}
  @media(max-width:440px){.field-grid{grid-template-columns:1fr}.form-footer{flex-direction:column;gap:14px}.form-footer>span{max-width:none}.form-footer button{width:100%}.audience-filter button{padding:9px}.search-content{gap:12px}.category-select{width:100%;justify-content:space-between}.category-select select{max-width:none;flex:1}}
</style>
