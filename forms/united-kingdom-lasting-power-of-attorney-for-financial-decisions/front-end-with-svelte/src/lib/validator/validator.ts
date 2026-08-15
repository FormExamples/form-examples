import type {
  AdditionalFlag,
  CompositeRisk,
  FiredRule,
  Lpa,
  ValidationResult,
} from '#lib/types.js';
import { applyBlockerRules } from './blocker-rules.js';
import { applyFlagRules } from './flag-rules.js';
import { computeValidityBand } from './band-rules.js';

// Max-grade composite risk. Any blocker promotes to critical; otherwise
// the worst flag wins (high > moderate > low). Default low.
function computeCompositeRisk(
  firedRules: FiredRule[],
  flags: AdditionalFlag[],
): CompositeRisk {
  if (firedRules.length > 0) return 'critical';
  if (flags.some((f) => f.priority === 'high')) return 'high';
  if (flags.some((f) => f.priority === 'moderate')) return 'moderate';
  return 'low';
}

export function validateLpa(lpa: Lpa): ValidationResult {
  const firedRules = applyBlockerRules(lpa);
  const additionalFlags = applyFlagRules(lpa);
  const compositeRisk = computeCompositeRisk(firedRules, additionalFlags);
  const validityBand = computeValidityBand(lpa);
  return {
    validityBand,
    compositeRisk,
    firedRules,
    additionalFlags,
  };
}
