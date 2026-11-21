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
  import { fluidStatusLabel } from '#lib/engine/utils.js';

  let statusFilter = $state('');
  let wardFilter = $state('');

  // Distinct wards present in the sample data (for the ward filter dropdown).
  const wards = Array.from(new Set(sampleAssessmentRows.map((r) => r.wardOrUnit))).sort();

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (statusFilter === '' || r.fluidStatus === statusFilter) &&
        (wardFilter === '' || r.wardOrUnit === wardFilter)
    )
  );

  // SVAR DataGrid columns. Totals, net balance, urine rate, and fluid status all
  // render through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Chart' },
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
      id: 'wardOrUnit',
      header: 'Ward / unit',
      sortable: true
    },

    {
      id: 'totalIntakeMl',
      header: 'Intake (mL)',
      sortable: true
    },

    {
      id: 'totalOutputMl',
      header: 'Output (mL)',
      sortable: true
    },

    {
      id: 'netBalanceMl',
      header: 'Net (mL)',
      sortable: true,
      format: fmt((v: number) => `${v >= 0 ? '+' : ''}${v}`)
    },
    {
      id: 'urineOutputRateMlPerKgPerHour',
      header: 'Urine mL/kg/h',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : v.toFixed(2)))
    },
    {
      id: 'fluidStatus',
      header: 'Fluid status',
      sortable: true,
      format: fmt((v: string) => fluidStatusLabel(v as never))
    },
    { id: 'chartStartAt', header: 'Start', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'chartStartAt',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/fluid-balance-chart/fluid-balance-charts/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Fluid balance dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Total intake and output, net balance, urine-output rate, and fluid status for each chart,
        computed by the shared engine. Select a row to open the chart.
      </p>
    </div>
    <a href="/fluid-balance-chart/fluid-balance-charts/new" class="button" data-variant="primary"
      >New chart</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Fluid status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="balanced">Balanced</option>
        <option value="positive">Positive</option>
        <option value="negative">Negative</option>
        <option value="oliguria">Oliguria</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Ward / unit</span>
      <select class="select inline-block w-auto" bind:value={wardFilter}>
        <option value="">All</option>
        {#each wards as ward (ward)}
          <option value={ward}>{ward}</option>
        {/each}
      </select>
    </label>
  </div>

  <DataGrid
    label="Fluid balance dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} charts</p>
</main>
