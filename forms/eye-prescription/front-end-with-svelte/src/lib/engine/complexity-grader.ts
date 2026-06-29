import type { Complexity, SphereClass, CylinderClass } from './types.js';

function isHighBand(s: SphereClass, c: CylinderClass): boolean {
  return s === 'high-myopia' || s === 'high-hyperopia' || c === 'high-astigmatism';
}
function isModerateBand(s: SphereClass, c: CylinderClass): boolean {
  return s === 'moderate-myopia' || s === 'moderate-hyperopia' || c === 'moderate-astigmatism';
}

export interface ComplexityInputs {
  rightEyeSphereClass: SphereClass;
  rightEyeCylinderClass: CylinderClass;
  leftEyeSphereClass: SphereClass;
  leftEyeCylinderClass: CylinderClass;
  presbyopiaClass: string;
  anisometropia: number | null;
  prismPresent: boolean;
}

export function computeComplexity(i: ComplexityInputs): Exclude<Complexity, ''> {
  if (
    isHighBand(i.rightEyeSphereClass, i.rightEyeCylinderClass) ||
    isHighBand(i.leftEyeSphereClass, i.leftEyeCylinderClass)
  ) return 'complex';
  if (i.prismPresent) return 'complex';
  if (i.anisometropia !== null && i.anisometropia > 2.00) return 'complex';
  if (i.presbyopiaClass !== 'none' && i.presbyopiaClass !== '') return 'moderate';
  if (
    isModerateBand(i.rightEyeSphereClass, i.rightEyeCylinderClass) ||
    isModerateBand(i.leftEyeSphereClass, i.leftEyeCylinderClass)
  ) return 'moderate';
  return 'simple';
}
