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
    suitabilityBandLabel,
    triageTierLabel
  } from '#lib/engine/utils.js';
  import { RECOMMENDATION_LABELS } from '#lib/engine/grader.js';

  let triageFilter = $state('');
  let recommendationFilter = $state('');

  const rows = $derived(
    sampleRequestRows.filter(
      (r) =>
        (triageFilter === '' || r.triageTier === triageFilter) &&
        (recommendationFilter === '' || r.recommendation === recommendationFilter)
    )
  );

  // SVAR DataGrid columns. The four axes, the recommendation, and the flag
  // count all render through the shared engine output so the dashboard and the
  // report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Request' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'referralDate', header: 'Referred', sortable: true },
    { id: 'clinicBp', header: 'Clinic BP' },
    {
      id: 'appropriatenessBand',
      header: 'Appropriateness',
      sortable: true,
      format: fmt((v: string) => appropriatenessBandLabel(v as never))
    },
    {
      id: 'suitabilityBand',
      header: 'Suitability',
      sortable: true,
      format: fmt((v: string) => suitabilityBandLabel(v as never))
    },
    {
      id: 'completenessPercent',
      header: 'Complete',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    {
      id: 'triageTier',
      header: 'Triage',
      sortable: true,
      format: fmt((v: string) => triageTierLabel(v as never))
    },
    {
      id: 'recommendation',
      header: 'Recommendation',
      sortable: true,
      format: fmt((v: string) => RECOMMENDATION_LABELS[v as never])
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'referralDate',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/ambulatory-blood-pressure-test-request/ambulatory-blood-pressure-test-requests/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">ABPM request vetting dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Four-axis grade, recommendation, and safety-flag count for incoming requests, computed by
        the shared engine. Select a row to open the request.
      </p>
    </div>
    <a
      href="/ambulatory-blood-pressure-test-request/ambulatory-blood-pressure-test-requests/new"
      class="button"
      data-variant="primary">New request</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Triage</span>
      <select class="select inline-block w-auto" bind:value={triageFilter}>
        <option value="">All</option>
        <option value="routine">Routine</option>
        <option value="urgent">Urgent</option>
        <option value="emergency">Emergency</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Recommendation</span>
      <select class="select inline-block w-auto" bind:value={recommendationFilter}>
        <option value="">All</option>
        <option value="accept">Accept and book</option>
        <option value="query-referrer">Query the referrer</option>
        <option value="redirect">Redirect / alternative</option>
        <option value="reject">Reject</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="ABPM request vetting dashboard"
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
