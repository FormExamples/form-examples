<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import { sampleAssessments } from '#lib/data/sample-reports.js';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';
  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1Manufacturer from '#lib/components/steps/Step1Manufacturer.svelte';
  import Step2Device from '#lib/components/steps/Step2Device.svelte';
  import Step3Contact from '#lib/components/steps/Step3Contact.svelte';
  import Step4Active from '#lib/components/steps/Step4Active.svelte';
  import Step5Software from '#lib/components/steps/Step5Software.svelte';
  import Step6Special from '#lib/components/steps/Step6Special.svelte';
  import Step7Suffix from '#lib/components/steps/Step7Suffix.svelte';
  import Step8Readiness from '#lib/components/steps/Step8Readiness.svelte';
  import Step9Report from '#lib/components/steps/Step9Report.svelte';

  const stepComponents = [
    Step1Manufacturer,
    Step2Device,
    Step3Contact,
    Step4Active,
    Step5Software,
    Step6Special,
    Step7Suffix,
    Step8Readiness,
    Step9Report
  ];

  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  const title = 'Medical Device Assessment';
  const subtitle = 'EU MDR 2017/745 Annex VIII risk class, conformity route and readiness.';

  // Hydrate the wizard whenever the route id changes: a saved draft for that id
  // wins, otherwise seed from the matching sample assessment (existing id) or a
  // blank draft (new).
  $effect(() => {
    const seed = sampleAssessments.find((s) => s.id === id)?.data;
    if (assessment.id !== id) {
      assessment.loadForId(id, seed);
    }
  });

  let errorSummaryEl: HTMLDivElement | null = $state(null);

  function onSubmit() {
    const errors = assessment.validate();
    assessment.errors = errors;
    if (errors.length > 0) {
      assessment.errorSummaryHidden = false;
      queueMicrotask(() => errorSummaryEl?.focus());
      return;
    }
    assessment.errorSummaryHidden = true;
    assessment.submitted = true;
    goto(`/medical-device-assessment/medical-device-assessments/${id}/report`);
  }

  function startOver() {
    const seed = sampleAssessments.find((s) => s.id === id)?.data;
    assessment.reset();
    assessment.loadForId(id, seed);
    // loadForId() just re-read storage (now cleared), so there is no restored draft.
    assessment.hadDraftAtLoad = false;
  }

  function onReset() {
    if (confirm('Clear all answers and start a fresh assessment?')) startOver();
  }

  function gotoStep(n: number) {
    assessment.goto(n);
    document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>

<a class="skip-link visually-hidden" href="#form-sections">Skip to questionnaire</a>

<header class="page-header no-print">
  <div class="page-header-inner">
    <h1>{isNew ? `New — ${title}` : `${title} — ${id}`}</h1>
    <p class="subtitle">{subtitle}</p>

    <Progress label="Form completion" max={100} value={assessment.percentComplete} />
    <p class="subtitle" aria-live="polite">{assessment.percentComplete}% complete</p>

    <StepList label={`${title} steps`} current={assessment.currentStep - 1}>
      {#each assessment.steps as s (s.number)}
        <StepListItem
          status={s.status}
          current={s.number === assessment.currentStep}
          onclick={() => gotoStep(s.number)}
        >
          {s.short}
        </StepListItem>
      {/each}
    </StepList>
  </div>
</header>

<main class="mx-16">
  <RestoreBanner show={assessment.hadDraftAtLoad} onDiscard={startOver} />

  <Form label={title} onsubmit={onSubmit} onreset={onReset}>
    {#if !assessment.errorSummaryHidden && assessment.errors.length > 0}
      <div bind:this={errorSummaryEl} class="error-summary-wrapper" tabindex="-1">
        <ErrorSummary title="Please correct the following">
          <ul>
            {#each assessment.errors as e (e.id)}
              <li><a href={`#${e.id}`}>{e.message}</a></li>
            {/each}
          </ul>
        </ErrorSummary>
      </div>
    {/if}

    <div id="form-sections">
      {#each stepComponents as StepComponent, i (i)}
        <section
          id={`step-${i + 1}`}
          class="step-section"
          role="group"
          aria-label={`Step ${i + 1}`}
          onmouseenter={() => assessment.goto(i + 1)}
          onfocusin={() => assessment.goto(i + 1)}
        >
          <StepComponent />
        </section>
      {/each}
    </div>

    <div class="button-group">
      <Button type="submit" data-variant="primary">Submit and view report</Button>
      <Button type="reset" data-variant="secondary">Start over</Button>
    </div>
  </Form>
</main>

<footer class="page-footer">
  <p>
    Simplified implementation of EU MDR 2017/745 Annex VIII. It supports a classification discussion
    and does not replace the regulation, the UK Medical Devices Regulations 2002, or the judgement
    of a notified body. In vitro diagnostic devices are classified under IVDR 2017/746.
  </p>
</footer>
