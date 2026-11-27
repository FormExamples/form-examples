<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { calculateGrade } from '#lib/engine/grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleAssessments } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1PersonSampled from '#lib/components/steps/Step1PersonSampled.svelte';
  import Step2Referrer from '#lib/components/steps/Step2Referrer.svelte';
  import Step3ClinicalDetails from '#lib/components/steps/Step3ClinicalDetails.svelte';
  import Step4LinkedRecipient from '#lib/components/steps/Step4LinkedRecipient.svelte';
  import Step5Urgency from '#lib/components/steps/Step5Urgency.svelte';
  import Step6RequesterConsent from '#lib/components/steps/Step6RequesterConsent.svelte';
  import Step7Sample from '#lib/components/steps/Step7Sample.svelte';
  import Step8Laboratory from '#lib/components/steps/Step8Laboratory.svelte';

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
    if (d.request.subjectRole === '') {
      found.push({ id: 'request-subjectRole', message: 'Role of the person sampled is required.' });
    }
    if (d.subject.familyName.trim() === '') {
      found.push({ id: 'subject-familyName', message: 'Family name is required.' });
    }
    if (d.subject.birthDate === '') {
      found.push({ id: 'subject-birthDate', message: 'Date of birth is required.' });
    }
    if (d.referrer.clinicianName.trim() === '') {
      found.push({ id: 'referrer-clinicianName', message: 'Referrer name is required.' });
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
      `/medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request/medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-requests/${id}/report`
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
    {isNew ? 'New HSCT HLA typing request' : `HSCT HLA typing request ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the eight sections; the four-axis grade, recommendation, and safety flags are computed
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

  <Form label="HSCT HLA typing request" onsubmit={submit}>
    <Step1PersonSampled />
    <Step2Referrer />
    <Step3ClinicalDetails />
    <Step4LinkedRecipient />
    <Step5Urgency />
    <Step6RequesterConsent />
    <Step7Sample />
    <Step8Laboratory />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
