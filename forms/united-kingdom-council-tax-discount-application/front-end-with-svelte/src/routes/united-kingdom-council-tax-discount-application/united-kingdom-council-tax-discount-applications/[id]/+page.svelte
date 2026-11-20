<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { validateApplication } from '#lib/engine/ctda-grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleApplications } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Claim from '#lib/components/steps/Step1Claim.svelte';
  import Step2Applicant from '#lib/components/steps/Step2Applicant.svelte';
  import Step3Household from '#lib/components/steps/Step3Household.svelte';
  import Step4Evidence from '#lib/components/steps/Step4Evidence.svelte';
  import Step5Declaration from '#lib/components/steps/Step5Declaration.svelte';

  let errors = $state<{ id: string; message: string }[]>([]);

  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  // Hydrate the wizard whenever the route id changes: a saved draft for that id
  // wins, otherwise seed from the matching sample application (existing id) or a
  // blank draft (new).
  $effect(() => {
    const seed = sampleApplications.find((s) => s.id === id)?.data;
    if (assessment.id !== id) {
      assessment.loadForId(id, seed);
      errors = [];
    }
  });

  function validate(): boolean {
    const d = assessment.data;
    const found: { id: string; message: string }[] = [];
    if (d.claim.claimType === '') {
      found.push({ id: 'claim-claimType', message: 'Choose what you are applying for.' });
    }
    if (d.applicant.name.trim() === '') {
      found.push({ id: 'applicant-name', message: 'Your full name is required.' });
    }
    errors = found;
    return found.length === 0;
  }

  function submit() {
    if (!validate()) {
      document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    assessment.result = validateApplication(assessment.data);
    goto(
      `/united-kingdom-council-tax-discount-application/united-kingdom-council-tax-discount-applications/${id}/report`
    );
  }

  function startOver() {
    const seed = sampleApplications.find((s) => s.id === id)?.data;
    assessment.reset();
    assessment.loadForId(id, seed);
    errors = [];
  }
</script>

<main class="mx-16 px-4 py-6">
  <h1 class="text-2xl font-bold text-base-content">
    {isNew ? 'New Council Tax discount application' : `Application ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the five sections; the eligibility class, counted adults, indicative outcome, and
    flagged issues are computed on submit. This is a pre-check — there is no numeric score, and
    eligibility is decided by the billing authority.
  </p>
  <Progress label="Application sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
  <StepList label="Application sections" current={TOTAL_STEPS}>
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

  <Form label="United Kingdom Council Tax Discount Application" onsubmit={submit}>
    <Step1Claim />
    <Step2Applicant />
    <Step3Household />
    <Step4Evidence />
    <Step5Declaration />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Check eligibility &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
