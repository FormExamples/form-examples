<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { validateWill } from '#lib/engine/will-grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleWills } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Testator from '#lib/components/steps/Step1Testator.svelte';
  import Step2Estate from '#lib/components/steps/Step2Estate.svelte';
  import Step3Executors from '#lib/components/steps/Step3Executors.svelte';
  import Step4Beneficiaries from '#lib/components/steps/Step4Beneficiaries.svelte';
  import Step5Family from '#lib/components/steps/Step5Family.svelte';
  import Step6Execution from '#lib/components/steps/Step6Execution.svelte';

  let errors = $state<{ id: string; message: string }[]>([]);

  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  // Hydrate the wizard whenever the route id changes: a saved draft for that id
  // wins, otherwise seed from the matching sample will (existing id) or a
  // blank draft (new).
  $effect(() => {
    const seed = sampleWills.find((s) => s.id === id)?.data;
    if (assessment.id !== id) {
      assessment.loadForId(id, seed);
      errors = [];
    }
  });

  function validate(): boolean {
    const d = assessment.data;
    const found: { id: string; message: string }[] = [];
    if (d.testator.testatorName.trim() === '') {
      found.push({
        id: 'testator-testatorName',
        message: 'Testator name is required.'
      });
    }
    errors = found;
    return found.length === 0;
  }

  function submit() {
    if (!validate()) {
      document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    assessment.result = validateWill(assessment.data);
    goto(
      `/united-kingdom-last-will-and-testament/united-kingdom-last-will-and-testaments/${id}/report`
    );
  }

  function startOver() {
    const seed = sampleWills.find((s) => s.id === id)?.data;
    assessment.reset();
    assessment.loadForId(id, seed);
    errors = [];
  }
</script>

<main class="mx-16 px-4 py-6">
  <h1 class="text-2xl font-bold text-base-content">
    {isNew ? 'New United Kingdom Last Will and Testament' : `Will ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the six sections; the validity class, beneficiary share total, and flagged issues are
    computed on submit. This is documentation support — there is no numeric score, and it is not
    legal advice.
  </p>
  <Progress label="Will sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
  <StepList label="Will sections" current={TOTAL_STEPS}>
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

  <Form label="United Kingdom Last Will and Testament" onsubmit={submit}>
    <Step1Testator />
    <Step2Estate />
    <Step3Executors />
    <Step4Beneficiaries />
    <Step5Family />
    <Step6Execution />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Validate &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
