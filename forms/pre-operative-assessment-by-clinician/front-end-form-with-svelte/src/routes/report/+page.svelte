<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import FlagBanner from '$lib/components/ui/FlagBanner.svelte';
  import Panel from '$lib/components/ui/Panel.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  const r = $derived(store.result);
  const d = $derived(store.data);

  const compositeAlertType = $derived(
    r.compositeRisk === 'critical'
      ? 'error'
      : r.compositeRisk === 'high'
        ? 'warning'
        : r.compositeRisk === 'moderate'
          ? 'warning'
          : 'success',
  );
</script>

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

  <div class="button-group">
    <a class="button" data-variant="primary" href="/report/pdf">Download PDF</a>
    <a class="button" data-variant="secondary" href="/#step-16">Back to summary</a>
  </div>
</Panel>
