import type { Arc42Documentation } from './types.js';

export function nonEmpty(s: string): boolean {
  return s.trim().length > 0;
}

export function nonDraftAdrs(d: Arc42Documentation): number {
  return d.architecturalDecisions.filter((a) => a.status !== '' && a.status !== 'draft').length;
}

export function fullyPopulatedQualityScenarios(d: Arc42Documentation): number {
  return d.qualityScenarios.filter((q) =>
    nonEmpty(q.source) && nonEmpty(q.stimulus) && nonEmpty(q.artifact) && nonEmpty(q.response) && nonEmpty(q.measure),
  ).length;
}

export function risksWithMitigation(d: Arc42Documentation): number {
  return d.riskItems.filter((r) => nonEmpty(r.mitigation)).length;
}
