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
  import { menopausalStatusLabel } from '#lib/engine/utils.js';

  let categoryFilter = $state('');
  let menopausalFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (categoryFilter === '' || r.symptomCategory === categoryFilter) &&
        (menopausalFilter === '' || r.menopausalStatus === menopausalFilter)
    )
  );

  // SVAR DataGrid columns. The symptom severity score and category render
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
      id: 'symptomScore',
      header: 'Score',
      sortable: true,
      format: fmt((v: number) => `${v}/30`)
    },

    {
      id: 'symptomCategory',
      header: 'Severity',
      sortable: true
    },

    {
      id: 'menopausalStatus',
      header: 'Menopausal',
      sortable: true,
      format: fmt((v: string) => menopausalStatusLabel(v) || '—')
    },
    {
      id: 'screeningOverdueFlag',
      header: 'Screening',
      format: fmt((v: boolean) => (v ? 'Overdue' : 'Up to date'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/gynecology-assessment/gynecology-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Gynecology clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Symptom severity score and category for assessed patients, computed by the shared engine.
        Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/gynecology-assessment/gynecology-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Severity</span>
      <select class="select inline-block w-auto" bind:value={categoryFilter}>
        <option value="">All</option>
        <option value="Minimal">Minimal</option>
        <option value="Mild">Mild</option>
        <option value="Moderate">Moderate</option>
        <option value="Severe">Severe</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Menopausal status</span>
      <select class="select inline-block w-auto" bind:value={menopausalFilter}>
        <option value="">All</option>
        <option value="pre-menopausal">Pre-menopausal</option>
        <option value="peri-menopausal">Peri-menopausal</option>
        <option value="post-menopausal">Post-menopausal</option>
        <option value="unknown">Unknown</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Gynecology clinician dashboard"
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
