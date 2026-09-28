<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { currentUser, refreshSession, login, register, logout, type Role } from "$lib/auth";
  let { role, children }: { role: Role; children: Snippet } = $props();
  let ready = $state(false);
  let busy = $state(false);
  let error = $state("");
  let email = $state("");
  let password = $state("");
  let fullName = $state("");
  let createAccount = $state(false);
  onMount(async () => {
    try {
      await refreshSession();
    } catch {
      error = "Layanan akun belum dapat dihubungi. Coba muat ulang halaman.";
    } finally {
      ready = true;
    }
  });
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (busy) return;
    busy = true;
    error = "";
    try {
      if (createAccount && role !== "admin") await register(fullName, email, password, role);
      else await login(email, password);
      password = "";
    } catch (cause) {
      error = cause instanceof Error ? cause.message : "Permintaan gagal.";
    } finally {
      busy = false;
    }
  }
</script>

{#if !ready}
  <p class="account-loading" role="status">Memeriksa sesi…</p>
{:else if $currentUser?.role === role}
  <div class="account-bar">
    <a href="/">Namia Syariah</a><span>{$currentUser.fullName}</span><button
      type="button"
      onclick={() => logout().catch(() => (error = "Gagal keluar. Coba lagi."))}>Keluar</button
    >
  </div>
  {#if error}<p role="alert">{error}</p>{/if}
  {@render children()}
{:else}
  <section class="account-card">
    <a href="/">← Beranda</a>
    <h1>
      {role === "admin"
        ? "Masuk administrator"
        : role === "borrower"
          ? "Akun pembiayaan"
          : "Akun pendana"}
    </h1>
    {#if $currentUser}
      <p>Akun yang aktif tidak memiliki akses ke halaman ini.</p>
      <button type="button" onclick={() => logout().catch(() => (error = "Gagal keluar."))}
        >Keluar dan gunakan akun lain</button
      >
    {:else}
      <p>
        {createAccount
          ? "Buat akun untuk menyimpan dan memantau pengajuan."
          : "Gunakan akun Anda untuk melanjutkan."}
      </p>
      <form onsubmit={submit}>
        {#if createAccount}<label
            >Nama lengkap<input
              required
              minlength="3"
              maxlength="128"
              autocomplete="name"
              bind:value={fullName}
            /></label
          >{/if}
        <label
          >Email<input
            type="email"
            required
            maxlength="254"
            autocomplete="username"
            bind:value={email}
          /></label
        >
        <label
          >Kata sandi<input
            type="password"
            required
            minlength="12"
            maxlength="128"
            autocomplete={createAccount ? "new-password" : "current-password"}
            bind:value={password}
          /></label
        >
        <small>Gunakan kata sandi setidaknya 12 karakter.</small>
        <button disabled={busy} type="submit"
          >{busy ? "Memproses…" : createAccount ? "Daftar" : "Masuk"}</button
        >
      </form>
      {#if role !== "admin"}<button
          class="secondary"
          type="button"
          onclick={() => {
            createAccount = !createAccount;
            error = "";
          }}>{createAccount ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}</button
        >{/if}
    {/if}
    {#if error}<p role="alert">{error}</p>{/if}
  </section>
{/if}

<style>
  .account-loading {
    padding: 2rem;
  }
  .account-card {
    max-width: 460px;
    margin: 4rem auto;
    padding: 2rem;
    border: 1px solid #cbd5e1;
    background: white;
    border-radius: 8px;
  }
  .account-card h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 1rem 0;
  }
  .account-card p {
    margin: 1rem 0;
  }
  form,
  label {
    display: grid;
    gap: 0.5rem;
  }
  form {
    gap: 1rem;
  }
  input {
    padding: 0.7rem;
    border: 1px solid #64748b;
    border-radius: 4px;
    color: #0f172a;
  }
  button {
    padding: 0.7rem 1rem;
    background: #065f46;
    color: white;
    border-radius: 4px;
  }
  button:disabled {
    opacity: 0.6;
  }
  .secondary {
    margin-top: 1rem;
    background: #e2e8f0;
    color: #0f172a;
  }
  .account-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    padding: 1rem 2rem;
    border-bottom: 1px solid #cbd5e1;
  }
  .account-bar span {
    margin-left: auto;
  }
  [role="alert"] {
    color: #991b1b;
  }
</style>
