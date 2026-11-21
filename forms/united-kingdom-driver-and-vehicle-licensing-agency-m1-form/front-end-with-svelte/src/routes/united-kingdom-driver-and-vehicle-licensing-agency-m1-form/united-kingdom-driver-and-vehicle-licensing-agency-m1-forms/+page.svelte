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
  import { priorityLabel } from '#lib/engine/utils.js';

  const plural = 'united-kingdom-driver-and-vehicle-licensing-agency-m1-forms';

  let priorityFilter = $state('');
  let diagnosisFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (priorityFilter === '' || r.highestPriority === priorityFilter) &&
        (diagnosisFilter === '' || r.hasDiagnosis === diagnosisFilter)
    )
  );

  // SVAR DataGrid columns. Diagnosis, condition count, highest clinical flag
  // priority, flag count, and completeness all render through the shared engine
  // output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Form' },
    {
      id: 'applicantName',
      header: 'Applicant',
      sortable: true
    },

    {
      id: 'assessedDate',
      header: 'Submitted',
      sortable: true
    },

    {
      id: 'hasDiagnosis',
      header: 'Diagnosis',
      sortable: true,
      format: fmt((v: string) => (v === 'yes' ? 'Yes' : v === 'no' ? 'No' : '—'))
    },

    {
      id: 'conditionCount',
      header: 'Conditions',
      sortable: true
    },

    {
      id: 'highestPriority',
      header: 'Priority',
      sortable: true,
      format: fmt((v: string) => (v === 'none' ? 'None' : priorityLabel(v as never)))
    },
    { id: 'flagCount', header: 'Flags', sortable: true },
    {
      id: 'complete',
      header: 'Complete',
      sortable: true,
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'applicantName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/united-kingdom-driver-and-vehicle-licensing-agency-m1-form/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">DVLA M1 clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Reported diagnosis, condition count, highest clinical flag priority, and completeness for
        submitted M1 forms, computed by the shared engine. Select a row to open the form.
      </p>
    </div>
    <a
      href="/united-kingdom-driver-and-vehicle-licensing-agency-m1-form/{plural}/new"
      class="button"
      data-variant="primary">New form</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Priority</span>
      <select class="select inline-block w-auto" bind:value={priorityFilter}>
        <option value="">All</option>
        <option value="urgent">Urgent</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
        <option value="none">None</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Diagnosis</span>
      <select class="select inline-block w-auto" bind:value={diagnosisFilter}>
        <option value="">All</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="DVLA M1 clinician dashboard"
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
