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
  import { riskLevelShortLabel } from '#lib/engine/utils.js';
  import type { RiskLevel } from '#lib/engine/types.js';

  let riskFilter = $state('');
  let deptFilter = $state('');

  const departments = $derived(
    Array.from(new Set(sampleAssessmentRows.map((r) => r.department))).sort()
  );

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (riskFilter === '' || r.overallRisk === riskFilter) &&
        (deptFilter === '' || r.department === deptFilter)
    )
  );

  // SVAR DataGrid columns. The overall concern level and worst domain render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Response' },
    { id: 'department', header: 'Department / team', sortable: true },
    { id: 'tenureBand', header: 'Tenure', sortable: true },
    {
      id: 'submittedDate',
      header: 'Submitted',
      sortable: true
    },

    {
      id: 'overallRisk',
      header: 'Overall concern',
      sortable: true,
      format: fmt((v: string) => riskLevelShortLabel(v as RiskLevel))
    },
    { id: 'worstDomain', header: 'Worst domain', sortable: true },
    { id: 'answeredCount', header: 'Answered', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'overallRisk',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/workplace-stress-assessment/workplace-stress-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Occupational-health dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Anonymous survey responses with their overall HSE concern level and worst-scoring domain,
        computed by the shared engine. Select a row to open the response.
      </p>
    </div>
    <a
      href="/workplace-stress-assessment/workplace-stress-assessments/new"
      class="button"
      data-variant="primary">New survey</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Overall concern</span>
      <select class="select inline-block w-auto" bind:value={riskFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
        <option value="very-high">Very High</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Department</span>
      <select class="select inline-block w-auto" bind:value={deptFilter}>
        <option value="">All</option>
        {#each departments as dept (dept)}
          <option value={dept}>{dept}</option>
        {/each}
      </select>
    </label>
  </div>

  <DataGrid
    label="Occupational-health dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} responses</p>
</main>
