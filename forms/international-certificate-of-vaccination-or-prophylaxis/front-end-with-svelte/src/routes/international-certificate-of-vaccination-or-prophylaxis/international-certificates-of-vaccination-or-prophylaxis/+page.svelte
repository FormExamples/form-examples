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
  import { diseaseLabel, validityStatusLabel } from '#lib/engine/utils.js';

  const plural = 'international-certificates-of-vaccination-or-prophylaxis';

  let diseaseFilter = $state('');
  let validityFilter = $state('');

  const rows = $derived(
    sampleCertificateRows.filter(
      (r) =>
        (diseaseFilter === '' || r.primaryDisease === diseaseFilter) &&
        (validityFilter === '' || r.validityStatus === validityFilter)
    )
  );

  // SVAR DataGrid columns. The validity status and error / warning counts render
  // through the shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Certificate' },
    { id: 'vaccineeName', header: 'Vaccinee', sortable: true },
    { id: 'centre', header: 'Centre', sortable: true },
    {
      id: 'issuingCountry',
      header: 'Country',
      sortable: true
    },

    {
      id: 'primaryDisease',
      header: 'Disease',
      sortable: true,
      format: fmt((v: string) => diseaseLabel(v))
    },
    { id: 'entriesCount', header: 'Entries', sortable: true },
    {
      id: 'vaccinationDate',
      header: 'Vaccinated',
      sortable: true
    },

    {
      id: 'validityStatus',
      header: 'Validity',
      sortable: true,
      format: fmt((v: string) => validityStatusLabel(v as never))
    },
    { id: 'errorCount', header: 'Errors', sortable: true },
    { id: 'warningCount', header: 'Warnings', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'vaccineeName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/international-certificate-of-vaccination-or-prophylaxis/${plural}/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Certificate registry</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Issued certificates with their primary disease, vaccination date, computed validity, and
        error / warning counts from the shared engine. Select a row to open the certificate.
      </p>
    </div>
    <a
      href="/international-certificate-of-vaccination-or-prophylaxis/{plural}/new"
      class="button"
      data-variant="primary">New certificate</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Disease</span>
      <select class="select inline-block w-auto" bind:value={diseaseFilter}>
        <option value="">All</option>
        <option value="yellow-fever">Yellow fever</option>
        <option value="polio">Polio</option>
        <option value="smallpox">Smallpox</option>
        <option value="cholera">Cholera</option>
        <option value="meningococcal">Meningococcal</option>
        <option value="covid-19">COVID-19</option>
        <option value="other">Other</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Validity</span>
      <select class="select inline-block w-auto" bind:value={validityFilter}>
        <option value="">All</option>
        <option value="valid">Valid</option>
        <option value="invalid">Invalid</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Certificate registry"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} certificates</p>
</main>
