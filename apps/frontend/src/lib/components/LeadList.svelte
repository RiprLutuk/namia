<script lang="ts">
  import { onMount } from "svelte";
  import { apiRequest } from "$lib/api";
  let { admin = false }: { admin?: boolean } = $props();
  interface Lead {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    status: string;
    targetAmount?: number;
    nik?: string;
    employmentType?: string;
    monthlyIncome?: number;
    notes?: string;
  }
  let leads = $state<Lead[]>([]);
  let selected = $state<Lead | null>(null);
  let note = $state("");
  let page = $state(1);
  let busy = $state(false);
  let error = $state("");
  async function load() {
    busy = true;
    error = "";
    try {
      leads = (await apiRequest<Lead[]>(`/api/leads?page=${page}`)).data;
    } catch (cause) {
      error = cause instanceof Error ? cause.message : "Gagal memuat pengajuan.";
    } finally {
      busy = false;
    }
  }
  onMount(load);
  async function details(id: number) {
    try {
      selected = (await apiRequest<Lead>(`/api/leads/${id}`)).data;
      note = "";
    } catch (cause) {
      error = cause instanceof Error ? cause.message : "Gagal memuat rincian.";
    }
  }
  async function review(decision: "verified" | "rejected") {
    if (!selected || busy || note.trim().length < 10) return;
    busy = true;
    error = "";
    try {
      await apiRequest(`/api/leads/${selected.id}/review`, {
        method: "POST",
        body: JSON.stringify({ decision, note: note.trim() }),
      });
      selected = null;
      await load();
    } catch (cause) {
      error = cause instanceof Error ? cause.message : "Verifikasi gagal.";
    } finally {
      busy = false;
    }
  }
</script>

<section class="leads">
  <div class="heading">
    <h1>{admin ? "Pengajuan masuk" : "Pengajuan saya"}</h1>
    <button type="button" disabled={busy} onclick={load}>Muat ulang</button>
  </div>
  {#if error}<p role="alert">{error}</p>{/if}
  <div class="table-scroll">
    <table>
      <thead
        ><tr><th>Referensi</th><th>Nama</th><th>Nominal</th><th>Status</th><th>Rincian</th></tr
        ></thead
      ><tbody>
        {#each leads as lead (lead.id)}<tr
            ><td>#{lead.id}</td><td>{lead.fullName}</td><td
              >{(lead.targetAmount || 0).toLocaleString("id-ID")}</td
            ><td>{lead.status}</td><td
              ><button type="button" onclick={() => details(lead.id)}>Lihat</button></td
            ></tr
          >
        {:else}<tr
            ><td colspan="5">{busy ? "Memuat…" : "Belum ada pengajuan pada halaman ini."}</td></tr
          >{/each}
      </tbody>
    </table>
  </div>
  <div class="pagination">
    <button
      type="button"
      disabled={page === 1 || busy}
      onclick={() => {
        page--;
        load();
      }}>Sebelumnya</button
    ><span>Halaman {page}</span><button
      type="button"
      disabled={leads.length < 50 || busy}
      onclick={() => {
        page++;
        load();
      }}>Berikutnya</button
    >
  </div>
  {#if selected}
    <section class="details" aria-label="Rincian pengajuan">
      <h2>Pengajuan #{selected.id}</h2>
      <dl>
        <dt>Nama</dt>
        <dd>{selected.fullName}</dd>
        <dt>Kontak</dt>
        <dd>{selected.email} · {selected.phone}</dd>
        <dt>NIK</dt>
        <dd>{selected.nik || "Belum dikirim"}</dd>
        <dt>Pekerjaan</dt>
        <dd>{selected.employmentType || "Belum dikirim"}</dd>
        <dt>Penghasilan</dt>
        <dd>{selected.monthlyIncome?.toLocaleString("id-ID") || "Belum dikirim"}</dd>
        <dt>Catatan pengajuan</dt>
        <dd>{selected.notes || "—"}</dd>
      </dl>
      {#if admin && selected.status === "submitted"}<p>
          Periksa identitas dan dokumen pendukung melalui prosedur operasional sebelum menyetujui.
        </p>
        <label
          >Catatan pemeriksaan<textarea minlength="10" maxlength="2000" bind:value={note}
          ></textarea></label
        >
        <div class="actions">
          <button
            disabled={busy || note.trim().length < 10}
            type="button"
            onclick={() => review("verified")}>Tandai terverifikasi</button
          ><button
            disabled={busy || note.trim().length < 10}
            type="button"
            onclick={() => review("rejected")}>Tolak</button
          >
        </div>{/if}
      <button type="button" onclick={() => (selected = null)}>Tutup rincian</button>
    </section>
  {/if}
</section>

<style>
  .leads {
    max-width: 1100px;
    margin: 2rem auto;
    padding: 1rem;
  }
  .heading,
  .pagination,
  .actions {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0;
  }
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
  }
  h2 {
    font-size: 1.2rem;
    font-weight: 700;
  }
  .table-scroll {
    overflow-x: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    text-align: left;
    padding: 1rem;
    border-bottom: 1px solid #cbd5e1;
  }
  button {
    background: #065f46;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
  }
  button:disabled {
    opacity: 0.5;
  }
  .details {
    border: 1px solid #cbd5e1;
    padding: 1.5rem;
    margin-top: 1rem;
  }
  dl {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 0.5rem;
    margin: 1rem 0;
  }
  dd {
    overflow-wrap: anywhere;
  }
  label {
    display: grid;
    margin-top: 1rem;
  }
  textarea {
    border: 1px solid #64748b;
    min-height: 100px;
    padding: 0.5rem;
  }
  [role="alert"] {
    color: #991b1b;
  }
</style>
