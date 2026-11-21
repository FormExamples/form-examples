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
  import { sampleRequestRows } from '#lib/data/sample-reports.js';
  import { indicationLabel } from '#lib/engine/defaults.js';
  import {
    appropriatenessLabel,
    preanalyticalLabel,
    triageTierLabel,
    recommendationLabel
  } from '#lib/engine/utils.js';

  let triageFilter = $state('');
  let recommendationFilter = $state('');

  const rows = $derived(
    sampleRequestRows.filter(
      (r) =>
        (triageFilter === '' || r.triageTier === triageFilter) &&
        (recommendationFilter === '' || r.recommendation === recommendationFilter)
    )
  );

  // SVAR DataGrid columns. Graded axes render through the shared engine label
  // helpers so the dashboard and the report stay in lock-step.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Request' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'primaryIndication',
      header: 'Indication',
      format: fmt((v: string) => indicationLabel(v))
    },
    { id: 'testCount', header: 'Tests', sortable: true },
    {
      id: 'appropriatenessScore',
      header: 'Appropriateness',
      sortable: true,
      format: fmt(
        (v: number, row: DataGridRow) =>
          `${v}/9 · ${appropriatenessLabel(row.appropriatenessBand as string)}`
      )
    },
    {
      id: 'preanalyticalBand',
      header: 'Pre-analytical',
      format: fmt((v: string) => preanalyticalLabel(v))
    },

    {
      id: 'completenessPercent',
      header: 'Complete',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },

    {
      id: 'triageTier',
      header: 'Triage',
      sortable: true,
      format: fmt((v: string) => triageTierLabel(v))
    },
    {
      id: 'recommendation',
      header: 'Recommendation',
      format: fmt((v: string) => recommendationLabel(v))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'triageTier',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/coagulation-test-request/coagulation-test-requests/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Coagulation vetting dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Four-axis vetting grades for incoming coagulation requests, computed by the shared engine.
        Select a row to open the request.
      </p>
    </div>
    <a
      href="/coagulation-test-request/coagulation-test-requests/new"
      class="button"
      data-variant="primary">New request</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Triage tier</span>
      <select class="select inline-block w-auto" bind:value={triageFilter}>
        <option value="">All</option>
        <option value="routine">Routine</option>
        <option value="urgent">Urgent</option>
        <option value="stat">Stat</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Recommendation</span>
      <select class="select inline-block w-auto" bind:value={recommendationFilter}>
        <option value="">All</option>
        <option value="accept">Accept and process</option>
        <option value="query-referrer">Query the referrer</option>
        <option value="redirect">Redirect</option>
        <option value="reject">Reject specimen</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Coagulation vetting dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} requests</p>
</main>
