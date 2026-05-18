<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { STEPS, TOTAL_STEPS } from '$lib/config/steps';
  import { certificateStore } from '$lib/stores/certificate.svelte';
  import { validateCertificate } from '$lib/engine/validation-rules';
  import Step01 from '$lib/components/steps/Step01CentreAndClinician.svelte';
  import Step02 from '$lib/components/steps/Step02VaccineeIdentity.svelte';
  import Step03 from '$lib/components/steps/Step03VaccineeSignature.svelte';
  import Step04 from '$lib/components/steps/Step04TravelContext.svelte';
  import Step05 from '$lib/components/steps/Step05EntryDiseaseVaccine.svelte';
  import Step06 from '$lib/components/steps/Step06EntryAdministration.svelte';
  import Step07 from '$lib/components/steps/Step07EntryValidityStamp.svelte';
  import Step08 from '$lib/components/steps/Step08Summary.svelte';

  const step = $derived(Number(page.params.step ?? '1'));
  const meta = $derived(STEPS.find((s) => s.n === step));

  const report = $derived(validateCertificate(certificateStore.data));

  function go(n: number) {
    goto(`/certificate/${Math.max(1, Math.min(TOTAL_STEPS, n))}`);
  }
</script>

<nav class="flex gap-1 flex-wrap mb-4" aria-live="polite">
  {#each STEPS as s}
    <button class="px-3 py-1 border rounded text-sm" class:bg-yellow-700={s.n === step}
            class:text-white={s.n === step} on:click={() => go(s.n)}>
      {s.n}
    </button>
  {/each}
</nav>

<section class="bg-white border rounded p-4 space-y-3">
  <h2 class="font-semibold">{meta?.title ?? ''}</h2>
  {#if step === 1}<Step01 />{/if}
  {#if step === 2}<Step02 />{/if}
  {#if step === 3}<Step03 />{/if}
  {#if step === 4}<Step04 />{/if}
  {#if step === 5}<Step05 />{/if}
  {#if step === 6}<Step06 />{/if}
  {#if step === 7}<Step07 />{/if}
  {#if step === 8}<Step08 {report} />{/if}
</section>

<nav class="flex justify-between mt-4">
  <button class="px-4 py-2 border rounded" on:click={() => go(step - 1)} disabled={step === 1}>Previous</button>
  <button class="px-4 py-2 border rounded" on:click={() => go(step + 1)} disabled={step === TOTAL_STEPS}>Next</button>
</nav>
