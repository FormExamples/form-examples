<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { validateApplication } from '#lib/engine/birth-grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleApplications } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Applicant from '#lib/components/steps/Step1Applicant.svelte';
  import Step2Registrant from '#lib/components/steps/Step2Registrant.svelte';
  import Step3Purpose from '#lib/components/steps/Step3Purpose.svelte';
  import Step4Order from '#lib/components/steps/Step4Order.svelte';
  import Step5Evidence from '#lib/components/steps/Step5Evidence.svelte';
  import Step6Declaration from '#lib/components/steps/Step6Declaration.svelte';

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
    if (d.applicant.applicantName.trim() === '') {
      found.push({ id: 'applicant-applicantName', message: 'Your full legal name is required.' });
    }
    if (d.registrant.registrantName.trim() === '') {
      found.push({
        id: 'registrant-registrantName',
        message: 'The full name of the person named is required.'
      });
    }
    if (d.registrant.state.trim() === '') {
      found.push({
        id: 'registrant-state',
        message: 'The state or territory of birth is required.'
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
    assessment.result = validateApplication(assessment.data);
    goto(
      `/united-states-birth-certificate-application/united-states-birth-certificate-applications/${id}/report`
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
    {isNew ? 'New United States Birth Certificate Application' : `Application ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the six sections; the application class, expected fee, and flagged issues are computed
    on submit. This is documentation support, not legal advice, and the issuing vital records office
    decides.
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

  <Form label="United States Birth Certificate Application" onsubmit={submit}>
    <Step1Applicant />
    <Step2Registrant />
    <Step3Purpose />
    <Step4Order />
    <Step5Evidence />
    <Step6Declaration />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Validate &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
