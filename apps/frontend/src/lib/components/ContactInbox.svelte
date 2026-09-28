<script lang="ts">
  import { onMount } from "svelte";
  import { apiRequest } from "$lib/api";
  interface Contact {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    notes: string;
    createdAt: string;
  }
  let messages = $state<Contact[]>([]);
  let page = $state(1);
  let busy = $state(false);
  let error = $state("");
  async function load() {
    busy = true;
    error = "";
    try {
      messages = (await apiRequest<Contact[]>(`/api/contacts?page=${page}`)).data;
    } catch (cause) {
      error = cause instanceof Error ? cause.message : "Pesan belum dapat dimuat.";
    } finally {
      busy = false;
    }
  }
  onMount(load);
</script>

<section class="inbox">
  <h2>Pesan kontak dan permintaan newsletter</h2>
  {#if error}<p role="alert">{error}</p>{/if}
  {#each messages as message (message.id)}
    <details>
      <summary
        >{message.fullName} · {new Date(message.createdAt).toLocaleDateString("id-ID")}</summary
      >
      <p>{message.email} {message.phone || ""}</p>
      <p class="message">{message.notes}</p>
    </details>
  {:else}<p>{busy ? "Memuat pesan…" : "Belum ada pesan pada halaman ini."}</p>{/each}
  <nav aria-label="Halaman pesan">
    <button
      type="button"
      disabled={page === 1 || busy}
      onclick={() => {
        page--;
        load();
      }}>Sebelumnya</button
    ><button type="button" disabled={busy} onclick={load}>Muat ulang</button><button
      type="button"
      disabled={messages.length < 50 || busy}
      onclick={() => {
        page++;
        load();
      }}>Berikutnya</button
    >
  </nav>
</section>

<style>
  .inbox {
    max-width: 1100px;
    margin: 2rem auto;
    padding: 1rem;
  }
  h2 {
    font-size: 1.25rem;
    font-weight: 700;
  }
  details {
    border-bottom: 1px solid #cbd5e1;
    padding: 1rem 0;
  }
  summary {
    cursor: pointer;
  }
  .message {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    margin: 1rem 0;
  }
  nav {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  button {
    padding: 0.5rem 1rem;
    background: #065f46;
    color: white;
    border-radius: 4px;
  }
  button:disabled {
    opacity: 0.5;
  }
  [role="alert"] {
    color: #991b1b;
  }
</style>
