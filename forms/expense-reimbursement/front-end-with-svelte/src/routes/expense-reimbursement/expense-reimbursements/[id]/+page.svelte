<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { claimStore } from '#lib/stores/result.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { calculateGrade } from '#lib/engine/grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleClaims } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Worker from '#lib/components/steps/Step1Worker.svelte';
  import Step2Approver from '#lib/components/steps/Step2Approver.svelte';
  import Step3Claim from '#lib/components/steps/Step3Claim.svelte';
  import Step4Expenses from '#lib/components/steps/Step4Expenses.svelte';
  import Step5Repayment from '#lib/components/steps/Step5Repayment.svelte';
  import Step6DeclarationAndSubmit from '#lib/components/steps/Step6DeclarationAndSubmit.svelte';

  let errors = $state<{ id: string; message: string }[]>([]);

  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  // Hydrate the wizard whenever the route id changes: a saved draft for that id
  // wins, otherwise seed from the matching sample claim (existing id) or a
  // blank draft (new).
  $effect(() => {
    const seed = sampleClaims.find((s) => s.id === id)?.claim;
    if (claimStore.id !== id) {
      claimStore.loadForId(id, seed);
      errors = [];
    }
  });

  function validate(): boolean {
    const d = claimStore.data;
    const found: { id: string; message: string }[] = [];
    if (d.worker.name.trim() === '') {
      found.push({ id: 'workerName', message: 'Your name is required.' });
    }
    if (d.manager.name.trim() === '') {
      found.push({ id: 'managerName', message: 'Approver name is required.' });
    }
    if (d.claim.claimDate === '') {
      found.push({ id: 'claimDate', message: 'Claim date is required.' });
    }
    if (d.claim.title.trim() === '') {
      found.push({ id: 'claimTitle', message: 'Claim title is required.' });
    }
    if (d.claim.businessPurpose.trim() === '') {
      found.push({ id: 'claimBusinessPurpose', message: 'Business purpose is required.' });
    }
    if (d.declarations.signedName.trim() === '') {
      found.push({ id: 'declSignedName', message: 'Type your name to sign.' });
    }
    errors = found;
    return found.length === 0;
  }

  function submit() {
    if (!validate()) {
      document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    claimStore.result = calculateGrade(claimStore.data);
    goto(`/expense-reimbursement/expense-reimbursements/${id}/report`);
  }

  function startOver() {
    const seed = sampleClaims.find((s) => s.id === id)?.claim;
    claimStore.reset();
    claimStore.loadForId(id, seed);
    errors = [];
  }
</script>

<main class="mx-16 px-4 py-6">
  <h1 class="text-2xl font-bold text-base-content">
    {isNew ? 'New expense claim' : `Expense claim ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the six sections; the three-axis grade is computed on submit.
  </p>
  <Progress label="Claim sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
  <StepList label="Claim sections" current={TOTAL_STEPS}>
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

  <RestoreBanner show={claimStore.hadDraftAtLoad} onDiscard={startOver} />

  <Form label="Expense reimbursement claim" onsubmit={submit}>
    <Step1Worker />
    <Step2Approver />
    <Step3Claim />
    <Step4Expenses />
    <Step5Repayment />
    <Step6DeclarationAndSubmit />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
