<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { validateApplication } from '#lib/engine/title-grader.js';
  import { detectFlaggedIssues } from '#lib/engine/flagged-issues.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleApplications } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Application from '#lib/components/steps/Step1Application.svelte';
  import Step2Owner from '#lib/components/steps/Step2Owner.svelte';
  import Step3Vehicle from '#lib/components/steps/Step3Vehicle.svelte';
  import Step4Odometer from '#lib/components/steps/Step4Odometer.svelte';
  import Step5TitleHistory from '#lib/components/steps/Step5TitleHistory.svelte';
  import Step6Lien from '#lib/components/steps/Step6Lien.svelte';
  import Step7Insurance from '#lib/components/steps/Step7Insurance.svelte';
  import Step8FeesTax from '#lib/components/steps/Step8FeesTax.svelte';

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
    if (d.application.state.trim() === '') {
      found.push({
        id: 'application-state',
        message: 'The state that will issue the title is required.'
      });
    }
    if (d.owner.ownerName.trim() === '') {
      found.push({ id: 'owner-ownerName', message: 'The owner name is required.' });
    }
    errors = found;
    return found.length === 0;
  }

  function submit() {
    if (!validate()) {
      document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    assessment.result = {
      ...validateApplication(assessment.data),
      flaggedIssues: detectFlaggedIssues(assessment.data),
      timestamp: new Date().toISOString()
    };
    goto(
      `/united-states-vehicle-title-and-registration-application/vehicle-title-applications/${id}/report`
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
    {isNew ? 'New vehicle title and registration application' : `Application ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the eight sections; the application class, VIN check, outstanding items, and flagged
    issues are computed on submit. This is documentation support, not legal advice: there is no
    numeric score, and the issuing state agency decides.
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

  <Form label="Vehicle title and registration application" onsubmit={submit}>
    <Step1Application />
    <Step2Owner />
    <Step3Vehicle />
    <Step4Odometer />
    <Step5TitleHistory />
    <Step6Lien />
    <Step7Insurance />
    <Step8FeesTax />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Check &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
