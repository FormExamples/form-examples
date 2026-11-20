<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { gradeApplication } from '#lib/engine/application-grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleApplications } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Jurisdiction from '#lib/components/steps/Step1Jurisdiction.svelte';
  import Step2FirstApplicant from '#lib/components/steps/Step2FirstApplicant.svelte';
  import Step3SecondApplicant from '#lib/components/steps/Step3SecondApplicant.svelte';
  import Step4Eligibility from '#lib/components/steps/Step4Eligibility.svelte';
  import Step5License from '#lib/components/steps/Step5License.svelte';
  import Step6Ceremony from '#lib/components/steps/Step6Ceremony.svelte';

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
    if (d.jurisdiction.state.trim() === '') {
      found.push({ id: 'jurisdiction-state', message: 'State is required.' });
    }
    if (d.applicantOne.name.trim() === '') {
      found.push({ id: 'applicantOne-name', message: 'The first applicant name is required.' });
    }
    if (d.applicantTwo.name.trim() === '') {
      found.push({ id: 'applicantTwo-name', message: 'The second applicant name is required.' });
    }
    errors = found;
    return found.length === 0;
  }

  function submit() {
    if (!validate()) {
      document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    assessment.result = gradeApplication(assessment.data);
    goto(
      `/united-states-marriage-license-application/united-states-marriage-license-applications/${id}/report`
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
    {isNew ? 'New United States Marriage License Application' : `Application ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the six sections; the class, the earliest permitted ceremony date, and flagged issues
    are computed on submit. This is documentation support, not legal advice; the issuing county
    clerk decides.
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

  <Form label="United States Marriage License Application" onsubmit={submit}>
    <Step1Jurisdiction />
    <Step2FirstApplicant />
    <Step3SecondApplicant />
    <Step4Eligibility />
    <Step5License />
    <Step6Ceremony />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Validate &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
