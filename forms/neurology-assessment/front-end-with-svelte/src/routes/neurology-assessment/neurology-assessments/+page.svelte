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

  let severityFilter = $state('');
  let anticoagFilter = $state('');

  /** Map a NIHSS total score to a severity band key. */
  function band(score: number): string {
    if (score === 0) return 'none';
    if (score <= 4) return 'minor';
    if (score <= 15) return 'moderate';
    if (score <= 20) return 'moderate-severe';
    return 'severe';
  }

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (severityFilter === '' || band(r.nihssScore) === severityFilter) &&
        (anticoagFilter === '' || (anticoagFilter === 'yes') === r.anticoagulantFlag)
    )
  );

  // SVAR DataGrid columns. The NIHSS score and severity render through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'assessedDate', header: 'Assessed', sortable: true },
    { id: 'nihssScore', header: 'NIHSS', sortable: true },
    {
      id: 'nihssSeverity',
      header: 'Severity',
      sortable: true
    },

    {
      id: 'mrsScore',
      header: 'mRS',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : String(v)))
    },
    {
      id: 'anticoagulantFlag',
      header: 'Anticoag.',
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
    goto(`/neurology-assessment/neurology-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Neurology clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        NIHSS score and severity band for assessed patients, computed by the shared engine. Select a
        row to open the assessment.
      </p>
    </div>
    <a href="/neurology-assessment/neurology-assessments/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">NIHSS severity</span>
      <select class="select inline-block w-auto" bind:value={severityFilter}>
        <option value="">All</option>
        <option value="none">No stroke symptoms</option>
        <option value="minor">Minor (1–4)</option>
        <option value="moderate">Moderate (5–15)</option>
        <option value="moderate-severe">Moderate to severe (16–20)</option>
        <option value="severe">Severe (21–42)</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Anticoagulant</span>
      <select class="select inline-block w-auto" bind:value={anticoagFilter}>
        <option value="">All</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Neurology clinician dashboard"
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
