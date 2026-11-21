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
  import { riskLevelShort } from '#lib/engine/utils.js';

  let riskFilter = $state('');
  let urgencyFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (riskFilter === '' || r.riskLevel === riskFilter) &&
        (urgencyFilter === '' || r.urgency === urgencyFilter)
    )
  );

  const urgencyText: Record<string, string> = {
    routine: 'Routine',
    urgent: 'Urgent',
    emergency: 'Emergency'
  };

  // SVAR DataGrid columns. The risk level and flag counts render through the
  // shared engine output so the dashboard and report stay aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Intake' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'submittedDate',
      header: 'Submitted',
      sortable: true
    },

    {
      id: 'riskLevel',
      header: 'Risk level',
      sortable: true,
      format: fmt((v: string) => riskLevelShort(v as never))
    },
    {
      id: 'urgency',
      header: 'Urgency',
      sortable: true,
      format: fmt((v: string) => urgencyText[v] ?? (v || '—'))
    },

    {
      id: 'allergyFlag',
      header: 'Allergy',
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
    goto(`/patient-intake/patient-intakes/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Patient intake clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Risk level, visit urgency, and safety flags for intake records, computed by the shared
        engine. Select a row to open the intake.
      </p>
    </div>
    <a href="/patient-intake/patient-intakes/new" class="button" data-variant="primary"
      >New intake</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Risk level</span>
      <select class="select inline-block w-auto" bind:value={riskFilter}>
        <option value="">All</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Urgency</span>
      <select class="select inline-block w-auto" bind:value={urgencyFilter}>
        <option value="">All</option>
        <option value="routine">Routine</option>
        <option value="urgent">Urgent</option>
        <option value="emergency">Emergency</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Patient intake clinician dashboard"
    {columns}
    rows={rows.map((row) => ({ ...row }))}
    rowId={(row) => String(row.id)}
    bind:sort
    emptyValue="—"
    onRowActivate={open}
    labels={{ sortAnnouncement: (header, direction) => `${header} sorted ${direction}` }}
  />

  <p class="mt-4 text-sm text-base-content/60">{rows.length} intakes</p>
</main>
