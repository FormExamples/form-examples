<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { store } from '#lib/stores/assessment.svelte.js';
  import { adviceLabel, approvalBadgeClass, approvalLabel } from '#lib/engine/utils.js';
  import { Button, Panel } from '@lilydesignsystem/svelte-headless';

  const id = $derived(page.params.id ?? 'new');
  const r = $derived(store.result);
  const d = $derived(store.data);

  // The report reflects the in-store fit note. If the user lands here without
  // having submitted (e.g. a deep link / refresh), send them back to the wizard.
  $effect(() => {
    if (!store.submitted) {
      goto(`/medical-fit-note/medical-fit-notes/${id}`);
    }
  });

  const priorityClass = (p: string) =>
    p === 'high'
      ? 'border-error text-error'
      : p === 'medium'
        ? 'border-warning text-base-content'
        : 'border-base-300 text-base-content/70';

  let pdfError = $state('');

  async function downloadPDF() {
    pdfError = '';
    try {
      const res = await fetch(`/medical-fit-note/medical-fit-notes/${id}/report/pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: store.data, result: store.result })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medical-fit-note-${id}.pdf`;
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
    <div
      class="page-header-inner"
      style="display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap;"
    >
      <h1>Fit note report</h1>
      <div style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
        {#if pdfError}
          <span class="error-message" style="margin:0;">{pdfError}</span>
        {/if}
        <Button data-variant="primary" onclick={downloadPDF}>Download PDF</Button>
        <Button data-variant="secondary" onclick={() => window.print()}>Print</Button>
        <Button
          data-variant="secondary"
          onclick={() => goto(`/medical-fit-note/medical-fit-notes/${id}`)}>Edit</Button
        >
      </div>
    </div>
  </header>

  <main class="mx-16">
    <Panel label="Fit note report" class="report-panel">
      <h2>Fit Note Report</h2>
      <p class="subtle">Employee: {d.employeeName || '—'}</p>

      <p data-testid="approval-status">
        <span class="rounded border px-3 py-1 font-semibold {approvalBadgeClass(r.approvalStatus)}"
          >{approvalLabel(r.approvalStatus)}</span
        >
      </p>
      <p class="subtle">
        Advice: {adviceLabel(r.outcome) || 'not chosen'} · Period: {r.durationDays == null
          ? '—'
          : `${r.durationDays} day${r.durationDays === 1 ? '' : 's'}`} · Adjustments: {r.adjustmentCount}
      </p>

      <div class="report-grid">
        <section>
          <h3>Employee</h3>
          <p>{d.employeeName || '—'}</p>
          <p class="subtle">DOB {d.employeeBirthDate || '—'} — NHS {d.employeeNhsNumber || '—'}</p>
          <p class="subtle">{d.employerName || '—'} — {d.jobTitle || '—'}</p>
        </section>
        <section>
          <h3>Clinician</h3>
          <p>{d.clinicianName || '—'} ({d.clinicianRole || '—'})</p>
          <p class="subtle">
            {d.clinicianRegistrationBody || '—'}
            {d.clinicianRegistrationNumber}
          </p>
          <p class="subtle">
            Assessed {d.assessmentDate || '—'} ({d.assessmentMethod || '—'})
          </p>
        </section>
      </div>

      <h3>Condition</h3>
      <p>{d.diagnosisPrimary || '—'}</p>
      {#if d.functionalEffects}<p class="subtle">{d.functionalEffects}</p>{/if}

      <h3>Fired rules</h3>
      {#if r.firedRules.length === 0}
        <p class="subtle">No rules fired.</p>
      {:else}
        <table class="subscales">
          <thead>
            <tr>
              <th scope="col">Rule</th>
              <th scope="col">Category</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {#each r.firedRules as rule (rule.ruleId)}
              <tr>
                <th scope="row">{rule.ruleId}</th>
                <td>{rule.category}</td>
                <td>{rule.description}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}

      <h3>Flags</h3>
      {#if r.additionalFlags.length === 0}
        <p class="subtle">No flags raised.</p>
      {:else}
        <ul class="my-2 space-y-2">
          {#each r.additionalFlags as f (f.flagId)}
            <li class="border-l-4 bg-base-100 p-3 {priorityClass(f.priority)}">
              <span class="font-semibold">[{f.priority.toUpperCase()}]</span>
              {f.category} — {f.description}
              <span class="block text-sm text-base-content/70">{f.suggestedAction}</span>
            </li>
          {/each}
        </ul>
      {/if}
    </Panel>
  </main>
{/if}
