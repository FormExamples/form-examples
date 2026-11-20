<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { validateCertificate } from '#lib/engine/grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleCertificates } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1StateAndDecedent from '#lib/components/steps/Step1StateAndDecedent.svelte';
  import Step2Death from '#lib/components/steps/Step2Death.svelte';
  import Step3Certifier from '#lib/components/steps/Step3Certifier.svelte';
  import Step4PartI from '#lib/components/steps/Step4PartI.svelte';
  import Step5PartII from '#lib/components/steps/Step5PartII.svelte';
  import Step6Manner from '#lib/components/steps/Step6Manner.svelte';
  import Step7Injury from '#lib/components/steps/Step7Injury.svelte';
  import Step8Referral from '#lib/components/steps/Step8Referral.svelte';
  import Step9Funeral from '#lib/components/steps/Step9Funeral.svelte';
  import Step10Copies from '#lib/components/steps/Step10Copies.svelte';
  import Step11Summary from '#lib/components/steps/Step11Summary.svelte';

  let errors = $state<{ id: string; message: string }[]>([]);

  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  // Hydrate the wizard whenever the route id changes: a saved draft for that id
  // wins, otherwise seed from the matching sample certificate (existing id) or a
  // blank draft (new).
  $effect(() => {
    const seed = sampleCertificates.find((s) => s.id === id)?.data;
    if (assessment.id !== id) {
      assessment.loadForId(id, seed);
      errors = [];
    }
  });

  function validate(): boolean {
    const d = assessment.data;
    const found: { id: string; message: string }[] = [];
    if (d.decedent.decedentName.trim() === '') {
      found.push({
        id: 'decedent-decedentName',
        message: 'Decedent name is required.'
      });
    }
    if (d.partI.causeIaCondition.trim() === '' && d.referral.referredToMedicalExaminer !== 'yes') {
      found.push({
        id: 'partI-causeIaCondition',
        message:
          'Part I line (a) immediate cause is required (unless referred to the medical examiner or coroner).'
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
    assessment.result = validateCertificate(assessment.data);
    goto(
      `/united-states-standard-certificate-of-death/united-states-standard-certificates-of-death/${id}/report`
    );
  }

  function startOver() {
    const seed = sampleCertificates.find((s) => s.id === id)?.data;
    assessment.reset();
    assessment.loadForId(id, seed);
    errors = [];
  }
</script>

<main class="mx-16 px-4 py-6">
  <h1 class="text-2xl font-bold text-base-content">
    {isNew ? 'New US Standard Certificate of Death' : `Certificate ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the eleven sections; the validity class, derived underlying cause, and flagged issues
    are computed on submit. This is a documentation instrument: there is no numeric score, it does
    not diagnose, and it is not legal advice.
  </p>
  <Progress label="Certificate sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
  <StepList label="Certificate sections" current={TOTAL_STEPS}>
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

  <Form label="US Standard Certificate of Death" onsubmit={submit}>
    <Step1StateAndDecedent />
    <Step2Death />
    <Step3Certifier />
    <Step4PartI />
    <Step5PartII />
    <Step6Manner />
    <Step7Injury />
    <Step8Referral />
    <Step9Funeral />
    <Step10Copies />
    <Step11Summary />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Validate &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
