import type {
  EyePrescription, SphereClass, CylinderClass, PresbyopiaClass
} from './types.js';

export function classifySphere(sphere: number | null): SphereClass {
  if (sphere === null || sphere === undefined) return '';
  if (sphere < -6.00) return 'high-myopia';
  if (sphere <= -3.25) return 'moderate-myopia';
  if (sphere <= -0.75) return 'low-myopia';
  if (sphere <= 0.50 && sphere >= -0.50) return 'emmetropia';
  if (sphere <= 2.00) return 'low-hyperopia';
  if (sphere <= 5.00) return 'moderate-hyperopia';
  return 'high-hyperopia';
}

export function classifyCylinder(cylinder: number | null): CylinderClass {
  if (cylinder === null || cylinder === undefined) return '';
  const m = Math.abs(cylinder);
  if (m < 0.50) return 'none';
  if (m <= 1.00) return 'mild-astigmatism';
  if (m <= 2.50) return 'moderate-astigmatism';
  return 'high-astigmatism';
}

export function classifyPresbyopia(
  addRight: number | null,
  addLeft: number | null,
): PresbyopiaClass {
  const a = Math.max(addRight ?? 0, addLeft ?? 0);
  if (a < 0.75) return 'none';
  if (a <= 1.50) return 'early-presbyopia';
  if (a <= 2.50) return 'established-presbyopia';
  return 'advanced-presbyopia';
}

export function anisometropiaDiopters(p: EyePrescription): number | null {
  const r = p.rightEye.sphereDiopters;
  const l = p.leftEye.sphereDiopters;
  if (r === null || l === null) return null;
  return Math.abs(r - l);
}

export function prismPresent(p: EyePrescription): boolean {
  return (
    (p.rightEye.prismHorizontalDiopters || 0) > 0 ||
    (p.rightEye.prismVerticalDiopters || 0) > 0 ||
    (p.leftEye.prismHorizontalDiopters || 0) > 0 ||
    (p.leftEye.prismVerticalDiopters || 0) > 0
  );
}
