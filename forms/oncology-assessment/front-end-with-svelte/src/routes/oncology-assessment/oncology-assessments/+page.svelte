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
  import { cancerTypeLabel, stageLabel, responseAssessmentLabel } from '#lib/engine/utils.js';

  let ecogFilter = $state('');
  let cancerTypeFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (ecogFilter === '' || String(r.ecogGrade) === ecogFilter) &&
        (cancerTypeFilter === '' || r.cancerType === cancerTypeFilter)
    )
  );

  // SVAR DataGrid columns. The ECOG performance status, stage and treatment
  // response render through the shared engine output so the dashboard and
  // report stay aligned.
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
      id: 'ecogGrade',
      header: 'ECOG',
      sortable: true,
      format: fmt((v: number) => `ECOG ${v}`)
    },
    {
      id: 'cancerType',
      header: 'Cancer type',
      sortable: true,
      format: fmt((v: string) => cancerTypeLabel(v))
    },
    {
      id: 'overallStage',
      header: 'Stage',
      sortable: true,
      format: fmt((v: string) => stageLabel(v))
    },
    {
      id: 'responseAssessment',
      header: 'Response',
      sortable: true,
      format: fmt((v: string) => responseAssessmentLabel(v))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/oncology-assessment/oncology-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Oncology clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        ECOG performance status, cancer type, stage and treatment response for assessed patients,
        computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a href="/oncology-assessment/oncology-assessments/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">ECOG grade</span>
      <select class="select inline-block w-auto" bind:value={ecogFilter}>
        <option value="">All</option>
        <option value="0">ECOG 0</option>
        <option value="1">ECOG 1</option>
        <option value="2">ECOG 2</option>
        <option value="3">ECOG 3</option>
        <option value="4">ECOG 4</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Cancer type</span>
      <select class="select inline-block w-auto" bind:value={cancerTypeFilter}>
        <option value="">All</option>
        <option value="breast">Breast</option>
        <option value="lung">Lung</option>
        <option value="colorectal">Colorectal</option>
        <option value="pancreatic">Pancreatic</option>
        <option value="brain">Brain</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Oncology clinician dashboard"
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
