<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { validateBillOfSale } from '#lib/engine/bill-of-sale-grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleBillsOfSale } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Transaction from '#lib/components/steps/Step1Transaction.svelte';
  import Step2Seller from '#lib/components/steps/Step2Seller.svelte';
  import Step3Buyer from '#lib/components/steps/Step3Buyer.svelte';
  import Step4Vehicle from '#lib/components/steps/Step4Vehicle.svelte';
  import Step5Odometer from '#lib/components/steps/Step5Odometer.svelte';
  import Step6Terms from '#lib/components/steps/Step6Terms.svelte';
  import Step7AfterSale from '#lib/components/steps/Step7AfterSale.svelte';

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
    if (d.seller.name.trim() === '') {
      found.push({ id: 'seller-name', message: 'Seller printed name is required.' });
    }
    errors = found;
    return found.length === 0;
  }

  function submit() {
    if (!validate()) {
      document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    assessment.result = validateBillOfSale(assessment.data);
    goto(`/united-states-vehicle-bill-of-sale/united-states-vehicle-bills-of-sale/${id}/report`);
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
    {isNew ? 'New United States vehicle bill of sale' : `Vehicle bill of sale ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the seven sections; the completeness class and flagged issues are computed on submit.
    This is documentation support, not legal advice, and there is no numeric score.
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

  <Form label="United States Vehicle Bill of Sale" onsubmit={submit}>
    <Step1Transaction />
    <Step2Seller />
    <Step3Buyer />
    <Step4Vehicle />
    <Step5Odometer />
    <Step6Terms />
    <Step7AfterSale />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Check &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
