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
  import { careSettingLabel, riskZoneLabel, formatTsb } from '#lib/engine/utils.js';
  import type { RiskZone } from '#lib/engine/types.js';

  let settingFilter = $state('');
  let zoneFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (settingFilter === '' || r.careSetting === settingFilter) &&
        (zoneFilter === '' || r.riskZone === zoneFilter)
    )
  );

  // SVAR DataGrid columns. Risk zone and treatment-threshold signals render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'infantIdentifier', header: 'Infant ID', sortable: true },
    { id: 'patientName', header: 'Infant', sortable: true },
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
      id: 'ageHours',
      header: 'Age (h)',
      sortable: true,
      format: fmt((v: number | null) => (v === null ? '—' : String(v)))
    },
    {
      id: 'tsb',
      header: 'TSB',
      sortable: true,
      format: fmt((v: number | null) => formatTsb(v))
    },
    {
      id: 'riskZone',
      header: 'Risk zone',
      sortable: true,
      format: fmt((v: RiskZone) => riskZoneLabel(v))
    },
    {
      id: 'aboveExchange',
      header: 'Exchange',
      format: fmt((v: boolean) => (v ? 'At/above' : 'Below'))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/bhutani-bilirubin-nomogram/bhutani-bilirubin-nomograms/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Bhutani nomogram dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Risk zone and treatment-threshold signals for assessed infants, computed by the shared
        engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/bhutani-bilirubin-nomogram/bhutani-bilirubin-nomograms/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={settingFilter}>
        <option value="">All</option>
        <option value="postnatal-ward">Postnatal ward</option>
        <option value="neonatal-unit">Neonatal unit</option>
        <option value="midwife-led-unit">Midwife-led unit</option>
        <option value="community">Community / midwifery follow-up</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Risk zone</span>
      <select class="select inline-block w-auto" bind:value={zoneFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="low-intermediate">Low-intermediate</option>
        <option value="high-intermediate">High-intermediate</option>
        <option value="high">High</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Bhutani nomogram dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} infants</p>
</main>
