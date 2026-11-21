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
    eligibilityLabel,
    impactLabel,
    priorityTierLabel,
    recommendationLabel,
    statusLabel
  } from '#lib/engine/utils.js';

  let priorityFilter = $state('');
  let recommendationFilter = $state('');

  const rows = $derived(
    sampleRequestRows.filter(
      (r) =>
        (priorityFilter === '' || r.priorityTier === priorityFilter) &&
        (recommendationFilter === '' || r.recommendation === recommendationFilter)
    )
  );

  // Request overview — rolls up the rows currently in view (reflects filters).
  const cards = $derived.by(() => {
    const total = rows.length;
    const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));
    const c = (pred: (r: (typeof rows)[number]) => boolean) => rows.filter(pred).length;
    const covered = pct(c((r) => r.eligibilityBand === 'likely-covered'));
    const highRisk = pct(c((r) => r.impactBand === 'high-risk'));
    const urgent = pct(c((r) => r.priorityTier === 'urgent'));
    const avgComplete =
      total === 0
        ? 0
        : Math.round(rows.reduce((a, r) => a + (r.completenessPercent || 0), 0) / total);
    return [
      { label: 'Requests in view', value: String(total), cls: '' },
      { label: 'Duty likely engaged', value: covered + '%', cls: 'text-success' },
      { label: 'High wellbeing risk', value: highRisk + '%', cls: highRisk ? 'text-error' : '' },
      { label: 'Urgent', value: urgent + '%', cls: urgent ? 'text-warning' : '' },
      { label: 'Avg completeness', value: avgComplete + '%', cls: '' }
    ];
  });

  // SVAR DataGrid columns. Graded axes render through the shared engine label
  // helpers so the dashboard and the report stay in lock-step.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Request' },
    { id: 'workerName', header: 'Worker', sortable: true },
    { id: 'workerJobTitle', header: 'Job title' },
    {
      id: 'status',
      header: 'Status',
      format: fmt((v: string) => statusLabel(v as never))
    },

    {
      id: 'eligibilityBand',
      header: 'Eligibility',
      format: fmt((v: string) => eligibilityLabel(v as never))
    },

    {
      id: 'impactBand',
      header: 'Impact',
      format: fmt((v: string) => impactLabel(v as never))
    },

    {
      id: 'completenessPercent',
      header: 'Complete',
      format: fmt((v: number) => `${v}%`)
    },

    {
      id: 'priorityTier',
      header: 'Priority',
      sortable: true,
      format: fmt((v: string) => priorityTierLabel(v as never))
    },
    {
      id: 'recommendation',
      header: 'Recommendation',
      format: fmt((v: string) => recommendationLabel(v as never))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'priorityTier',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/neurodiversity-adjustment-request/neurodiversity-adjustment-requests/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Adjustment-request handling dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Four-axis grades for incoming neurodiversity adjustment requests, computed by the shared
        engine. Select a row to open the request.
      </p>
    </div>
    <a
      href="/neurodiversity-adjustment-request/neurodiversity-adjustment-requests/new"
      class="button"
      data-variant="primary">New request</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Priority tier</span>
      <select class="select inline-block w-auto" bind:value={priorityFilter}>
        <option value="">All</option>
        <option value="routine">Routine</option>
        <option value="soon">Soon</option>
        <option value="urgent">Urgent</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Recommendation</span>
      <select class="select inline-block w-auto" bind:value={recommendationFilter}>
        <option value="">All</option>
        <option value="progress-to-meeting">Progress to meeting</option>
        <option value="seek-occupational-health">Seek occupational health</option>
        <option value="request-more-detail">Request more detail</option>
        <option value="signpost-access-to-work">Signpost Access to Work</option>
      </select>
    </label>
  </div>

  <section class="mb-4" aria-label="Request overview">
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {#each cards as card (card.label)}
        <div class="rounded-lg border border-base-300 bg-base-100 px-3 py-2">
          <div class="text-2xl font-bold tabular-nums {card.cls}">{card.value}</div>
          <div class="text-xs text-base-content/60">{card.label}</div>
        </div>
      {/each}
    </div>
  </section>

  <DataGrid
    label="Adjustment-request handling dashboard"
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
