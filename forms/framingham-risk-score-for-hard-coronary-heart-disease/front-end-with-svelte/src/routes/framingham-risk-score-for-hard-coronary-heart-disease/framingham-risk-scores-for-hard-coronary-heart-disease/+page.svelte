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
  import { riskLevelLabel } from '#lib/engine/utils.js';

  const plural = 'framingham-risk-scores-for-hard-coronary-heart-disease';

  let riskFilter = $state('');
  let smokingFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (riskFilter === '' || r.riskCategory === riskFilter) &&
        (smokingFilter === '' || r.smokingStatus === smokingFilter)
    )
  );

  const smokingLabel: Record<string, string> = {
    current: 'Current',
    former: 'Former',
    never: 'Never',
    '': '—'
  };

  // SVAR DataGrid columns. The 10-year risk percentage and risk category render
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
      id: 'riskPercent',
      header: '10-yr risk',
      sortable: true,
      format: fmt((v: number) => `${v.toFixed(1)} %`)
    },
    {
      id: 'riskCategory',
      header: 'Category',
      sortable: true,
      format: fmt((v: string) => riskLevelLabel(v))
    },
    {
      id: 'smokingStatus',
      header: 'Smoking',
      sortable: true,
      format: fmt((v: string) => smokingLabel[v] ?? '—')
    },

    {
      id: 'onStatinFlag',
      header: 'On statin',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'riskPercent',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/framingham-risk-score-for-hard-coronary-heart-disease/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Framingham risk clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        10-year hard CHD risk percentage and risk category for assessed patients, computed by the
        shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/framingham-risk-score-for-hard-coronary-heart-disease/{plural}/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Risk category</span>
      <select class="select inline-block w-auto" bind:value={riskFilter}>
        <option value="">All</option>
        <option value="low">Low Risk</option>
        <option value="intermediate">Intermediate Risk</option>
        <option value="high">High Risk</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Smoking status</span>
      <select class="select inline-block w-auto" bind:value={smokingFilter}>
        <option value="">All</option>
        <option value="current">Current</option>
        <option value="former">Former</option>
        <option value="never">Never</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Framingham risk clinician dashboard"
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
