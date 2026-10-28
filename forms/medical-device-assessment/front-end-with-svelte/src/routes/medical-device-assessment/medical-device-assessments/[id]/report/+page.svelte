<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Alert from '#lib/components/ui/Alert.svelte';
  import Badge from '#lib/components/ui/Badge.svelte';
  import { Button, Panel } from '@lilydesignsystem/svelte-headless';
  import {
    classColor,
    classLabel,
    priorityColor,
    readinessColor,
    readinessLabel,
    routeLabel
  } from '#lib/engine/utils.js';

  const id = $derived(page.params.id ?? 'new');
  const r = $derived(assessment.result);
  const d = $derived(assessment.data);
  const overridden = $derived(r.finalDeviceClass !== r.computedDeviceClass);

  // The report reflects the in-store assessment. If the user lands here without
  // having submitted (e.g. a deep link / refresh), send them back to the wizard.
  $effect(() => {
    if (!assessment.submitted) {
      goto(`/medical-device-assessment/medical-device-assessments/${id}`);
    }
  });

  const alertType = $derived(
    r.regulatoryReadiness === 'blocked'
      ? 'error'
      : r.regulatoryReadiness === 'gaps'
        ? 'warning'
        : 'success'
  );

  let pdfError = $state('');

  async function downloadPDF() {
    pdfError = '';
    try {
      const res = await fetch(
        `/medical-device-assessment/medical-device-assessments/${id}/report/pdf`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: assessment.data, result: assessment.result })
        }
      );
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medical-device-assessment-${id}.pdf`;
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

{#if assessment.submitted}
  <header class="page-header no-print">
    <div
      class="page-header-inner"
      style="display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap;"
    >
      <h1>Medical device assessment report</h1>
      <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
        {#if pdfError}
          <span class="error-message" style="margin:0;">{pdfError}</span>
        {/if}
        <Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
        <Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
        <Button
          data-variant="secondary"
          onclick={() => goto(`/medical-device-assessment/medical-device-assessments/${id}`)}
          >Edit</Button
        >
      </div>
    </div>
  </header>

  <main class="mx-16">
    <Panel label="Medical device assessment report" class="report-panel">
      <h2>Medical Device Assessment Report</h2>
      <p><strong>Device:</strong> {d.deviceName || 'Unnamed device'}</p>
      {#if d.intendedPurpose}
        <p class="subtle">{d.intendedPurpose}</p>
      {/if}

      <div class="report-grid">
        <section>
          <h3>Manufacturer</h3>
          <p>{d.manufacturer.name || '—'}</p>
          <p class="subtle">
            {d.manufacturer.countryAsIso31661Alpha2 || '—'}
            {#if d.manufacturer.singleRegistrationNumber}· SRN {d.manufacturer
                .singleRegistrationNumber}{/if}
          </p>
        </section>
        <section>
          <h3>Assessor</h3>
          <p>{d.assessor.name || '—'}</p>
          <p class="subtle">{d.assessor.organization || '—'} · {d.assessmentDate ?? '—'}</p>
        </section>
      </div>

      <Alert type={alertType} heading={`Readiness: ${readinessLabel(r.regulatoryReadiness)}`}>
        <p>
          <Badge
            label={classLabel(r.finalDeviceClass, r.classSuffix)}
            colorClass={classColor(r.finalDeviceClass)}
          />
          {#if overridden}<span class="override"
              >assessor override of computed {classLabel(r.computedDeviceClass)}</span
            >{/if}
        </p>
        <p><strong>Conformity route:</strong> {routeLabel(r.conformityRoute)}</p>
        <p><strong>Determining rule:</strong> {r.determiningRule || 'None'}</p>
        {#if overridden}<p><strong>Override reason:</strong> {r.overrideReason || '—'}</p>{/if}
      </Alert>

      <p>
        <Badge
          label={readinessLabel(r.regulatoryReadiness)}
          colorClass={readinessColor(r.regulatoryReadiness)}
        />
      </p>

      <h3>Fired rules ({r.firedRules.length})</h3>
      {#if r.firedRules.length === 0}
        <p class="subtle">No classification rules fired.</p>
      {:else}
        <ul>
          {#each r.firedRules as rule (rule.ruleId)}
            <li>
              <strong>Class {rule.deviceClass}</strong> — Rule {rule.annexViiiRule} ({rule.category}):
              {rule.description}
              {#if rule.ruleId === r.determiningRule}<strong>(determining rule)</strong>{/if}
            </li>
          {/each}
        </ul>
      {/if}

      <h3>Flags ({r.additionalFlags.length})</h3>
      {#if r.additionalFlags.length === 0}
        <p class="subtle">No flags raised.</p>
      {:else}
        <ul>
          {#each r.additionalFlags as f (f.flagId)}
            <li>
              <Badge label={f.priority.toUpperCase()} colorClass={priorityColor(f.priority)} />
              <strong>{f.flagId}</strong>
              {f.description}
              {f.suggestedAction}
            </li>
          {/each}
        </ul>
      {/if}

      {#if d.assessorNotes}
        <h3>Assessor notes</h3>
        <p class="notes">{d.assessorNotes}</p>
      {/if}
    </Panel>
  </main>
{/if}
