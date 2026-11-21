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
  import { bandLabel, careSettingLabel, trendLabel } from '#lib/engine/utils.js';

  let settingFilter = $state('');
  let bandFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (settingFilter === '' || r.careSetting === settingFilter) &&
        (bandFilter === '' || r.summaryBand === bandFilter)
    )
  );

  // SVAR DataGrid columns. Lowest total, summary band, and trend render through
  // the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    {
      id: 'newbornIdentifier',
      header: 'Newborn ID',
      sortable: true
    },

    {
      id: 'patientName',
      header: 'Newborn',
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
    { id: 'lowestTotal', header: 'Lowest', sortable: true },
    {
      id: 'fiveMinuteTotal',
      header: '5-min',
      sortable: true
    },

    {
      id: 'summaryBand',
      header: 'Band',
      sortable: true,
      format: fmt((v: string) => bandLabel(v as never))
    },
    {
      id: 'trend',
      header: 'Trend',
      sortable: true,
      format: fmt((v: string) => trendLabel(v as never))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/apgar-score/apgar-scores/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Apgar clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Lowest total, summary band, and trend for assessed newborns, computed by the shared engine.
        Select a row to open the assessment.
      </p>
    </div>
    <a href="/apgar-score/apgar-scores/new" class="button" data-variant="primary">New assessment</a>
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={settingFilter}>
        <option value="">All</option>
        <option value="delivery-room">Delivery room</option>
        <option value="theatre">Obstetric theatre</option>
        <option value="birth-centre">Birth centre</option>
        <option value="home">Home birth</option>
        <option value="neonatal-unit">Neonatal unit</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Band</span>
      <select class="select inline-block w-auto" bind:value={bandFilter}>
        <option value="">All</option>
        <option value="reassuring">Reassuring (7-10)</option>
        <option value="moderately-low">Moderately low (4-6)</option>
        <option value="low">Low (0-3)</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Apgar clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} newborns</p>
</main>
