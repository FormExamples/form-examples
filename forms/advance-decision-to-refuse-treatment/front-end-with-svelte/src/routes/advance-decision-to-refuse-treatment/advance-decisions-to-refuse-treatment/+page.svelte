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
  import { validityStatusLabel } from '#lib/engine/utils.js';

  let statusFilter = $state('');
  let lifeSustainingFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (statusFilter === '' || r.validityStatus === statusFilter) &&
        (lifeSustainingFilter === '' ||
          (lifeSustainingFilter === 'yes' ? r.lifeSustainingRefusal : !r.lifeSustainingRefusal))
    )
  );

  // SVAR DataGrid columns. The validity status renders through the shared
  // engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'ADRT' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'createdDate', header: 'Created', sortable: true },
    {
      id: 'validityStatus',
      header: 'Validity',
      sortable: true,
      format: fmt((v: string) => validityStatusLabel(v))
    },
    {
      id: 'lifeSustainingRefusal',
      header: 'Life-sustaining',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    {
      id: 'witnessed',
      header: 'Witnessed',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/advance-decision-to-refuse-treatment/advance-decisions-to-refuse-treatment/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">ADRT clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Legal validity status and life-sustaining / witness flags for recorded ADRTs, computed by
        the shared engine. Select a row to open the document.
      </p>
    </div>
    <a
      href="/advance-decision-to-refuse-treatment/advance-decisions-to-refuse-treatment/new"
      class="button"
      data-variant="primary">New ADRT</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Validity status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="draft">Draft</option>
        <option value="complete">Complete</option>
        <option value="valid">Valid</option>
        <option value="invalid">Invalid</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Life-sustaining refusal</span>
      <select class="select inline-block w-auto" bind:value={lifeSustainingFilter}>
        <option value="">All</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="ADRT clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} ADRTs</p>
</main>
