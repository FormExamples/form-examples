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
  import { asrsClassificationLabel, adhdSubtypeLabel } from '#lib/engine/utils.js';

  let classificationFilter = $state('');
  let subtypeFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (classificationFilter === '' || r.classification === classificationFilter) &&
        (subtypeFilter === '' || r.subtype === subtypeFilter)
    )
  );

  // SVAR DataGrid columns. The ASRS total, classification, and predominant
  // presentation render through the shared engine output so the dashboard and
  // report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'assessedDate', header: 'Assessed', sortable: true },
    { id: 'asrsTotal', header: 'ASRS /72', sortable: true },
    {
      id: 'partAScreenerPositive',
      header: 'Part A screen',
      format: fmt((v: boolean) => (v ? 'Positive' : 'Negative'))
    },
    {
      id: 'classification',
      header: 'Classification',
      sortable: true,
      format: fmt((v: string) => asrsClassificationLabel(v))
    },
    {
      id: 'subtype',
      header: 'Presentation',
      sortable: true,
      format: fmt((v: string) => adhdSubtypeLabel(v as never))
    },
    {
      id: 'comorbidityFlag',
      header: 'Comorbid',
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
    goto(`/attention-deficit-assessment/attention-deficit-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">ADHD screening clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        ASRS total, ADHD classification, and predominant presentation for screened patients,
        computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/attention-deficit-assessment/attention-deficit-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Classification</span>
      <select class="select inline-block w-auto" bind:value={classificationFilter}>
        <option value="">All</option>
        <option value="unlikely">Unlikely ADHD</option>
        <option value="possible">Possible ADHD</option>
        <option value="likely">Likely ADHD</option>
        <option value="highly-likely">Highly Likely ADHD</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Presentation</span>
      <select class="select inline-block w-auto" bind:value={subtypeFilter}>
        <option value="">All</option>
        <option value="inattentive">Predominantly Inattentive</option>
        <option value="hyperactive-impulsive">Predominantly Hyperactive-Impulsive</option>
        <option value="combined">Combined Presentation</option>
        <option value="unspecified">Unspecified</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="ADHD screening clinician dashboard"
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
