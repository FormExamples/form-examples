<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { evaluateDirective } from '#lib/engine/grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleDirectives } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Principal from '#lib/components/steps/Step1Principal.svelte';
  import Step2Agent from '#lib/components/steps/Step2Agent.svelte';
  import Step3Authority from '#lib/components/steps/Step3Authority.svelte';
  import Step4Wishes from '#lib/components/steps/Step4Wishes.svelte';
  import Step5Signing from '#lib/components/steps/Step5Signing.svelte';
  import Step6Summary from '#lib/components/steps/Step6Summary.svelte';

  let errors = $state<{ id: string; message: string }[]>([]);

  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  // Hydrate the wizard whenever the route id changes: a saved draft for that id
  // wins, otherwise seed from the matching sample directive (existing id) or a
  // blank draft (new).
  $effect(() => {
    const seed = sampleDirectives.find((s) => s.id === id)?.data;
    if (assessment.id !== id) {
      assessment.loadForId(id, seed);
      errors = [];
    }
  });

  function validate(): boolean {
    const d = assessment.data;
    const found: { id: string; message: string }[] = [];
    if (d.principal.principalName.trim() === '') {
      found.push({ id: 'principal-principalName', message: 'Principal name is required.' });
    }
    if (d.agent.agentName.trim() === '') {
      found.push({ id: 'agent-agentName', message: 'Agent name is required.' });
    }
    errors = found;
    return found.length === 0;
  }

  function submit() {
    if (!validate()) {
      document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    assessment.result = evaluateDirective(assessment.data);
    goto(
      `/united-states-health-care-power-of-attorney/united-states-health-care-powers-of-attorney/${id}/report`
    );
  }

  function startOver() {
    const seed = sampleDirectives.find((s) => s.id === id)?.data;
    assessment.reset();
    assessment.loadForId(id, seed);
    errors = [];
  }
</script>

<main class="mx-16 px-4 py-6">
  <h1 class="text-2xl font-bold text-base-content">
    {isNew ? 'New United States Health Care Power of Attorney' : `Directive ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the six sections; the readiness class and flagged issues are computed on submit. This
    is a documentation instrument, not legal advice: a court, the treating facility, and the state
    decide whether a directive is valid.
  </p>
  <Progress label="Directive sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
  <StepList label="Directive sections" current={TOTAL_STEPS}>
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

  <Form label="United States Health Care Power of Attorney" onsubmit={submit}>
    <Step1Principal />
    <Step2Agent />
    <Step3Authority />
    <Step4Wishes />
    <Step5Signing />
    <Step6Summary />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Validate &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
