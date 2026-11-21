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
  import { interpretationBandLabel, settingLabel } from '#lib/engine/utils.js';

  let settingFilter = $state('');
  let bandFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (settingFilter === '' || r.setting === settingFilter) &&
        (bandFilter === '' || r.interpretationBand === bandFilter)
    )
  );

  // SVAR DataGrid columns. Total score, interpretation band, and the delirium
  // flag render through the shared engine output so the dashboard and report
  // stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    {
      id: 'patientIdentifier',
      header: 'Patient ID',
      sortable: true
    },

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
      id: 'setting',
      header: 'Setting',
      sortable: true,
      format: fmt((v: string) => settingLabel(v as never) || '—')
    },
    { id: 'totalScore', header: '4AT', sortable: true },
    {
      id: 'interpretationBand',
      header: 'Interpretation',
      sortable: true,
      format: fmt((v: string) => interpretationBandLabel(v as never))
    },
    {
      id: 'deliriumFlag',
      header: 'Delirium flag',
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
    goto(`/four-a-test-for-delirium/four-a-test-for-deliriums/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">4AT clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        4AT total, interpretation band, and delirium flag for assessed patients, computed by the
        shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/four-a-test-for-delirium/four-a-test-for-deliriums/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Setting</span>
      <select class="select inline-block w-auto" bind:value={settingFilter}>
        <option value="">All</option>
        <option value="acute">Acute medical admission</option>
        <option value="ed">Emergency department</option>
        <option value="periop">Peri-operative / post-operative</option>
        <option value="careHome">Care home</option>
        <option value="community">Community</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Interpretation band</span>
      <select class="select inline-block w-auto" bind:value={bandFilter}>
        <option value="">All</option>
        <option value="unlikely">Delirium unlikely (0)</option>
        <option value="possibleCognitiveImpairment">Possible cognitive impairment (1-3)</option>
        <option value="possibleDelirium">Possible delirium (4+)</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="4AT clinician dashboard"
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
