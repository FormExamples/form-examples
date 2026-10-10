<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { store } from '#lib/stores/assessment.svelte.js';
  import { sampleAssessments } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';
  import RestoreBanner from '#lib/components/ui/RestoreBanner.svelte';

  import Step01 from '#lib/components/steps/Step01Supplier.svelte';
  import Step02 from '#lib/components/steps/Step02Product.svelte';
  import Step03 from '#lib/components/steps/Step03Assessor.svelte';
  import Step04 from '#lib/components/steps/Step04CompanyInformation.svelte';
  import Step05 from '#lib/components/steps/Step05ValueProposition.svelte';
  import Step06 from '#lib/components/steps/Step06ClinicalSafety.svelte';
  import Step07 from '#lib/components/steps/Step07DataProtection.svelte';
  import Step08 from '#lib/components/steps/Step08TechnicalSecurity.svelte';
  import Step09 from '#lib/components/steps/Step09Interoperability.svelte';
  import Step10 from '#lib/components/steps/Step10UsabilityAccessibility.svelte';
  import Step11 from '#lib/components/steps/Step11Review.svelte';

  const stepComponents = [
    Step01, Step02, Step03, Step04, Step05, Step06, Step07, Step08, Step09, Step10, Step11,
  ];

  const base = '/uk-nhs-digital-technology-assessment-criteria/assessments';
  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  const title = 'UK NHS DTAC Assessment';
  const subtitle = 'Digital Technology Assessment Criteria: seven sections, 47 criteria.';

  // Hydrate the wizard whenever the route id changes: a saved draft wins,
  // otherwise seed from the matching sample (existing id) or a blank draft.
  $effect(() => {
    const seed = sampleAssessments.find((s) => s.id === id)?.data;
    if (store.id !== id) {
      store.loadForId(id, seed);
    }
  });

  let errorSummaryEl: HTMLDivElement | null = $state(null);

  function onSubmit() {
    const errors = store.validate();
    store.errors = errors;
    if (Object.keys(errors).length > 0) {
      store.errorSummaryHidden = false;
      queueMicrotask(() => errorSummaryEl?.focus());
      return;
    }
    store.errorSummaryHidden = true;
    store.submitted = true;
    goto(`${base}/${id}/report`);
  }

  function startOver() {
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

    <Progress label="Criteria answered" max={100} value={store.percentComplete} />
    <p class="subtitle" aria-live="polite">{store.percentComplete}% of criteria answered</p>

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
      Record the supplier, product and assessor, then mark each DTAC criterion met, partially met, not
      met or not applicable. The engine computes a result per section, an overall outcome and flagged
      issues as you go.
    </p>
  </div>

  <RestoreBanner show={store.hadDraftAtLoad} onDiscard={startOver} />

  <Form label={title} onsubmit={onSubmit} onreset={startOver}>
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
    Based on the NHS England Digital Technology Assessment Criteria (DTAC). The criteria text is a
    summary for structured recording; assess against the published DTAC. This tool records an
    assessment and does not confer compliance.
  </p>
</footer>
