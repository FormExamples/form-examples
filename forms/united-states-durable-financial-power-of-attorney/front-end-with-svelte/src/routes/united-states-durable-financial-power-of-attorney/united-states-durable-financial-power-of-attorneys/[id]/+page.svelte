<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { validateInstrument } from '#lib/engine/dpoa-grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleInstruments } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Principal from '#lib/components/steps/Step1Principal.svelte';
  import Step2Durability from '#lib/components/steps/Step2Durability.svelte';
  import Step3Agents from '#lib/components/steps/Step3Agents.svelte';
  import Step4Authority from '#lib/components/steps/Step4Authority.svelte';
  import Step5Signing from '#lib/components/steps/Step5Signing.svelte';
  import Step6Acceptance from '#lib/components/steps/Step6Acceptance.svelte';

  let errors = $state<{ id: string; message: string }[]>([]);

  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  // Hydrate the wizard whenever the route id changes: a saved draft for that id
  // wins, otherwise seed from the matching sample certificate (existing id) or a
  // blank draft (new).
  $effect(() => {
    const seed = sampleInstruments.find((s) => s.id === id)?.data;
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
    if (d.principal.state.trim() === '') {
      found.push({ id: 'principal-state', message: 'Governing state is required.' });
    }
    if (d.agents.agentName.trim() === '') {
      found.push({ id: 'agents-agentName', message: 'Agent name is required.' });
    }
    errors = found;
    return found.length === 0;
  }

  function submit() {
    if (!validate()) {
      document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    assessment.result = validateInstrument(assessment.data);
    goto(
      `/united-states-durable-financial-power-of-attorney/united-states-durable-financial-power-of-attorneys/${id}/report`
    );
  }

  function startOver() {
    const seed = sampleInstruments.find((s) => s.id === id)?.data;
    assessment.reset();
    assessment.loadForId(id, seed);
    errors = [];
  }
</script>

<main class="mx-16 px-4 py-6">
  <h1 class="text-2xl font-bold text-base-content">
    {isNew ? 'New durable financial power of attorney plan' : `Durable power of attorney ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the six sections; the validity class, the governing state rule, and flagged issues are
    computed on submit. This checks your execution plan against the state's rule — it is
    documentation support, not legal advice.
  </p>
  <Progress label="Plan sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
  <StepList label="Plan sections" current={TOTAL_STEPS}>
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

  <Form label="Durable financial power of attorney" onsubmit={submit}>
    <Step1Principal />
    <Step2Durability />
    <Step3Agents />
    <Step4Authority />
    <Step5Signing />
    <Step6Acceptance />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Validate &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
