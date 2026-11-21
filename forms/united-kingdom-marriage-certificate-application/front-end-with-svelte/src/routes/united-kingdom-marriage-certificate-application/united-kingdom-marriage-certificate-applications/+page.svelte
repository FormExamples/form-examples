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
  import { sampleCertificateRows } from '#lib/data/sample-reports.js';
  import { validityClassLabel } from '#lib/engine/utils.js';

  let validityFilter = $state('');

  const rows = $derived(
    sampleCertificateRows.filter((r) => validityFilter === '' || r.validityClass === validityFilter)
  );

  // SVAR DataGrid columns. The validity class renders through the shared
  // engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Reference' },
    { id: 'partyNames', header: 'Parties', sortable: true },
    { id: 'registrationDistrict', header: 'District', sortable: true },
    { id: 'noticeDate', header: 'Notice date', sortable: true },
    { id: 'ceremonyDate', header: 'Ceremony date', sortable: true },
    {
      id: 'validityClass',
      header: 'Class',
      sortable: true,
      format: fmt((v: string) => validityClassLabel(v as never))
    },
    { id: 'immigrationReferral', header: 'Immigration referral', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'partyNames',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(
      `/united-kingdom-marriage-certificate-application/united-kingdom-marriage-certificate-applications/${id}`
    );
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Register-office dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Application class, ceremony date, immigration referral, and flag counts, computed by the
        shared engine. Select a row to open the application. This dashboard classifies and validates
        — it gives no legal advice, and the register office decides each notice.
      </p>
    </div>
    <a
      href="/united-kingdom-marriage-certificate-application/united-kingdom-marriage-certificate-applications/new"
      class="button"
      data-variant="primary">New application</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Validity</span>
      <select class="select inline-block w-auto" bind:value={validityFilter}>
        <option value="">All</option>
        <option value="ready-to-submit">Ready to submit</option>
        <option value="incomplete">Incomplete</option>
        <option value="needs-evidence">Needs evidence or correction</option>
        <option value="ineligible">Ineligible</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Register-office dashboard"
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
