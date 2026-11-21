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
  import { gradeShortLabel, dispositionLabel } from '#lib/engine/utils.js';
  import type { ClavienDindoGradeKey, DispositionLocation } from '#lib/engine/types.js';

  let gradeFilter = $state('');
  let dispositionFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (gradeFilter === '' || r.overallGrade === gradeFilter) &&
        (dispositionFilter === '' || r.disposition === dispositionFilter)
    )
  );

  // SVAR DataGrid columns. The overall Clavien-Dindo grade, complication count,
  // and flag count render through the shared engine output so the dashboard and
  // report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Report' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'procedureName',
      header: 'Procedure',
      sortable: true
    },

    {
      id: 'surgeryDate',
      header: 'Surgery date',
      sortable: true
    },

    {
      id: 'overallGrade',
      header: 'Clavien-Dindo',
      sortable: true,
      format: fmt((v: ClavienDindoGradeKey) => `Grade ${gradeShortLabel(v) || '0'}`)
    },

    {
      id: 'complicationCount',
      header: 'Complications',
      sortable: true
    },

    {
      id: 'disposition',
      header: 'Disposition',
      sortable: true,
      format: fmt((v: DispositionLocation) => dispositionLabel(v))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/post-operative-report/post-operative-reports/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Post-operative clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Overall Clavien-Dindo grade, complication count, and disposition for reported operations,
        computed by the shared engine. Select a row to open the report.
      </p>
    </div>
    <a
      href="/post-operative-report/post-operative-reports/new"
      class="button"
      data-variant="primary">New report</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Clavien-Dindo grade</span>
      <select class="select inline-block w-auto" bind:value={gradeFilter}>
        <option value="">All</option>
        <option value="grade-0">Grade 0</option>
        <option value="grade-i">Grade I</option>
        <option value="grade-ii">Grade II</option>
        <option value="grade-iiia">Grade IIIa</option>
        <option value="grade-iiib">Grade IIIb</option>
        <option value="grade-iva">Grade IVa</option>
        <option value="grade-ivb">Grade IVb</option>
        <option value="grade-v">Grade V</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Disposition</span>
      <select class="select inline-block w-auto" bind:value={dispositionFilter}>
        <option value="">All</option>
        <option value="recovery">Recovery / PACU</option>
        <option value="ward">Surgical ward</option>
        <option value="hdu">High dependency unit</option>
        <option value="icu">Intensive care unit</option>
        <option value="theatre">Returned to theatre</option>
        <option value="home">Discharged home</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Post-operative clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} reports</p>
</main>
