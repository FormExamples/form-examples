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

  let severityFilter = $state('');
  let familyFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (severityFilter === '' || r.severity === severityFilter) &&
        (familyFilter === '' || String(r.familyHistoryFlag) === familyFilter)
    )
  );

  // SVAR DataGrid columns. The lowest standardised score and the overall
  // severity render through the shared engine output so the dashboard and
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
      id: 'lowestScore',
      header: 'Lowest score',
      sortable: true,
      format: fmt((v: number | null) => (v === null || v === undefined ? '—' : String(v)))
    },
    {
      id: 'severity',
      header: 'Severity',
      sortable: true,
      format: fmt((v: string) => severityLabel(v as never))
    },
    {
      id: 'familyHistoryFlag',
      header: 'Family history',
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
    goto(`/dyslexia-assessment/dyslexia-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Dyslexia clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Lowest standardised score and overall dyslexia severity for assessed patients, computed by
        the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a href="/dyslexia-assessment/dyslexia-assessments/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Severity</span>
      <select class="select inline-block w-auto" bind:value={severityFilter}>
        <option value="">All</option>
        <option value="none">No dyslexia</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Family history</span>
      <select class="select inline-block w-auto" bind:value={familyFilter}>
        <option value="">All</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Dyslexia clinician dashboard"
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
