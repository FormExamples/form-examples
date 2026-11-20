<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { validateRegistration } from '#lib/engine/grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleRegistrations } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Child from '#lib/components/steps/Step1Child.svelte';
  import Step2Mother from '#lib/components/steps/Step2Mother.svelte';
  import Step3Parentage from '#lib/components/steps/Step3Parentage.svelte';
  import Step4Informant from '#lib/components/steps/Step4Informant.svelte';
  import Step5Certificate from '#lib/components/steps/Step5Certificate.svelte';

  let errors = $state<{ id: string; message: string }[]>([]);

  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  // Hydrate the wizard whenever the route id changes: a saved draft for that id
  // wins, otherwise seed from the matching sample application (existing id) or a
  // blank draft (new).
  $effect(() => {
    const seed = sampleRegistrations.find((s) => s.id === id)?.data;
    if (assessment.id !== id) {
      assessment.loadForId(id, seed);
      errors = [];
    }
  });

  function validate(): boolean {
    const d = assessment.data;
    const found: { id: string; message: string }[] = [];
    if (d.child.childSurname.trim() === '') {
      found.push({ id: 'child-childSurname', message: "Child's surname is required." });
    }
    if (d.mother.motherName.trim() === '') {
      found.push({ id: 'mother-motherName', message: "Mother's full name is required." });
    }
    errors = found;
    return found.length === 0;
  }

  function submit() {
    if (!validate()) {
      document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    assessment.result = validateRegistration(assessment.data);
    goto(`/united-kingdom-birth-registration/united-kingdom-birth-registrations/${id}/report`);
  }

  function startOver() {
    const seed = sampleRegistrations.find((s) => s.id === id)?.data;
    assessment.reset();
    assessment.loadForId(id, seed);
    errors = [];
  }
</script>

<main class="mx-16 px-4 py-6">
  <h1 class="text-2xl font-bold text-base-content">
    {isNew ? 'New United Kingdom Birth Registration' : `Birth registration ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the five sections; the readiness class, days since birth, and flagged issues are
    computed on submit. This is a completeness check — there is no numeric score, and it does not
    register a birth or replace the registrar.
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

  <Form label="United Kingdom Birth Registration" onsubmit={submit}>
    <Step1Child />
    <Step2Mother />
    <Step3Parentage />
    <Step4Informant />
    <Step5Certificate />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Validate &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
