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
  import { riskLevelLabel } from '#lib/engine/utils.js';

  let riskFilter = $state('');
  let gfrFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (riskFilter === '' || r.riskLevel === riskFilter) &&
        (gfrFilter === '' || r.gfrCategory === gfrFilter)
    )
  );

  // SVAR DataGrid columns. KDIGO GFR / albuminuria categories and the composite
  // risk render through the shared engine output so the dashboard and report
  // stay aligned.
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
      id: 'gfrCategory',
      header: 'GFR cat.',
      sortable: true,
      format: fmt((v: string) => v || '—')
    },
    {
      id: 'albuminuriaCategory',
      header: 'Albuminuria',
      sortable: true,
      format: fmt((v: string) => v || '—')
    },
    {
      id: 'riskLevel',
      header: 'KDIGO risk',
      sortable: true,
      format: fmt((v: string) => riskLevelLabel(v as never))
    },
    {
      id: 'egfr',
      header: 'eGFR',
      sortable: true,
      format: fmt((v: number | null) => (v == null ? '—' : String(v)))
    },
    {
      id: 'acr',
      header: 'ACR',
      sortable: true,
      format: fmt((v: number | null) => (v == null ? '—' : String(v)))
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
    goto(`/renal-assessment/renal-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Renal clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        KDIGO GFR / albuminuria categories and composite CKD risk for assessed patients, computed by
        the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a href="/renal-assessment/renal-assessments/new" class="button" data-variant="primary"
      >New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">KDIGO risk</span>
      <select class="select inline-block w-auto" bind:value={riskFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
        <option value="very-high">Very high</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">GFR category</span>
      <select class="select inline-block w-auto" bind:value={gfrFilter}>
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
    label="Renal clinician dashboard"
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
