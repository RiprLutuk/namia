<script lang="ts">
  import AccountAccess from "$lib/components/AccountAccess.svelte";
  import ContactInbox from "$lib/components/ContactInbox.svelte";
  import LeadList from "$lib/components/LeadList.svelte";
</script>

<svelte:head
  ><title>Administrasi | Namia Syariah</title><meta
    name="robots"
    content="noindex,nofollow"
  /></svelte:head
>
<AccountAccess role="admin"
  ><nav class="p-6"><a class="underline" href="/cms">Kelola konten situs →</a></nav>
  <LeadList admin /><ContactInbox /></AccountAccess
>
