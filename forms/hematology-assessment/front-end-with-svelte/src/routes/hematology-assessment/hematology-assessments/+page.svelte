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
  import { abnormalityLevelLabel } from '#lib/engine/utils.js';
  import type { AbnormalityLevel } from '#lib/engine/types.js';

  let levelFilter = $state('');
  let specimenFilter = $state('');

  const rows = $derived(
    sampleAssessmentRows.filter(
      (r) =>
        (levelFilter === '' || r.abnormalityLevel === levelFilter) &&
        (specimenFilter === '' || r.specimenType === specimenFilter)
    )
  );

  const specimenLabels: Record<string, string> = {
    edtaBlood: 'EDTA Blood',
    citratedBlood: 'Citrated Blood',
    serumSample: 'Serum Sample',
    boneMarrow: 'Bone Marrow',
    other: 'Other'
  };

  // SVAR DataGrid columns. The abnormality classification and composite score
  // render through the shared engine output so the dashboard and report stay
  // aligned.
  const columns: DataGridColumn[] = [
    { id: 'id', header: 'Assessment' },
    {
      id: 'patientName',
      header: 'Patient',
      sortable: true
    },

    {
      id: 'assessedDate',
      header: 'Assessed',
      sortable: true
    },

    {
      id: 'specimenType',
      header: 'Specimen',
      sortable: true,
      format: fmt((v: string) => specimenLabels[v] ?? v ?? '—')
    },
    {
      id: 'abnormalityLevel',
      header: 'Classification',
      sortable: true,
      format: fmt((v: string) => abnormalityLevelLabel(v as AbnormalityLevel))
    },
    {
      id: 'abnormalityScore',
      header: 'Score',
      sortable: true,
      format: fmt((v: number) => `${v}%`)
    },
    { id: 'flagCount', header: 'Flags', sortable: true },
    {
      id: 'transfusionFlag',
      header: 'Transf. rxn',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    },

    {
      id: 'anticoagFlag',
      header: 'Anticoag.',
      format: fmt((v: boolean) => (v ? 'Yes' : 'No'))
    }
  ];

  let sort = $state<{ columnId: string; direction: 'ascending' | 'descending' | 'none' }>({
    columnId: 'patientName',
    direction: 'ascending'
  });

  // Open a record when its row is activated (click, or Enter on a cell).
  function open(_row: DataGridRow, id: string) {
    goto(`/hematology-assessment/hematology-assessments/${id}`);
  }
</script>

<main class="mx-16 px-4 py-6">
  <div class="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-base-content">Hematology clinician dashboard</h1>
      <p class="mt-1 text-sm text-base-content/70">
        Composite abnormality classification and score for assessed patients, computed by the shared
        engine. Select a row to open the assessment.
      </p>
    </div>
    <a
      href="/hematology-assessment/hematology-assessments/new"
      class="button"
      data-variant="primary">New assessment</a
    >
  </div>

  <div class="mb-4 flex flex-wrap gap-4">
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Classification</span>
      <select class="select inline-block w-auto" bind:value={levelFilter}>
        <option value="">All</option>
        <option value="normal">Normal</option>
        <option value="mildAbnormality">Mild Abnormality</option>
        <option value="moderateAbnormality">Moderate Abnormality</option>
        <option value="severeAbnormality">Severe Abnormality</option>
        <option value="critical">Critical</option>
        <option value="draft">Draft</option>
      </select>
    </label>
    <label class="text-sm">
      <span class="mr-2 font-medium text-base-content/80">Specimen type</span>
      <select class="select inline-block w-auto" bind:value={specimenFilter}>
        <option value="">All</option>
        <option value="edtaBlood">EDTA Blood</option>
        <option value="citratedBlood">Citrated Blood</option>
        <option value="serumSample">Serum Sample</option>
        <option value="boneMarrow">Bone Marrow</option>
        <option value="other">Other</option>
      </select>
    </label>
  </div>

  <DataGrid
    label="Hematology clinician dashboard"
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
