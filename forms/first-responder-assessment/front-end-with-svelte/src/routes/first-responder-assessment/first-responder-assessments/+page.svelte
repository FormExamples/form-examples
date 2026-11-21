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
  import { competencyLabel, fitnessDecisionLabel, riskLevelLabel } from '#lib/engine/utils.js';

  let fitnessFilter = $state('');
  let riskFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (fitnessFilter === '' || r.overallFitness === fitnessFilter) &&
        (riskFilter === '' || r.overallRisk === riskFilter)
    )
  );

  const roleLabels: Record<string, string> = {
    paramedic: 'Paramedic',
    emt: 'EMT',
    'first-aider': 'First Aider',
    'advanced-paramedic': 'Advanced Paramedic',
    'community-responder': 'Community Responder',
    other: 'Other'
  };

  // SVAR DataGrid columns. Overall competency, fitness decision, and risk
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    {
      id: 'responderName',
      header: 'Responder',
      sortable: true
    },

    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'roleType',
      header: 'Role',
      sortable: true,
      format: fmt((v: string) => roleLabels[v] ?? (v || '—'))
    },
    {
      id: 'overallCompetency',
      header: 'Competency',
      sortable: true,
      format: fmt((v: string) => competencyLabel(v as never))
    },
    {
      id: 'overallFitness',
      header: 'Fitness decision',
      sortable: true,
      format: fmt((v: string) => fitnessDecisionLabel(v as never))
    },
    {
      id: 'overallRisk',
      header: 'Overall risk',
      sortable: true,
      format: fmt((v: string) => riskLevelLabel(v as never))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'responderName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/first-responder-assessment/first-responder-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">First responder assessor dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Overall competency, fitness decision, and risk for assessed responders, computed by the
        shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/first-responder-assessment/first-responder-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Fitness decision</span>
      <select class="select inline-block w-auto" bind:value={fitnessFilter}>
        <option value="">All</option>
        <option value="fit-for-duty">Fit for Duty</option>
        <option value="fit-with-restrictions">Fit with Restrictions</option>
        <option value="temporarily-unfit">Temporarily Unfit</option>
        <option value="permanently-unfit">Permanently Unfit</option>
      </select>
    </label>
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
  </div>

  <DataGrid
    label="First responder assessor dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} responders</p>
</main>
