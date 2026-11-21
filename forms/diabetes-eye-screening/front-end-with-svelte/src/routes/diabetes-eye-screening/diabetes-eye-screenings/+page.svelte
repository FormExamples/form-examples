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
    outcomeLabel,
    referralLabel,
    retinopathyLabel,
    maculopathyLabel
  } from '#lib/engine/utils.js';

  let outcomeFilter = $state('');
  let referralFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (outcomeFilter === '' || r.outcome === outcomeFilter) &&
        (referralFilter === '' || r.referral === referralFilter)
    )
  );

  // SVAR DataGrid columns. Worst-eye grades, outcome, and referral render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Screening' },
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
      id: 'screenedDate',
      header: 'Screened',
      sortable: true
    },

    {
      id: 'worstRetinopathy',
      header: 'Worst R',
      sortable: true,
      format: fmt((v: string) => retinopathyLabel(v))
    },
    {
      id: 'worstMaculopathy',
      header: 'Worst M',
      sortable: true,
      format: fmt((v: string) => maculopathyLabel(v))
    },
    {
      id: 'outcome',
      header: 'Outcome',
      sortable: true,
      format: fmt((v: string) => outcomeLabel(v))
    },
    {
      id: 'referral',
      header: 'Referral',
      sortable: true,
      format: fmt((v: string) => referralLabel(v))
    },
    {
      id: 'urgentFlag',
      header: 'Urgent',
      sortable: true,
      format: fmt((v: boolean) => (v ? 'Yes' : '—'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/diabetes-eye-screening/diabetes-eye-screenings/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Diabetes eye screening dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Worst-eye grades, recall / referral outcome, and safety flags for screened patients,
        computed by the shared engine. Select a row to open the screening.
      </p>
    </div>
    <a
      href="/diabetes-eye-screening/diabetes-eye-screenings/new"
      class="button"
      data-variant="primary">New screening</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Outcome</span>
      <select class="select inline-block w-auto" bind:value={outcomeFilter}>
        <option value="">All</option>
        <option value="refer-hes-urgent">Urgent referral to ophthalmology</option>
        <option value="refer-hes">Routine referral to HES</option>
        <option value="refer-slit-lamp">Slit-lamp biomicroscopy</option>
        <option value="surveillance-6-month">6-monthly surveillance</option>
        <option value="routine-12-month">Routine 12-monthly</option>
        <option value="routine-24-month">Routine 24-monthly</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Referral</span>
      <select class="select inline-block w-auto" bind:value={referralFilter}>
        <option value="">All</option>
        <option value="none">No referral</option>
        <option value="hes-routine">Hospital eye service (routine)</option>
        <option value="hes-urgent">Ophthalmology (urgent)</option>
        <option value="slit-lamp">Slit-lamp biomicroscopy</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Diabetes eye screening dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} screenings</p>
</main>
