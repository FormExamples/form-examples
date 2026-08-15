<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { store } from '#lib/stores/assessment.svelte.js';
  import { sampleAssessments } from '#lib/data/sample-reports.js';

  // Lily Svelte headless contract — local shape-equivalent components.
  import Form from '#lib/components/ui/Form.svelte';
  import Progress from '#lib/components/ui/Progress.svelte';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';
  import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';
  import Button from '#lib/components/ui/Button.svelte';

  // 16 step components.
  import Step01 from '#lib/components/steps/Step01Clinician.svelte';
  import Step02 from '#lib/components/steps/Step02Patient.svelte';
  import Step03 from '#lib/components/steps/Step03Vitals.svelte';
  import Step04 from '#lib/components/steps/Step04Airway.svelte';
  import Step05 from '#lib/components/steps/Step05Cardiovascular.svelte';
  import Step06 from '#lib/components/steps/Step06Respiratory.svelte';
  import Step07 from '#lib/components/steps/Step07Neurological.svelte';
  import Step08 from '#lib/components/steps/Step08RenalHepatic.svelte';
  import Step09 from '#lib/components/steps/Step09Haematology.svelte';
  import Step10 from '#lib/components/steps/Step10Endocrine.svelte';
  import Step11 from '#lib/components/steps/Step11Gastrointestinal.svelte';
  import Step12 from '#lib/components/steps/Step12Musculoskeletal.svelte';
  import Step13 from '#lib/components/steps/Step13Medications.svelte';
  import Step14 from '#lib/components/steps/Step14FunctionalCapacity.svelte';
  import Step15 from '#lib/components/steps/Step15AnaesthesiaPlan.svelte';
  import Step16 from '#lib/components/steps/Step16Summary.svelte';

  const stepComponents = [
    Step01, Step02, Step03, Step04, Step05, Step06, Step07, Step08,
    Step09, Step10, Step11, Step12, Step13, Step14, Step15, Step16,
  ];

  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  const title = 'Pre-operative Assessment by Clinician';
  const subtitle =
    'ASA Physical Status, Mallampati, RCRI, STOP-BANG, and Clinical Frailty Scale.';

  // Hydrate the wizard whenever the route id changes: a saved draft for that id
  // wins, otherwise seed from the matching sample assessment (existing id) or a
  // blank draft (new).
  $effect(() => {
    const seed = sampleAssessments.find((s) => s.id === id)?.data;
    if (store.id !== id) {
      store.loadForId(id, seed);
    }
  });

  let errorSummaryEl: HTMLDivElement | null = $state(null);

  function focusErrorSummary() {
    queueMicrotask(() => errorSummaryEl?.focus());
  }

  function onSubmit() {
    const errors = store.validate();
    store.errors = errors;
    if (Object.keys(errors).length > 0) {
      store.errorSummaryHidden = false;
      focusErrorSummary();
      return;
    }
    store.errorSummaryHidden = true;
    store.submitted = true;
    goto(`/pre-operative-assessment-by-clinician/pre-operative-assessments-by-clinician/${id}/report`);
  }

  function onReset() {
    const seed = sampleAssessments.find((s) => s.id === id)?.data;
    store.reset();
    store.loadForId(id, seed);
  }

  function gotoStep(n: number) {
    store.goto(n);
    document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const errorEntries = $derived(Object.entries(store.errors));
</script>

<a class="skip-link visually-hidden" href="#form-sections">Skip to questionnaire</a>

<header class="page-header no-print">
  <div class="page-header-inner">
    <h1>{isNew ? `New — ${title}` : `${title} — ${id}`}</h1>
    <p class="subtitle">{subtitle}</p>

    <Progress label="Form completion" max={100} value={store.percentComplete} />
    <p class="subtitle" aria-live="polite">
      {store.percentComplete}% complete
    </p>

    <StepList label={`${title} steps`} current={store.currentStep - 1}>
      {#each store.steps as s (s.number)}
        <StepListItem
          status={s.status}
          current={s.number === store.currentStep}
          onclick={() => gotoStep(s.number)}
        >
          {s.short}
        </StepListItem>
      {/each}
    </StepList>
  </div>
</header>

<main class="mx-16">
  <div class="intro">
    <p>
      Clinician data-entry wizard for the pre-operative assessment.
      Document objective findings across 16 body-system sections; the
      engine computes the ASA Physical Status grade, Mallampati class,
      RCRI score, STOP-BANG score, and Clinical Frailty Scale, and emits
      a composite perioperative risk plus a list of safety flags.
    </p>
  </div>

  <Form label={title} onsubmit={onSubmit} onreset={onReset}>
    {#if !store.errorSummaryHidden && errorEntries.length > 0}
      <div bind:this={errorSummaryEl} class="error-summary-wrapper" tabindex="-1">
        <ErrorSummary title="There is a problem">
          <ul>
            {#each errorEntries as [eid, message] (eid)}
              <li><a href={`#${eid}`}>{message}</a></li>
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
          onmouseenter={() => store.goto(i + 1)}
          onfocusin={() => store.goto(i + 1)}
          aria-labelledby={`step-${i + 1}-legend`}
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
    ASA Physical Status Classification, Mallampati airway score, Revised
    Cardiac Risk Index (Lee 1999), STOP-BANG (Chung 2008), and Clinical
    Frailty Scale (Rockwood 2005) are validated clinical instruments.
    This screening tool is for clinical decision support; final ASA
    grading and anaesthesia planning remain the responsibility of the
    signing clinician.
  </p>
</footer>
