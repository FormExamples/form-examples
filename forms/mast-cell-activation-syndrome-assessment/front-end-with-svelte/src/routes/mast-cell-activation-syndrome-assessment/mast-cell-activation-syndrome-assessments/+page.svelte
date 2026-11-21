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

  let categoryFilter = $state('');
  let anaphylaxisFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (categoryFilter === '' || r.mcasCategory === categoryFilter) &&
        (anaphylaxisFilter === '' || String(r.anaphylaxisFlag) === anaphylaxisFilter)
    )
  );

  // SVAR DataGrid columns. The MCAS Symptom Score, burden category, and organ
  // systems affected render through the shared engine output so the dashboard
  // and report stay aligned.
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
      header: 'MCAS score',
      sortable: true,
      format: fmt((v: number) => `${v}/40`)
    },
    { id: 'mcasCategory', header: 'Burden', sortable: true },
    {
      id: 'organSystemsAffected',
      header: 'Systems',
      sortable: true
    },

    {
      id: 'tryptaseLevel',
      header: 'Tryptase',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : `${v} ng/mL`))
    },
    {
      id: 'anaphylaxisFlag',
      header: 'Anaphylaxis',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'symptomScore',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(
      `/mast-cell-activation-syndrome-assessment/mast-cell-activation-syndrome-assessments/${id}`
    );
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">MCAS clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        MCAS Symptom Score, burden category, and organ systems affected for assessed patients,
        computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/mast-cell-activation-syndrome-assessment/mast-cell-activation-syndrome-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Burden</span>
      <select class="select inline-block w-auto" bind:value={categoryFilter}>
        <option value="">All</option>
        <option value="Minimal">Minimal</option>
        <option value="Mild">Mild</option>
        <option value="Moderate">Moderate</option>
        <option value="Severe">Severe</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Anaphylaxis risk</span>
      <select class="select inline-block w-auto" bind:value={anaphylaxisFilter}>
        <option value="">All</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="MCAS clinician dashboard"
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
