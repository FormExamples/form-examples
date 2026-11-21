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
  import { sampleAdrRows } from '#lib/data/sample-reports.js';
  import { statusLabel, groupLabel, pad4 } from '#lib/engine/utils.js';
  import type { Status, DecisionGroup } from '#lib/types.js';

  let statusFilter = $state('');
  let groupFilter = $state('');

  const rows = $derived(
    sampleAdrRows.filter(
      (r) =>
        (statusFilter === '' || r.status === statusFilter) &&
        (groupFilter === '' || r.decisionGroup === groupFilter)
    )
  );

  // SVAR DataGrid columns. Status, group, completeness and flags render through
  // the shared engine output so the register and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'number', header: 'No.', sortable: true, format: fmt((v: number | null) => pad4(v)) },
    { id: 'title', header: 'Title', sortable: true },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      format: fmt((v: Status) => statusLabel(v))
    },
    {
      id: 'decisionGroup',
      header: 'Group',
      sortable: true,
      format: fmt((v: DecisionGroup) => groupLabel(v))
    },
    {
      id: 'completeness',
      header: 'Complete',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    { id: 'chosenPosition', header: 'Chosen', format: fmt((v: string) => v || '—') },
    { id: 'authorName', header: 'Author', sortable: true },
    {
      id: 'decisionDate',
      header: 'Date',
      sortable: true,
      format: fmt((v: string) => v || '—')
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'number',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/architecture-decision-record/architecture-decision-records/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Architecture decision register</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Status, group, completeness, the chosen position, and open flags for each recorded decision,
        computed by the shared engine. Select a row to open the record.
      </p>
    </div>
    <a
      href="/architecture-decision-record/architecture-decision-records/new"
      class="button"
      data-variant="primary">New record</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="decided">Decided</option>
        <option value="approved">Approved</option>
        <option value="superseded">Superseded</option>
        <option value="deprecated">Deprecated</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Group</span>
      <select class="select inline-block w-auto" bind:value={groupFilter}>
        <option value="">All</option>
        <option value="business">Business</option>
        <option value="data">Data</option>
        <option value="integration">Integration</option>
        <option value="presentation">Presentation</option>
        <option value="security">Security</option>
        <option value="infrastructure">Infrastructure</option>
        <option value="operations">Operations</option>
        <option value="governance">Governance</option>
        <option value="other">Other</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Architecture decision register"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} records</p>
</main>
