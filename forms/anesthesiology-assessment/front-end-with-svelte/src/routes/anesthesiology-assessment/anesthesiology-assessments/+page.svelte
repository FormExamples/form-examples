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
  import { riskLevelLabel, asaClassShort, mallampatiShort } from '#lib/engine/utils.js';
  import type { AsaClass, MallampatiClass, RiskLevel } from '#lib/engine/types.js';

  let riskFilter = $state('');
  let asaFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (riskFilter === '' || r.riskLevel === riskFilter) &&
        (asaFilter === '' || r.asaClass === asaFilter)
    )
  );

  // SVAR DataGrid columns. The ASA / Mallampati classes, RCRI and STOP-BANG
  // scores, and the composite risk all render through the shared engine output
  // so the dashboard and report stay aligned.
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
      id: 'asaClass',
      header: 'ASA',
      sortable: true,
      format: fmt((v: AsaClass) => asaClassShort(v))
    },
    {
      id: 'mallampatiClass',
      header: 'Mallampati',
      sortable: true,
      format: fmt((v: MallampatiClass) => mallampatiShort(v))
    },
    { id: 'rcriScore', header: 'RCRI', sortable: true },
    {
      id: 'stopbangScore',
      header: 'STOP-BANG',
      sortable: true
    },

    {
      id: 'riskLevel',
      header: 'Overall risk',
      sortable: true,
      format: fmt((v: RiskLevel) => riskLevelLabel(v))
    },

    {
      id: 'airwayFlag',
      header: 'Difficult airway',
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
    goto(`/anesthesiology-assessment/anesthesiology-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Anaesthetist dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        ASA / Mallampati classification, RCRI and STOP-BANG scores, and composite perioperative risk
        for assessed patients, computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/anesthesiology-assessment/anesthesiology-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Overall risk</span>
      <select class="select inline-block w-auto" bind:value={riskFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="medium">Moderate</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">ASA class</span>
      <select class="select inline-block w-auto" bind:value={asaFilter}>
        <option value="">All</option>
        <option value="i">ASA I</option>
        <option value="ii">ASA II</option>
        <option value="iii">ASA III</option>
        <option value="iv">ASA IV</option>
        <option value="v">ASA V</option>
        <option value="vi">ASA VI</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Anaesthetist dashboard"
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
