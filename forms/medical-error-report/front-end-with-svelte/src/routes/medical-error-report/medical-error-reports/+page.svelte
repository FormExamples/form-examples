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
  import { whoSeverityLabel, riskLevelLabel, errorTypeLabel } from '#lib/engine/utils.js';

  let riskFilter = $state('');
  let severityFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (riskFilter === '' || r.riskLevel === riskFilter) &&
        (severityFilter === '' || r.whoSeverity === severityFilter)
    )
  );

  // SVAR DataGrid columns. WHO severity and the overall risk render through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Report' },
    {
      id: 'incidentRef',
      header: 'Incident',
      sortable: true
    },

    {
      id: 'reportedDate',
      header: 'Reported',
      sortable: true
    },

    {
      id: 'errorType',
      header: 'Error type',
      sortable: true,
      format: fmt((v: string) => errorTypeLabel(v))
    },
    {
      id: 'whoSeverity',
      header: 'WHO severity',
      sortable: true,
      format: fmt((v: string) => whoSeverityLabel(v as never))
    },
    {
      id: 'riskLevel',
      header: 'Overall risk',
      sortable: true,
      format: fmt((v: string) => riskLevelLabel(v as never))
    },

    {
      id: 'harmFlag',
      header: 'Harm',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },

    {
      id: 'dutyOfCandourFlag',
      header: 'DoC due',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'reportedDate',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/medical-error-report/medical-error-reports/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Patient-safety dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        WHO severity and overall risk for reported incidents, computed by the shared engine. Select
        a row to open the report.
      </p>
    </div>
    <a href="/medical-error-report/medical-error-reports/new" class="button" data-variant="primary"
      >New report</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Overall risk</span>
      <select class="select inline-block w-auto" bind:value={riskFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">WHO severity</span>
      <select class="select inline-block w-auto" bind:value={severityFilter}>
        <option value="">All</option>
        <option value="near-miss">Near Miss</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
        <option value="critical">Critical</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Patient-safety dashboard"
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
