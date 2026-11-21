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
  import { sampleLpaRows } from '#lib/data/sample-reports.js';
  import { validityStatusLabel } from '#lib/engine/utils.js';

  const plural = 'united-kingdom-lasting-powers-of-attorney-for-health-and-care-decisions';

  let statusFilter = $state('');
  let jurisdictionFilter = $state('');

  const rows = $derived(
    sampleLpaRows.filter(
      (r) =>
        (statusFilter === '' || r.validityStatus === statusFilter) &&
        (jurisdictionFilter === '' || r.jurisdiction === jurisdictionFilter)
    )
  );

  const capitalize = (v: string) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : '—');

  const decisionRuleLabel = (v: string) =>
    v === 'jointly-and-severally'
      ? 'Jointly & severally'
      : v === 'jointly'
        ? 'Jointly'
        : v === 'mixed'
          ? 'Mixed'
          : '—';

  // SVAR DataGrid columns. Validity status and completeness render through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Reference', sortable: true },
    { id: 'donorName', header: 'Donor', sortable: true },
    {
      id: 'jurisdiction',
      header: 'Jurisdiction',
      sortable: true,
      format: fmt((v: string) => capitalize(v))
    },

    {
      id: 'attorneyCount',
      header: 'Attorneys',
      sortable: true
    },

    {
      id: 'decisionRule',
      header: 'Decision rule',
      format: fmt((v: string) => decisionRuleLabel(v))
    },
    {
      id: 'validityStatus',
      header: 'Validity',
      sortable: true,
      format: fmt((v: string) => validityStatusLabel(v as never))
    },
    {
      id: 'completenessScore',
      header: 'Complete',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'id',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">LP1H case-worker dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Statutory validity and completeness for LP1H applications, computed by the shared engine.
        Select a row to open the application.
      </p>
    </div>
    <a
      href="/united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions/{plural}/new"
      class="button"
      data-variant="primary">New application</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Validity</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="ready-to-register">Ready to register</option>
        <option value="needs-correction">Needs correction</option>
        <option value="invalid">Invalid</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Jurisdiction</span>
      <select class="select inline-block w-auto" bind:value={jurisdictionFilter}>
        <option value="">All</option>
        <option value="england">England</option>
        <option value="wales">Wales</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="LP1H case-worker dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} applications</p>
</main>
