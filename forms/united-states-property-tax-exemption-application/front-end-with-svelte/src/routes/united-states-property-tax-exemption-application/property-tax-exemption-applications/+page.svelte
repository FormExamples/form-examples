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
  import { sampleApplicationRows } from '#lib/data/sample-reports.js';
  import { eligibilityClassLabel } from '#lib/engine/utils.js';

  let classFilter = $state('');

  const rows = $derived(
    sampleApplicationRows.filter((r) => classFilter === '' || r.eligibilityClass === classFilter)
  );

  // SVAR DataGrid columns. The eligibility class renders through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'parcelNumber', header: 'Parcel', sortable: true },
    { id: 'applicantName', header: 'Applicant', sortable: true },
    { id: 'countyState', header: 'County, state', sortable: true },
    { id: 'filingDate', header: 'Filed', sortable: true },
    {
      id: 'eligibilityClass',
      header: 'Eligibility',
      sortable: true,
      format: fmt((v: string) => eligibilityClassLabel(v as never))
    },
    { id: 'exemptionsClaimed', header: 'Exemptions', sortable: true },
    { id: 'filedLate', header: 'Filing', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'applicantName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(
      `/united-states-property-tax-exemption-application/property-tax-exemption-applications/${id}`
    );
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Assessor dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Eligibility class, exemptions claimed, late-filing indication and flag counts for
        applications, computed by the shared engine. Select a row to open the application. This
        dashboard classifies and checks; the county assessor decides.
      </p>
    </div>
    <a
      href="/united-states-property-tax-exemption-application/property-tax-exemption-applications/new"
      class="button"
      data-variant="primary"
    >
      New application
    </a>
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Eligibility</span>
      <select class="select inline-block w-auto" bind:value={classFilter}>
        <option value="">All</option>
        <option value="likely-eligible">Likely eligible</option>
        <option value="incomplete">Incomplete</option>
        <option value="likely-ineligible">Likely ineligible</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Assessor dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} applications</p>
</main>
