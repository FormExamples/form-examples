<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { validateApplication } from '#lib/engine/divorce-grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleApplications } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Application from '#lib/components/steps/Step1Application.svelte';
  import Step2Marriage from '#lib/components/steps/Step2Marriage.svelte';
  import Step3Jurisdiction from '#lib/components/steps/Step3Jurisdiction.svelte';
  import Step4Parties from '#lib/components/steps/Step4Parties.svelte';
  import Step5Children from '#lib/components/steps/Step5Children.svelte';
  import Step6Finances from '#lib/components/steps/Step6Finances.svelte';
  import Step7Progress from '#lib/components/steps/Step7Progress.svelte';

  function todayIso(): string {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }

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
      if (assessment.data.application.asOfDate === null) {
        assessment.data.application.asOfDate = todayIso();
      }
    }
  });

  function validate(): boolean {
    const d = assessment.data;
    const found: { id: string; message: string }[] = [];
    if (d.parties.applicantName.trim() === '') {
      found.push({
        id: 'parties-applicantName',
        message: 'Your full name is required.'
      });
    }
    if (d.application.applicationType === '') {
      found.push({
        id: 'application-applicationType',
        message: 'The type of application is required.'
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
    goto(`/united-kingdom-divorce-application/united-kingdom-divorce-applications/${id}/report`);
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
    {isNew ? 'New divorce application check' : `Divorce application ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the seven sections; the application class, the earliest eligible date, the jurisdiction
    result and the flagged issues are computed on submit. This is a completeness check, not a
    numeric score, and it gives no legal advice.
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

  <Form label="United Kingdom Divorce Application" onsubmit={submit}>
    <Step1Application />
    <Step2Marriage />
    <Step3Jurisdiction />
    <Step4Parties />
    <Step5Children />
    <Step6Finances />
    <Step7Progress />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Validate &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
