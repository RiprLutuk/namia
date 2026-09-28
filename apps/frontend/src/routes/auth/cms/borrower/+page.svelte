<script lang="ts">
  import AccountAccess from "$lib/components/AccountAccess.svelte";
  import LeadList from "$lib/components/LeadList.svelte";
</script>

<svelte:head
  ><title>Akun pembiayaan | Namia Syariah</title><meta
    name="robots"
    content="noindex,nofollow"
  /></svelte:head
>
<AccountAccess role="borrower"
  ><nav class="p-6"><a class="underline" href="/onboarding">Buat pengajuan pembiayaan →</a></nav>
  <LeadList /></AccountAccess
>
