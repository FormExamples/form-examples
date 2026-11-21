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
  import { stageLabel, careSettingLabel, formatEgfr } from '#lib/engine/utils.js';

  let settingFilter = $state('');
  let stageFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (settingFilter === '' || r.careSetting === settingFilter) &&
        (stageFilter === '' || r.egfrStage === stageFilter)
    )
  );

  // SVAR DataGrid columns. eGFR, CKD G-stage, and the referral flag render
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
      id: 'egfr',
      header: 'eGFR',
      sortable: true,
      format: fmt((v: number | null) => formatEgfr(v))
    },
    {
      id: 'egfrStage',
      header: 'CKD G-stage',
      sortable: true,
      format: fmt((v: string | null) => (v ? stageLabel(v as never) : 'Unknown'))
    },
    {
      id: 'referralFlag',
      header: 'Referral',
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
      `/estimated-glomerular-filtration-rate-calculator/estimated-glomerular-filtration-rate-calculators/${id}`
    );
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">eGFR dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        eGFR and CKD G-stage for assessed patients, computed by the shared engine. Select a row to
        open the assessment.
      </p>
    </div>
    <a
      href="/estimated-glomerular-filtration-rate-calculator/estimated-glomerular-filtration-rate-calculators/new"
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
        <option value="secondary-care">Secondary care</option>
        <option value="laboratory">Laboratory</option>
        <option value="pharmacy">Pharmacy</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">CKD G-stage</span>
      <select class="select inline-block w-auto" bind:value={stageFilter}>
        <option value="">All</option>
        <option value="G1">G1</option>
        <option value="G2">G2</option>
        <option value="G3a">G3a</option>
        <option value="G3b">G3b</option>
        <option value="G4">G4</option>
        <option value="G5">G5</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="eGFR dashboard"
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
