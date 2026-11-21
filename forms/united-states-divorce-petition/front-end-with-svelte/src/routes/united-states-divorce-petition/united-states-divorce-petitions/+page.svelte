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
  import { samplePetitionRows } from '#lib/data/sample-reports.js';
  import { readinessClassLabel } from '#lib/engine/utils.js';

  let readinessFilter = $state('');

  const rows = $derived(
    samplePetitionRows.filter((r) => readinessFilter === '' || r.readinessClass === readinessFilter)
  );

  // SVAR DataGrid columns. Readiness class and the earliest decree date render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Petition' },
    { id: 'petitionerName', header: 'Petitioner', sortable: true },
    { id: 'respondentName', header: 'Respondent', sortable: true },
    { id: 'state', header: 'State', sortable: true },
    { id: 'caseType', header: 'Case type', sortable: true },
    { id: 'filedDate', header: 'Filed', sortable: true },
    {
      id: 'readinessClass',
      header: 'Readiness',
      sortable: true,
      format: fmt((v: string) => readinessClassLabel(v as never))
    },
    { id: 'earliestDecreeDate', header: 'Earliest decree', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'petitionerName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/united-states-divorce-petition/united-states-divorce-petitions/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Divorce petitions dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Readiness class, earliest permitted decree date, and flag counts for petitions, computed by
        the shared engine. Select a row to open the petition. This dashboard classifies only; it
        gives no legal advice and the court decides.
      </p>
    </div>
    <a
      href="/united-states-divorce-petition/united-states-divorce-petitions/new"
      class="button"
      data-variant="primary"
    >
      New petition
    </a>
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Readiness</span>
      <select class="select inline-block w-auto" bind:value={readinessFilter}>
        <option value="">All</option>
        <option value="ready-to-file">Ready to file</option>
        <option value="incomplete">Incomplete</option>
        <option value="not-yet-eligible">Not yet eligible</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Divorce petitions dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} petitions</p>
</main>
