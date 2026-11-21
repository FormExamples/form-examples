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
  import { riskLabel, reviewPathwayLabel, referralLabel } from '#lib/engine/utils.js';

  let riskFilter = $state('');
  let referralFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (riskFilter === '' || r.overallRisk === riskFilter) &&
        (referralFilter === '' || r.referral === referralFilter)
    )
  );

  // SVAR DataGrid columns. Per-foot risk, overall risk, review pathway, and
  // referral render through the shared engine output so the dashboard and
  // report stay aligned.
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
      id: 'rightFootRisk',
      header: 'Right foot',
      sortable: true,
      format: fmt((v: string) => riskLabel(v))
    },
    {
      id: 'leftFootRisk',
      header: 'Left foot',
      sortable: true,
      format: fmt((v: string) => riskLabel(v))
    },
    {
      id: 'overallRisk',
      header: 'Overall risk',
      sortable: true,
      format: fmt((v: string) => riskLabel(v))
    },
    {
      id: 'reviewPathway',
      header: 'Review pathway',
      sortable: true,
      format: fmt((v: string) => reviewPathwayLabel(v))
    },
    {
      id: 'referral',
      header: 'Referral',
      sortable: true,
      format: fmt((v: string) => referralLabel(v))
    },
    {
      id: 'urgentFlag',
      header: 'Urgent',
      sortable: true,
      format: fmt((v: boolean) => (v ? 'Yes' : '—'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/diabetes-podiatry-assessment/diabetes-podiatry-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Diabetes podiatry assessment dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Per-foot and overall risk, review pathway, referral, and safety flags for assessed patients,
        computed by the shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/diabetes-podiatry-assessment/diabetes-podiatry-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Overall risk</span>
      <select class="select inline-block w-auto" bind:value={riskFilter}>
        <option value="">All</option>
        <option value="low">Low risk</option>
        <option value="moderate">Moderate risk</option>
        <option value="high">High risk</option>
        <option value="active-urgent">Active / urgent</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Referral</span>
      <select class="select inline-block w-auto" bind:value={referralFilter}>
        <option value="">All</option>
        <option value="none">No referral</option>
        <option value="foot-protection-service">Foot protection service</option>
        <option value="multidisciplinary-foot-team">Multidisciplinary foot team</option>
        <option value="urgent-mdt">Urgent multidisciplinary foot team</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Diabetes podiatry assessment dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} assessments</p>
</main>
