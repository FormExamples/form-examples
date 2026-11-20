<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { assessBillOfSale } from '#lib/engine/bill-of-sale-grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleBillsOfSale } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Sale from '#lib/components/steps/Step1Sale.svelte';
  import Step2Seller from '#lib/components/steps/Step2Seller.svelte';
  import Step3Buyer from '#lib/components/steps/Step3Buyer.svelte';
  import Step4Vehicle from '#lib/components/steps/Step4Vehicle.svelte';
  import Step5Checks from '#lib/components/steps/Step5Checks.svelte';
  import Step6Payment from '#lib/components/steps/Step6Payment.svelte';
  import Step7Condition from '#lib/components/steps/Step7Condition.svelte';
  import Step8Dvla from '#lib/components/steps/Step8Dvla.svelte';
  import Step9Signatures from '#lib/components/steps/Step9Signatures.svelte';

  let errors = $state<{ id: string; message: string }[]>([]);

  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  // Hydrate the wizard whenever the route id changes: a saved draft for that id
  // wins, otherwise seed from the matching sample bill of sale (existing id) or a
  // blank draft (new).
  $effect(() => {
    const seed = sampleBillsOfSale.find((s) => s.id === id)?.data;
    if (assessment.id !== id) {
      assessment.loadForId(id, seed);
      errors = [];
    }
  });

  function validate(): boolean {
    const d = assessment.data;
    const found: { id: string; message: string }[] = [];
    if (d.vehicle.registration.trim() === '') {
      found.push({
        id: 'vehicle-registration',
        message: 'Registration number is required.'
      });
    }
    if (d.seller.name.trim() === '') {
      found.push({ id: 'seller-name', message: 'Seller name is required.' });
    }
    errors = found;
    return found.length === 0;
  }

  function submit() {
    if (!validate()) {
      document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    assessment.result = assessBillOfSale(assessment.data);
    goto(`/united-kingdom-vehicle-bill-of-sale/united-kingdom-vehicle-bills-of-sale/${id}/report`);
  }

  function startOver() {
    const seed = sampleBillsOfSale.find((s) => s.id === id)?.data;
    assessment.reset();
    assessment.loadForId(id, seed);
    errors = [];
  }
</script>

<main class="mx-16 px-4 py-6">
  <h1 class="text-2xl font-bold text-base-content">
    {isNew ? 'New United Kingdom Vehicle Bill of Sale' : `Bill of sale ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the nine sections; the classification, missing items, and flagged issues are computed
    on submit. This is documentation support, not legal advice — there is no numeric score.
  </p>
  <Progress label="Bill of sale sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
  <StepList label="Bill of sale sections" current={TOTAL_STEPS}>
    {#each steps as step (step.number)}
      <StepListItem status="finished" label={step.title}>{step.shortTitle}</StepListItem>
    {/each}
  </StepList>

  {#if errors.length > 0}
    <ErrorSummary title="Please fix the following before submitting" class="mb-6">
      <ul>
        {#each errors as e (e.id)}
          <li><a href={`#${e.id}`}>{e.message}</a></li>
        {/each}
      </ul>
    </ErrorSummary>
  {/if}

  <RestoreBanner show={assessment.hadDraftAtLoad} onDiscard={startOver} />

  <Form label="United Kingdom Vehicle Bill of Sale" onsubmit={submit}>
    <Step1Sale />
    <Step2Seller />
    <Step3Buyer />
    <Step4Vehicle />
    <Step5Checks />
    <Step6Payment />
    <Step7Condition />
    <Step8Dvla />
    <Step9Signatures />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Classify &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
