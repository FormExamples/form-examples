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
  import { sampleFitNoteRows } from '#lib/data/sample-reports.js';
  import {
    fitnessCategoryLabel,
    periodComplianceLabel,
    recommendationLabel
  } from '#lib/engine/utils.js';

  const plural = 'united-kingdom-statements-of-fitness-for-work';

  let fitnessFilter = $state('');
  let recommendationFilter = $state('');

  const rows = $derived(
    sampleFitNoteRows.filter(
      (r) =>
        (fitnessFilter === '' || r.fitnessCategory === fitnessFilter) &&
        (recommendationFilter === '' || r.recommendation === recommendationFilter)
    )
  );

  // SVAR DataGrid columns. The fitness category, period compliance, validity,
  // and recommendation render through the shared engine output so the dashboard
  // and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Fit note' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'assessmentDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'fitnessCategory',
      header: 'Fitness',
      sortable: true,
      format: fmt((v: string) => fitnessCategoryLabel(v as never))
    },
    {
      id: 'periodDays',
      header: 'Days',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : String(v)))
    },
    {
      id: 'periodCompliance',
      header: 'Compliance',
      sortable: true,
      format: fmt((v: string) => periodComplianceLabel(v as never))
    },
    {
      id: 'recommendation',
      header: 'Recommendation',
      sortable: true,
      format: fmt((v: string) => recommendationLabel(v as never))
    },
    {
      id: 'isValid',
      header: 'Valid',
      sortable: true,
      format: fmt((v: string) => (v === 'yes' ? 'Yes' : 'No'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/united-kingdom-statement-of-fitness-for-work/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Fit-note clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Fitness category, period compliance, validity, and recommendation for issued fit notes,
        computed by the shared engine. Select a row to open the fit note.
      </p>
    </div>
    <a
      href="/united-kingdom-statement-of-fitness-for-work/{plural}/new"
      class="button"
      data-variant="primary">New fit note</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Fitness category</span>
      <select class="select inline-block w-auto" bind:value={fitnessFilter}>
        <option value="">All</option>
        <option value="not_fit">Not fit for work</option>
        <option value="may_be_fit">May be fit for work</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Recommendation</span>
      <select class="select inline-block w-auto" bind:value={recommendationFilter}>
        <option value="">All</option>
        <option value="standard">Standard — no referral</option>
        <option value="refer_occupational_health">Refer to occupational health</option>
        <option value="refer_access_to_work">Refer to Access to Work</option>
        <option value="refer_employment_advisor">Refer to employment advisor</option>
        <option value="review_for_validity">Review for validity</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Fit-note clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} fit notes</p>
</main>
