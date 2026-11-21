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
  import { severityLabel, asrmStageShort, ehp30Label } from '#lib/engine/utils.js';
  import type { SeverityLevel } from '#lib/engine/types.js';

  let severityFilter = $state('');
  let stageFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (severityFilter === '' || r.overallSeverity === severityFilter) &&
        (stageFilter === '' || String(r.asrmStage ?? '') === stageFilter)
    )
  );

  // SVAR DataGrid columns. The ASRM stage, EHP-30 score, and overall severity
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
      id: 'asrmStage',
      header: 'ASRM stage',
      sortable: true,
      format: fmt((v: number | null) => asrmStageShort((v as 1 | 2 | 3 | 4) ?? null))
    },
    { id: 'asrmPoints', header: 'Points', sortable: true },
    {
      id: 'ehp30Score',
      header: 'EHP-30',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : `${v} (${ehp30Label(v)})`))
    },
    {
      id: 'overallSeverity',
      header: 'Severity',
      sortable: true,
      format: fmt((v: string) => severityLabel(v as SeverityLevel))
    },
    {
      id: 'infertilityFlag',
      header: 'Infertility',
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
    goto(`/endometriosis-assessment/endometriosis-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Endometriosis clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        ASRM stage, EHP-30 quality-of-life score, and overall severity for assessed patients,
        computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/endometriosis-assessment/endometriosis-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Severity</span>
      <select class="select inline-block w-auto" bind:value={severityFilter}>
        <option value="">All</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
        <option value="critical">Critical</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">ASRM stage</span>
      <select class="select inline-block w-auto" bind:value={stageFilter}>
        <option value="">All</option>
        <option value="1">Stage I</option>
        <option value="2">Stage II</option>
        <option value="3">Stage III</option>
        <option value="4">Stage IV</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Endometriosis clinician dashboard"
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
