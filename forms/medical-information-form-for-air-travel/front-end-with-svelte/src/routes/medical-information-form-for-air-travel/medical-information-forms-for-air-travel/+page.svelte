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
  import { fitnessBandLabel } from '#lib/engine/utils.js';
  import type { FitnessBand } from '#lib/engine/types.js';

  let bandFilter = $state('');
  let airlineFilter = $state('');

  const airlines = $derived(Array.from(new Set(sampleAssessmentRows.map((r) => r.airline))).sort());

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (bandFilter === '' || r.band === bandFilter) &&
        (airlineFilter === '' || r.airline === airlineFilter)
    )
  );

  // SVAR DataGrid columns. The fitness band and flag counts render through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'MEDIF' },
    { id: 'passengerName', header: 'Passenger', sortable: true },
    { id: 'airline', header: 'Airline', sortable: true },
    { id: 'flight', header: 'Flight', sortable: true },
    {
      id: 'outboundDate',
      header: 'Departure',
      sortable: true
    },

    {
      id: 'band',
      header: 'Fitness band',
      sortable: true,
      format: fmt((v: FitnessBand) => fitnessBandLabel(v))
    },
    { id: 'flagCount', header: 'Flags', sortable: true },
    { id: 'highFlagCount', header: 'High', sortable: true },
    {
      id: 'oxygenFlag',
      header: 'Oxygen',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },

    {
      id: 'pregnancyFlag',
      header: 'Pregnant',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'passengerName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/medical-information-form-for-air-travel/medical-information-forms-for-air-travel/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Airline medical-desk dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Fitness-to-fly band and safety-flag counts for submitted MEDIFs, computed by the shared
        engine. Select a row to open the form.
      </p>
    </div>
    <a
      href="/medical-information-form-for-air-travel/medical-information-forms-for-air-travel/new"
      class="button"
      data-variant="primary">New MEDIF</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Fitness band</span>
      <select class="select inline-block w-auto" bind:value={bandFilter}>
        <option value="">All</option>
        <option value="fit">Fit to fly</option>
        <option value="fit-with-conditions">Fit with conditions</option>
        <option value="requires-review">Requires review</option>
        <option value="unfit-to-fly">Unfit to fly</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Airline</span>
      <select class="select inline-block w-auto" bind:value={airlineFilter}>
        <option value="">All</option>
        {#each airlines as a (a)}
          <option value={a}>{a}</option>
        {/each}
      </select>
    </label>
  </div>

  <DataGrid
    label="Airline medical-desk dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} MEDIFs</p>
</main>
