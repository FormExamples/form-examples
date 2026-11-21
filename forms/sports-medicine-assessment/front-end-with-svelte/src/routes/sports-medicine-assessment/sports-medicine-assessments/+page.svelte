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
  import { clearanceLabel } from '#lib/engine/utils.js';

  let clearanceFilter = $state('');
  let contactFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (clearanceFilter === '' || r.clearance === clearanceFilter) &&
        (contactFilter === '' || r.contactLevel === contactFilter)
    )
  );

  const contactLabel: Record<string, string> = {
    low: 'Low',
    moderate: 'Moderate',
    high: 'High'
  };

  // SVAR DataGrid columns. The PPE clearance decision and the safety flags
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'athleteName', header: 'Athlete', sortable: true },
    { id: 'assessedDate', header: 'Assessed', sortable: true },
    { id: 'sport', header: 'Sport', sortable: true },
    {
      id: 'contactLevel',
      header: 'Contact',
      sortable: true,
      format: fmt((v: string) => contactLabel[v] ?? '—')
    },
    {
      id: 'clearance',
      header: 'Clearance',
      sortable: true,
      format: fmt((v: string) => clearanceLabel(v as never))
    },
    {
      id: 'concussionFlag',
      header: 'Concussion',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },

    {
      id: 'redSFlag',
      header: 'RED-S',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'athleteName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/sports-medicine-assessment/sports-medicine-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Sports medicine clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        PPE clearance decisions and safety flags for assessed athletes, computed by the shared
        engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/sports-medicine-assessment/sports-medicine-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Clearance</span>
      <select class="select inline-block w-auto" bind:value={clearanceFilter}>
        <option value="">All</option>
        <option value="cleared">Cleared</option>
        <option value="conditional">Cleared with Conditions</option>
        <option value="pending">Not Cleared Pending Further Evaluation</option>
        <option value="not-cleared">Not Cleared for Sport</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Contact level</span>
      <select class="select inline-block w-auto" bind:value={contactFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Sports medicine clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} athletes</p>
</main>
