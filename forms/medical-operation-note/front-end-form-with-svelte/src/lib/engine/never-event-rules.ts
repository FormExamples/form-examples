import type { CompositeRisk, FiredRule, OperationNote } from './types.js';

/**
 * NHS England Never Events (2018 policy) relevant to the operating
 * theatre, parsed from a comma-separated list on
 * `safetyCountsEbl.neverEventFlags`.
 *
 * Accepted tokens (case-insensitive, trimmed):
 *   wrong-site, wrong-side, wrong-patient, wrong-procedure, wrong-implant
 *
 * Plus the standalone Boolean `retainedForeignBody === 'yes'`.
 *
 * Any of these forces composite risk = Critical.
 */
const KNOWN_TOKENS = new Set([
  'wrong-site',
  'wrong-side',
  'wrong-patient',
  'wrong-procedure',
  'wrong-implant',
]);

export function applyNeverEventRules(data: OperationNote): {
  fired: boolean;
  risk: CompositeRisk;
  firedRules: FiredRule[];
  tokens: string[];
  retainedForeignBody: boolean;
} {
  const firedRules: FiredRule[] = [];
  const raw = data.safetyCountsEbl.neverEventFlags || '';
  const tokens = raw
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0 && KNOWN_TOKENS.has(t));

  for (const t of tokens) {
    firedRules.push({
      ruleId: `R-NE-${t.toUpperCase()}`,
      instrument: 'never-event',
      grade: 'critical',
      category: 'never-event',
      description: `Never-event suspicion: ${t}`,
    });
  }

  const retainedForeignBody = data.safetyCountsEbl.retainedForeignBody === 'yes';
  if (retainedForeignBody) {
    firedRules.push({
      ruleId: 'R-NE-RETAINED-FOREIGN-BODY',
      instrument: 'never-event',
      grade: 'critical',
      category: 'never-event',
      description: 'Retained foreign body declared',
    });
  }

  if (data.safetyCountsEbl.intraOperativeArrest === 'yes') {
    firedRules.push({
      ruleId: 'R-NE-INTRA-OP-ARREST',
      instrument: 'never-event',
      grade: 'critical',
      category: 'arrest',
      description: 'Intra-operative cardiac or respiratory arrest',
    });
  }

  const fired = tokens.length > 0 || retainedForeignBody ||
    data.safetyCountsEbl.intraOperativeArrest === 'yes';

  return {
    fired,
    risk: fired ? 'critical' : 'routine',
    firedRules,
    tokens,
    retainedForeignBody,
  };
}
