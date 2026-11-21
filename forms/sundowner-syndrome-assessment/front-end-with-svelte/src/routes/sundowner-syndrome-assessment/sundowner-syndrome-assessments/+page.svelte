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
  import type { Severity } from '#lib/engine/types.js';

  let severityFilter = $state('');
  let cmaiBandFilter = $state('');

  // CMAI severity bands, matching the engine thresholds.
  function cmaiBand(score: number): string {
    if (score > 120) return 'critical';
    if (score >= 76) return 'severe';
    if (score >= 46) return 'moderate';
    return 'mild';
  }

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (severityFilter === '' || r.severity === severityFilter) &&
        (cmaiBandFilter === '' || cmaiBand(r.cmaiScore) === cmaiBandFilter)
    )
  );

  // SVAR DataGrid columns. CMAI / NPI totals, severity band, and flag counts
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
      id: 'severity',
      header: 'Severity',
      sortable: true,
      format: fmt((v: string) => severityLabel(v as Severity))
    },
    { id: 'cmaiScore', header: 'CMAI (/203)', sortable: true },
    { id: 'npiScore', header: 'NPI (/144)', sortable: true },
    { id: 'highPriorityFlags', header: 'High flags', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/sundowner-syndrome-assessment/sundowner-syndrome-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Sundowner clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        CMAI / NPI totals and severity band for assessed patients, computed by the shared engine.
        Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/sundowner-syndrome-assessment/sundowner-syndrome-assessments/new"
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
      <span class="mr-2 font-medium text-base-content/80">CMAI band</span>
      <select class="select inline-block w-auto" bind:value={cmaiBandFilter}>
        <option value="">All</option>
        <option value="mild">Mild (29-45)</option>
        <option value="moderate">Moderate (46-75)</option>
        <option value="severe">Severe (76-120)</option>
        <option value="critical">Critical (>120)</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Sundowner clinician dashboard"
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
