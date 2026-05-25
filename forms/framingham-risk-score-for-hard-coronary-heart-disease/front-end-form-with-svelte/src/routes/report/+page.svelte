<script lang="ts">
  import { goto } from '$app/navigation';
  import { assessment } from '$lib/stores/assessment.svelte';
  import { riskLevelLabel } from '$lib/engine/utils';
  import Panel from '$lib/components/ui/Panel.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  const data = $derived(assessment.data);
  const result = $derived(assessment.result);

  $effect(() => {
    if (!assessment.result) goto('/');
  });

  function startNew() {
    assessment.reset();
    goto('/');
  }

  function alertType(level: string): 'info' | 'success' | 'warning' | 'error' {
    switch (level) {
      case 'low':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'info';
    }
  }
</script>

{#if result}
  <main>
    <Panel label="Framingham risk score report" class="report-panel">
      <h2>Framingham risk score report</h2>

      <Alert type={alertType(result.riskCategory)} heading={`${result.tenYearRiskPercent}% 10-year risk of hard CHD`}>
        <p>{riskLevelLabel(result.riskCategory)}</p>
        <p class="subtle">Generated {new Date(result.timestamp).toLocaleString()}</p>
      </Alert>

      <h3>Key inputs</h3>
      <div class="summary-box">
        <p><strong>Patient:</strong> {data.patientInformation.fullName || 'Not provided'}</p>
        <p><strong>Age:</strong> {data.demographics.age ?? 'N/A'}</p>
        <p><strong>Sex:</strong> {data.demographics.sex || 'N/A'}</p>
        <p><strong>Smoking:</strong> {data.smokingHistory.smokingStatus || 'N/A'}</p>
        <p><strong>Total cholesterol:</strong> {data.cholesterol.totalCholesterol ?? 'N/A'} {data.cholesterol.cholesterolUnit === 'mmolL' ? 'mmol/L' : 'mg/dL'}</p>
        <p><strong>HDL cholesterol:</strong> {data.cholesterol.hdlCholesterol ?? 'N/A'} {data.cholesterol.cholesterolUnit === 'mmolL' ? 'mmol/L' : 'mg/dL'}</p>
        <p><strong>Systolic BP:</strong> {data.bloodPressure.systolicBp ?? 'N/A'} mmHg</p>
        <p><strong>BP treatment:</strong> {data.bloodPressure.onBpTreatment || 'N/A'}</p>
      </div>

      {#if result.additionalFlags.length > 0}
        <h3>Flagged issues for clinician</h3>
        {#each result.additionalFlags as flag (flag.id)}
          <Alert
            type={flag.priority === 'high' ? 'error' : flag.priority === 'medium' ? 'warning' : 'info'}
            heading={`${flag.priority.toUpperCase()} \u2014 ${flag.category}`}
          >
            <p>{flag.message}</p>
          </Alert>
        {/each}
      {/if}

      {#if result.firedRules.length > 0}
        <h3>Risk analysis</h3>
        <ul class="fired-rules">
          {#each result.firedRules as rule (rule.id)}
            <li>
              <code>{rule.id}</code> &mdash; <strong>{rule.category}</strong>: {rule.description}
              <em>({rule.riskLevel})</em>
            </li>
          {/each}
        </ul>
      {/if}

      {#if data.reviewCalculate.clinicalNotes}
        <h3>Clinical notes</h3>
        <p><strong>Clinician:</strong> {data.reviewCalculate.clinicianName || 'Not provided'}</p>
        <p><strong>Review date:</strong> {data.reviewCalculate.reviewDate || 'Not provided'}</p>
        <p class="notes">{data.reviewCalculate.clinicalNotes}</p>
      {/if}

      <div class="button-group">
        <Button data-variant="secondary" onclick={() => goto('/')}>Back to form</Button>
        <Button data-variant="primary" onclick={() => window.print()}>Print</Button>
        <Button data-variant="danger" onclick={startNew}>Start over</Button>
      </div>
    </Panel>
  </main>
{/if}

<style>
  .fired-rules { margin: 0 0 1rem; padding-left: 1.25rem; }
  .fired-rules code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .subtle { color: var(--color-muted); font-size: 0.875rem; }
  .notes { white-space: pre-wrap; }
  .report-panel h2 { margin: 0 0 0.75rem; font-size: 1.5rem; }
  .report-panel h3 { font-size: 1.0625rem; margin: 1rem 0 0.5rem; }
</style>
