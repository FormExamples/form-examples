<script lang="ts">
  import { goto } from '$app/navigation';
  import { assessment } from '$lib/stores/assessment.svelte.js';
  import { riskCategoryLabel } from '$lib/engine/utils.js';
  import Panel from '$lib/components/ui/Panel.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Button from '$lib/components/ui/Button.svelte';

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
      case 'moderate':
        return 'warning';
      case 'high':
        return 'warning';
      case 'veryHigh':
        return 'error';
      default:
        return 'info';
    }
  }

  const result = $derived(assessment.result);
  const data = $derived(assessment.data);
</script>

{#if result}
  <main>
    <Panel label="SCORE2-Diabetes risk assessment report" class="report-panel">
      <h2>SCORE2-Diabetes risk assessment report</h2>

      <Alert type={alertType(result.riskCategory)} heading={riskCategoryLabel(result.riskCategory)}>
        <p class="subtle">Generated {new Date(result.timestamp).toLocaleString()}</p>
      </Alert>

      <h3>Patient summary</h3>
      <div class="summary-box">
        <p><strong>Name:</strong> {data.patientDemographics.fullName || 'N/A'}</p>
        <p><strong>Date of birth:</strong> {data.patientDemographics.dateOfBirth || 'N/A'}</p>
        <p><strong>Sex:</strong> {data.patientDemographics.sex || 'N/A'}</p>
        <p><strong>NHS number:</strong> {data.patientDemographics.nhsNumber || 'N/A'}</p>
        <p><strong>Diabetes type:</strong> {data.diabetesHistory.diabetesType || 'N/A'}</p>
        <p><strong>HbA1c:</strong> {data.diabetesHistory.hba1cValue ?? 'N/A'} {data.diabetesHistory.hba1cUnit || ''}</p>
        <p><strong>BP:</strong> {data.bloodPressure.systolicBp ?? 'N/A'}/{data.bloodPressure.diastolicBp ?? 'N/A'} mmHg</p>
        <p><strong>eGFR:</strong> {data.renalFunction.egfr ?? 'N/A'} mL/min/1.73m\u00b2</p>
        <p><strong>BMI:</strong> {data.lifestyleFactors.bmi ?? 'N/A'} kg/m\u00b2</p>
        <p><strong>Total cholesterol:</strong> {data.lipidProfile.totalCholesterol ?? 'N/A'} mmol/L</p>
        <p><strong>LDL cholesterol:</strong> {data.lipidProfile.ldlCholesterol ?? 'N/A'} mmol/L</p>
        <p><strong>Smoking:</strong> {data.lifestyleFactors.smokingStatus || 'N/A'}</p>
      </div>

      {#if result.additionalFlags.length > 0}
        <h3>Clinical safety flags</h3>
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
        <h3>Risk classification rules triggered</h3>
        <ul class="fired-rules">
          {#each result.firedRules as rule (rule.id)}
            <li>
              <code>{rule.id}</code> &mdash; <strong>{rule.category}</strong>: {rule.description}
              <em>({rule.riskLevel})</em>
            </li>
          {/each}
        </ul>
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
</style>
