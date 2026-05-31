// SVAR DataGrid column definitions for the medical-operation-note dashboard.
//
// Each entry uses the shape consumed by `@svar-ui/svelte-grid`'s <Grid columns={…}>
// prop: `id` matches the row field, `header` is the visible label, `width`
// fixes the column in pixels, `align` controls cell alignment, and `sort` enables
// the SVAR sort icon. The dashboard's current standalone implementation uses
// the same definitions to render a Tailwind-styled HTML table, so the
// definitions are the single source of truth.

import type { OperationNoteRow } from './sample-data.js';

export interface DashboardColumn {
  id: keyof OperationNoteRow | 'patient' | 'procedure';
  header: string;
  width: number;
  align?: 'left' | 'right' | 'center';
  sort?: boolean;
  description?: string;
}

export const DASHBOARD_COLUMNS: DashboardColumn[] = [
  { id: 'hospital', header: 'Hospital', width: 200, align: 'left', sort: true },
  { id: 'theatre', header: 'Theatre', width: 90, align: 'left', sort: true },
  { id: 'listType', header: 'List', width: 110, align: 'left', sort: true },
  { id: 'surgeon', header: 'Lead surgeon', width: 160, align: 'left', sort: true },
  { id: 'patient', header: 'Patient', width: 90, align: 'left', sort: true,
    description: 'Anonymised label; no real NHS number rendered in the dashboard.' },
  { id: 'procedure', header: 'Primary procedure (OPCS-4)', width: 280, align: 'left', sort: true },
  { id: 'urgency', header: 'Urgency', width: 110, align: 'left', sort: true },
  { id: 'compositeRisk', header: 'Composite risk', width: 130, align: 'left', sort: true },
  { id: 'clavienDindoGrade', header: 'Clavien–Dindo', width: 120, align: 'center', sort: true },
  { id: 'estimatedBloodLossMl', header: 'EBL (mL)', width: 90, align: 'right', sort: true },
  { id: 'countsAgreed', header: 'Counts', width: 80, align: 'center', sort: true },
  { id: 'neverEventFlagged', header: 'Never event', width: 100, align: 'center', sort: true },
  { id: 'recoveryDestination', header: 'Recovery', width: 130, align: 'left', sort: true },
  { id: 'signedAt', header: 'Signed at', width: 170, align: 'left', sort: true },
];
