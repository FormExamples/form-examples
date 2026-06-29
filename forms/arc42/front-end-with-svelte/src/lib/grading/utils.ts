import type { Arc42Documentation, Maturity, Completeness } from './types.js';

export function nonEmpty(s: string): boolean {
  return s.trim().length > 0;
}

/** Human-readable label for a maturity band. */
export function maturityLabel(m: Maturity): string {
  switch (m) {
    case 'draft':
      return 'Draft';
    case 'reviewable':
      return 'Reviewable';
    case 'ready':
      return 'Ready';
    case 'mature':
      return 'Mature';
    default:
      return '—';
  }
}

/** Lily-token banner classes for a maturity band (low→error … high→success). */
export function maturityColor(m: Maturity): string {
  switch (m) {
    case 'mature':
      return 'bg-success text-success-content border-success';
    case 'ready':
      return 'bg-info text-info-content border-info';
    case 'reviewable':
      return 'bg-warning text-warning-content border-warning';
    case 'draft':
      return 'bg-error text-error-content border-error';
    default:
      return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Human-readable label for a completeness state. */
export function completenessLabel(c: Completeness): string {
  switch (c) {
    case 'complete':
      return 'Complete';
    case 'partial':
      return 'Partial';
    default:
      return 'Empty';
  }
}

/** Lily-token text classes for a completeness state. */
export function completenessColor(c: Completeness): string {
  switch (c) {
    case 'complete':
      return 'text-success';
    case 'partial':
      return 'text-warning';
    default:
      return 'text-error';
  }
}

/** Human-readable label for a sign-off recommendation. */
export function recommendationLabel(r: string): string {
  switch (r) {
    case 'proceed':
      return 'Proceed';
    case 'revise-first':
      return 'Revise first';
    case 'block':
      return 'Block';
    default:
      return '—';
  }
}

/** Count of the 12 sections graded `complete`. */
export function completeSectionCount(byS: Record<number, Completeness>): number {
  let n = 0;
  for (let i = 1; i <= 12; i++) if (byS[i] === 'complete') n++;
  return n;
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
