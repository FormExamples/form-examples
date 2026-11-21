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
  import { sampleChecklistRows } from '#lib/data/sample-reports.js';
  import { statusLabel, urgencyLabel } from '#lib/checklist/labels.js';
  import type { ChecklistStatus, Urgency } from '#lib/checklist/types.js';

  let statusFilter = $state('');
  let urgencyFilter = $state('');

  const rows = $derived(
    sampleChecklistRows.filter(
      (r) =>
        (statusFilter === '' || r.status === statusFilter) &&
        (urgencyFilter === '' || r.urgency === urgencyFilter)
    )
  );

  // SVAR DataGrid columns. Status and urgency render through the shared engine
  // labels so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Case' },
    { id: 'caseDate', header: 'Case date', sortable: true },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'siteName', header: 'Site', sortable: true },
    {
      id: 'operatingRoom',
      header: 'Theatre / OR',
      sortable: true
    },

    {
      id: 'surgeonName',
      header: 'Surgeon',
      sortable: true
    },

    {
      id: 'anaesthetistName',
      header: 'Anaesthetist',
      sortable: true
    },

    {
      id: 'urgency',
      header: 'Urgency',
      sortable: true,
      format: fmt((v: Urgency) => urgencyLabel(v))
    },

    {
      id: 'surgicalSpecialty',
      header: 'Specialty',
      sortable: true
    },

    {
      id: 'status',
      header: 'Status',
      sortable: true,
      format: fmt((v: ChecklistStatus) => statusLabel(v))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'caseDate',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/who-surgical-safety-checklist/who-surgical-safety-checklists/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Surgical safety dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Lifecycle status and computed safety-flag count for every surgical case, derived by the
        shared engine. Select a row to open the checklist.
      </p>
    </div>
    <a
      href="/who-surgical-safety-checklist/who-surgical-safety-checklists/new"
      class="button"
      data-variant="primary">New checklist</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Status</span>
      <select class="select inline-block w-auto" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="not-started">Not started</option>
        <option value="sign-in-complete">Sign In complete</option>
        <option value="time-out-complete">Time Out complete</option>
        <option value="sign-out-complete">Sign Out complete</option>
        <option value="completed">Completed</option>
        <option value="abandoned">Abandoned</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Urgency</span>
      <select class="select inline-block w-auto" bind:value={urgencyFilter}>
        <option value="">All</option>
        <option value="elective">Elective</option>
        <option value="urgent">Urgent</option>
        <option value="emergency">Emergency</option>
        <option value="immediate">Immediate</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Surgical safety dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} cases</p>
</main>
