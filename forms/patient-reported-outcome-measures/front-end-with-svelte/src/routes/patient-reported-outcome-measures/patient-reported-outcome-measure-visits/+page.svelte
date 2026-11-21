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
  import { sampleVisitRows } from '#lib/data/sample-reports.js';

  let visitFilter = $state('');
  let ndiBandFilter = $state('');

  const rows = $derived(
    sampleVisitRows.filter(
      (r) =>
        (visitFilter === '' || r.visit === visitFilter) &&
        (ndiBandFilter === '' || r.ndiBand === ndiBandFilter)
    )
  );

  const visitOptions = Array.from(new Set(sampleVisitRows.map((r) => r.visit).filter(Boolean)));

  // SVAR DataGrid columns. All computed values render through the shared
  // engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Visit ID' },
    { id: 'subjectId', header: 'Subject', sortable: true },
    { id: 'subjectName', header: 'Name', sortable: true },
    { id: 'visit', header: 'Visit', sortable: true },
    { id: 'assessmentDate', header: 'Date', sortable: true },
    {
      id: 'sf36Pcs',
      header: 'SF-36 PCS (approx.)',
      sortable: true,
      format: fmt((v: number | null) => (typeof v === 'number' ? v.toFixed(1) : '—'))
    },
    {
      id: 'sf36Mcs',
      header: 'SF-36 MCS (approx.)',
      sortable: true,
      format: fmt((v: number | null) => (typeof v === 'number' ? v.toFixed(1) : '—'))
    },
    {
      id: 'ndiPercentage',
      header: 'NDI %',
      sortable: true,
      format: fmt((v: number | null) => (typeof v === 'number' ? v.toFixed(1) : '—'))
    },
    { id: 'ndiBand', header: 'NDI band', sortable: true },
    {
      id: 'mjoaTotal',
      header: 'mJOA',
      sortable: true,
      format: fmt((v: number | null) => (typeof v === 'number' ? String(v) : '—'))
    },
    { id: 'mjoaBand', header: 'mJOA band', sortable: true },
    {
      id: 'eq5dIndex',
      header: 'EQ-5D index',
      sortable: true,
      format: fmt((v: number | null) => (typeof v === 'number' ? v.toFixed(3) : '—'))
    }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'subjectName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/patient-reported-outcome-measures/patient-reported-outcome-measure-visits/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">PRO measures clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        SF-36 summary approximations, NDI band, mJOA band, and EQ-5D index for recorded visits,
        computed by the shared engine. Select a row to open the visit.
      </p>
    </div>
    <a
      href="/patient-reported-outcome-measures/patient-reported-outcome-measure-visits/new"
      class="button"
      data-variant="primary">New visit</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Visit</span>
      <select class="select inline-block w-auto" bind:value={visitFilter}>
        <option value="">All</option>
        {#each visitOptions as v (v)}
          <option value={v}>{v}</option>
        {/each}
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">NDI band</span>
      <select class="select inline-block w-auto" bind:value={ndiBandFilter}>
        <option value="">All</option>
        <option value="no-disability">No disability</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
        <option value="complete">Complete</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="PRO measures clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} visits</p>
</main>
