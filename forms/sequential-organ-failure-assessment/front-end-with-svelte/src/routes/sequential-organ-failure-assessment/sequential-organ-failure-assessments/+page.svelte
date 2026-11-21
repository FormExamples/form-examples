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
  import { mortalityBandLabel, careLocationLabel } from '#lib/engine/utils.js';

  let locationFilter = $state('');
  let bandFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (locationFilter === '' || r.careLocation === locationFilter) &&
        (bandFilter === '' || r.mortalityBand === bandFilter)
    )
  );

  // SVAR DataGrid columns. Total SOFA, delta-SOFA, mortality band, and Sepsis-3
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
      id: 'careLocation',
      header: 'Location',
      sortable: true,
      format: fmt((v: string) => careLocationLabel(v as never) || '—')
    },

    {
      id: 'totalSofa',
      header: 'Total SOFA',
      sortable: true
    },

    {
      id: 'deltaSofa',
      header: 'Delta',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : `${v >= 0 ? '+' : ''}${v}`))
    },
    {
      id: 'mortalityBand',
      header: 'Mortality band',
      sortable: true,
      format: fmt((v: string) => mortalityBandLabel(v as never))
    },
    {
      id: 'sepsis3',
      header: 'Sepsis-3',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'totalSofa',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/sequential-organ-failure-assessment/sequential-organ-failure-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">SOFA clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Total SOFA, delta-SOFA, mortality band, and Sepsis-3 status for assessed patients, computed
        by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/sequential-organ-failure-assessment/sequential-organ-failure-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care location</span>
      <select class="select inline-block w-auto" bind:value={locationFilter}>
        <option value="">All</option>
        <option value="icu">Intensive care unit</option>
        <option value="hdu">High-dependency unit</option>
        <option value="critical-care-outreach">Critical-care outreach</option>
        <option value="acute-medical-unit">Acute medical unit</option>
        <option value="emergency-department">Emergency department</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Mortality band</span>
      <select class="select inline-block w-auto" bind:value={bandFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
        <option value="veryHigh">Very high</option>
        <option value="extreme">Extreme</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="SOFA clinician dashboard"
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
