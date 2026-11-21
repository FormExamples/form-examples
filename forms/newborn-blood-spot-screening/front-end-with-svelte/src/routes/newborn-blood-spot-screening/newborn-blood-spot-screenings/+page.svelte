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
  import { outcomeLabel, referralStatusLabel, sexLabel } from '#lib/engine/utils.js';

  let outcomeFilter = $state('');
  let referralFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (outcomeFilter === '' || r.overallOutcome === outcomeFilter) &&
        (referralFilter === '' || r.referralStatus === referralFilter)
    )
  );

  // SVAR DataGrid columns. Overall outcome, referral status, and referral /
  // flag counts render through the shared engine output so the dashboard and
  // report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Screening' },
    { id: 'nhsNumber', header: 'NHS number', sortable: true },
    { id: 'babyName', header: 'Baby', sortable: true },
    {
      id: 'sex',
      header: 'Sex',
      sortable: true,
      format: fmt((v: string) => sexLabel(v as never) || '—')
    },
    { id: 'recordDate', header: 'Recorded', sortable: true },
    {
      id: 'ageAtSampleDays',
      header: 'Age (days)',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : `Day ${v}`))
    },
    {
      id: 'overallOutcome',
      header: 'Outcome',
      sortable: true,
      format: fmt((v: string) => outcomeLabel(v as never))
    },
    {
      id: 'referralStatus',
      header: 'Referral',
      sortable: true,
      format: fmt((v: string) => referralStatusLabel(v as never))
    },
    { id: 'referralCount', header: 'Referrals', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'babyName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/newborn-blood-spot-screening/newborn-blood-spot-screenings/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Blood spot clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Screening outcome, referral status, urgent referrals, and safety flags for screened babies,
        computed by the shared engine. Select a row to open the screening.
      </p>
    </div>
    <a
      href="/newborn-blood-spot-screening/newborn-blood-spot-screenings/new"
      class="button"
      data-variant="primary">New screening</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Outcome</span>
      <select class="select inline-block w-auto" bind:value={outcomeFilter}>
        <option value="">All</option>
        <option value="all-not-suspected">All conditions not suspected</option>
        <option value="referral-required">Referral required</option>
        <option value="repeat-required">Repeat sample required</option>
        <option value="incomplete">Incomplete</option>
        <option value="declined-only-outstanding">Complete — some declined</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Referral status</span>
      <select class="select inline-block w-auto" bind:value={referralFilter}>
        <option value="">All</option>
        <option value="urgent">Urgent referral</option>
        <option value="repeat">Repeat sample</option>
        <option value="routine">Routine — no referral</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Blood spot clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} babies</p>
</main>
