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
  import {
    appropriatenessBandLabel,
    identitySafetyBandLabel,
    organLabel,
    recommendationLabel,
    titleCase
  } from '#lib/engine/utils.js';
  import type {
    AppropriatenessBand,
    IdentitySafetyBand,
    Organ,
    Recommendation,
    TriageTier
  } from '#lib/engine/types.js';

  let triageFilter = $state('');
  let recommendationFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (triageFilter === '' || r.triageTier === triageFilter) &&
        (recommendationFilter === '' || r.recommendation === recommendationFilter)
    )
  );

  // SVAR DataGrid columns. The four-axis grade and recommendation render through
  // the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Request' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'requestedDate',
      header: 'Requested',
      sortable: true
    },

    {
      id: 'organRequired',
      header: 'Organ',
      sortable: true,
      format: fmt((v: Organ) => organLabel(v) || '—')
    },
    { id: 'testCount', header: 'Tests', sortable: true },
    {
      id: 'appropriatenessScore',
      header: 'Appropriateness',
      sortable: true,
      format: fmt(
        (v: number, row: DataGridRow) =>
          `${v}/9 · ${appropriatenessBandLabel(row.appropriatenessBand as AppropriatenessBand)}`
      )
    },
    {
      id: 'identitySafetyBand',
      header: 'Identity safety',
      sortable: true,
      format: fmt((v: IdentitySafetyBand) => identitySafetyBandLabel(v))
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
      format: fmt((v: TriageTier) => titleCase(v))
    },
    {
      id: 'recommendation',
      header: 'Recommendation',
      sortable: true,
      format: fmt((v: Recommendation) => recommendationLabel(v))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'requestedDate',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(
      `/medical-renal-transplant-recipient-request/medical-renal-transplant-recipient-requests/${id}`
    );
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Histocompatibility vetting dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Four-axis grade and recommendation for incoming renal transplant recipient requests,
        computed by the shared engine. Select a row to open the request.
      </p>
    </div>
    <a
      href="/medical-renal-transplant-recipient-request/medical-renal-transplant-recipient-requests/new"
      class="button"
      data-variant="primary">New request</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Triage tier</span>
      <select class="select inline-block w-auto" bind:value={triageFilter}>
        <option value="">All</option>
        <option value="routine">Routine</option>
        <option value="urgent">Urgent</option>
        <option value="emergency">Emergency</option>
        <option value="stat">Stat</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Recommendation</span>
      <select class="select inline-block w-auto" bind:value={recommendationFilter}>
        <option value="">All</option>
        <option value="accept">Accept and process</option>
        <option value="query-referrer">Query the referrer</option>
        <option value="redirect">Redirect</option>
        <option value="reject">Reject</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Histocompatibility vetting dashboard"
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
