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
      case 'borderline':
        return 'warning';
      case 'intermediate':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'info';
    }
  }

  let pdfError = $state('');

  async function downloadPDF() {
    pdfError = '';
    try {
      const res = await fetch('/report/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: assessment.data, result: assessment.result })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prevent-cvd-risk-${data.patientInformation.fullName.replace(/\s+/g, '-') || 'report'}-${new Date().toISOString().slice(0, 10)}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        pdfError = 'Failed to generate PDF. Please try again.';
      }
    } catch {
      pdfError = 'Failed to generate PDF. Please check your connection and try again.';
    }
  }
</script>

{#if result}
  <main>
    <Panel label="PREVENT CVD risk report" class="report-panel">
      <h2>PREVENT CVD risk report</h2>

      <Alert
        type={alertType(result.riskCategory)}
        heading={riskCategoryLabel(result.riskCategory)}
      >
        <p><strong>10-year risk:</strong> {result.tenYearRiskPercent}%</p>
        <p><strong>30-year risk:</strong> {result.thirtyYearRiskPercent}%</p>
        <p class="subtle">Generated {new Date(result.timestamp).toLocaleString()}</p>
      </Alert>

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
        <h3>Risk rules triggered</h3>
        <ul class="fired-rules">
          {#each result.firedRules as rule (rule.id)}
            <li>
              <code>{rule.id}</code> &mdash; <strong>{rule.category}</strong>: {rule.description}
              <em>({rule.riskLevel})</em>
            </li>
          {/each}
        </ul>
      {/if}

      <h3>Patient summary</h3>
      <div class="summary-box">
        <p><strong>Name:</strong> {data.patientInformation.fullName || 'N/A'}</p>
        <p><strong>DOB:</strong> {data.patientInformation.dateOfBirth || 'N/A'}</p>
        <p><strong>NHS number:</strong> {data.patientInformation.nhsNumber || 'N/A'}</p>
        <p><strong>Age / sex:</strong> {data.demographics.age ?? 'N/A'} / {data.demographics.sex || 'N/A'}</p>
        <p><strong>Ethnicity:</strong> {data.demographics.ethnicity || 'N/A'}</p>
      </div>

      <h3>Clinical data</h3>
      <div class="summary-box">
        <p><strong>Systolic BP:</strong> {data.bloodPressure.systolicBp ?? 'N/A'} mmHg</p>
        <p><strong>Total cholesterol:</strong> {data.cholesterolLipids.totalCholesterol ?? 'N/A'} mg/dL</p>
        <p><strong>HDL cholesterol:</strong> {data.cholesterolLipids.hdlCholesterol ?? 'N/A'} mg/dL</p>
        <p><strong>On statin:</strong> {data.cholesterolLipids.onStatin || 'N/A'}</p>
        <p><strong>Diabetes:</strong> {data.metabolicHealth.hasDiabetes || 'N/A'}</p>
        <p><strong>HbA1c:</strong> {data.metabolicHealth.hba1cValue ?? 'N/A'} {data.metabolicHealth.hba1cUnit || ''}</p>
        <p><strong>BMI:</strong> {data.metabolicHealth.bmi ?? 'N/A'}</p>
        <p><strong>eGFR:</strong> {data.renalFunction.egfr ?? 'N/A'} mL/min</p>
        <p><strong>Smoking:</strong> {data.smokingHistory.smokingStatus || 'N/A'}</p>
        <p><strong>Known CVD:</strong> {data.medicalHistory.hasKnownCvd || 'N/A'}</p>
      </div>

      {#if data.reviewCalculate.clinicalNotes}
        <h3>Clinical notes</h3>
        <p class="notes">{data.reviewCalculate.clinicalNotes}</p>
        {#if data.reviewCalculate.clinicianName}
          <p class="subtle">
            Reviewed by: {data.reviewCalculate.clinicianName}
            {#if data.reviewCalculate.reviewDate}on {data.reviewCalculate.reviewDate}{/if}
          </p>
        {/if}
      {/if}

      {#if pdfError}
        <Alert type="error"><p>{pdfError}</p></Alert>
      {/if}

      <div class="button-group">
        <Button data-variant="secondary" onclick={() => goto('/')}>Back to form</Button>
        <Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
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
