<script lang="ts">
  import { goto } from '$app/navigation';
  import DataGrid, {
    type DataGridColumn,
    type DataGridRow
  } from '@lilydesignsystem/svelte-data-grid';

  import { sampleReportRows } from '#lib/data/sample-reports.js';

  let hospitalFilter = $state('');
  let completenessFilter = $state('');
  const rows = $derived(
    sampleReportRows.filter(
      (r) =>
        (hospitalFilter === '' || r.hospitalName === hospitalFilter) &&
        (completenessFilter === '' ||
          (completenessFilter === 'complete' && r.reportedCount === r.totalCount) ||
          (completenessFilter === 'incomplete' && r.reportedCount < r.totalCount))
    )
  );
  const hospitalOptions = Array.from(new Set(sampleReportRows.map((r) => r.hospitalName)));

  // SVAR DataGrid columns. Metrics-recorded counts all render through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Report' },
    { id: 'hospitalName', header: 'Hospital', sortable: true },
    { id: 'preparedByName', header: 'Prepared by', sortable: true },
    { id: 'period', header: 'Period', sortable: true },
    { id: 'reportedCount', header: 'Metrics recorded', sortable: true },
    { id: 'totalCount', header: 'Total metrics', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'hospitalName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/hospital-dashboard-metrics/hospital-dashboard-metrics-reports/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Administrator review dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Metrics recorded out of 67, for each reporting period, computed by the shared engine. Select
        a row to open the reporting period.
      </p>
    </div>
    <a
      href="/hospital-dashboard-metrics/hospital-dashboard-metrics-reports/new"
      class="button"
      data-variant="primary">New reporting period</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Hospital</span>
      <select class="select inline-block w-auto" bind:value={hospitalFilter}>
        <option value="">All</option>
        {#each hospitalOptions as h (h)}
          <option value={h}>{h}</option>
        {/each}
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Completeness</span>
      <select class="select inline-block w-auto" bind:value={completenessFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Administrator review dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} reporting periods</p>
</main>
