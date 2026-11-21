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
  let departmentFilter = $state('');

  const departments = $derived([...new Set(sampleAssessmentRows.map((r) => r.department))].sort());

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (outcomeFilter === '' || r.outcome === outcomeFilter) &&
        (departmentFilter === '' || r.department === departmentFilter)
    )
  );

  // SVAR DataGrid columns. The outcome and completion percentage render through
  // the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Checklist' },
    {
      id: 'employeeName',
      header: 'Employee',
      sortable: true
    },

    {
      id: 'department',
      header: 'Department',
      sortable: true
    },

    {
      id: 'lastWorkingDay',
      header: 'Last working day',
      sortable: true
    },

    {
      id: 'outcome',
      header: 'Outcome',
      sortable: true,
      format: fmt((v: string) => outcomeLabel(v as never))
    },
    {
      id: 'completionPercent',
      header: 'Completion',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    { id: 'blockerCount', header: 'Blockers', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'employeeName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/employee-offboarding-checklist/employee-offboarding-checklists/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Offboarding HR dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Completeness outcome and percentage for departing employees, computed by the shared engine.
        Select a row to open the checklist.
      </p>
    </div>
    <a
      href="/employee-offboarding-checklist/employee-offboarding-checklists/new"
      class="button"
      data-variant="primary">New checklist</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Outcome</span>
      <select class="select inline-block w-auto" bind:value={outcomeFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="partial">Partial</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Department</span>
      <select class="select inline-block w-auto" bind:value={departmentFilter}>
        <option value="">All</option>
        {#each departments as dept (dept)}
          <option value={dept}>{dept}</option>
        {/each}
      </select>
    </label>
  </div>

  <DataGrid
    label="Offboarding HR dashboard"
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
