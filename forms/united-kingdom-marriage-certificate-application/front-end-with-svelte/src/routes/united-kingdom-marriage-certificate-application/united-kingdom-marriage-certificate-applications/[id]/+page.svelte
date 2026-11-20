<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import { validateApplication } from '#lib/engine/marriage-grader.js';
  import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
  import { sampleCertificates } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Notice from '#lib/components/steps/Step1Notice.svelte';
  import Step2Ceremony from '#lib/components/steps/Step2Ceremony.svelte';
  import Step3PartyOne from '#lib/components/steps/Step3PartyOne.svelte';
  import Step4PartyTwo from '#lib/components/steps/Step4PartyTwo.svelte';
  import Step5Relationship from '#lib/components/steps/Step5Relationship.svelte';
  import Step6Certificate from '#lib/components/steps/Step6Certificate.svelte';

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
    if (d.partyOne.name.trim() === '') {
      found.push({ id: 'partyOne-name', message: "The first party's name is required." });
    }
    if (d.partyTwo.name.trim() === '') {
      found.push({ id: 'partyTwo-name', message: "The second party's name is required." });
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
      `/united-kingdom-marriage-certificate-application/united-kingdom-marriage-certificate-applications/${id}/report`
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
    {isNew ? 'New United Kingdom Marriage Certificate Application' : `Application ${id}`}
  </h1>
  <p class="mt-1 text-sm text-base-content/70">
    Complete the six sections; the application class, the permitted ceremony window, and flagged
    issues are computed on submit. This is a completeness check — there is no numeric score, and it
    gives no legal advice: the register office decides each notice.
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

  <Form label="United Kingdom Marriage Certificate Application" onsubmit={submit}>
    <Step1Notice />
    <Step2Ceremony />
    <Step3PartyOne />
    <Step4PartyTwo />
    <Step5Relationship />
    <Step6Certificate />

    <div class="button-group">
      <Button type="submit" data-variant="primary">Validate &amp; view report</Button>
      <Button data-variant="danger" onclick={startOver}>Start over</Button>
    </div>
  </Form>
</main>
