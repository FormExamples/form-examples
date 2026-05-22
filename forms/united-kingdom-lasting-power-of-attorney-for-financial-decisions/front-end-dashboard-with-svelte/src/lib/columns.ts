// SVAR Svelte Grid column configuration for the LPA dashboard.
// One entry per displayed LpaRow field. Display formatting for enum-valued
// columns (decisionMode, whenAttorneysCanAct, validityBand, compositeRisk,
// opgStatus) is performed by `formatRow()` before the rows reach the grid,
// so SVAR Grid renders human-readable strings directly without needing
// custom cell components.

import type { LpaRow } from './types.js';

export interface GridColumn {
  id: keyof LpaRow;
  header: string;
  width?: number;
  flexgrow?: number;
  sort?: boolean;
}

export const columns: GridColumn[] = [
  { id: 'donorName', header: 'Donor', flexgrow: 2, sort: true },
  { id: 'attorneyCount', header: 'Attorneys', width: 100, sort: true },
  { id: 'decisionMode', header: 'Decision mode', width: 220, sort: true },
  { id: 'whenAttorneysCanAct', header: 'When can act', width: 220, sort: true },
  { id: 'replacementAttorneyCount', header: 'Replacements', width: 130, sort: true },
  { id: 'peopleToNotifyCount', header: 'Notify', width: 90, sort: true },
  { id: 'validityBand', header: 'Validity', width: 180, sort: true },
  { id: 'compositeRisk', header: 'Risk', width: 110, sort: true },
  { id: 'opgStatus', header: 'OPG status', width: 180, sort: true },
  { id: 'createdAt', header: 'Created', width: 120, sort: true },
];

export function decisionModeLabel(mode: string): string {
  switch (mode) {
    case 'single_attorney':
      return 'Single attorney';
    case 'jointly_and_severally':
      return 'Jointly and severally';
    case 'jointly':
      return 'Jointly';
    case 'mixed':
      return 'Mixed';
    default:
      return '—';
  }
}

export function whenAttorneysCanActLabel(when: string): string {
  switch (when) {
    case 'as_soon_as_registered':
      return 'As soon as registered';
    case 'only_when_no_capacity':
      return 'Only when no capacity';
    default:
      return '—';
  }
}

export function validityBandLabel(band: string): string {
  return band ? band.replace(/_/g, ' ') : '—';
}

export function statusLabel(status: string): string {
  return status ? status.replace(/_/g, ' ') : '—';
}

export interface DisplayRow {
  id: string;
  donorName: string;
  attorneyCount: number;
  decisionMode: string;
  whenAttorneysCanAct: string;
  replacementAttorneyCount: number;
  peopleToNotifyCount: number;
  validityBand: string;
  compositeRisk: string;
  opgStatus: string;
  opgReferenceNumber: string;
  createdAt: string;
}

export function formatRow(r: LpaRow): DisplayRow {
  return {
    id: r.id,
    donorName: r.donorName,
    attorneyCount: r.attorneyCount,
    decisionMode: decisionModeLabel(r.decisionMode),
    whenAttorneysCanAct: whenAttorneysCanActLabel(r.whenAttorneysCanAct),
    replacementAttorneyCount: r.replacementAttorneyCount,
    peopleToNotifyCount: r.peopleToNotifyCount,
    validityBand: validityBandLabel(r.validityBand),
    compositeRisk: r.compositeRisk,
    opgStatus: statusLabel(r.opgStatus),
    opgReferenceNumber: r.opgReferenceNumber,
    createdAt: r.createdAt ? r.createdAt.slice(0, 10) : '',
  };
}
