<script lang="ts">
  import { goto } from '$app/navigation';
  import { assessment } from '$lib/stores/assessment.svelte';
  import { riskCategoryLabel } from '$lib/engine/utils';
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
      case 'moderate':
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
    <Panel label="Heart Health Check report" class="report-panel">
      <h2>Heart Health Check report</h2>

      <Alert
        type={alertType(result.riskCategory)}
        heading={`${riskCategoryLabel(result.riskCategory)} \u2014 ${result.tenYearRiskPercent}% 10-year CVD risk`}
      >
        {#if result.heartAge != null}
          <p>Heart age: {result.heartAge} years</p>
        {/if}
        <p class="subtle">Generated {new Date(result.timestamp).toLocaleString()}</p>
      </Alert>

      {#if result.heartAge != null && data.demographicsEthnicity.age != null}
        {@const ageDiff = result.heartAge - data.demographicsEthnicity.age}
        <h3>Heart age vs chronological age</h3>
        <div class="summary-box">
          <p><strong>Chronological age:</strong> {data.demographicsEthnicity.age}</p>
          <p><strong>Heart age:</strong> {result.heartAge}</p>
          <p><strong>Difference:</strong> {ageDiff > 0 ? '+' : ''}{ageDiff} years</p>
        </div>
      {/if}

      {#if result.firedRules.length > 0}
        <h3>Risk factors identified</h3>
        <ul class="fired-rules">
          {#each result.firedRules as rule (rule.id)}
            <li>
              <code>{rule.id}</code> &mdash; <strong>{rule.category}</strong>: {rule.description}
              <em>({rule.riskLevel})</em>
            </li>
          {/each}
        </ul>
      {/if}

      {#if result.additionalFlags.length > 0}
        <h3>Flagged issues</h3>
        {#each result.additionalFlags as flag (flag.id)}
          <Alert
            type={flag.priority === 'high' ? 'error' : flag.priority === 'medium' ? 'warning' : 'info'}
            heading={`${flag.priority.toUpperCase()} \u2014 ${flag.category}`}
          >
            <p>{flag.message}</p>
          </Alert>
        {/each}
      {/if}

      <h3>Patient summary</h3>
      <div class="summary-box">
        <p><strong>Name:</strong> {data.patientInformation.fullName || 'N/A'}</p>
        <p><strong>DOB:</strong> {data.patientInformation.dateOfBirth || 'N/A'}</p>
        <p><strong>Sex:</strong> {data.demographicsEthnicity.sex || 'N/A'}</p>
        <p><strong>Age:</strong> {data.demographicsEthnicity.age ?? 'N/A'}</p>
        <p><strong>NHS number:</strong> {data.patientInformation.nhsNumber || 'N/A'}</p>
        <p><strong>GP:</strong> {data.patientInformation.gpName || 'N/A'}</p>
      </div>

      <h3>Key risk factors</h3>
      <div class="summary-box">
        {#if data.bloodPressure.systolicBP != null}
          <p><strong>Blood pressure:</strong> {data.bloodPressure.systolicBP}/{data.bloodPressure.diastolicBP ?? '?'} mmHg</p>
        {/if}
        {#if data.cholesterol.totalCholesterol != null}
          <p><strong>Total cholesterol:</strong> {data.cholesterol.totalCholesterol} mmol/L</p>
        {/if}
        <p><strong>Smoking:</strong> {data.smokingAlcohol.smokingStatus || 'Not stated'}</p>
        <p><strong>Diabetes:</strong> {data.medicalConditions.hasDiabetes || 'Not stated'}</p>
        {#if data.bodyMeasurements.bmi != null}
          <p><strong>BMI:</strong> {data.bodyMeasurements.bmi}</p>
        {/if}
        <p><strong>Family CVD &lt;60:</strong> {data.familyHistory.familyCVDUnder60 || 'Not stated'}</p>
      </div>

      {#if data.reviewCalculate.clinicianName}
        <h3>Clinician</h3>
        <p><strong>Name:</strong> {data.reviewCalculate.clinicianName}</p>
        {#if data.reviewCalculate.reviewDate}
          <p><strong>Review date:</strong> {data.reviewCalculate.reviewDate}</p>
        {/if}
        {#if data.reviewCalculate.clinicalNotes}
          <p class="notes">{data.reviewCalculate.clinicalNotes}</p>
        {/if}
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
</style>
