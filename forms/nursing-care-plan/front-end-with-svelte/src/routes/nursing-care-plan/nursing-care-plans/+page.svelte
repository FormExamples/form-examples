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
  import { sampleCarePlanRows } from '#lib/data/sample-reports.js';
  import { completenessLabel, careSettingLabel, planTypeLabel } from '#lib/engine/utils.js';

  let settingFilter = $state('');
  let statusFilter = $state('');

  const rows = $derived(
    sampleCarePlanRows.filter(
      (r) =>
        (settingFilter === '' || r.careSetting === settingFilter) &&
        (statusFilter === '' || r.status === statusFilter)
    )
  );

  // SVAR DataGrid columns. Status, completeness percent, and flag count render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Care plan' },
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
      id: 'authoredDate',
      header: 'Authored',
      sortable: true
    },

    {
      id: 'planType',
      header: 'Type',
      sortable: true,
      format: fmt((v: string) => planTypeLabel(v as never) || '—')
    },
    {
      id: 'careSetting',
      header: 'Setting',
      sortable: true,
      format: fmt((v: string) => careSettingLabel(v as never) || '—')
    },

    {
      id: 'problemCount',
      header: 'Problems',
      sortable: true
    },

    {
      id: 'completenessPercent',
      header: 'Complete %',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    {
      id: 'status',
      header: 'Status',
      sortable: true,
      format: fmt((v: string) => completenessLabel(v as never))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/nursing-care-plan/nursing-care-plans/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Nursing care plan dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Care-plan status, completeness percent, problem count, and flag count for documented care
        plans, computed by the shared engine. Select a row to open the care plan.
      </p>
    </div>
    <a href="/nursing-care-plan/nursing-care-plans/new" class="button" data-variant="primary"
      >New care plan</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={settingFilter}>
        <option value="">All</option>
        <option value="hospital-ward">Hospital ward</option>
        <option value="community">Community / district nursing</option>
        <option value="care-home">Care home</option>
        <option value="hospice">Hospice</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="partial">Partial</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Nursing care plan dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} care plans</p>
</main>
