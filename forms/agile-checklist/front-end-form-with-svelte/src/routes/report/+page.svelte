<script lang="ts">
  import { goto } from '$app/navigation';
  import { store } from '$lib/stores/checklist.svelte.js';
  import { ALL_ITEMS, SECTION_LABEL } from '$lib/config/items.js';
  import FlagBanner from '$lib/components/ui/FlagBanner.svelte';
  import Panel from '$lib/components/ui/Panel.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import { buildPdf } from '$lib/report/pdf-builder.js';

  const r = $derived(store.result);
  const d = $derived(store.data);

  function downloadPdf() {
    buildPdf(d, r);
  }

  function pctOrDash(p: number | null): string {
    return p === null ? '—' : `${p.toFixed(0)}%`;
  }
</script>

<Panel label="Checklist report" class="report-panel">
  <div class="report-header">
    <h2>Checklist report</h2>
    <div class="button-group">
      <Button data-variant="secondary" onclick={() => goto('/')}>Back to form</Button>
      <Button data-variant="primary" onclick={downloadPdf}>Download PDF</Button>
    </div>
  </div>

  <div class="respondent-grid">
    <p><strong>Respondent:</strong> {d.respondent.fullName || '—'}</p>
    <p><strong>Role:</strong> {d.respondent.role || '—'}</p>
    <p><strong>Team:</strong> {d.respondent.teamName || '—'}</p>
    <p><strong>Organisation:</strong> {d.respondent.organisationName || '—'}</p>
    <p><strong>Date:</strong> {d.respondent.assessmentDate || '—'}</p>
    <p><strong>Cadence:</strong> {d.respondent.assessmentPeriod || '—'}</p>
  </div>

  <div class="summary-grid">
    <p><strong>Overall:</strong> {pctOrDash(r.overallPercent)}</p>
    <p><strong>Teams:</strong> {pctOrDash(r.teams.percent)} ({r.teams.band})</p>
    <p>
      <strong>Stakeholders:</strong>
      {pctOrDash(r.stakeholders.percent)} ({r.stakeholders.band})
    </p>
    <p><strong>Practices:</strong> {pctOrDash(r.practices.percent)} ({r.practices.band})</p>
  </div>

  <FlagBanner flags={r.additionalFlags} maturity={r.maturity} />

  <h3>Per-item answers</h3>
  <table class="answers-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Section</th>
        <th>Item</th>
        <th>Answer</th>
      </tr>
    </thead>
    <tbody>
      {#each ALL_ITEMS as item (item.id)}
        {@const a = d.answers[item.id] || ''}
        <tr>
          <td><code>{item.id}</code></td>
          <td>{SECTION_LABEL[item.section]}</td>
          <td>{item.text}</td>
          <td class="uppercase">{a || '—'}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#if d.actionPlan.topAction1 || d.actionPlan.topAction2 || d.actionPlan.topAction3}
    <h3>Top three actions</h3>
    <ol>
      {#if d.actionPlan.topAction1}<li>{d.actionPlan.topAction1}</li>{/if}
      {#if d.actionPlan.topAction2}<li>{d.actionPlan.topAction2}</li>{/if}
      {#if d.actionPlan.topAction3}<li>{d.actionPlan.topAction3}</li>{/if}
    </ol>
  {/if}

  {#if d.actionPlan.coachNotes}
    <h3>Coach notes</h3>
    <p class="notes">{d.actionPlan.coachNotes}</p>
  {/if}

  {#if d.actionPlan.overallNotes}
    <h3>Overall notes</h3>
    <p class="notes">{d.actionPlan.overallNotes}</p>
  {/if}
</Panel>

<style>
  .report-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  .report-header h2 { font-size: 1.25rem; font-weight: 600; margin: 0; }
  .report-header :global(.button-group) { margin-top: 0; }
  .respondent-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
  @media (max-width: 640px) { .respondent-grid { grid-template-columns: 1fr; } }
  .summary-grid {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.5rem;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
  @media (max-width: 640px) { .summary-grid { grid-template-columns: 1fr; } }
  .answers-table {
    width: 100%;
    font-size: 0.8125rem;
    border-collapse: collapse;
  }
  .answers-table th,
  .answers-table td {
    text-align: left;
    padding: 0.375rem 0.5rem;
    border: 1px solid var(--color-border);
    vertical-align: top;
  }
  .answers-table th {
    background: var(--color-bg);
    font-weight: 600;
  }
  .uppercase { text-transform: uppercase; }
  .notes { white-space: pre-line; font-size: 0.875rem; }
  h3 { font-weight: 600; margin: 1rem 0 0.5rem; }
</style>
