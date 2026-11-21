<script lang="ts">
  import { goto } from '$app/navigation';
  import DataGrid, {
    type DataGridColumn,
    type DataGridRow
  } from '@lilydesignsystem/svelte-data-grid';

  import { sampleAssessmentRows } from '#lib/data/sample-reports.js';

  let outcomeFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter((r) => outcomeFilter === '' || r.outcome === outcomeFilter)
  );

  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    { id: 'supplier', header: 'Supplier', sortable: true },
    { id: 'product', header: 'Product', sortable: true },
    { id: 'assessedDate', header: 'Assessed', sortable: true },
    { id: 'outcomeLabel', header: 'Outcome', sortable: true },
    { id: 'mandatoryMet', header: 'Mandatory met' },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'supplier',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/uk-nhs-digital-technology-assessment-criteria/assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">DTAC assessments dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Outcome, mandatory criteria met and flagged issues per assessed product, computed by the
        shared engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/uk-nhs-digital-technology-assessment-criteria/assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Outcome</span>
      <select class="select inline-block w-auto" bind:value={outcomeFilter}>
        <option value="">All</option>
        <option value="meets">Meets</option>
        <option value="conditional">Meets with conditions</option>
        <option value="does-not-meet">Does not meet</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="DTAC assessments dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} assessments</p>
</main>
