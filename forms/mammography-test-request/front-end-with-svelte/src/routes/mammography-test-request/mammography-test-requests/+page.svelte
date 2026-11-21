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
    examTypeLabel,
    indicationLabel,
    triageTierLabel,
    priorityLabel,
    recommendationLabel
  } from '#lib/engine/utils.js';

  let tierFilter = $state('');
  let recommendationFilter = $state('');

  const rows = $derived(
    sampleRequestRows.filter(
      (r) =>
        (tierFilter === '' || r.triageTier === tierFilter) &&
        (recommendationFilter === '' || r.recommendation === recommendationFilter)
    )
  );

  // SVAR DataGrid columns. Every graded value renders through the shared engine
  // output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Request' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'examType',
      header: 'Exam',
      sortable: true,
      format: fmt((v: string) => examTypeLabel(v))
    },
    {
      id: 'indication',
      header: 'Indication',
      sortable: true,
      format: fmt((v: string) => indicationLabel(v))
    },
    {
      id: 'appropriatenessScore',
      header: 'Appropriate.',
      sortable: true,
      format: fmt((v: number) => `${v} / 9`)
    },
    {
      id: 'triageTier',
      header: 'Triage',
      sortable: true,
      format: fmt((v: string) => triageTierLabel(v))
    },
    {
      id: 'twoWeekWaitEligible',
      header: '2WW',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    {
      id: 'priorityBand',
      header: 'Priority',
      sortable: true,
      format: fmt((v: string) => priorityLabel(v))
    },
    {
      id: 'completenessPercent',
      header: 'Complete',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    {
      id: 'recommendation',
      header: 'Recommendation',
      sortable: true,
      format: fmt((v: string) => recommendationLabel(v))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/mammography-test-request/mammography-test-requests/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Mammography vetting dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Four-axis grade and cancer-pathway triage for each request, computed by the shared engine.
        Select a row to open the request.
      </p>
    </div>
    <a
      href="/mammography-test-request/mammography-test-requests/new"
      class="button"
      data-variant="primary">New request</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Triage tier</span>
      <select class="select inline-block w-auto" bind:value={tierFilter}>
        <option value="">All</option>
        <option value="routine">Routine</option>
        <option value="urgent">Urgent</option>
        <option value="two-week-wait">Two-week-wait</option>
        <option value="emergency">Emergency</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Recommendation</span>
      <select class="select inline-block w-auto" bind:value={recommendationFilter}>
        <option value="">All</option>
        <option value="accept">Accept and book</option>
        <option value="query-referrer">Query the referrer</option>
        <option value="redirect">Redirect</option>
        <option value="reject">Reject</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Mammography vetting dashboard"
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
