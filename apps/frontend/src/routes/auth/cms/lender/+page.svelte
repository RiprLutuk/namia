<script lang="ts">
  import AccountAccess from "$lib/components/AccountAccess.svelte";
  import InvestmentCalculator from "$lib/components/calculators/InvestmentCalculator.svelte";
</script>

<svelte:head
  ><title>Akun pendana | Namia Syariah</title><meta
    name="robots"
    content="noindex,nofollow"
  /></svelte:head
>
<AccountAccess role="lender"
  ><section class="portal-container py-8">
    <h1 class="portal-heading">Akun pendana</h1>
    <p class="my-4">
      Layanan transaksi pendanaan belum tersedia. Simulasi di bawah tidak membuat transaksi, saldo,
      atau instruksi transfer.
    </p>
    <InvestmentCalculator />
  </section></AccountAccess
>
