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
  import { followUpTimeframeLabel, priorityLabel } from '#lib/engine/utils.js';
  import type { FlagPriority, FollowUpTimeframe } from '#lib/engine/types.js';

  let followUpFilter = $state('');
  let priorityFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (followUpFilter === '' || r.followUpTimeframe === followUpFilter) &&
        (priorityFilter === '' || r.reviewPriority === priorityFilter)
    )
  );

  // SVAR DataGrid columns. Completeness and review priority render through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Referral' },
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
      id: 'followUpTimeframe',
      header: 'Follow-up',
      sortable: true,
      format: fmt((v: FollowUpTimeframe) => followUpTimeframeLabel(v))
    },

    {
      id: 'completeness',
      header: 'Completeness',
      sortable: true
    },

    {
      id: 'reviewPriority',
      header: 'Review priority',
      sortable: true,
      format: fmt((v: FlagPriority | 'none') => (v === 'none' ? 'None' : priorityLabel(v)))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/who-counter-referral-form/who-counter-referral-forms/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Counter-referral clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Completeness status, follow-up timeframe, and review priority for counter-referred patients,
        computed by the shared engine. Select a row to open the form.
      </p>
    </div>
    <a
      href="/who-counter-referral-form/who-counter-referral-forms/new"
      class="button"
      data-variant="primary">New form</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Follow-up</span>
      <select class="select inline-block w-auto" bind:value={followUpFilter}>
        <option value="">All</option>
        <option value="urgent-within-24-hours">Urgent (within 24h)</option>
        <option value="2-to-6-days">2–6 days</option>
        <option value="1-to-2-weeks">1–2 weeks</option>
        <option value="more-than-2-weeks">More than 2 weeks</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Review priority</span>
      <select class="select inline-block w-auto" bind:value={priorityFilter}>
        <option value="">All</option>
        <option value="urgent">Urgent</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
        <option value="none">None</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Counter-referral clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} patients</p>
</main>
