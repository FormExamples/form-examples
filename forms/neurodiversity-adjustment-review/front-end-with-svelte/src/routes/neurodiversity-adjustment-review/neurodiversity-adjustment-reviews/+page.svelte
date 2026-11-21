<script lang="ts">
  import { goto } from '$app/navigation';
  import DataGrid, {
    type DataGridColumn,
    type DataGridRow
  } from '@lilydesignsystem/svelte-data-grid';

  // A column's template, typed as it was written, as a DataGrid format. A missing
  // value (null, undefined or '') is left to the grid's emptyValue.
  const fmt =
    <T,>(template: (value: T, row: DataGridRow) => string) =>
    (value: unknown, row: DataGridRow): string =>
      value === null || value === undefined || value === '' ? '' : template(value as T, row);
  import { sampleReports } from '#lib/data/sample-reports.js';
  import {
    effectivenessBandLabel,
    wellbeingRiskBandLabel,
    nextStepUrgencyLabel,
    reviewStatusLabel
  } from '#lib/engine/utils.js';

  let effectivenessFilter = $state('');
  let urgencyFilter = $state('');

  const rows = $derived(
    sampleReports.filter(
      (r) =>
        (effectivenessFilter === '' || r.effectivenessBand === effectivenessFilter) &&
        (urgencyFilter === '' || r.nextStepUrgency === urgencyFilter)
    )
  );

  // Review overview — rolls up the rows currently in view. Reflects the active
  // filters, so slicing by effectiveness or urgency re-scopes the metrics.
  const cards = $derived.by(() => {
    const total = rows.length;
    const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));
    const c = (pred: (r: (typeof rows)[number]) => boolean) => rows.filter(pred).length;
    const effective = pct(c((r) => r.effectivenessBand === 'effective'));
    const ineffective = pct(c((r) => r.effectivenessBand === 'ineffective'));
    const highRisk = pct(c((r) => r.wellbeingRiskBand === 'high-risk'));
    const avgComplete =
      total === 0
        ? 0
        : Math.round(rows.reduce((a, r) => a + (r.completenessPercent || 0), 0) / total);
    return [
      { label: 'Reviews in view', value: String(total), cls: '' },
      {
        label: 'Effective',
        value: effective + '%',
        cls: effective ? 'text-success' : ''
      },

      {
        label: 'Ineffective',
        value: ineffective + '%',
        cls: ineffective ? 'text-error' : ''
      },

      {
        label: 'High wellbeing risk',
        value: highRisk + '%',
        cls: highRisk ? 'text-error' : 'text-success'
      },
      { label: 'Avg completeness', value: avgComplete + '%', cls: '' }
    ];
  });

  // SVAR DataGrid columns. Graded axes render through the shared engine label
  // helpers so the dashboard and the report stay in lock-step.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Review' },
    { id: 'workerName', header: 'Worker', sortable: true },
    {
      id: 'reviewStatus',
      header: 'Status',
      format: fmt((v: string) => reviewStatusLabel(v as never))
    },
    { id: 'reviewDate', header: 'Reviewed', sortable: true },
    {
      id: 'effectivenessBand',
      header: 'Effectiveness',
      sortable: true,
      format: fmt((v: string) => effectivenessBandLabel(v as never))
    },
    {
      id: 'wellbeingRiskBand',
      header: 'Wellbeing risk',
      sortable: true,
      format: fmt((v: string) => wellbeingRiskBandLabel(v as never))
    },
    {
      id: 'nextStepUrgency',
      header: 'Next step',
      sortable: true,
      format: fmt((v: string) => nextStepUrgencyLabel(v as never))
    },
    { id: 'completenessPercent', header: 'Complete', format: fmt((v: number) => `${v}%`) },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'nextStepUrgency',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/neurodiversity-adjustment-review/neurodiversity-adjustment-reviews/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Graded adjustment reviews</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Four-axis grades for completed neurodiversity adjustment reviews, computed by the shared
        engine. Select a row to open the review.
      </p>
    </div>
    <a
      href="/neurodiversity-adjustment-review/neurodiversity-adjustment-reviews/new"
      class="button"
      data-variant="primary">New review</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Effectiveness</span>
      <select class="select inline-block w-auto" bind:value={effectivenessFilter}>
        <option value="">All</option>
        <option value="effective">Effective</option>
        <option value="partially-effective">Partially effective</option>
        <option value="ineffective">Ineffective</option>
        <option value="not-yet-assessed">Not yet assessed</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Next-step urgency</span>
      <select class="select inline-block w-auto" bind:value={urgencyFilter}>
        <option value="">All</option>
        <option value="none">None</option>
        <option value="review-scheduled">Review scheduled</option>
        <option value="adjust-now">Adjust now</option>
        <option value="escalate">Escalate</option>
      </select>
    </label>
  </div>

  <section class="mb-4" aria-label="Review overview">
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {#each cards as card (card.label)}
        <div class="rounded-lg border border-base-300 bg-base-100 px-3 py-2">
          <div class="text-2xl font-bold tabular-nums {card.cls}">{card.value}</div>
          <div class="text-xs text-base-content/60">{card.label}</div>
        </div>
      {/each}
    </div>
  </section>

  <DataGrid
    label="Graded adjustment reviews"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} reviews</p>
</main>
