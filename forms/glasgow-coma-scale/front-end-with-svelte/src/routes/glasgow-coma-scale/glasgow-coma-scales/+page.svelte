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
  import { severityBandLabel, settingLabel } from '#lib/engine/utils.js';

  let settingFilter = $state('');
  let bandFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (settingFilter === '' || r.setting === settingFilter) &&
        (bandFilter === '' || r.severityBand === bandFilter)
    )
  );

  // SVAR DataGrid columns. Total GCS, severity band, GCS-P, and the airway flag
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    {
      id: 'patientIdentifier',
      header: 'Patient ID',
      sortable: true
    },

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
      id: 'setting',
      header: 'Setting',
      sortable: true,
      format: fmt((v: string) => settingLabel(v as never) || '—')
    },
    { id: 'totalDisplay', header: 'GCS', sortable: true },
    {
      id: 'severityBand',
      header: 'Severity',
      sortable: true,
      format: fmt((v: string) => severityBandLabel(v as never))
    },
    { id: 'gcsP', header: 'GCS-P', sortable: true },
    {
      id: 'airwayFlag',
      header: 'Airway risk',
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
    goto(`/glasgow-coma-scale/glasgow-coma-scales/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">GCS clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Total GCS, severity band, GCS-Pupils, and airway risk for assessed patients, computed by the
        shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a href="/glasgow-coma-scale/glasgow-coma-scales/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={settingFilter}>
        <option value="">All</option>
        <option value="ed">Emergency department</option>
        <option value="neuro">Neuro / neurosurgical unit</option>
        <option value="critical-care">Critical care / HDU</option>
        <option value="pre-hospital">Pre-hospital / ambulance</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Severity</span>
      <select class="select inline-block w-auto" bind:value={bandFilter}>
        <option value="">All</option>
        <option value="mild">Mild (13-15)</option>
        <option value="moderate">Moderate (9-12)</option>
        <option value="severe">Severe (3-8)</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="GCS clinician dashboard"
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
