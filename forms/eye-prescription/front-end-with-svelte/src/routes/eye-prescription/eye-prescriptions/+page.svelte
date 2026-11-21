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
  import { complexityLabel, lensTypeLabel } from '#lib/engine/utils.js';

  let complexityFilter = $state('');
  let lensFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (complexityFilter === '' || r.complexity === complexityFilter) &&
        (lensFilter === '' || r.lensType === lensFilter)
    )
  );

  // SVAR DataGrid columns. The complexity grade and flag counts render through
  // the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Prescription' },
    { id: 'patientName', header: 'Patient', sortable: true },
    { id: 'issueDate', header: 'Issued', sortable: true },
    { id: 'expiryDate', header: 'Expires', sortable: true },
    {
      id: 'complexity',
      header: 'Complexity',
      sortable: true,
      format: fmt((v: string) => complexityLabel(v as never))
    },
    {
      id: 'lensType',
      header: 'Lens type',
      sortable: true,
      format: fmt((v: string) => lensTypeLabel(v))
    },

    {
      id: 'prismFlag',
      header: 'Prism',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
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
    goto(`/eye-prescription/eye-prescriptions/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Eye prescription dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Prescription-complexity grade and safety-flag counts for issued prescriptions, computed by
        the shared engine. Select a row to open the prescription.
      </p>
    </div>
    <a href="/eye-prescription/eye-prescriptions/new" class="button" data-variant="primary"
      >New prescription</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Complexity</span>
      <select class="select inline-block w-auto" bind:value={complexityFilter}>
        <option value="">All</option>
        <option value="simple">Simple</option>
        <option value="moderate">Moderate</option>
        <option value="complex">Complex</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Lens type</span>
      <select class="select inline-block w-auto" bind:value={lensFilter}>
        <option value="">All</option>
        <option value="single-vision-distance">Single vision — distance</option>
        <option value="single-vision-near">Single vision — near</option>
        <option value="single-vision-intermediate">Single vision — intermediate</option>
        <option value="bifocal">Bifocal</option>
        <option value="trifocal">Trifocal</option>
        <option value="varifocal">Varifocal</option>
        <option value="occupational-varifocal">Occupational varifocal</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Eye prescription dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} prescriptions</p>
</main>
