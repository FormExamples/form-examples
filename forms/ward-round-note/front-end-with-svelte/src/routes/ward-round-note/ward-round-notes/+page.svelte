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
  let wardFilter = $state('');

  const wards = $derived(
    Array.from(new Set(sampleAssessmentRows.map((r) => r.ward).filter(Boolean))).sort()
  );

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (statusFilter === '' || r.status === statusFilter) &&
        (wardFilter === '' || r.ward === wardFilter)
    )
  );

  // SVAR DataGrid columns. Completeness status, completeness percentage, and
  // the safety-flag counts render through the shared engine output so the
  // dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Note' },
    { id: 'patientIdentifier', header: 'Patient ID', sortable: true },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'ward', header: 'Ward', sortable: true },
    {
      id: 'reviewedDate',
      header: 'Reviewed',
      sortable: true
    },

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
    { id: 'highFlagCount', header: 'High flags', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/ward-round-note/ward-round-notes/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Ward round note dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Completeness status, completeness percentage, and safety flags for documented daily reviews,
        computed by the shared engine. Select a row to open the note.
      </p>
    </div>
    <a href="/ward-round-note/ward-round-notes/new" class="button" data-variant="primary"
      >New note</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Completeness</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="partial">Partial</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Ward</span>
      <select class="select inline-block w-auto" bind:value={wardFilter}>
        <option value="">All</option>
        {#each wards as w (w)}
          <option value={w}>{w}</option>
        {/each}
      </select>
    </label>
  </div>

  <DataGrid
    label="Ward round note dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} notes</p>
</main>
