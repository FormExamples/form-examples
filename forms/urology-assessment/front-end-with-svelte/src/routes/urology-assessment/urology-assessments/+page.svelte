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
  import { qolLabel } from '#lib/engine/utils.js';

  let severityFilter = $state('');
  let urgencyFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (severityFilter === '' || r.ipssCategory === severityFilter) &&
        (urgencyFilter === '' || r.urgency === urgencyFilter)
    )
  );

  // SVAR DataGrid columns. The IPSS total, severity category, and quality of
  // life render through the shared engine output so the dashboard and report
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
      id: 'ipssScore',
      header: 'IPSS',
      sortable: true,
      format: fmt((v: number) => `${v}/35`)
    },

    {
      id: 'ipssCategory',
      header: 'Severity',
      sortable: true
    },

    {
      id: 'qolScore',
      header: 'Quality of life',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : qolLabel(v)))
    },
    {
      id: 'psa',
      header: 'PSA (ng/mL)',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : String(v)))
    },
    { id: 'urgency', header: 'Urgency', sortable: true },
    {
      id: 'hematuriaFlag',
      header: 'Haematuria',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'ipssScore',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/urology-assessment/urology-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Urology clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        IPSS score, symptom severity, and quality of life for assessed patients, computed by the
        shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a href="/urology-assessment/urology-assessments/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Severity</span>
      <select class="select inline-block w-auto" bind:value={severityFilter}>
        <option value="">All</option>
        <option value="Mild">Mild</option>
        <option value="Moderate">Moderate</option>
        <option value="Severe">Severe</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Referral urgency</span>
      <select class="select inline-block w-auto" bind:value={urgencyFilter}>
        <option value="">All</option>
        <option value="routine">Routine</option>
        <option value="urgent">Urgent</option>
        <option value="emergency">Emergency</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Urology clinician dashboard"
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
