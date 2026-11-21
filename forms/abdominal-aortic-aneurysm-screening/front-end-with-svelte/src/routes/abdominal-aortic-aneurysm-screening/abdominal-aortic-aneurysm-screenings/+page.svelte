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
  import { categoryLabel, eligibilityRouteLabel, formatDiameter } from '#lib/engine/utils.js';

  let routeFilter = $state('');
  let categoryFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (routeFilter === '' || r.eligibilityRoute === routeFilter) &&
        (categoryFilter === '' || r.category === categoryFilter)
    )
  );

  // SVAR DataGrid columns. The diameter, category, and referral flag render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'patientIdentifier', header: 'Patient ID', sortable: true },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'scannedDate', header: 'Scanned', sortable: true },
    {
      id: 'eligibilityRoute',
      header: 'Eligibility',
      sortable: true,
      format: fmt((v: string) => eligibilityRouteLabel(v as never) || '—')
    },
    {
      id: 'maxAorticDiameterCm',
      header: 'Max diameter',
      sortable: true,
      format: fmt((v: number | null) => formatDiameter(v))
    },
    {
      id: 'category',
      header: 'Category',
      sortable: true,
      format: fmt((v: string) => categoryLabel(v as never))
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
    goto(`/abdominal-aortic-aneurysm-screening/abdominal-aortic-aneurysm-screenings/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">AAA screening dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Maximum aortic diameter and category for scanned patients, computed by the shared engine.
        Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/abdominal-aortic-aneurysm-screening/abdominal-aortic-aneurysm-screenings/new"
      class="button"
      data-variant="primary">New scan</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Eligibility route</span>
      <select class="select inline-block w-auto" bind:value={routeFilter}>
        <option value="">All</option>
        <option value="routine-year-of-65">Routine — year of 65</option>
        <option value="self-referral-over-65">Self-referral — over 65</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Category</span>
      <select class="select inline-block w-auto" bind:value={categoryFilter}>
        <option value="">All</option>
        <option value="normal">Normal</option>
        <option value="small">Small aneurysm</option>
        <option value="medium">Medium aneurysm</option>
        <option value="large">Large aneurysm</option>
        <option value="non-visualised">Non-visualised</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="AAA screening dashboard"
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
