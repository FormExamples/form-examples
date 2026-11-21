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
  import { bandLabel, careSettingLabel } from '#lib/engine/utils.js';

  let settingFilter = $state('');
  let bandFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (settingFilter === '' || r.careSetting === settingFilter) &&
        (bandFilter === '' || r.burdenBand === bandFilter)
    )
  );

  // SVAR DataGrid columns. Total score, band, and instrument form render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'carerIdentifier', header: 'Carer ID', sortable: true },
    { id: 'carerName', header: 'Carer', sortable: true },
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
      id: 'instrumentForm',
      header: 'Form',
      sortable: true,
      format: fmt((v: string) => (v === 'zbi12' ? 'ZBI-12' : 'ZBI-22'))
    },
    {
      id: 'totalScore',
      header: 'Total',
      sortable: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      format: fmt((v: number, row: any) => `${v} / ${row.maxScore}`)
    },
    {
      id: 'burdenBand',
      header: 'Band',
      sortable: true,
      format: fmt((v: string) => bandLabel(v as never))
    },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'carerName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/zarit-burden-interview/zarit-burden-interviews/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">ZBI clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        ZBI total, burden band, and flag count for assessed carers, computed by the shared engine.
        Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/zarit-burden-interview/zarit-burden-interviews/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Care setting</span>
      <select class="select inline-block w-auto" bind:value={settingFilter}>
        <option value="">All</option>
        <option value="memory-service">Old-age / memory service</option>
        <option value="community">Community / district nursing</option>
        <option value="general-practice">General practice</option>
        <option value="social-care">Social care / carer support</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Band</span>
      <select class="select inline-block w-auto" bind:value={bandFilter}>
        <option value="">All</option>
        <option value="little-or-none">Little or no burden (0-21)</option>
        <option value="mild-to-moderate">Mild to moderate (22-40)</option>
        <option value="moderate-to-severe">Moderate to severe (41-60)</option>
        <option value="severe">Severe (61-88)</option>
        <option value="lower">ZBI-12 lower (0-16)</option>
        <option value="high">ZBI-12 high (≥ 17)</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="ZBI clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} carers</p>
</main>
