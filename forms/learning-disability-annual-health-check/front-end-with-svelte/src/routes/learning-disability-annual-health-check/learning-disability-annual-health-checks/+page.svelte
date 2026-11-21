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
  import { statusLabel } from '#lib/engine/utils.js';

  let statusFilter = $state('');
  let hapFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (statusFilter === '' || r.status === statusFilter) &&
        (hapFilter === '' ||
          (hapFilter === 'complete' ? r.healthActionPlanComplete : !r.healthActionPlanComplete))
    )
  );

  // SVAR DataGrid columns. Completeness status, completeness percentage, the
  // Health Action Plan gate, and the STOMP flag render through the shared engine
  // output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Check' },
    { id: 'personIdentifier', header: 'Person ID', sortable: true },
    { id: 'personName', header: 'Person', sortable: true },
    { id: 'practiceName', header: 'GP practice', sortable: true },
    { id: 'checkedDate', header: 'Checked', sortable: true },
    {
      id: 'status',
      header: 'Completeness',
      sortable: true,
      format: fmt((v: string) => statusLabel(v as never))
    },
    {
      id: 'completenessPercent',
      header: '%',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    {
      id: 'healthActionPlanComplete',
      header: 'Health Action Plan',
      sortable: true,
      format: fmt((v: boolean) => (v ? 'Produced & shared' : 'Outstanding'))
    },
    {
      id: 'stompFlag',
      header: 'STOMP',
      sortable: true,
      format: fmt((v: boolean) => (v ? 'Flag' : '—'))
    },
    { id: 'highFlagCount', header: 'High flags', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'personName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/learning-disability-annual-health-check/learning-disability-annual-health-checks/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Annual health check dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Completeness status, completeness percentage, the Health Action Plan, and the STOMP flag for
        checked people, computed by the shared engine. Select a row to open the check.
      </p>
    </div>
    <a
      href="/learning-disability-annual-health-check/learning-disability-annual-health-checks/new"
      class="button"
      data-variant="primary">New check</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Completeness</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Health Action Plan</span>
      <select class="select inline-block w-auto" bind:value={hapFilter}>
        <option value="">All</option>
        <option value="complete">Produced & shared</option>
        <option value="outstanding">Outstanding</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Annual health check dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} people</p>
</main>
