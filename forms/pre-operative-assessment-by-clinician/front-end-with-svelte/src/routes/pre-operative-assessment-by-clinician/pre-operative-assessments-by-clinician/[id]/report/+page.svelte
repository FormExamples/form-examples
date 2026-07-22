<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { store } from '$lib/stores/assessment.svelte.js';
  import FlagBanner from '$lib/components/ui/FlagBanner.svelte';
  import Panel from '$lib/components/ui/Panel.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  const id = $derived(page.params.id ?? 'new');
  const r = $derived(store.result);
  const d = $derived(store.data);

  // The report reflects the in-store assessment. If the user lands here without
  // having submitted (e.g. a deep link / refresh), send them back to the wizard.
  $effect(() => {
    if (!store.submitted) {
      goto(`/pre-operative-assessment-by-clinician/pre-operative-assessments-by-clinician/${id}`);
    }
  });

  const compositeAlertType = $derived(
    r.compositeRisk === 'critical'
      ? 'error'
      : r.compositeRisk === 'high'
        ? 'warning'
        : r.compositeRisk === 'moderate'
          ? 'warning'
          : 'success',
  );

  let pdfError = $state('');

  async function downloadPDF() {
    pdfError = '';
    try {
      const res = await fetch(`/pre-operative-assessments-by-clinician/${id}/report/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: store.data, result: store.result }),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pre-operative-assessment-${d.patient.lastName || id}.pdf`;
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

{#if store.submitted}
  <header class="page-header no-print">
    <div class="page-header-inner" style="display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap;">
      <h1>Pre-operative assessment report</h1>
      <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
        {#if pdfError}
          <span class="error-message" style="margin:0;">{pdfError}</span>
        {/if}
        <Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
        <Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
        <Button
          data-variant="secondary"
          onclick={() => goto(`/pre-operative-assessment-by-clinician/pre-operative-assessments-by-clinician/${id}`)}>Edit</Button
        >
      </div>
    </div>
  </header>

  <main class="mx-16">
    <Panel label="Pre-operative assessment report" class="report-panel">
      <h2>Pre-operative Assessment Report</h2>

      <div class="report-grid">
        <section>
          <h3>Clinician</h3>
          <p>{d.clinician.clinicianName} ({d.clinician.clinicianRole})</p>
          <p class="subtle">{d.clinician.registrationBody} {d.clinician.registrationNumber}</p>
          <p class="subtle">
            {d.clinician.assessmentDate} {d.clinician.assessmentTime} — {d.clinician.siteName}
          </p>
        </section>
        <section>
          <h3>Patient</h3>
          <p>{d.patient.firstName} {d.patient.lastName}</p>
          <p class="subtle">NHS {d.patient.nhsNumber} — DOB {d.patient.dateOfBirth}</p>
          <p class="subtle">
            Weight {d.patient.weightKg ?? '—'} kg · Height {d.patient.heightCm ?? '—'} cm
          </p>
        </section>
      </div>

      <Alert type={compositeAlertType} heading={`Composite risk: ${r.compositeRisk.toUpperCase()}`}>
        <p>
          <strong>Computed ASA:</strong> {r.computedAsaGrade}{r.asaEmergencySuffix}
          {#if d.summary.finalAsaGrade && d.summary.finalAsaGrade !== r.computedAsaGrade}
            <span class="override">→ Clinician final: {d.summary.finalAsaGrade}</span>
          {/if}
        </p>
        <p>
          Mallampati {r.mallampatiClass || '—'} · RCRI {r.rcriScore} · STOP-BANG {r.stopbangScore} ·
          CFS {r.frailtyScale ?? '—'}
        </p>
        <p><strong>Recommendation:</strong> {d.summary.recommendation || '—'}</p>
      </Alert>

      <FlagBanner flags={r.additionalFlags} risk={r.compositeRisk} />

      <h3>Anaesthesia plan</h3>
      <p>Technique: {d.anaesthesiaPlan.technique || '—'}</p>
      <p>Airway: {d.anaesthesiaPlan.airwayPlan || '—'}</p>
      <p>Monitoring: {d.anaesthesiaPlan.monitoringLevel || '—'}</p>
      <p>Disposition: {d.anaesthesiaPlan.postOpDisposition || '—'}</p>
      <p>Analgesia: {d.anaesthesiaPlan.analgesiaPlan || '—'}</p>

      <h3>Clinician notes</h3>
      <p class="notes">{d.summary.clinicianNotes || '—'}</p>
    </Panel>
  </main>
{/if}
