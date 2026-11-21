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
  import { complianceStatusLabel, riskLevelLabel } from '#lib/engine/utils.js';

  let complianceFilter = $state('');
  let riskFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (complianceFilter === '' || r.complianceStatus === complianceFilter) &&
        (riskFilter === '' || r.riskLevel === riskFilter)
    )
  );

  // SVAR DataGrid columns. Compliance status and overall risk render through
  // the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Checklist' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'assessedDate',
      header: 'Reviewed',
      sortable: true
    },

    {
      id: 'occupationCategory',
      header: 'Occupation',
      sortable: true
    },

    {
      id: 'complianceStatus',
      header: 'Compliance',
      sortable: true,
      format: fmt((v: string) => complianceStatusLabel(v as never))
    },
    {
      id: 'riskLevel',
      header: 'Overall risk',
      sortable: true,
      format: fmt((v: string) => riskLevelLabel(v as never))
    },

    {
      id: 'childhoodComplete',
      header: 'Childhood',
      format: fmt((v: boolean) => (v ? 'Complete' : 'Gaps'))
    },

    {
      id: 'covidComplete',
      header: 'COVID-19',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },

    {
      id: 'fluCurrent',
      header: 'Flu',
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
    goto(`/vaccinations-checklist/vaccinations-checklists/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Vaccinations clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Vaccination compliance status and overall exposure risk for reviewed patients, computed by
        the shared engine. Select a row to open the checklist.
      </p>
    </div>
    <a
      href="/vaccinations-checklist/vaccinations-checklists/new"
      class="button"
      data-variant="primary">New checklist</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Compliance</span>
      <select class="select inline-block w-auto" bind:value={complianceFilter}>
        <option value="">All</option>
        <option value="fully-immunised">Fully immunised</option>
        <option value="partially-immunised">Partially immunised</option>
        <option value="non-compliant">Non-compliant</option>
        <option value="contraindicated">Contraindicated</option>
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
    label="Vaccinations clinician dashboard"
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
