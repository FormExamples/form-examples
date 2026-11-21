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
  import { progressLabel, careSettingLabel, parityLabel } from '#lib/engine/utils.js';

  let careSettingFilter = $state('');
  let progressFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (careSettingFilter === '' || r.careSetting === careSettingFilter) &&
        (progressFilter === '' || r.progressClassification === progressFilter)
    )
  );

  // SVAR DataGrid columns. Progress classification, latest dilatation, elapsed
  // hours, and flag count render through the shared engine output so the
  // dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Record' },
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
      id: 'careSetting',
      header: 'Setting',
      sortable: true,
      format: fmt((v: string) => careSettingLabel(v as never) || '—')
    },
    {
      id: 'parity',
      header: 'Parity',
      sortable: true,
      format: fmt((v: string) => parityLabel(v as never) || '—')
    },
    {
      id: 'progressClassification',
      header: 'Progress',
      sortable: true,
      format: fmt((v: string) => progressLabel(v as never))
    },
    {
      id: 'latestDilatationCm',
      header: 'Dilatation',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : `${v} cm`))
    },
    {
      id: 'elapsedHours',
      header: 'Elapsed',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : `${v.toFixed(1)} h`))
    },
    { id: 'observationCount', header: 'Obs', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'elapsedHours',
    direction: 'descending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/partogram/partograms/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Partogram dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Progress classification, latest dilatation, elapsed hours, and flag count for partograms,
        computed by the shared engine. Select a row to open the record.
      </p>
    </div>
    <a href="/partogram/partograms/new" class="button" data-variant="primary">New partogram</a>
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={careSettingFilter}>
        <option value="">All</option>
        <option value="labour-ward">Labour ward</option>
        <option value="birth-centre">Birth centre</option>
        <option value="triage">Triage</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Progress</span>
      <select class="select inline-block w-auto" bind:value={progressFilter}>
        <option value="">All</option>
        <option value="normal">Normal</option>
        <option value="alertLineCrossed">Alert line crossed</option>
        <option value="actionLineCrossed">Action line crossed</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Partogram dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} partograms</p>
</main>
