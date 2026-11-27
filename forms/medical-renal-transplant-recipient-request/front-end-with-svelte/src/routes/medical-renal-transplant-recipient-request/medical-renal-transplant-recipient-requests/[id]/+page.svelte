<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { calculateGrade } from '#lib/engine/grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleAssessments } from '#lib/data/sample-reports.js';
  import { selectedTests } from '#lib/engine/tests.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Recipient from '#lib/components/steps/Step1Recipient.svelte';
  import Step2OrganHistory from '#lib/components/steps/Step2OrganHistory.svelte';
  import Step3ClinicalDialysis from '#lib/components/steps/Step3ClinicalDialysis.svelte';
  import Step4Tests from '#lib/components/steps/Step4Tests.svelte';
  import Step5Requester from '#lib/components/steps/Step5Requester.svelte';
  import Step6Sample from '#lib/components/steps/Step6Sample.svelte';
  import Step7Laboratory from '#lib/components/steps/Step7Laboratory.svelte';

  let errors = $state<{ id: string; message: string }[]>([]);

  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  // Hydrate the wizard whenever the route id changes: a saved draft for that id
  // wins, otherwise seed from the matching sample request (existing id) or a
  // blank draft (new).
  $effect(() => {
    const seed = sampleAssessments.find((s) => s.id === id)?.data;
    if (assessment.id !== id) {
      assessment.loadForId(id, seed);
      errors = [];
    }
  });

  function validate(): boolean {
    const d = assessment.data;
    const found: { id: string; message: string }[] = [];
    if (d.recipient.familyName.trim() === '') {
      found.push({ id: 'recipient-familyName', message: 'Recipient family name is required.' });
    }
    if (d.recipient.birthDate === '') {
      found.push({ id: 'recipient-birthDate', message: 'Recipient date of birth is required.' });
    }
    if (d.history.organRequired === '') {
      found.push({ id: 'history-organRequired', message: 'Organ required is required.' });
    }
    if (selectedTests(d).length === 0) {
      found.push({ id: 'tests-testDetail', message: 'Tick at least one test.' });
    }
    if (d.requester.clinicianName.trim() === '') {
      found.push({ id: 'requester-clinicianName', message: 'Requester name is required.' });
    }
    errors = found;
    return found.length === 0;
  }

  function submit() {
    if (!validate()) {
      document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    assessment.result = calculateGrade(assessment.data);
    goto(
      `/medical-renal-transplant-recipient-request/medical-renal-transplant-recipient-requests/${id}/report`
    );
  }

  function startOver() {
    const seed = sampleAssessments.find((s) => s.id === id)?.data;
    assessment.reset();
    assessment.loadForId(id, seed);
    errors = [];
  }
</script>

<main class="mx-16 px-4 py-6">
  <h1 class="text-2xl font-bold text-base-content">
    {isNew ? 'New renal transplant recipient request' : `Renal transplant recipient request ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the seven sections; the four-axis grade, recommendation, and safety flags are computed
    on submit.
  </p>
  <Progress label="Request sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
  <StepList label="Request sections" current={TOTAL_STEPS}>
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

  <Form label="Renal transplant recipient request" onsubmit={submit}>
    <Step1Recipient />
    <Step2OrganHistory />
    <Step3ClinicalDialysis />
    <Step4Tests />
    <Step5Requester />
    <Step6Sample />
    <Step7Laboratory />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
