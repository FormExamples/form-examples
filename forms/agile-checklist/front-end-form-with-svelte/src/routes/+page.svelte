<script lang="ts">
  import { goto } from '$app/navigation';
  import { store } from '$lib/stores/checklist.svelte.js';
  import { STEPS } from '$lib/config/steps.js';
  import { TOTAL_ITEMS } from '$lib/config/items.js';

  // Lily Svelte headless contract — local shape-equivalent components.
  import Form from '$lib/components/ui/Form.svelte';
  import Progress from '$lib/components/ui/Progress.svelte';
  import StepList from '$lib/components/ui/StepList.svelte';
  import StepListItem from '$lib/components/ui/StepListItem.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Panel from '$lib/components/ui/Panel.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';

  import Step01 from '$lib/components/steps/Step01Respondent.svelte';
  import Step02 from '$lib/components/steps/Step02Teams.svelte';
  import Step03 from '$lib/components/steps/Step03Stakeholders.svelte';
  import Step04 from '$lib/components/steps/Step04Practices.svelte';
  import Step05 from '$lib/components/steps/Step05Summary.svelte';

  const stepComponents = [Step01, Step02, Step03, Step04, Step05];

  const result = $derived(store.result);
  const progressPct = $derived(Math.round((result.answeredCount / TOTAL_ITEMS) * 100));

  function savedAtLabel(iso: string): string {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' });
    } catch {
      return '';
    }
  }

  function gotoStep(n: number) {
    store.goto(n);
    document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function stepStatus(n: number): 'waiting' | 'in-progress' | 'finished' {
    if (n < store.currentStep) return 'finished';
    if (n === store.currentStep) return 'in-progress';
    return 'waiting';
  }

  function generateReport() {
    goto('/report');
  }
</script>

<a class="skip-link visually-hidden" href="#form-sections">Skip to questionnaire</a>

<header class="page-header">
  <div class="page-header-inner">
    <h1>Agile Checklist</h1>
    <p class="subtitle">
      Self-assessment of 57 concrete agile behaviours across Teams, Stakeholders, and Practices.
    </p>

    <Progress label="Items answered" max={TOTAL_ITEMS} value={result.answeredCount} />
    <p class="subtitle" aria-live="polite">
      {result.answeredCount} of {TOTAL_ITEMS} items answered ({progressPct}%)
      {#if store.lastSavedAt}
        <span class="saved-indicator" data-testid="saved-indicator">
          · saved {savedAtLabel(store.lastSavedAt)}
        </span>
      {/if}
    </p>

    <StepList label="Agile checklist steps" current={store.currentStep - 1}>
      {#each STEPS as s (s.number)}
        <StepListItem
          status={stepStatus(s.number)}
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
  {#if store.draftRestored}
    <Alert type="info" role="status">
      <p>
        <strong>Draft restored.</strong>
        A previous in-progress checklist was loaded from this browser.
      </p>
      <div class="button-group">
        <Button data-variant="secondary" onclick={() => store.acknowledgeDraft()}>
          Keep editing
        </Button>
        <Button data-variant="danger" onclick={() => store.discardDraft()}>
          Discard draft
        </Button>
      </div>
    </Alert>
  {/if}

  <div class="intro">
    <p>
      Complete all 5 sections below, then generate the report. The tool computes
      a per-section percentage of "yes" answers, derives a composite agility
      maturity level, fires coaching rules per section, and surfaces operational
      flags such as finished-work risk, experimentation-blocked, and
      psychological-safety risk.
    </p>
  </div>

  <Form label="Agile Checklist" onsubmit={generateReport} onreset={() => store.reset()}>
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
      <Button type="submit" data-variant="primary">Generate report</Button>
      <Button type="reset" data-variant="secondary">Start over</Button>
    </div>
  </Form>

  <Panel label="Checklist report">
    <p class="empty-message">
      Click "Generate report" above to render the full maturity report.
    </p>
  </Panel>
</main>

<style>
  .visually-hidden {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0 0 0 0);
    white-space: nowrap; border: 0;
  }
  .skip-link {
    position: absolute;
    left: -9999px; top: 0;
    background: var(--color-primary);
    color: white;
    padding: 0.5rem 1rem;
    z-index: 100;
    text-decoration: none;
  }
  .skip-link:focus { left: 0; }
  .page-header {
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
  .page-header-inner {
    max-width: 56rem;
    margin: 0 auto;
    padding: 1rem;
  }
  .page-header h1 { font-size: 1.25rem; font-weight: 600; margin: 0 0 0.25rem; }
  .subtitle { color: var(--color-muted); font-size: 0.875rem; margin: 0 0 0.75rem; }
  .saved-indicator { font-size: 0.75rem; font-weight: 400; }
  main {
    max-width: 56rem;
    margin: 0 auto;
    padding: 1.5rem 1rem 4rem;
  }
  .intro { margin-bottom: 1rem; color: var(--color-text); }
  .step-section {
    margin-bottom: 1.25rem;
    scroll-margin-top: 6rem;
  }
</style>
