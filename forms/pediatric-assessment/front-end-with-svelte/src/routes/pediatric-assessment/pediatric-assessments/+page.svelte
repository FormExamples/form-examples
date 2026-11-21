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
  import { devScreenLabel } from '#lib/engine/utils.js';

  let resultFilter = $state('');
  let immunizationFilter = $state('');
  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (resultFilter === '' || r.overallResult === resultFilter) &&
        (immunizationFilter === '' || (immunizationFilter === 'yes') === r.immunizationUpToDate)
    )
  );

  // SVAR DataGrid columns. The developmental screen result and flag count
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'overallResult',
      header: 'Screen result',
      sortable: true,
      format: fmt((v: string) => devScreenLabel(v))
    },
    {
      id: 'immunizationUpToDate',
      header: 'Immunised',
      format: fmt((v: boolean) => (v ? 'Up to date' : 'Not up to date'))
    },

    {
      id: 'growthFlag',
      header: 'Growth',
      format: fmt((v: boolean) => (v ? 'Flag' : 'OK'))
    },

    {
      id: 'allergyFlag',
      header: 'Allergy',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/pediatric-assessment/pediatric-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Paediatric clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Developmental screen result, immunisation status, and safety flags for screened children,
        computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a href="/pediatric-assessment/pediatric-assessments/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Screen result</span>
      <select class="select inline-block w-auto" bind:value={resultFilter}>
        <option value="">All</option>
        <option value="normal">Normal Development</option>
        <option value="developmental-concern">Developmental Concern</option>
        <option value="developmental-delay">Developmental Delay</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Immunisation</span>
      <select class="select inline-block w-auto" bind:value={immunizationFilter}>
        <option value="">All</option>
        <option value="yes">Up to date</option>
        <option value="no">Not up to date</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Paediatric clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} children</p>
</main>
