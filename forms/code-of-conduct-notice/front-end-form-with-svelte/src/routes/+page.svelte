<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import { validateForm } from '$lib/engine/form-validator';
  import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
  import { steps } from '$lib/config/steps';

  // Lily Svelte headless contract — local shape-equivalent components.
  import Form from '$lib/components/ui/Form.svelte';
  import Progress from '$lib/components/ui/Progress.svelte';
  import StepList from '$lib/components/ui/StepList.svelte';
  import StepListItem from '$lib/components/ui/StepListItem.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Panel from '$lib/components/ui/Panel.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';

  import Step1RecipientDetails from '$lib/components/steps/Step1RecipientDetails.svelte';
  import Step2CodeOfConductNotice from '$lib/components/steps/Step2CodeOfConductNotice.svelte';
  import Step3AcknowledgementSignature from '$lib/components/steps/Step3AcknowledgementSignature.svelte';

  const stepComponents = [
    Step1RecipientDetails,
    Step2CodeOfConductNotice,
    Step3AcknowledgementSignature
  ];

  const title = 'Code of Conduct Notice';
  const subtitle = 'Read-and-acknowledge notice for medical-service providers.';

  const submitted = $derived(assessment.result !== null);

  const priorityClass: Record<string, 'info' | 'warning' | 'error'> = {
    high: 'error',
    medium: 'warning',
    low: 'info'
  };

  function submitForm() {
    const { completeness, status, firedRules } = validateForm(assessment.data);
    const additionalFlags = detectAdditionalFlags(assessment.data);
    assessment.result = {
      completenessPercent: completeness,
      status,
      firedRules,
      additionalFlags,
      timestamp: new Date().toISOString()
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startNew() {
    assessment.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function gotoStep(n: number) {
    assessment.currentStep = n;
    document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function stepStatus(n: number): 'waiting' | 'in-progress' | 'finished' {
    if (n < assessment.currentStep) return 'finished';
    if (n === assessment.currentStep) return 'in-progress';
    return 'waiting';
  }
</script>

<svelte:head>
  <title>Code of Conduct Notice</title>
</svelte:head>

<a class="skip-link visually-hidden" href="#form-sections">Skip to questionnaire</a>

<header class="page-header no-print">
  <div class="page-header-inner">
    <h1>{title}</h1>
    <p class="subtitle">{subtitle}</p>

    {#if submitted && assessment.result}
      <Progress label="Form completion" max={100} value={assessment.result.completenessPercent} />
      <p class="subtitle" aria-live="polite">
        {assessment.result.completenessPercent}% complete · {assessment.result.status}
      </p>
    {:else}
      <Progress label="Form completion" max={steps.length} value={assessment.currentStep} />
      <p class="subtitle" aria-live="polite">
        Step {assessment.currentStep} of {steps.length}
      </p>
    {/if}

    <StepList label={`${title} steps`} current={assessment.currentStep - 1}>
      {#each steps as s (s.number)}
        <StepListItem
          status={stepStatus(s.number)}
          current={s.number === assessment.currentStep}
          onclick={() => gotoStep(s.number)}
        >
          {s.shortTitle}
        </StepListItem>
      {/each}
    </StepList>
  </div>
</header>

<main>
  {#if submitted && assessment.result}
    <div class="report-actions no-print">
      <Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
      <Button data-variant="primary" onclick={startNew}>New Form</Button>
    </div>

    <Alert
      type={assessment.result.completenessPercent === 100 ? 'success' : 'warning'}
      heading={`${assessment.result.completenessPercent}% Complete — ${assessment.result.status}`}
      role="status"
    >
      <p>
        Generated {new Date(assessment.result.timestamp).toLocaleString()}.
      </p>
    </Alert>

    {#if assessment.result.additionalFlags.length > 0}
      <Panel label="Flagged Issues">
        <h3>Flagged Issues</h3>
        {#each assessment.result.additionalFlags as flag}
          <Alert type={priorityClass[flag.priority]} role="status">
            <p>
              <strong>{flag.priority.toUpperCase()} · {flag.category}:</strong>
              {flag.message}
            </p>
          </Alert>
        {/each}
      </Panel>
    {/if}

    {#if assessment.result.firedRules.length > 0}
      <Panel label="Missing Required Fields">
        <h3>Missing Required Fields</h3>
        <table class="fired-rules-table">
          <thead>
            <tr>
              <th>Rule</th>
              <th>Section</th>
              <th>Issue</th>
              <th>Field</th>
            </tr>
          </thead>
          <tbody>
            {#each assessment.result.firedRules as rule}
              <tr>
                <td><code>{rule.id}</code></td>
                <td>{rule.section}</td>
                <td>{rule.description}</td>
                <td><code>{rule.field}</code></td>
              </tr>
            {/each}
          </tbody>
        </table>
      </Panel>
    {/if}

    <Panel label="Acknowledgement Summary">
      <h3>Acknowledgement Summary</h3>
      <dl class="summary-grid">
        <dt>Acknowledged</dt>
        <dd>{assessment.data.acknowledgementSignature.agreed ? 'Yes' : 'No'}</dd>
        <dt>Recipient Name</dt>
        <dd>{assessment.data.acknowledgementSignature.recipientTypedFullName || 'N/A'}</dd>
        <dt>Date</dt>
        <dd>{assessment.data.acknowledgementSignature.recipientTypedDate || 'N/A'}</dd>
        <dt>Organisation</dt>
        <dd>{assessment.data.recipientDetails.organisationName || 'N/A'}</dd>
        <dt>Role</dt>
        <dd>{assessment.data.recipientDetails.recipientRole || 'N/A'}</dd>
      </dl>
    </Panel>
  {:else}
    <div class="intro">
      <p>
        Read the three sections below — recipient details, the twelve Code
        of Conduct principles, and the acknowledgement — then submit to
        record your acknowledgement.
      </p>
    </div>

    <Form label={title} onsubmit={submitForm} onreset={startNew}>
      <div id="form-sections">
        {#each stepComponents as StepComponent, i (i)}
          <div
            id={`step-${i + 1}`}
            class="step-section"
            onmouseenter={() => (assessment.currentStep = i + 1)}
            onfocusin={() => (assessment.currentStep = i + 1)}
            role="region"
            aria-labelledby={`step-${i + 1}-legend`}
          >
            <StepComponent />
          </div>
        {/each}
      </div>

      <div class="button-group">
        <Button type="submit" data-variant="primary">
          Submit Code of Conduct Acknowledgement
        </Button>
        <Button type="reset" data-variant="secondary">Start over</Button>
      </div>
    </Form>

    <footer class="page-footer">
      <p>
        For compliance records. Twelve principles derived from standard
        medical-service code-of-conduct templates.
      </p>
    </footer>
  {/if}
</main>

<style>
  .report-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-bottom: 0.75rem;
  }
  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
  }
  .fired-rules-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
  }
  .fired-rules-table th,
  .fired-rules-table td {
    text-align: left;
    padding: 0.375rem 0.5rem;
    border-bottom: 1px solid var(--color-border);
    vertical-align: top;
  }
  .fired-rules-table th { background: var(--color-bg); font-weight: 600; }
  .summary-grid {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 0.25rem 1rem;
    font-size: 0.9375rem;
    margin: 0;
  }
  .summary-grid dt { font-weight: 600; color: var(--color-muted); }
  .summary-grid dd { margin: 0; }
</style>
