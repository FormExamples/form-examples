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
  import { outcomeLabel } from '#lib/engine/utils.js';

  let outcomeFilter = $state('');
  let criticalFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (outcomeFilter === '' || r.outcome === outcomeFilter) &&
        (criticalFilter === '' ||
          (criticalFilter === 'with' ? r.criticalCount > 0 : r.criticalCount === 0))
    )
  );

  // SVAR DataGrid columns. The overall outcome, finding counts and flags render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Audit' },
    { id: 'siteName', header: 'Site', sortable: true },
    { id: 'auditDate', header: 'Audited', sortable: true },
    {
      id: 'outcome',
      header: 'Outcome',
      sortable: true,
      format: fmt((v: string) => outcomeLabel(v as never))
    },

    {
      id: 'findingCount',
      header: 'Findings',
      sortable: true
    },

    {
      id: 'criticalCount',
      header: 'Critical',
      sortable: true
    },

    {
      id: 'riddorFlag',
      header: 'RIDDOR',
      format: fmt((v: boolean) => (v ? 'Outstanding' : 'OK'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'siteName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/workplace-safety-assessment/workplace-safety-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Workplace safety dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Overall outcome, finding counts and flags for audited sites, computed by the shared engine.
        Select a row to open the audit.
      </p>
    </div>
    <a
      href="/workplace-safety-assessment/workplace-safety-assessments/new"
      class="button"
      data-variant="primary">New audit</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Outcome</span>
      <select class="select inline-block w-auto" bind:value={outcomeFilter}>
        <option value="">All</option>
        <option value="compliant">Compliant</option>
        <option value="minor">Minor Findings</option>
        <option value="major">Major Findings</option>
        <option value="critical">Critical Findings</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Critical findings</span>
      <select class="select inline-block w-auto" bind:value={criticalFilter}>
        <option value="">All</option>
        <option value="with">With critical findings</option>
        <option value="without">No critical findings</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Workplace safety dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} sites</p>
</main>
