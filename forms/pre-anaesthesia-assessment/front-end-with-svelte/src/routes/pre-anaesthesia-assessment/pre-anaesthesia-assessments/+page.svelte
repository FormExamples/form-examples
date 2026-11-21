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

  let riskFilter = $state('');
  let asaFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (riskFilter === '' || r.compositeRisk === riskFilter) &&
        (asaFilter === '' || r.asaGrade === asaFilter)
    )
  );

  const riskLabel: Record<string, string> = {
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
    critical: 'Critical'
  };

  // SVAR DataGrid columns. The ASA grade, RCRI, STOP-BANG, CFS, composite risk,
  // and flag count all render through the shared engine output so the dashboard
  // and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'assessedDate', header: 'Assessed', sortable: true },
    { id: 'procedure', header: 'Procedure' },
    {
      id: 'asaGrade',
      header: 'ASA',
      sortable: true,
      format: fmt((v: string) => (v ? `ASA ${v}` : '—'))
    },
    { id: 'rcriScore', header: 'RCRI', sortable: true },
    {
      id: 'stopbangScore',
      header: 'STOP-BANG',
      sortable: true
    },

    {
      id: 'frailtyScale',
      header: 'CFS',
      sortable: true,
      format: fmt((v: number | null) => (v == null ? '—' : String(v)))
    },
    {
      id: 'compositeRisk',
      header: 'Composite risk',
      sortable: true,
      format: fmt((v: string) => riskLabel[v] ?? v)
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/pre-anaesthesia-assessment/pre-anaesthesia-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Clinician pre-operative review dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Computed ASA grade, adjunct scores (RCRI / STOP-BANG / CFS), and composite perioperative
        risk for assessed patients, computed by the shared engine. Select a row to open the
        assessment.
      </p>
    </div>
    <a
      href="/pre-anaesthesia-assessment/pre-anaesthesia-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Composite risk</span>
      <select class="select inline-block w-auto" bind:value={riskFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">ASA grade</span>
      <select class="select inline-block w-auto" bind:value={asaFilter}>
        <option value="">All</option>
        <option value="I">ASA I</option>
        <option value="II">ASA II</option>
        <option value="III">ASA III</option>
        <option value="IV">ASA IV</option>
        <option value="V">ASA V</option>
        <option value="VI">ASA VI</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Clinician pre-operative review dashboard"
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
