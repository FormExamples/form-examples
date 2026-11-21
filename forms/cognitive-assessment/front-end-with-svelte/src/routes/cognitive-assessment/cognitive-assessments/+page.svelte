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
  import { referralSourceLabel } from '#lib/engine/utils.js';

  let categoryFilter = $state('');
  let referralFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (categoryFilter === '' || r.mmseCategory === categoryFilter) &&
        (referralFilter === '' || r.referralSource === referralFilter)
    )
  );

  // SVAR DataGrid columns. The MMSE score and impairment category render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'assessedDate', header: 'Assessed', sortable: true },
    { id: 'mmseScore', header: 'MMSE / 30', sortable: true },
    {
      id: 'mmseCategory',
      header: 'Category',
      sortable: true
    },

    {
      id: 'referralSource',
      header: 'Referral',
      sortable: true,
      format: fmt((v: string) => referralSourceLabel(v))
    },

    {
      id: 'safetyFlag',
      header: 'Safety',
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
    goto(`/cognitive-assessment/cognitive-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Cognitive clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        MMSE score and cognitive impairment category for assessed patients, computed by the shared
        engine. Select a row to open the assessment.
      </p>
    </div>
    <a href="/cognitive-assessment/cognitive-assessments/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Category</span>
      <select class="select inline-block w-auto" bind:value={categoryFilter}>
        <option value="">All</option>
        <option value="Normal cognition">Normal cognition</option>
        <option value="Mild cognitive impairment">Mild cognitive impairment</option>
        <option value="Moderate cognitive impairment">Moderate cognitive impairment</option>
        <option value="Severe cognitive impairment">Severe cognitive impairment</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Referral source</span>
      <select class="select inline-block w-auto" bind:value={referralFilter}>
        <option value="">All</option>
        <option value="gp">GP</option>
        <option value="neurologist">Neurologist</option>
        <option value="psychiatrist">Psychiatrist</option>
        <option value="geriatrician">Geriatrician</option>
        <option value="self">Self</option>
        <option value="family">Family</option>
        <option value="other">Other</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Cognitive clinician dashboard"
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
