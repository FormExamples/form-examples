<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { store } from '$lib/state.svelte.js';
  import { STEPS } from '$lib/config/steps.js';

  // Lily Svelte headless contract — local shape-equivalent components.
  import Form from '$lib/components/ui/Form.svelte';
  import Progress from '$lib/components/ui/Progress.svelte';
  import StepList from '$lib/components/ui/StepList.svelte';
  import StepListItem from '$lib/components/ui/StepListItem.svelte';
  import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Panel from '$lib/components/ui/Panel.svelte';

  // 12 step components.
  import Step1 from '$lib/steps/Step1Identification.svelte';
  import Step2 from '$lib/steps/Step2PatientIdentification.svelte';
  import Step3 from '$lib/steps/Step3SurgicalTeam.svelte';
  import Step4 from '$lib/steps/Step4DiagnosesProcedures.svelte';
  import Step5 from '$lib/steps/Step5Anaesthesia.svelte';
  import Step6 from '$lib/steps/Step6PositionPrepApproach.svelte';
  import Step7 from '$lib/steps/Step7OperativeFindings.svelte';
  import Step8 from '$lib/steps/Step8MaterialsImplants.svelte';
  import Step9 from '$lib/steps/Step9DrainsPacksSpecimens.svelte';
  import Step10 from '$lib/steps/Step10SafetyCountsEbl.svelte';
  import Step11 from '$lib/steps/Step11PostOperativePlan.svelte';
  import Step12 from '$lib/steps/Step12SignOff.svelte';

  const stepComponents = [
    Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8, Step9, Step10, Step11, Step12,
  ];

  const title = 'Medical Operation Note';
  const subtitle =
    'Composite operative risk (Routine / Complicated / High-risk / Critical) with Clavien–Dindo, ASA, and safety flags.';

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
  }

  function onReset() {
    store.reset();
  }

  function gotoStep(n: number) {
    store.goto(n);
    document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function openDynamicRoute() {
    void goto(`/operation-note/${store.currentStep}`);
  }

  // Mirror current URL hash on mount, if any.
  onMount(() => {});

  const errorEntries = $derived(Object.entries(store.errors));
</script>

<a class="skip-link visually-hidden" href="#form-sections">Skip to questionnaire</a>

<header class="page-header">
  <div class="page-header-inner">
    <h1>{title}</h1>
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

<main>
  <div class="intro">
    <p>
      Operating-team data-entry wizard for the contemporaneous surgical
      operation note. Document objective findings across 12 sections; the
      engine computes the composite operative risk
      (Routine / Complicated / High-risk / Critical), the Clavien–Dindo
      grade, the blood-loss band, the agreed counts, and the full set of
      WHO Sign-Out safety flags. Produces a signed PDF op note and a
      FHIR R5 <code>Procedure</code> bundle for the electronic health
      record.
    </p>
  </div>

  <Form label={title} onsubmit={onSubmit} onreset={onReset}>
    {#if !store.errorSummaryHidden && errorEntries.length > 0}
      <div bind:this={errorSummaryEl} class="error-summary-wrapper">
        <ErrorSummary title="There is a problem">
          <ul>
            {#each errorEntries as [id, message] (id)}
              <li><a href={`#${id}`}>{message}</a></li>
            {/each}
          </ul>
        </ErrorSummary>
      </div>
    {/if}

    <div id="form-sections">
      {#each stepComponents as StepComponent, i (i)}
        <div
          id={`step-${i + 1}`}
          class="step-section"
          onmouseenter={() => store.goto(i + 1)}
          onfocusin={() => store.goto(i + 1)}
          role="region"
          aria-labelledby={`step-${i + 1}-legend`}
        >
          <StepComponent />
        </div>
      {/each}
    </div>

    <div class="button-group">
      <Button type="submit" data-variant="primary">Submit and view report</Button>
      <Button type="reset" data-variant="secondary">Start over</Button>
      <Button data-variant="secondary" onclick={openDynamicRoute}>
        Open one step at a time
      </Button>
    </div>
  </Form>

  <Panel label="Operation-note report">
    {#if !store.submitted}
      <p class="empty-message">Submit the form to see the report.</p>
    {:else}
      <p>
        Composite risk:
        <strong>{store.result.finalRisk.toUpperCase()}</strong>
        — Clavien–Dindo {store.result.clavienDindoGrade},
        blood loss {store.result.bloodLossBand},
        {store.result.additionalFlags.length} flag{store.result.additionalFlags.length === 1 ? '' : 's'}.
      </p>
    {/if}
  </Panel>

  <footer class="page-footer">
    <p>
      RCS Good Surgical Practice §3.5, WHO Surgical Safety Checklist
      (Sign-Out), NHS England Never Events Policy, Clavien–Dindo
      classification, NCEPOD urgency, and OPCS-4 procedure codes are
      validated clinical and regulatory references. This tool supports
      contemporaneous documentation by the operating team; the lead
      surgeon remains responsible for the final composite-risk decision
      and any override.
    </p>
    <p>
      Steps: {STEPS.length}. Algorithm: max-grade. Defaults to Routine.
    </p>
  </footer>
</main>
