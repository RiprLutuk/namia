<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { CheckCircle2, ArrowRight, ArrowLeft, AlertCircle } from "lucide-svelte";
  import { API_BASE_URL, NAMIA_API_KEY } from "$lib/api";

  let step = $state(1);
  let isSubmitting = $state(false);
  let submissionSuccess = $state(false);
  let leadReference = $state("");
  let errorMessage = $state("");

  // Form State
  let fullName = $state("");
  let nik = $state("");
  let phone = $state("");
  let email = $state("");
  let categorySlug = $state("p2p-lending");
  let requestedAmount = $state(20000000);
  let tenorMonths = $state(12);
  let purpose = $state("Modal Usaha UMKM");

  // KYC Details
  let employmentType = $state("entrepreneur");
  let companyName = $state("");
  let monthlyIncome = $state(15000000);
  let existingObligation = $state(0);
  let agreesIslamicRules = $state(false);
  let digitalSignatureAgreed = $state(false);

  let productId = $state("");
  let productName = $state("");
  let createdLeadId = $state<number | null>(null);
  const stepNames = ["Data diri", "Kebutuhan", "Keuangan", "Periksa & kirim"];
  const categoryOptions = [
    {value: "p2p-lending", label: "Modal kerja usaha"},
    {value: "pembiayaan-usaha", label: "Pengadaan barang / aset"},
    {value: "paylater-syariah", label: "Operasional / jasa"},
    {value: "asuransi-syariah", label: "Proteksi usaha"},
  ];
  onMount(() => {
    const params = page.url.searchParams;
    const amount = Number(params.get("amount"));
    const tenor = Number(params.get("tenor"));
    if (Number.isFinite(amount) && amount > 0) requestedAmount = Math.min(2000000000, Math.max(2000000, amount));
    if (Number.isFinite(tenor) && tenor > 0) tenorMonths = Math.min(60, Math.max(3, Math.round(tenor)));
    if (params.get("purpose")) purpose = params.get("purpose")!.slice(0, 500);
    if (categoryOptions.some(option => option.value === params.get("category"))) categorySlug = params.get("category")!;
    productId = params.get("productId") || "";
    productName = params.get("name") || "";
  });

  function formatRupiah(num: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  }

  function validateStep(currentStep: number): boolean {
    errorMessage = "";
    if (currentStep === 1) {
      if (!fullName.trim() || fullName.trim().length < 3) {
        errorMessage = "Nama lengkap wajib diisi minimal 3 karakter.";
        return false;
      }
      if (!/^\d{16}$/.test(nik)) {
        errorMessage = "NIK KTP wajib terdiri dari 16 digit angka.";
        return false;
      }
      if (!/^\+?[\d\s()-]{9,20}$/.test(phone)) {
        errorMessage = "Nomor WhatsApp aktif wajib diisi.";
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorMessage = "Format alamat email tidak valid.";
        return false;
      }
    } else if (currentStep === 2) {
      if (!Number.isFinite(requestedAmount) || requestedAmount < 2000000 || requestedAmount > 2000000000) {
        errorMessage = "Masukkan nominal antara Rp 2 juta dan Rp 2 miliar.";
        return false;
      }
      if (!purpose.trim()) { errorMessage = "Jelaskan tujuan penggunaan dana."; return false; }
      if (!Number.isInteger(tenorMonths) || tenorMonths < 3 || tenorMonths > 60) { errorMessage = "Pilih jangka waktu 3–60 bulan."; return false; }
    } else if (currentStep === 3) {
      if (!companyName.trim()) { errorMessage = "Isi nama usaha atau tempat Anda bekerja."; return false; }
      if (!Number.isFinite(existingObligation) || existingObligation < 0) { errorMessage = "Cicilan berjalan tidak boleh negatif."; return false; }
      if (!Number.isFinite(monthlyIncome) || monthlyIncome <= 0) {
        errorMessage = "Penghasilan bulanan wajib diisi.";
        return false;
      }
    } else if (currentStep === 4) {
      if (!agreesIslamicRules || !digitalSignatureAgreed) {
        errorMessage = "Persetujuan penggunaan data dan prinsip syariah perlu dicentang sebelum mengirim.";
        return false;
      }
    }
    return true;
  }

  function nextStep() {
    if (validateStep(step)) {
      step++;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function prevStep() {
    errorMessage = "";
    if (step > 1) {
      step--;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    for (let current = 1; current <= 4; current++) {
      if (!validateStep(current)) { step = current; return; }
    }
    isSubmitting = true;
    errorMessage = "";
    const headers = { "Content-Type": "application/json", "x-api-key": NAMIA_API_KEY };
    try {
      if (!createdLeadId) {
        const response = await fetch(`${API_BASE_URL}/api/leads/`, {
          method: "POST", headers,
          body: JSON.stringify({
            fullName: fullName.trim(), email: email.trim(), phone: phone.trim(),
            needCategory: categorySlug, targetAmount: requestedAmount, targetTenorMonths: tenorMonths,
            notes: JSON.stringify({ purpose, productId: productId || undefined, productName: productName || undefined, companyName, existingObligation, agreesIslamicRules, digitalSignatureAgreed }),
          }),
        });
        const result = await response.json();
        if (!response.ok || !result.success || !result.data?.id) throw new Error("Pengajuan belum terkirim. Periksa koneksi dan coba lagi.");
        createdLeadId = Number(result.data.id);
      }
      const response = await fetch(`${API_BASE_URL}/api/leads/${createdLeadId}/kyc`, {
        method: "PATCH", headers,
        body: JSON.stringify({ step: 3, nik, employmentType, monthlyIncome }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error("Data awal tersimpan. Lengkapi pengiriman data keuangan dengan menekan Coba kirim lagi.");
      leadReference = String(createdLeadId);
      submissionSuccess = true;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      errorMessage = createdLeadId
        ? "Data awal tersimpan, tetapi data identitas belum terkirim lengkap. Tekan Coba kirim lagi."
        : "Pengajuan belum terkirim. Periksa koneksi Anda, lalu coba kirim lagi. Data isian tetap tersedia di halaman ini.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head><title>Pengajuan pembiayaan — Namia Syariah</title><meta name="description" content="Sampaikan kebutuhan pembiayaan Anda melalui formulir pengajuan bertahap Namia Syariah." /></svelte:head>
<div class="portal-page application-page"><div class="portal-container">
  <header><p class="portal-kicker">Pengajuan pembiayaan</p><h1 class="portal-heading">Satu langkah untuk kebutuhan Anda.</h1><p>Ceritakan kebutuhan usaha Anda. Isi bertahap, periksa, lalu kirim saat siap.</p></header>
  {#if submissionSuccess}
    <section class="success-panel portal-panel" aria-live="polite"><CheckCircle2 size={38} /><p class="portal-kicker">Pengajuan diterima</p><h2>Terima kasih, {fullName.split(' ')[0]}.</h2><p>Data Anda sudah tersimpan untuk ditinjau. Simpan nomor pengajuan berikut saat menghubungi tim Namia.</p><dl><div><dt>Nomor pengajuan</dt><dd>#{leadReference}</dd></div><div><dt>Jumlah pembiayaan</dt><dd>{formatRupiah(requestedAmount)}</dd></div><div><dt>Jangka waktu</dt><dd>{tenorMonths} bulan</dd></div><div><dt>Tujuan</dt><dd>{purpose}</dd></div></dl><div class="success-actions"><a class="portal-button" href="/auth/cms/borrower">Portal penerima dana →</a><a class="portal-button-secondary" href="/contacts">Hubungi tim Namia</a></div></section>
  {:else}
    <div class="application-layout">
      <aside><ol class="application-steps">{#each stepNames as name, index}<li class:current={step === index + 1} class:complete={step > index + 1} aria-current={step === index + 1 ? 'step' : undefined}><span>{#if step > index + 1}<CheckCircle2 size={16} />{:else}{index + 1}{/if}</span><div><strong>{name}</strong><small>{index + 1 < step ? 'Sudah diisi' : index + 1 === step ? 'Sedang Anda isi' : 'Berikutnya'}</small></div></li>{/each}</ol><div class="help-note"><h2>Isi sesuai keadaan Anda.</h2><p>Belum yakin dengan nominalnya? Anda bisa kembali ke langkah sebelumnya sebelum mengirim.</p><a href="/contacts">Butuh bantuan? →</a></div></aside>
      <section class="application-form portal-panel">
        <div class="form-heading"><p>Langkah {step} dari 4</p><h2>{stepNames[step - 1]}</h2><p>{step === 1 ? 'Mulai dengan identitas dan kontak yang dapat dihubungi.' : step === 2 ? 'Sesuaikan nominal dan jangka waktu dengan kebutuhan Anda.' : step === 3 ? 'Informasi ini membantu memahami kemampuan pembayaran Anda.' : 'Pastikan isian Anda benar sebelum dikirim untuk ditinjau.'}</p></div>
        {#if productName}<div class="selected-product">Pilihan produk: <strong>{productName}</strong></div>{/if}
        {#if errorMessage}<div class="form-error" role="alert"><AlertCircle size={18} /><span>{errorMessage}</span></div>{/if}
        <form novalidate onsubmit={(event) => {event.preventDefault(); if(step === 4) handleSubmit(); else nextStep();}}>
          {#if step === 1}
            <div class="form-field"><label for="fullName">Nama lengkap sesuai KTP <span>*</span></label><input id="fullName" autocomplete="name" bind:value={fullName} placeholder="Nama lengkap Anda" maxlength="128" required /></div>
            <div class="form-field"><label for="nik">Nomor Induk Kependudukan <span>*</span></label><input id="nik" inputmode="numeric" maxlength="16" bind:value={nik} placeholder="16 digit NIK" required /><small>Gunakan NIK milik Anda sendiri.</small></div>
            <div class="field-grid"><div class="form-field"><label for="phone">Nomor WhatsApp <span>*</span></label><input id="phone" type="tel" autocomplete="tel" bind:value={phone} placeholder="08xxxxxxxxxx" maxlength="20" required /></div><div class="form-field"><label for="email">Alamat email <span>*</span></label><input id="email" type="email" autocomplete="email" bind:value={email} placeholder="nama@email.com" required /></div></div>
          {:else if step === 2}
            <div class="form-field"><label for="categorySlug">Kebutuhan pembiayaan <span>*</span></label><select id="categorySlug" bind:value={categorySlug}>{#each categoryOptions as category}<option value={category.value}>{category.label}</option>{/each}</select></div>
            <div class="form-field"><label for="requestedAmount">Jumlah yang diajukan (Rp) <span>*</span></label><input id="requestedAmount" type="number" min="2000000" max="2000000000" step="1000000" bind:value={requestedAmount} required /><small>{formatRupiah(requestedAmount || 0)} · Rp 2 juta–Rp 2 miliar</small></div>
            <div class="form-field"><label for="tenorMonths">Jangka waktu (bulan) <span>*</span></label><div class="tenor-options">{#each [6,12,18,24,36] as tenor}<button type="button" class:active={tenorMonths === tenor} aria-pressed={tenorMonths === tenor} onclick={() => tenorMonths = tenor}>{tenor} bulan</button>{/each}</div><input id="tenorMonths" type="number" min="3" max="60" step="1" bind:value={tenorMonths} required /><small>Atau tentukan jangka waktu lain, 3–60 bulan.</small></div>
            <div class="form-field"><label for="purpose">Dana akan digunakan untuk <span>*</span></label><textarea id="purpose" rows="3" maxlength="500" bind:value={purpose} placeholder="Contoh: menambah stok dagangan dan membeli mesin jahit" required></textarea></div>
          {:else if step === 3}
            <div class="form-field"><label for="employmentType">Status pekerjaan <span>*</span></label><select id="employmentType" bind:value={employmentType}><option value="entrepreneur">Pemilik usaha / UMKM</option><option value="permanent_employee">Karyawan tetap</option><option value="contract_employee">Karyawan kontrak</option><option value="freelancer">Profesional / freelancer</option></select></div>
            <div class="form-field"><label for="companyName">Nama usaha / tempat bekerja <span>*</span></label><input id="companyName" bind:value={companyName} placeholder="Nama usaha atau perusahaan" required /></div>
            <div class="field-grid"><div class="form-field"><label for="monthlyIncome">Penghasilan bulanan (Rp) <span>*</span></label><input id="monthlyIncome" type="number" min="1" step="100000" bind:value={monthlyIncome} required /></div><div class="form-field"><label for="existingObligation">Cicilan berjalan (Rp)</label><input id="existingObligation" type="number" min="0" step="100000" bind:value={existingObligation} /><small>Isi 0 jika tidak ada cicilan.</small></div></div>
          {:else}
            <dl class="review"><div><dt>Pemohon</dt><dd>{fullName}</dd></div><div><dt>Kontak</dt><dd>{email}<br />{phone}</dd></div><div><dt>Pembiayaan</dt><dd>{formatRupiah(requestedAmount)} / {tenorMonths} bulan</dd></div><div><dt>Tujuan</dt><dd>{purpose}</dd></div><div><dt>Usaha / pekerjaan</dt><dd>{companyName}</dd></div><div><dt>Penghasilan per bulan</dt><dd>{formatRupiah(monthlyIncome)}</dd></div><div><dt>Cicilan berjalan</dt><dd>{formatRupiah(existingObligation)}</dd></div></dl>
            <p class="review-note">Ini adalah pengajuan untuk ditinjau. Ketentuan pembiayaan dan akad akan dikonfirmasi dalam proses berikutnya.</p>
            <label class="consent"><input type="checkbox" bind:checked={agreesIslamicRules} /><span>Saya menyatakan data yang diisi benar dan dana akan digunakan untuk kegiatan yang sesuai prinsip syariah.</span></label>
            <label class="consent"><input type="checkbox" bind:checked={digitalSignatureAgreed} /><span>Saya menyetujui penggunaan data di formulir ini oleh Namia dan penyedia pembiayaan untuk meninjau serta menindaklanjuti pengajuan saya.</span></label>
          {/if}
          <div class="form-actions">{#if step > 1 && !createdLeadId}<button class="portal-button-secondary" type="button" onclick={prevStep} disabled={isSubmitting}><ArrowLeft size={15} />Kembali</button>{:else}<small>{step < 4 ? '* Wajib diisi' : 'Periksa sebelum mengirim'}</small>{/if}<button class="portal-button" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Mengirim...' : step === 4 ? (createdLeadId ? 'Coba kirim lagi' : 'Kirim pengajuan') : 'Lanjutkan'}<ArrowRight size={15} /></button></div>
        </form>
      </section>
    </div>
  {/if}
</div></div>
<style>
.application-page{padding-bottom:65px}header{padding:40px 0 32px}header>p:last-child{font-size:14px;line-height:1.8;color:#65736e;margin-top:14px}.application-layout{display:grid;grid-template-columns:245px minmax(0,710px);gap:35px;align-items:start}.application-steps{list-style:none;margin:0;padding:0;display:grid;gap:8px}.application-steps li{display:flex;align-items:center;gap:14px;padding:14px 15px;border-radius:5px;border:1px solid transparent;color:#65736e}.application-steps li>span{width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:1px solid #c6d2bd;border-radius:50%;font-size:12px;background:white}.application-steps strong{font-size:13px;display:block}.application-steps small{display:block;font-size:10px;margin-top:5px}.application-steps li.current{background:#e8f0db;border-color:#cad9b7;color:#165b45}.application-steps li.current>span{background:#165b45;border-color:#165b45;color:white}.application-steps li.complete{color:#165b45}.help-note{border-top:1px solid #d3ddcb;margin-top:28px;padding:23px 15px}.help-note h2{font:19px Georgia,serif;margin:0 0 10px}.help-note p{font-size:12px;line-height:1.8;color:#65736e;margin-bottom:15px}.help-note a{font-size:12px;text-decoration:underline;text-underline-offset:3px;color:#165b45}.application-form{background:white;overflow:hidden}.form-heading{padding:26px 30px 23px;border-bottom:1px solid #dce4d5}.form-heading p:first-child{font-size:11px;color:#65736e;margin:0 0 7px}.form-heading h2{font:27px Georgia,serif;margin:0 0 10px;color:#233b35}.form-heading p:last-child{font-size:12px;line-height:1.7;color:#65736e;margin:0}.selected-product{padding:13px 30px;background:#eef3e6;font-size:12px;color:#165b45;border-bottom:1px solid #d4dfc8}form{padding:26px 30px 22px}.form-field{margin-bottom:23px}.form-field>label{display:block;font-size:12px;font-weight:700;color:#233b35;margin-bottom:9px}.form-field label span{color:#65736e}.form-field input,.form-field select,.form-field textarea{display:block;width:100%;border:1px solid #bfcfba;background:#fff;border-radius:4px;padding:12px;font-size:13px;color:#233b35;font-family:Tahoma,Arial,sans-serif;box-shadow:inset 0 1px 2px #233b3508}.form-field textarea{resize:vertical}.form-field small{display:block;font-size:11px;color:#65736e;margin-top:7px;line-height:1.6}.field-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.form-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:23px;border-top:1px solid #dce4d5}.form-actions small{font-size:11px;color:#65736e}.form-actions button{display:flex;align-items:center;gap:7px;font-size:12px}.form-actions button:disabled{opacity:.55;cursor:wait}.tenor-options{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.tenor-options button{border:1px solid #c5d1bf;border-radius:4px;padding:9px 10px;background:linear-gradient(#fff,#edf1e8);font-size:12px;color:#65736e;cursor:pointer}.tenor-options button.active{background:#dfecb9;border-color:#a1b988;color:#165b45}.form-error{display:flex;align-items:flex-start;gap:10px;padding:15px 18px;background:#fff0eb;color:#853e2c;border:1px solid #e5c7ba;border-radius:4px;margin:20px 30px 0;font-size:12px;line-height:1.7}.form-error :global(svg){flex-shrink:0;margin-top:2px}.review{border-top:1px solid #dce4d5;margin:0 0 20px}.review div{display:grid;grid-template-columns:1fr 1.6fr;gap:20px;padding:13px 0;border-bottom:1px solid #dce4d5;font-size:12px;line-height:1.7}.review dt{color:#65736e}.review dd{margin:0;font-weight:700;overflow-wrap:anywhere}.review-note{font-size:12px;line-height:1.8;padding:14px;background:#f1f5e9;border:1px solid #d8e3ca;border-radius:4px;color:#65736e;margin-bottom:20px}.consent{display:flex;gap:11px;align-items:flex-start;font-size:12px;line-height:1.8;margin-bottom:16px;color:#233b35;cursor:pointer}.consent input{width:17px;height:17px;accent-color:#165b45;margin-top:3px;flex-shrink:0}.success-panel{max-width:710px;padding:40px;margin:0 auto;background:white;text-align:center}.success-panel :global(svg){margin:0 auto 17px;color:#165b45}.success-panel h2{font:32px Georgia,serif;margin:15px 0}.success-panel>p:not(.portal-kicker){font-size:13px;line-height:1.8;color:#65736e}.success-panel dl{margin:25px 0;text-align:left}.success-panel dl>div{display:flex;justify-content:space-between;gap:20px;font-size:12px;padding:15px 0;border-bottom:1px solid #dce4d5}.success-panel dt{color:#65736e}.success-panel dd{margin:0;text-align:right;font-weight:700;max-width:65%}.success-actions{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;font-size:12px}:focus-visible{outline:3px solid #a1bb73;outline-offset:3px}
@media(max-width:800px){.application-layout{grid-template-columns:1fr;gap:22px}.application-steps{display:flex;justify-content:space-between;gap:4px}.application-steps li{padding:10px 7px;gap:7px}.application-steps li>span{width:24px;height:24px;flex-shrink:0}.application-steps strong{font-size:10px}.application-steps small,.help-note{display:none}}@media(max-width:500px){header{padding-top:26px}.application-steps li{flex-direction:column;gap:7px;flex:1;text-align:center;padding:10px 3px}.form-heading{padding:22px}form{padding:22px}.field-grid{grid-template-columns:1fr;gap:0}.form-error{margin:18px 22px 0}.selected-product{padding:12px 22px}.review div{grid-template-columns:1fr 1.3fr;gap:12px}.success-panel{padding:26px}}
</style>
