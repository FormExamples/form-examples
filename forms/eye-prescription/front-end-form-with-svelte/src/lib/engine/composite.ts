import type { EyePrescription, ClassificationResult, FiredRule } from './types.js';
import {
  classifySphere, classifyCylinder, classifyPresbyopia,
  anisometropiaDiopters, prismPresent,
} from './refractive-rules.js';
import { computeComplexity } from './complexity-grader.js';
import { flaggedIssues } from './flagged-issues.js';

function makeFiredRules(p: EyePrescription, r: ClassificationResult): FiredRule[] {
  const out: FiredRule[] = [];
  if (r.rightEyeSphereClass) {
    out.push({
      ruleId: `R-SPH-${r.rightEyeSphereClass.toUpperCase()}`,
      instrument: 'sphere', eye: 'right', class: r.rightEyeSphereClass,
      category: 'refraction',
      description: `Right sphere ${p.rightEye.sphereDiopters} D → ${r.rightEyeSphereClass}`,
    });
  }
  if (r.leftEyeSphereClass) {
    out.push({
      ruleId: `R-SPH-${r.leftEyeSphereClass.toUpperCase()}`,
      instrument: 'sphere', eye: 'left', class: r.leftEyeSphereClass,
      category: 'refraction',
      description: `Left sphere ${p.leftEye.sphereDiopters} D → ${r.leftEyeSphereClass}`,
    });
  }
  if (r.rightEyeCylinderClass && r.rightEyeCylinderClass !== 'none') {
    out.push({
      ruleId: `R-CYL-${r.rightEyeCylinderClass.toUpperCase()}`,
      instrument: 'cylinder', eye: 'right', class: r.rightEyeCylinderClass,
      category: 'refraction',
      description: `Right cylinder ${p.rightEye.cylinderDiopters} D → ${r.rightEyeCylinderClass}`,
    });
  }
  if (r.leftEyeCylinderClass && r.leftEyeCylinderClass !== 'none') {
    out.push({
      ruleId: `R-CYL-${r.leftEyeCylinderClass.toUpperCase()}`,
      instrument: 'cylinder', eye: 'left', class: r.leftEyeCylinderClass,
      category: 'refraction',
      description: `Left cylinder ${p.leftEye.cylinderDiopters} D → ${r.leftEyeCylinderClass}`,
    });
  }
  if (r.presbyopiaClass && r.presbyopiaClass !== 'none') {
    out.push({
      ruleId: `R-ADD-${r.presbyopiaClass.toUpperCase()}`,
      instrument: 'addition', eye: 'both', class: r.presbyopiaClass,
      category: 'accommodation',
      description: `Addition → ${r.presbyopiaClass}`,
    });
  }
  if (r.anisometropia !== null && r.anisometropia > 0.50) {
    out.push({
      ruleId: 'R-ANISO-01',
      instrument: 'anisometropia', eye: 'both', class: '',
      category: 'alignment',
      description: `Anisometropia ${r.anisometropia.toFixed(2)} D`,
    });
  }
  if (r.prismPresent) {
    out.push({
      ruleId: 'R-PRISM-01',
      instrument: 'prism', eye: 'both', class: '',
      category: 'alignment',
      description: 'Prism prescribed',
    });
  }
  return out;
}

export function classify(p: EyePrescription): ClassificationResult {
  const partial = {
    rightEyeSphereClass: classifySphere(p.rightEye.sphereDiopters),
    leftEyeSphereClass: classifySphere(p.leftEye.sphereDiopters),
    rightEyeCylinderClass: classifyCylinder(p.rightEye.cylinderDiopters),
    leftEyeCylinderClass: classifyCylinder(p.leftEye.cylinderDiopters),
    presbyopiaClass: classifyPresbyopia(
      p.rightEye.additionDiopters,
      p.leftEye.additionDiopters,
    ),
    anisometropia: anisometropiaDiopters(p),
    prismPresent: prismPresent(p),
  };
  const complexity = computeComplexity(partial);
  const result: ClassificationResult = {
    ...partial,
    complexity,
    firedRules: [],
    additionalFlags: [],
  };
  result.firedRules = makeFiredRules(p, result);
  result.additionalFlags = flaggedIssues(p, partial);
  return result;
}
