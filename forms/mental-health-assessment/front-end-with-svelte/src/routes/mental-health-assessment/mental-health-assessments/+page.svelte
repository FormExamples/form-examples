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
  import { severityLabel } from '#lib/engine/utils.js';

  let phq9Filter = $state('');
  let gad7Filter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (phq9Filter === '' || r.phq9Severity === phq9Filter) &&
        (gad7Filter === '' || r.gad7Severity === gad7Filter)
    )
  );

  // SVAR DataGrid columns. PHQ-9 / GAD-7 scores and severity bands render
  // through the shared engine output so the dashboard and report stay aligned.
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
      id: 'phq9Score',
      header: 'PHQ-9',
      sortable: true,
      format: fmt((v: number) => `${v}/27`)
    },
    {
      id: 'phq9Severity',
      header: 'Depression',
      sortable: true,
      format: fmt((v: string) => severityLabel(v))
    },
    {
      id: 'gad7Score',
      header: 'GAD-7',
      sortable: true,
      format: fmt((v: number) => `${v}/21`)
    },
    {
      id: 'gad7Severity',
      header: 'Anxiety',
      sortable: true,
      format: fmt((v: string) => severityLabel(v))
    },
    {
      id: 'safetyFlag',
      header: 'Safety',
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
    goto(`/mental-health-assessment/mental-health-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Mental health clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        PHQ-9 depression and GAD-7 anxiety scores with severity bands for assessed patients,
        computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/mental-health-assessment/mental-health-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Depression (PHQ-9)</span>
      <select class="select inline-block w-auto" bind:value={phq9Filter}>
        <option value="">All</option>
        <option value="minimal">Minimal</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="moderately-severe">Moderately Severe</option>
        <option value="severe">Severe</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Anxiety (GAD-7)</span>
      <select class="select inline-block w-auto" bind:value={gad7Filter}>
        <option value="">All</option>
        <option value="minimal">Minimal</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Mental health clinician dashboard"
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
