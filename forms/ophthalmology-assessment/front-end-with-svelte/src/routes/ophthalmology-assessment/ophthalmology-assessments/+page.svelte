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
  import { vaGradeShortLabel } from '#lib/engine/utils.js';

  let gradeFilter = $state('');
  let eyeFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (gradeFilter === '' || r.vaGrade === gradeFilter) &&
        (eyeFilter === '' || r.affectedEye === eyeFilter)
    )
  );

  // SVAR DataGrid columns. The visual acuity grade, IOP status and flag count
  // render through the shared engine output so the dashboard and report stay
  // aligned.
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
      id: 'vaGrade',
      header: 'VA grade',
      sortable: true,
      format: fmt((v: string) => vaGradeShortLabel(v as never))
    },
    { id: 'affectedEye', header: 'Eye', sortable: true },
    { id: 'primaryCondition', header: 'Primary concern' },
    { id: 'iopStatus', header: 'IOP', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/ophthalmology-assessment/ophthalmology-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Ophthalmology clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Visual acuity grade, IOP status and safety flags for assessed patients, computed by the
        shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/ophthalmology-assessment/ophthalmology-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">VA grade</span>
      <select class="select inline-block w-auto" bind:value={gradeFilter}>
        <option value="">All</option>
        <option value="normal">Normal</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
        <option value="blindness">Blindness</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Affected eye</span>
      <select class="select inline-block w-auto" bind:value={eyeFilter}>
        <option value="">All</option>
        <option value="left">Left</option>
        <option value="right">Right</option>
        <option value="both">Both</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Ophthalmology clinician dashboard"
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
