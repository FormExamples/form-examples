<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { store } from '#lib/stores/assessment.svelte.js';
  import { CRITERIA, SECTIONS } from '#lib/engine/criteria.js';
  import FlagBanner from '#lib/components/ui/FlagBanner.svelte';
  import Alert from '#lib/components/ui/Alert.svelte';
  import { Button, Panel } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const r = $derived(store.result);
  const d = $derived(store.data);

  // If the user lands here without having submitted, send them to the wizard.
  $effect(() => {
    if (!store.submitted) {
      goto(`/uk-nhs-digital-technology-assessment-criteria/assessments/${id}`);
    }
  });

  const alertType = $derived(
    r.outcome === 'meets' ? 'success' : r.outcome === 'does-not-meet' ? 'error' : 'warning',
  );
</script>

{#if store.submitted}
  <header class="page-header no-print">
    <div class="page-header-inner" style="display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap;">
      <h1>DTAC assessment report</h1>
      <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
        <Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
        <Button
          data-variant="secondary"
          onclick={() => goto(`/uk-nhs-digital-technology-assessment-criteria/assessments/${id}`)}>Edit</Button
        >
      </div>
    </div>
  </header>

  <main class="mx-16">
    <Panel label="DTAC assessment report" class="report-panel">
      <h2>DTAC Assessment Report</h2>

      <div class="report-grid">
        <section>
          <h3>Supplier</h3>
          <p>{d.supplier.name || '—'}</p>
          <p class="subtle">{d.supplier.companyRegistrationNumber} {d.supplier.countryOfRegistration}</p>
        </section>
        <section>
          <h3>Product</h3>
          <p>{d.product.name || '—'} {d.product.version}</p>
          <p class="subtle">{d.product.productType} · {d.product.medicalDeviceClass}</p>
        </section>
        <section>
          <h3>Assessor</h3>
          <p>{d.assessor.name || '—'} ({d.assessor.role || '—'})</p>
          <p class="subtle">{d.assessment.assessmentDate ?? '—'} · DTAC {d.assessment.dtacVersion || '—'}</p>
        </section>
      </div>

      <Alert type={alertType} heading={`Outcome: ${r.outcomeLabel}`}>
        <p>
          Mandatory {r.mandatoryMet}/{r.mandatoryTotal} met · advisory {r.advisoryMet}/{r.advisoryTotal} met
        </p>
        {#if d.assessment.finalOutcome && d.assessment.finalOutcome !== r.outcome}
          <p class="override">
            Assessor final outcome: {d.assessment.finalOutcome} — {d.assessment.assessorOverrideReason}
          </p>
        {/if}
      </Alert>

      <FlagBanner flags={r.flags} outcome={r.outcome} />

      <h3>Sections</h3>
      <ul>
        {#each SECTIONS as s (s.id)}
          <li>Section {s.id.toUpperCase()} — {s.title}: <strong>{r.sections[s.id]}</strong></li>
        {/each}
      </ul>

      <h3>Criteria not met or partially met</h3>
      {#if r.firedRules.length === 0}
        <p>None.</p>
      {:else}
        <ul>
          {#each r.firedRules as rule (rule.ruleId)}
            <li>
              <strong>{rule.criterionId.toUpperCase()}</strong> ({rule.status}, {rule.mandatory ? 'mandatory' : 'advisory'}):
              {rule.description}
            </li>
          {/each}
        </ul>
      {/if}

      <h3>Assessor notes</h3>
      <p class="notes">{d.assessment.assessorNotes || '—'}</p>
      <p class="subtle">{CRITERIA.length} criteria assessed against the published DTAC.</p>
    </Panel>
  </main>
{/if}
