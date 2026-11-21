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
  import { sampleLpaRows } from '#lib/data/sample-reports.js';
  import {
    decisionModeLabel,
    whenAttorneysCanActLabel,
    bandLabel,
    compositeRiskLabel
  } from '#lib/validator/labels.js';

  const plural = 'united-kingdom-lasting-powers-of-attorney-for-financial-decisions';

  let riskFilter = $state('');
  let modeFilter = $state('');

  const rows = $derived(
    sampleLpaRows.filter(
      (r) =>
        (riskFilter === '' || r.compositeRisk === riskFilter) &&
        (modeFilter === '' || r.decisionMode === modeFilter)
    )
  );

  // SVAR DataGrid columns. Validity band and composite risk render through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'donorName', header: 'Donor', sortable: true },
    {
      id: 'attorneyCount',
      header: 'Attorneys',
      sortable: true
    },

    {
      id: 'decisionMode',
      header: 'Decision mode',
      sortable: true,
      format: fmt((v: string) => decisionModeLabel(v))
    },
    {
      id: 'whenAttorneysCanAct',
      header: 'When can act',
      sortable: true,
      format: fmt((v: string) => whenAttorneysCanActLabel(v))
    },

    {
      id: 'replacementAttorneyCount',
      header: 'Replacements',
      sortable: true
    },

    {
      id: 'peopleToNotifyCount',
      header: 'Notify',
      sortable: true
    },

    {
      id: 'validityBand',
      header: 'Validity',
      sortable: true,
      format: fmt((v: string) => bandLabel(v))
    },
    {
      id: 'compositeRisk',
      header: 'Risk',
      sortable: true,
      format: fmt((v: string) => compositeRiskLabel(v as never))
    },
    {
      id: 'opgStatus',
      header: 'OPG status',
      sortable: true,
      format: fmt((v: string) => bandLabel(v))
    },
    { id: 'createdAt', header: 'Created', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'donorName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/united-kingdom-lasting-power-of-attorney-for-financial-decisions/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">LPA case dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Validity band and composite risk for each LP1F deed, computed by the shared validation
        engine. Select a row to open the LPA.
      </p>
    </div>
    <a
      href="/united-kingdom-lasting-power-of-attorney-for-financial-decisions/{plural}/new"
      class="button"
      data-variant="primary">New LPA</a
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
      <span class="mr-2 font-medium text-base-content/80">Decision mode</span>
      <select class="select inline-block w-auto" bind:value={modeFilter}>
        <option value="">All</option>
        <option value="single_attorney">Single attorney</option>
        <option value="jointly_and_severally">Jointly and severally</option>
        <option value="jointly">Jointly</option>
        <option value="mixed">Mixed</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="LPA case dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} LPAs</p>
</main>
