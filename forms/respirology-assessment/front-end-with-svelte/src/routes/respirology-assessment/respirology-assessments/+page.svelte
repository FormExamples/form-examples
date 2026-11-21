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

  let gradeFilter = $state('');
  let oxygenFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (gradeFilter === '' || String(r.mrcGrade) === gradeFilter) &&
        (oxygenFilter === '' || (oxygenFilter === 'yes' ? r.oxygenFlag : !r.oxygenFlag))
    )
  );

  // SVAR DataGrid columns. The MRC dyspnoea grade and severity render through
  // the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'mrcGrade',
      header: 'MRC grade',
      sortable: true,
      format: fmt((v: number) => `MRC ${v}`)
    },
    { id: 'severity', header: 'Severity', sortable: true },
    {
      id: 'oxygenFlag',
      header: 'Oxygen',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },

    {
      id: 'allergyFlag',
      header: 'Allergy',
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
    goto(`/respirology-assessment/respirology-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Respirology clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        MRC dyspnoea grade and severity for assessed patients, computed by the shared engine. Select
        a row to open the assessment.
      </p>
    </div>
    <a
      href="/respirology-assessment/respirology-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">MRC grade</span>
      <select class="select inline-block w-auto" bind:value={gradeFilter}>
        <option value="">All</option>
        <option value="1">MRC 1</option>
        <option value="2">MRC 2</option>
        <option value="3">MRC 3</option>
        <option value="4">MRC 4</option>
        <option value="5">MRC 5</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Oxygen therapy</span>
      <select class="select inline-block w-auto" bind:value={oxygenFilter}>
        <option value="">All</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Respirology clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>
