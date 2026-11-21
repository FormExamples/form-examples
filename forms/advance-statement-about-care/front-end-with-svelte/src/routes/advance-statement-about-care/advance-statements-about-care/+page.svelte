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
  import { completenessLevelLabel } from '#lib/engine/utils.js';

  let levelFilter = $state('');
  let witnessFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (levelFilter === '' || r.completenessLevel === levelFilter) &&
        (witnessFilter === '' || String(r.witnessed) === witnessFilter)
    )
  );

  // SVAR DataGrid columns. The completeness level, section counts, and flags
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Statement' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'nhsNumber', header: 'NHS number' },
    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'completenessLevel',
      header: 'Completeness',
      sortable: true,
      format: fmt((v: string) => completenessLevelLabel(v))
    },
    {
      id: 'completedCount',
      header: 'Sections',
      format: fmt((v: number, row: DataGridRow) => `${v} / ${row.totalCount}`)
    },
    {
      id: 'witnessed',
      header: 'Witnessed',
      sortable: true,
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'reviewDate', header: 'Review date', format: fmt((v: string) => v || '—') },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/advance-statement-about-care/advance-statements-about-care/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Advance statement clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Completeness level, section counts, and validity flags for recorded statements, computed by
        the shared engine. Select a row to open the statement.
      </p>
    </div>
    <a
      href="/advance-statement-about-care/advance-statements-about-care/new"
      class="button"
      data-variant="primary">New statement</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Completeness</span>
      <select class="select inline-block w-auto" bind:value={levelFilter}>
        <option value="">All</option>
        <option value="incomplete">Incomplete</option>
        <option value="partial">Partial</option>
        <option value="complete">Complete</option>
        <option value="verified">Verified</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Witnessed</span>
      <select class="select inline-block w-auto" bind:value={witnessFilter}>
        <option value="">All</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Advance statement clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} statements</p>
</main>
