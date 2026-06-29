import type { CompositeRisk, ClavienDindoGrade, BloodLossBand } from './types.js';

/**
 * Ordering of composite risk bands. Higher index = worse.
 */
const RISK_ORDER: CompositeRisk[] = ['routine', 'complicated', 'high-risk', 'critical'];

export function maxRisk(a: CompositeRisk, b: CompositeRisk): CompositeRisk {
  return RISK_ORDER.indexOf(a) >= RISK_ORDER.indexOf(b) ? a : b;
}

export function riskRank(r: CompositeRisk): number {
  return RISK_ORDER.indexOf(r);
}

const CD_ORDER: ClavienDindoGrade[] = ['0', 'I', 'II', 'IIIa', 'IIIb', 'IVa', 'IVb', 'V'];

export function maxClavienDindo(
  a: ClavienDindoGrade,
  b: ClavienDindoGrade,
): ClavienDindoGrade {
  return CD_ORDER.indexOf(a) >= CD_ORDER.indexOf(b) ? a : b;
}

/**
 * Map estimated blood loss in mL to a band.
 *
 * Bands (per RCS Good Surgical Practice / NICE NG24):
 *   minimal  ≤ 100
 *   mild     ≤ 500
 *   moderate ≤ 1500
 *   severe   ≤ 3000
 *   massive  > 3000
 *
 * Null returns 'minimal' (assume nothing has been entered yet).
 */
export function bloodLossBand(ml: number | null): BloodLossBand {
  if (ml === null || ml <= 100) return 'minimal';
  if (ml <= 500) return 'mild';
  if (ml <= 1500) return 'moderate';
  if (ml <= 3000) return 'severe';
  return 'massive';
}

export function computeBmi(
  weightKg: number | null,
  heightCm: number | null,
): number | null {
  if (weightKg === null || heightCm === null || heightCm <= 0) return null;
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

/**
 * Sum PRBC + FFP + platelet + cryo units transfused intra-operatively.
 */
export function totalTransfusionUnits(
  prbc: number | null,
  ffp: number | null,
  plt: number | null,
  cryo: number | null,
): number {
  return (prbc ?? 0) + (ffp ?? 0) + (plt ?? 0) + (cryo ?? 0);
}

/** Human-readable label for a composite operative-risk band. */
export function compositeRiskLabel(r: CompositeRisk): string {
  switch (r) {
    case 'routine': return 'Routine';
    case 'complicated': return 'Complicated';
    case 'high-risk': return 'High-risk';
    case 'critical': return 'Critical';
    default: return '—';
  }
}

/**
 * Lily-token utility classes (background / text / border triple) for a
 * composite operative-risk band. Routine → success, Complicated → warning,
 * High-risk → error, Critical → error (emphasised by the caller).
 */
export function compositeRiskColor(r: CompositeRisk): string {
  switch (r) {
    case 'routine': return 'bg-success text-success-content border-success';
    case 'complicated': return 'bg-warning text-warning-content border-warning';
    case 'high-risk': return 'bg-error text-error-content border-error';
    case 'critical': return 'bg-error text-error-content border-error';
    default: return 'bg-base-300 text-base-content border-base-300';
  }
}

/** Human-readable label for a Clavien–Dindo grade. */
export function clavienDindoLabel(g: ClavienDindoGrade): string {
  return g === '0' ? 'None' : `Grade ${g}`;
}

/** Human-readable label for an estimated-blood-loss band. */
export function bloodLossBandLabel(b: BloodLossBand): string {
  return b.charAt(0).toUpperCase() + b.slice(1);
}
