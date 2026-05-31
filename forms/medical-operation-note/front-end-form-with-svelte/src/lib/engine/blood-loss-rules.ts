import type {
  BloodLossBand,
  CompositeRisk,
  FiredRule,
  OperationNote,
} from './types.js';
import { bloodLossBand } from './utils.js';

/**
 * Map a blood-loss band to the composite-risk band it drives.
 *
 *   minimal, mild → routine
 *   moderate      → complicated   (EBL 501-1500 mL band per spec)
 *   severe        → high-risk     (EBL 1501-3000 mL)
 *   massive       → critical      (EBL > 3000 mL)
 */
export function bloodLossToRisk(band: BloodLossBand): CompositeRisk {
  switch (band) {
    case 'minimal':
    case 'mild':
      return 'routine';
    case 'moderate':
      return 'complicated';
    case 'severe':
      return 'high-risk';
    case 'massive':
      return 'critical';
  }
}

/**
 * Apply blood-loss + transfusion rules. The numeric EBL drives the band;
 * additionally, EBL > 1500 mL flags massive haemorrhage as a separate
 * fired rule (also rendered as an AdditionalFlag in flagged-issues.ts).
 */
export function applyBloodLossRules(data: OperationNote): {
  band: BloodLossBand;
  firedRules: FiredRule[];
} {
  const ebl = data.safetyCountsEbl.estimatedBloodLossMl;
  const band = bloodLossBand(ebl);
  const firedRules: FiredRule[] = [];

  if (band !== 'minimal' && band !== 'mild') {
    firedRules.push({
      ruleId: `R-EBL-${band.toUpperCase()}`,
      instrument: 'blood-loss',
      grade: band,
      category: 'haemorrhage',
      description: `Estimated blood loss ${ebl ?? 0} mL — ${band} band`,
    });
  }

  if ((ebl ?? 0) > 1500) {
    firedRules.push({
      ruleId: 'R-EBL-MASSIVE-HAEMORRHAGE',
      instrument: 'blood-loss',
      grade: 'massive',
      category: 'haemorrhage',
      description: `EBL ${ebl ?? 0} mL exceeds 1500 mL — massive haemorrhage threshold`,
    });
  }

  return { band, firedRules };
}
