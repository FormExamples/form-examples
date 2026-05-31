import type { CompositeRisk, FiredRule, OperationNote } from './types.js';

/**
 * Resolve the swab/needle/instrument-count discrepancy state at sign-out.
 *
 * - All three explicitly agreed → counts agreed; no rule fires.
 * - Any one explicitly disagreed → discrepancy: composite risk ≥ High-risk.
 * - Retained foreign body declared independently → handled in
 *   `never-event-rules.ts` (forces Critical).
 */
export function applyCountRules(data: OperationNote): {
  countsAgreed: boolean;
  discrepancyRisk: CompositeRisk;
  firedRules: FiredRule[];
} {
  const s = data.safetyCountsEbl;
  const firedRules: FiredRule[] = [];

  const anyDisagreed =
    s.swabCountAgreed === 'no' ||
    s.needleCountAgreed === 'no' ||
    s.instrumentCountAgreed === 'no';

  const allAgreed =
    s.swabCountAgreed === 'yes' &&
    s.needleCountAgreed === 'yes' &&
    s.instrumentCountAgreed === 'yes';

  if (anyDisagreed) {
    firedRules.push({
      ruleId: 'R-COUNTS-DISCREPANCY',
      instrument: 'counts',
      grade: 'discrepancy',
      category: 'safety',
      description: 'Swab / needle / instrument count discrepancy at sign-out',
    });
    return { countsAgreed: false, discrepancyRisk: 'high-risk', firedRules };
  }

  return {
    countsAgreed: allAgreed,
    discrepancyRisk: 'routine',
    firedRules,
  };
}
