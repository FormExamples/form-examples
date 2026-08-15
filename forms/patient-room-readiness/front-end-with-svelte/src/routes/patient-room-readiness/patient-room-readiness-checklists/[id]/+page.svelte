<script lang="ts">
  import { page } from '$app/state';
  import { store } from '#lib/stores/checklist.svelte.js';
  import { sampleAssessments } from '#lib/data/sample-reports.js';

  // Lily Svelte headless contract — local shape-equivalent components.
  import Form from '#lib/components/ui/Form.svelte';
  import Progress from '#lib/components/ui/Progress.svelte';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';
  import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';
  import Button from '#lib/components/ui/Button.svelte';
  import Panel from '#lib/components/ui/Panel.svelte';

  // 3 step components.
  import Step1 from '#lib/components/steps/Step1Location.svelte';
  import Step2 from '#lib/components/steps/Step2Checklist.svelte';
  import Step3 from '#lib/components/steps/Step3InspectorSignOff.svelte';

  const stepComponents = [Step1, Step2, Step3];

  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  const title = 'Patient Room Readiness';
  const subtitle = 'Room-readiness checklist: location, 25 checkpoints, and inspector sign-off.';

  // Hydrate the wizard whenever the route id changes: a saved draft for that id
  // wins, otherwise seed from the matching sample checklist (existing id) or a
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
    document.getElementById('report')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  const result = $derived(store.result);
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
      Inspector data-entry wizard for the room-readiness checklist. Identify
      the building and room, confirm each of the 25 fixture / fabric
      checkpoints, and sign off with your name, email, and inspection date
      and time. There is no clinical grading here — just a tally of what is
      confirmed and what still needs attention.
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

  <Panel label="Report" aria-live="polite">
    <div id="report" class="report-panel">
      {#if !store.submitted}
        <p class="empty-message">Submit the form to see the report.</p>
      {:else}
        <h2>Patient Room Readiness Report</h2>
        <p class="subtle">Generated {new Date().toLocaleString()}</p>
        <p class="subtle">
          {store.data.location.buildingNameOrNumber || '—'} /
          {store.data.location.roomNameOrNumber || '—'}
          — inspected by {store.data.inspector.name || '—'}
          on {store.data.inspection.date || '—'} {store.data.inspection.time}
        </p>

        <h3>Checklist result</h3>
        <p class="subscale-chips">
          <span class="subscale-chip"
            ><strong>{result.checkedCount}</strong> / {result.totalCount} checkpoints confirmed</span
          >
        </p>

        <h3>Unchecked checkpoints</h3>
        {#if result.uncheckedFields.length === 0}
          <p class="muted">All checkpoints confirmed. Room is ready for occupancy.</p>
        {:else}
          <ul class="flags">
            {#each result.uncheckedFields as label (label)}
              <li class="flag-medium">
                <span class="flag-message">{label}</span>
              </li>
            {/each}
          </ul>
        {/if}
      {/if}
    </div>
  </Panel>
</main>

<footer class="page-footer">
  <p>
    A facilities/housekeeping readiness sign-off, not a clinical instrument.
    Transcribed verbatim from a hospital housekeeping room-readiness proforma.
  </p>
</footer>

<style>
  .subscale-chips {
    margin: 0.5rem 0 1rem;
  }
  .subscale-chip {
    display: inline-block;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 9999px;
    padding: 0.375rem 0.875rem;
    font-size: 0.9375rem;
  }
  .flags {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }
  .flag-medium {
    background: var(--color-warning-bg);
    border: 1px solid var(--color-warning);
    border-radius: 0.375rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.9375rem;
  }
  .muted {
    color: var(--color-muted);
  }
</style>
