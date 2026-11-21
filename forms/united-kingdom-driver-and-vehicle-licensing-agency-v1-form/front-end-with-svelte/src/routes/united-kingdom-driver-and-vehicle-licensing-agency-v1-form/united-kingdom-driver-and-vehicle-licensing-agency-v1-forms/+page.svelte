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
  import { statusLabel } from '#lib/engine/utils.js';

  const plural = 'united-kingdom-driver-and-vehicle-licensing-agency-v1-forms';

  let statusFilter = $state('');
  let standardFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (statusFilter === '' || (statusFilter === 'complete' ? r.complete : !r.complete)) &&
        (standardFilter === '' || (standardFilter === 'meets' ? r.meetsStandard : !r.meetsStandard))
    )
  );

  // SVAR DataGrid columns. Completeness status, eyesight standard, declared
  // vision conditions, and flag counts render through the shared engine output
  // so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Reference' },
    {
      id: 'applicantName',
      header: 'Applicant',
      sortable: true
    },

    {
      id: 'submittedAt',
      header: 'Submitted',
      sortable: true
    },

    {
      id: 'meetsStandard',
      header: 'Eyesight std',
      format: fmt((v: boolean) => (v ? 'Meets' : 'Does not'))
    },

    {
      id: 'conditionsDeclared',
      header: 'Conditions',
      sortable: true
    },

    {
      id: 'completeness',
      header: 'Complete %',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    {
      id: 'complete',
      header: 'Status',
      sortable: true,
      format: fmt((v: boolean) => statusLabel(v))
    },
    { id: 'highPriorityFlagCount', header: 'High flags', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'applicantName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/united-kingdom-driver-and-vehicle-licensing-agency-v1-form/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">DVLA V1 clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Completeness status, eyesight-standard self-declaration, declared vision conditions, and
        flag counts for submitted V1 forms, computed by the shared engine. Select a row to open the
        form.
      </p>
    </div>
    <a
      href="/united-kingdom-driver-and-vehicle-licensing-agency-v1-form/{plural}/new"
      class="button"
      data-variant="primary">New form</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Eyesight standard</span>
      <select class="select inline-block w-auto" bind:value={standardFilter}>
        <option value="">All</option>
        <option value="meets">Meets standard</option>
        <option value="fails">Does not meet</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="DVLA V1 clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} forms</p>
</main>
