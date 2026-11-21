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
  import { riskLevelLabel, auditRiskLabel } from '#lib/engine/utils.js';

  let riskFilter = $state('');
  let auditFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (riskFilter === '' || r.riskLevel === riskFilter) &&
        (auditFilter === '' || r.auditCategory === auditFilter)
    )
  );

  // SVAR DataGrid columns. AUDIT / DAST scores and the overall risk render
  // through the shared engine output so the dashboard and report stay aligned.
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
      id: 'auditScore',
      header: 'AUDIT',
      sortable: true,
      format: fmt((v: number) => `${v}/40`)
    },
    {
      id: 'auditCategory',
      header: 'AUDIT band',
      sortable: true,
      format: fmt((v: string) => auditRiskLabel(v as never))
    },
    {
      id: 'dastScore',
      header: 'DAST-10',
      sortable: true,
      format: fmt((v: number) => `${v}/10`)
    },
    {
      id: 'riskLevel',
      header: 'Overall risk',
      sortable: true,
      format: fmt((v: string) => riskLevelLabel(v as never))
    },

    {
      id: 'ivFlag',
      header: 'IV use',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },

    {
      id: 'withdrawalFlag',
      header: 'Withdrawal',
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
    goto(`/substance-abuse-assessment/substance-abuse-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Substance abuse clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        AUDIT and DAST-10 scores and overall substance use risk for assessed patients, computed by
        the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/substance-abuse-assessment/substance-abuse-assessments/new"
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
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">AUDIT band</span>
      <select class="select inline-block w-auto" bind:value={auditFilter}>
        <option value="">All</option>
        <option value="low-risk">Low Risk (0-7)</option>
        <option value="hazardous">Hazardous (8-15)</option>
        <option value="harmful">Harmful (16-19)</option>
        <option value="dependence-likely">Dependence Likely (20-40)</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Substance abuse clinician dashboard"
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
