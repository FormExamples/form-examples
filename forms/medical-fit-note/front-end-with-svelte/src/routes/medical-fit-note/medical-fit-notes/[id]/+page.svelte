<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { store } from '#lib/stores/assessment.svelte.js';
  import { sampleAssessments } from '#lib/data/sample-reports.js';

  import Form from '#lib/components/ui/Form.svelte';
  import { Button, ErrorSummary, Progress } from '@lilydesignsystem/svelte-headless';
  import StepList from '#lib/components/ui/StepList.svelte';
  import StepListItem from '#lib/components/ui/StepListItem.svelte';

  import Step1 from '#lib/components/steps/Step1Employee.svelte';
  import Step2 from '#lib/components/steps/Step2Assessment.svelte';
  import Step3 from '#lib/components/steps/Step3Condition.svelte';
  import Step4 from '#lib/components/steps/Step4Advice.svelte';
  import Step5 from '#lib/components/steps/Step5Adjustments.svelte';
  import Step6 from '#lib/components/steps/Step6Period.svelte';
  import Step7 from '#lib/components/steps/Step7SignOff.svelte';
  import Step8 from '#lib/components/steps/Step8Report.svelte';

  const stepComponents = [Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8];

  const id = $derived(page.params.id ?? 'new');
  const isNew = $derived(id === 'new');

  const title = 'Medical Fit Note';
  const subtitle = 'Clinician sign-off and approval of a fit note.';

  // Hydrate the wizard whenever the route id changes: a saved draft for that id
  // wins, otherwise seed from the matching sample fit note (existing id) or a
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
    void store.save();
    goto(`/medical-fit-note/medical-fit-notes/${id}/report`);
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
      Clinician wizard for the medical fit note. Record the employee, assessment, condition, fitness
      advice, adjustments, period and sign-off; the engine applies rules R-01 to R-09 and shows
      whether the note is approved, needs completion or is blocked.
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
    This tool checks that a fit note is complete and consistent. It supports, and does not replace,
    the signing clinician's judgement; the clinician remains responsible for the advice given.
  </p>
</footer>
