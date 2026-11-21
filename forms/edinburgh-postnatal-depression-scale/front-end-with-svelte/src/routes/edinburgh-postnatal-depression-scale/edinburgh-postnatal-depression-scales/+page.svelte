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
  import { bandLabel, careSettingLabel } from '#lib/engine/utils.js';

  let settingFilter = $state('');
  let bandFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (settingFilter === '' || r.careSetting === settingFilter) &&
        (bandFilter === '' || r.band === bandFilter)
    )
  );

  // SVAR DataGrid columns. Total score, band, and self-harm render through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    {
      id: 'respondentIdentifier',
      header: 'Respondent ID',
      sortable: true
    },

    {
      id: 'respondentName',
      header: 'Respondent',
      sortable: true
    },

    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'careSetting',
      header: 'Setting',
      sortable: true,
      format: fmt((v: string) => careSettingLabel(v as never) || '—')
    },
    { id: 'totalScore', header: 'Total', sortable: true },
    {
      id: 'band',
      header: 'Band',
      sortable: true,
      format: fmt((v: string) => bandLabel(v as never))
    },
    {
      id: 'selfHarmFlag',
      header: 'Self-harm',
      format: fmt((v: boolean) => (v ? 'FLAG' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'respondentName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/edinburgh-postnatal-depression-scale/edinburgh-postnatal-depression-scales/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">EPDS clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        EPDS total, interpretation band, and self-harm flag for assessed respondents, computed by
        the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/edinburgh-postnatal-depression-scale/edinburgh-postnatal-depression-scales/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={settingFilter}>
        <option value="">All</option>
        <option value="maternity">Maternity service</option>
        <option value="community">Community / health visiting</option>
        <option value="general-practice">General practice</option>
        <option value="perinatal-mh">Perinatal mental-health service</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Band</span>
      <select class="select inline-block w-auto" bind:value={bandFilter}>
        <option value="">All</option>
        <option value="lower">Lower (0-9)</option>
        <option value="possible">Possible (10-12)</option>
        <option value="likely">Likely (13-30)</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="EPDS clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} respondents</p>
</main>
