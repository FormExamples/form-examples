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
  import { riskCategoryLabel } from '#lib/engine/utils.js';

  const plural = 'predicting-risk-of-cardiovascular-disease-events-records';

  let riskFilter = $state('');
  let diabetesFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (riskFilter === '' || r.riskCategory === riskFilter) &&
        (diabetesFilter === '' || String(r.diabetes) === diabetesFilter)
    )
  );

  // SVAR DataGrid columns. Risk category and the 10-/30-year risk percentages
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Record' },
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
      id: 'riskCategory',
      header: 'Risk category',
      sortable: true,
      format: fmt((v: string) => riskCategoryLabel(v))
    },
    {
      id: 'tenYearRisk',
      header: '10-yr risk',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    {
      id: 'thirtyYearRisk',
      header: '30-yr risk',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },

    {
      id: 'diabetes',
      header: 'Diabetes',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },

    {
      id: 'smoker',
      header: 'Smoker',
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
    goto(`/predicting-risk-of-cardiovascular-disease-events/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">CVD risk clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        PREVENT risk category and 10-/30-year CVD risk estimates for assessed patients, computed by
        the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/predicting-risk-of-cardiovascular-disease-events/{plural}/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Risk category</span>
      <select class="select inline-block w-auto" bind:value={riskFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="borderline">Borderline</option>
        <option value="intermediate">Intermediate</option>
        <option value="high">High</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Diabetes</span>
      <select class="select inline-block w-auto" bind:value={diabetesFilter}>
        <option value="">All</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="CVD risk clinician dashboard"
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
