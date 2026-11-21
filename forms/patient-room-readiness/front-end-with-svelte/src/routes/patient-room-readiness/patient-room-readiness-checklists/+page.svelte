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

  let search = $state('');
  let readinessFilter = $state<'' | 'ready' | 'not-ready'>('');

  function isReady(row: { checkedCount: number; totalCount: number }): boolean {
    return row.checkedCount === row.totalCount;
  }

  const rows = $derived(
    sampleAssessmentRows.filter((r) => {
      if (search) {
        const term = search.toLowerCase();
        const matches =
          r.buildingNameOrNumber.toLowerCase().includes(term) ||
          r.roomNameOrNumber.toLowerCase().includes(term) ||
          r.inspectorName.toLowerCase().includes(term);
        if (!matches) return false;
      }
      if (readinessFilter === 'ready' && !isReady(r)) return false;
      if (readinessFilter === 'not-ready' && isReady(r)) return false;
      return true;
    })
  );

  // SVAR DataGrid columns. Checked/total both render through the shared
  // tally output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Checklist' },
    {
      id: 'buildingNameOrNumber',
      header: 'Building',
      sortable: true
    },

    {
      id: 'roomNameOrNumber',
      header: 'Room',
      sortable: true
    },

    {
      id: 'assessedDate',
      header: 'Inspected',
      sortable: true
    },

    {
      id: 'checkedCount',
      header: 'Checkpoints',
      sortable: true,
      format: fmt((v: number, row: DataGridRow) => `${v} / ${row.totalCount}`)
    },
    { id: 'inspectorName', header: 'Inspector', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'assessedDate',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/patient-room-readiness/patient-room-readiness-checklists/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Housekeeping dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Room-readiness checklists by building, room, checkpoint completeness, and inspector. Select
        a row to open the checklist.
      </p>
    </div>
    <a
      href="/patient-room-readiness/patient-room-readiness-checklists/new"
      class="button"
      data-variant="primary">New checklist</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Search</span>
      <input
        type="search"
        class="search-input inline-block w-auto"
        placeholder="Building, room, or inspector…"
        bind:value={search}
      />
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Readiness</span>
      <select class="select inline-block w-auto" bind:value={readinessFilter}>
        <option value="">All rooms</option>
        <option value="ready">Fully ready (25/25)</option>
        <option value="not-ready">Needs attention</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Housekeeping dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} rooms</p>
</main>
