<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { X } from "lucide-svelte";
  let {
    title,
    onclose,
    onsave,
    saveLabel = "Simpan perubahan",
    busy = false,
    children,
  }: {
    title: string;
    onclose: () => void;
    onsave: () => void;
    saveLabel?: string;
    busy?: boolean;
    children: Snippet;
  } = $props();
  let dialog: HTMLDialogElement;
  onMount(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  });
</script>

<dialog
  bind:this={dialog}
  aria-label={title}
  oncancel={(event) => {
    event.preventDefault();
    if (!busy) onclose();
  }}
>
  <header>
    <div>
      <span>EDITOR KONTEN</span>
      <h2>{title}</h2>
    </div>
    <button aria-label="Tutup editor" disabled={busy} onclick={onclose}><X size={20} /></button>
  </header>
  <form
    onsubmit={(event) => {
      event.preventDefault();
      onsave();
    }}
  >
    <fieldset disabled={busy}>{@render children()}</fieldset>
    <footer>
      <button type="button" disabled={busy} onclick={onclose}>Batal</button><button
        class="save"
        disabled={busy}
        type="submit">{busy ? "Menyimpan…" : saveLabel}</button
      >
    </footer>
  </form>
</dialog>

<style>
  dialog {
    margin: auto;
    width: min(640px, calc(100% - 32px));
    max-height: 90dvh;
    padding: 0;
    border: 1px solid #d6e1d9;
    border-radius: 10px;
    box-shadow: 0 24px 80px #10251c33;
    color: #264738;
    background: white;
  }
  dialog::backdrop {
    background: #10251c80;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e3eae5;
  }
  header span {
    font-size: 9px;
    letter-spacing: 1.8px;
    color: #6b8474;
  }
  h2 {
    font-size: 19px;
    font-weight: 600;
    margin-top: 6px;
  }
  header button {
    padding: 8px;
    cursor: pointer;
  }
  fieldset {
    padding: 24px;
    border: 0;
    min-width: 0;
  }
  footer {
    position: sticky;
    bottom: 0;
    background: #f7faf8;
    border-top: 1px solid #e3eae5;
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  footer button {
    padding: 10px 16px;
    border: 1px solid #d7e1d9;
    border-radius: 5px;
    font-size: 12px;
    cursor: pointer;
  }
  .save {
    background: #185d45;
    color: white;
    border-color: #185d45;
  }
  button:disabled {
    opacity: 0.5;
    cursor: wait;
  }
  dialog :global(input:focus),
  dialog :global(textarea:focus),
  dialog :global(select:focus) {
    outline: 2px solid #70a98b;
    outline-offset: 1px;
  }
  dialog :global(label) {
    font-size: 12px;
  }
  dialog :global(input),
  dialog :global(textarea),
  dialog :global(select) {
    min-height: 40px;
  }
  button:focus-visible {
    outline: 2px solid #27845e;
    outline-offset: 3px;
  }
</style>
