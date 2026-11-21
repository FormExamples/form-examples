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
  import { sampleAssessmentRows } from '#lib/data/sample-reports.js';
  import { rebaActionLevel } from '#lib/engine/utils.js';

  let riskFilter = $state('');
  let rsiFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (riskFilter === '' || r.riskLevel === riskFilter) &&
        (rsiFilter === '' || (rsiFilter === 'yes' ? r.rsiFlag : !r.rsiFlag))
    )
  );

  // SVAR DataGrid columns. REBA score, risk level and recommended action render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'workerName', header: 'Worker', sortable: true },
    { id: 'jobTitle', header: 'Job title', sortable: true },
    { id: 'assessedDate', header: 'Assessed', sortable: true },
    { id: 'rebaScore', header: 'REBA', sortable: true },
    {
      id: 'riskLevel',
      header: 'Risk level',
      sortable: true
    },

    {
      // Its own id: SVAR keys columns by id, and 'rebaScore' is the REBA column.
      id: 'action',
      header: 'Action',
      format: fmt((_v: unknown, row: Record<string, unknown>) =>
        rebaActionLevel(row.rebaScore as number)
      )
    },
    {
      id: 'painSeverity',
      header: 'Pain',
      sortable: true,
      format: fmt((v: number | null) => (v == null ? '—' : `${v}/10`))
    },

    {
      id: 'rsiFlag',
      header: 'RSI',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'workerName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/ergonomic-assessment/ergonomic-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Ergonomic assessor dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        REBA score, risk level and recommended action for assessed workers, computed by the shared
        engine. Select a row to open the assessment.
      </p>
    </div>
    <a href="/ergonomic-assessment/ergonomic-assessments/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Risk level</span>
      <select class="select inline-block w-auto" bind:value={riskFilter}>
        <option value="">All</option>
        <option value="Negligible risk">Negligible</option>
        <option value="Low risk">Low</option>
        <option value="Medium risk">Medium</option>
        <option value="High risk">High</option>
        <option value="Very high risk">Very high</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Existing RSI</span>
      <select class="select inline-block w-auto" bind:value={rsiFilter}>
        <option value="">All</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Ergonomic assessor dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} workers</p>
</main>
