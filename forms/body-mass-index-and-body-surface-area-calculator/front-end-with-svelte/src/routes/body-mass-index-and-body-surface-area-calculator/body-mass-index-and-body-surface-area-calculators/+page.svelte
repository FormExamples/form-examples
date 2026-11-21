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
  import { bmiCategoryLabel, careSettingLabel, formatBmi, formatBsa } from '#lib/engine/utils.js';

  let settingFilter = $state('');
  let categoryFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (settingFilter === '' || r.careSetting === settingFilter) &&
        (categoryFilter === '' || r.bmiCategory === categoryFilter)
    )
  );

  // SVAR DataGrid columns. BMI, WHO category, BSA, and the severe flag render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
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
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'careSetting',
      header: 'Setting',
      sortable: true,
      format: fmt((v: string) => careSettingLabel(v as never) || '—')
    },
    {
      id: 'bmi',
      header: 'BMI',
      sortable: true,
      format: fmt((v: number | null) => formatBmi(v))
    },
    {
      id: 'bmiCategory',
      header: 'Category',
      sortable: true,
      format: fmt((v: string) => bmiCategoryLabel(v as never))
    },
    {
      id: 'bsaMosteller',
      header: 'BSA (Mosteller)',
      sortable: true,
      format: fmt((v: number | null) => formatBsa(v))
    },
    {
      id: 'severeFlag',
      header: 'Severe',
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
    goto(
      `/body-mass-index-and-body-surface-area-calculator/body-mass-index-and-body-surface-area-calculators/${id}`
    );
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">BMI and BSA dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        BMI, WHO weight-status category, and body surface area for assessed patients, computed by
        the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/body-mass-index-and-body-surface-area-calculator/body-mass-index-and-body-surface-area-calculators/new"
      class="button"
      data-variant="primary">New calculation</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={settingFilter}>
        <option value="">All</option>
        <option value="primary-care">Primary care</option>
        <option value="outpatient">Outpatient</option>
        <option value="inpatient">Inpatient</option>
        <option value="oncology">Oncology</option>
        <option value="pre-operative">Pre-operative</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">WHO category</span>
      <select class="select inline-block w-auto" bind:value={categoryFilter}>
        <option value="">All</option>
        <option value="underweight">Underweight</option>
        <option value="normal">Normal</option>
        <option value="overweight">Overweight</option>
        <option value="obese-class-1">Obese class I</option>
        <option value="obese-class-2">Obese class II</option>
        <option value="obese-class-3">Obese class III</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="BMI and BSA dashboard"
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
