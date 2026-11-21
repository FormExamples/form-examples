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
  import { severityBandLabel, ppsBandLabel } from '#lib/engine/utils.js';
  import type { SeverityBand } from '#lib/engine/types.js';

  let severityFilter = $state('');
  let ppsFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (severityFilter === '' || r.severityBand === severityFilter) &&
        (ppsFilter === '' || r.ppsBand === ppsFilter)
    )
  );

  // SVAR DataGrid columns. The ESAS-r total, severity band, and severe-symptom
  // count render through the shared engine output so the dashboard and report
  // stay aligned.
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
      id: 'esasTotal',
      header: 'ESAS-r total',
      sortable: true
    },

    {
      id: 'severityBand',
      header: 'Severity',
      sortable: true,
      format: fmt((v: string) => severityBandLabel(v as SeverityBand))
    },
    {
      id: 'ppsScore',
      header: 'PPS',
      sortable: true,
      format: fmt((v: number | null) => String(v ?? '—'))
    },
    { id: 'severeSymptomCount', header: 'Severe sx', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'esasTotal',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/palliative-assessment/palliative-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Palliative MDT dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        ESAS-r total, severity band, performance status, and safety flags for assessed patients,
        computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/palliative-assessment/palliative-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Severity</span>
      <select class="select inline-block w-auto" bind:value={severityFilter}>
        <option value="">All</option>
        <option value="none">{severityBandLabel('none')}</option>
        <option value="mild">{severityBandLabel('mild')}</option>
        <option value="moderate">{severityBandLabel('moderate')}</option>
        <option value="severe">{severityBandLabel('severe')}</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">PPS band</span>
      <select class="select inline-block w-auto" bind:value={ppsFilter}>
        <option value="">All</option>
        <option value="high">{ppsBandLabel('high')}</option>
        <option value="moderate">{ppsBandLabel('moderate')}</option>
        <option value="low">{ppsBandLabel('low')}</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Palliative MDT dashboard"
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
