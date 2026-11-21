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
  import { kdigoRiskZoneLabel, reviewStatusLabel } from '#lib/engine/utils.js';

  let zoneFilter = $state('');
  let reviewFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows
      .map((r) => ({
        ...r,
        // A review with no staging is "not classified" rather than a zone.
        zoneDisplay: r.kdigoRiskZone ?? 'not-classified'
      }))
      .filter(
        (r) =>
          (zoneFilter === '' || r.zoneDisplay === zoneFilter) &&
          (reviewFilter === '' || r.reviewStatus === reviewFilter)
      )
  );

  function zoneDisplayLabel(v: string): string {
    return v === 'not-classified' ? 'Not classified' : kdigoRiskZoneLabel(v as never);
  }

  // SVAR DataGrid columns. G-stage, albuminuria stage, KDIGO risk zone, and
  // review completeness render through the shared engine output so the
  // dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Review' },
    {
      id: 'patientIdentifier',
      header: 'Patient ID',
      sortable: true
    },

    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'reviewedDate',
      header: 'Reviewed',
      sortable: true
    },

    {
      id: 'gfrCategory',
      header: 'G-stage',
      sortable: true,
      format: fmt((v: string) => v || '—')
    },
    {
      id: 'albuminuriaCategory',
      header: 'A-stage',
      sortable: true,
      format: fmt((v: string) => v || '—')
    },
    {
      id: 'zoneDisplay',
      header: 'KDIGO risk zone',
      sortable: true,
      format: fmt((v: string) => zoneDisplayLabel(v))
    },
    {
      id: 'reviewStatus',
      header: 'Completeness',
      sortable: true,
      format: fmt((v: string) => reviewStatusLabel(v as never))
    },
    {
      id: 'referralFlag',
      header: 'Referral',
      sortable: true,
      format: fmt((v: boolean) => (v ? 'Yes' : '—'))
    },
    { id: 'highFlagCount', header: 'High flags', sortable: true },
    { id: 'flagCount', header: 'Flags', sortable: true }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/chronic-kidney-disease-review/chronic-kidney-disease-reviews/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Chronic kidney disease review dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        G-stage, albuminuria stage, KDIGO risk zone, review completeness, and flags for reviewed
        patients, computed by the shared engine. Select a row to open the review.
      </p>
    </div>
    <a
      href="/chronic-kidney-disease-review/chronic-kidney-disease-reviews/new"
      class="button"
      data-variant="primary">New review</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">KDIGO risk zone</span>
      <select class="select inline-block w-auto" bind:value={zoneFilter}>
        <option value="">All</option>
        <option value="low">Low risk</option>
        <option value="moderate">Moderate risk</option>
        <option value="high">High risk</option>
        <option value="very-high">Very high risk</option>
        <option value="not-classified">Not classified</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Completeness</span>
      <select class="select inline-block w-auto" bind:value={reviewFilter}>
        <option value="">All</option>
        <option value="complete">Complete</option>
        <option value="partial">Partial</option>
        <option value="incomplete">Incomplete</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Chronic kidney disease review dashboard"
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
