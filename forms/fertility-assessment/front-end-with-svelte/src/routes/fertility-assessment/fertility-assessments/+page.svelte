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
  import { concernLevelLabel, recommendationLabel } from '#lib/engine/utils.js';

  let concernFilter = $state('');
  let recommendationFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (concernFilter === '' || r.concernLevel === concernFilter) &&
        (recommendationFilter === '' || r.recommendation === recommendationFilter)
    )
  );

  // SVAR DataGrid columns. The concern level and score render through the
  // shared engine output so the dashboard and report stay aligned.
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
      id: 'concernLevel',
      header: 'Concern',
      sortable: true,
      format: fmt((v: string) => concernLevelLabel(v as never))
    },
    { id: 'concernScore', header: 'Score', sortable: true },
    {
      id: 'semenAnalysisDone',
      header: 'Semen analysis',
      format: fmt((v: boolean) => (v ? 'Done' : 'Pending'))
    },
    {
      id: 'recommendation',
      header: 'Recommendation',
      format: fmt((v: string) => recommendationLabel(v) || '—')
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/fertility-assessment/fertility-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Fertility clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        NICE CG156 concern level and score for assessed patients, computed by the shared engine.
        Select a row to open the assessment.
      </p>
    </div>
    <a href="/fertility-assessment/fertility-assessments/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Concern level</span>
      <select class="select inline-block w-auto" bind:value={concernFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Recommendation</span>
      <select class="select inline-block w-auto" bind:value={recommendationFilter}>
        <option value="">All</option>
        <option value="continue-attempts">Continue attempts</option>
        <option value="lifestyle-optimisation">Lifestyle optimisation</option>
        <option value="targeted-treatment">Targeted medical treatment</option>
        <option value="specialist-referral">Specialist referral</option>
        <option value="art-referral">ART (IVF/ICSI) referral</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Fertility clinician dashboard"
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
