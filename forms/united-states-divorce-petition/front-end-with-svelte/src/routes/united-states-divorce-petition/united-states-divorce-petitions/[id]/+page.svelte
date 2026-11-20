<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { validatePetition } from '#lib/engine/divorce-grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { samplePetitions } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Filing from '#lib/components/steps/Step1Filing.svelte';
  import Step2Spouses from '#lib/components/steps/Step2Spouses.svelte';
  import Step3Children from '#lib/components/steps/Step3Children.svelte';
  import Step4Property from '#lib/components/steps/Step4Property.svelte';
  import Step5Service from '#lib/components/steps/Step5Service.svelte';
  import Step6Decree from '#lib/components/steps/Step6Decree.svelte';

  let errors = $state<{ id: string; message: string }[]>([]);

  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  // Hydrate the wizard whenever the route id changes: a saved draft for that id
  // wins, otherwise seed from the matching sample certificate (existing id) or a
  // blank draft (new).
  $effect(() => {
    const seed = samplePetitions.find((s) => s.id === id)?.data;
    if (assessment.id !== id) {
      assessment.loadForId(id, seed);
      errors = [];
    }
  });

  function validate(): boolean {
    const d = assessment.data;
    const found: { id: string; message: string }[] = [];
    if (d.filing.state.trim() === '') {
      found.push({ id: 'filing-state', message: 'Filing state is required.' });
    }
    if (d.spouses.petitionerName.trim() === '') {
      found.push({ id: 'spouses-petitionerName', message: 'Petitioner name is required.' });
    }
    if (d.spouses.respondentName.trim() === '') {
      found.push({ id: 'spouses-respondentName', message: 'Respondent name is required.' });
    }
    errors = found;
    return found.length === 0;
  }

  function submit() {
    if (!validate()) {
      document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    assessment.result = validatePetition(assessment.data);
    goto(`/united-states-divorce-petition/united-states-divorce-petitions/${id}/report`);
  }

  function startOver() {
    const seed = samplePetitions.find((s) => s.id === id)?.data;
    assessment.reset();
    assessment.loadForId(id, seed);
    errors = [];
  }
</script>

<main class="mx-16 px-4 py-6">
  <h1 class="text-2xl font-bold text-base-content">
    {isNew ? 'New United States Divorce Petition' : `Divorce petition ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the six sections; the readiness class, property regime, earliest decree date, and
    flagged issues are computed on submit. This is documentation support, not legal advice; the
    court decides.
  </p>
  <Progress label="Petition sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
  <StepList label="Petition sections" current={TOTAL_STEPS}>
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

  <Form label="United States Divorce Petition" onsubmit={submit}>
    <Step1Filing />
    <Step2Spouses />
    <Step3Children />
    <Step4Property />
    <Step5Service />
    <Step6Decree />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Validate &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
