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
  import { completionStatusLabel, riskLevelLabel } from '#lib/engine/utils.js';

  let riskFilter = $state('');
  let statusFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (riskFilter === '' || r.riskLevel === riskFilter) &&
        (statusFilter === '' || r.completionStatus === statusFilter)
    )
  );

  // SVAR DataGrid columns. Completion status and the overall risk render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Checklist' },
    { id: 'employeeName', header: 'Employee', sortable: true },
    { id: 'jobTitle', header: 'Job title', sortable: true },
    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'completionPercentage',
      header: 'Complete',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    {
      id: 'completionStatus',
      header: 'Status',
      sortable: true,
      format: fmt((v: string) => completionStatusLabel(v as never))
    },
    {
      id: 'riskLevel',
      header: 'Overall risk',
      sortable: true,
      format: fmt((v: string) => riskLevelLabel(v as never))
    },

    {
      id: 'dbsCleared',
      header: 'DBS',
      format: fmt((v: boolean) => (v ? 'Cleared' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'employeeName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/employee-onboarding-checklist/employee-onboarding-checklists/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Onboarding HR dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Completion status and overall onboarding risk for staff records, computed by the shared
        engine. Select a row to open the checklist.
      </p>
    </div>
    <a
      href="/employee-onboarding-checklist/employee-onboarding-checklists/new"
      class="button"
      data-variant="primary">New checklist</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Overall risk</span>
      <select class="select inline-block w-auto" bind:value={riskFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Completion status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="not-started">Not started</option>
        <option value="in-progress">In progress</option>
        <option value="mostly-complete">Mostly complete</option>
        <option value="complete">Complete</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Onboarding HR dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} employees</p>
</main>
