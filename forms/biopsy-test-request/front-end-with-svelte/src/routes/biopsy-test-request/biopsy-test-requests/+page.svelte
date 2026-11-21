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
  import { sampleRequestRows } from '#lib/data/sample-reports.js';
  import {
    appropriatenessBandLabel,
    bleedingRiskLabel,
    biopsySiteLabel,
    indicationLabel,
    triageTierLabel
  } from '#lib/engine/utils.js';

  let bleedingFilter = $state('');
  let triageFilter = $state('');

  const rows = $derived(
    sampleRequestRows.filter(
      (r) =>
        (bleedingFilter === '' || r.bleedingRiskBand === bleedingFilter) &&
        (triageFilter === '' || r.triageTier === triageFilter)
    )
  );

  // SVAR DataGrid columns. Appropriateness band, bleeding-risk band, and the
  // triage tier render through the shared engine output so the dashboard and
  // report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Request' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'referralDate',
      header: 'Referred',
      sortable: true
    },

    {
      id: 'biopsySite',
      header: 'Site',
      sortable: true,
      format: fmt((v: string) => biopsySiteLabel(v) || '—')
    },
    {
      id: 'indication',
      header: 'Indication',
      sortable: true,
      format: fmt((v: string) => indicationLabel(v) || '—')
    },
    {
      id: 'appropriatenessBand',
      header: 'Appropriateness',
      sortable: true,
      format: fmt((v: string) => appropriatenessBandLabel(v as never))
    },
    {
      id: 'bleedingRiskBand',
      header: 'Bleeding risk',
      sortable: true,
      format: fmt((v: string) => bleedingRiskLabel(v as never))
    },
    {
      id: 'triageTier',
      header: 'Triage',
      sortable: true,
      format: fmt((v: string) => triageTierLabel(v as never))
    },
    {
      id: 'twoWeekWaitEligible',
      header: '2WW',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    {
      id: 'completenessPercent',
      header: 'Complete',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'referralDate',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/biopsy-test-request/biopsy-test-requests/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Biopsy request vetting dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Appropriateness, periprocedural bleeding risk, and triage tier for incoming requests,
        computed by the shared engine. Select a row to open the request.
      </p>
    </div>
    <a href="/biopsy-test-request/biopsy-test-requests/new" class="button" data-variant="primary"
      >New request</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Bleeding risk</span>
      <select class="select inline-block w-auto" bind:value={bleedingFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Triage tier</span>
      <select class="select inline-block w-auto" bind:value={triageFilter}>
        <option value="">All</option>
        <option value="routine">Routine</option>
        <option value="urgent">Urgent</option>
        <option value="two-week-wait">Two-week wait</option>
        <option value="emergency">Emergency</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Biopsy request vetting dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} requests</p>
</main>
