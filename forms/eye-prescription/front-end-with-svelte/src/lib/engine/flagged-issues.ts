import type {
  EyePrescription, AdditionalFlag, ClassificationResult
} from './types.js';
import { ageInYears } from './utils.js';

export function flaggedIssues(
  p: EyePrescription,
  partial: Pick<ClassificationResult,
    'anisometropia' | 'prismPresent' | 'presbyopiaClass'>,
): AdditionalFlag[] {
  const flags: AdditionalFlag[] = [];
  let i = 0;
  const add = (
    category: AdditionalFlag['category'],
    eye: AdditionalFlag['eye'],
    priority: AdditionalFlag['priority'],
    description: string,
    suggestedAction: string,
  ): void => {
    i += 1;
    flags.push({
      flagId: `F-${category.toUpperCase()}-${String(i).padStart(3, '0')}`,
      category, eye, priority, description, suggestedAction,
    });
  };

  const rs = p.rightEye.sphereDiopters;
  const ls = p.leftEye.sphereDiopters;
  const rc = p.rightEye.cylinderDiopters;
  const lc = p.leftEye.cylinderDiopters;

  if (rs !== null && rs < -6.00) {
    add('high-myopia', 'right', 'medium',
      `Right sphere ${rs} D below -6.00 D`,
      'Consider retinal screening every 12 months');
  }
  if (ls !== null && ls < -6.00) {
    add('high-myopia', 'left', 'medium',
      `Left sphere ${ls} D below -6.00 D`,
      'Consider retinal screening every 12 months');
  }
  if (rs !== null && rs > 5.00) {
    add('high-hyperopia', 'right', 'medium',
      `Right sphere ${rs} D above +5.00 D`,
      'Assess angle-closure risk; gonioscopy if indicated');
  }
  if (ls !== null && ls > 5.00) {
    add('high-hyperopia', 'left', 'medium',
      `Left sphere ${ls} D above +5.00 D`,
      'Assess angle-closure risk; gonioscopy if indicated');
  }
  if (rc !== null && Math.abs(rc) > 2.50) {
    add('high-astigmatism', 'right', 'medium',
      `Right cylinder ${rc} D magnitude > 2.50 D`,
      'Consider corneal topography; rule out keratoconus');
  }
  if (lc !== null && Math.abs(lc) > 2.50) {
    add('high-astigmatism', 'left', 'medium',
      `Left cylinder ${lc} D magnitude > 2.50 D`,
      'Consider corneal topography; rule out keratoconus');
  }
  if (partial.anisometropia !== null && partial.anisometropia > 2.00) {
    add('anisometropia', 'both', 'medium',
      `Anisometropia ${partial.anisometropia.toFixed(2)} D > 2.00 D`,
      'Adaptation period expected; consider contact-lens correction');
  }
  if (partial.prismPresent) {
    add('prism-present', 'both', 'medium',
      'Prism prescribed in one or both eyes',
      'Document indication; review binocular vision');
  }
  if (partial.presbyopiaClass && partial.presbyopiaClass !== 'none') {
    add('presbyopia', 'both', 'low',
      `Addition prescribed (${partial.presbyopiaClass})`,
      'Counsel patient on accommodation expectations');
  }

  const age = ageInYears(p.patient.birthDate, p.examination.issueDate);
  if (age !== null && age < 16) {
    add('paediatric', 'both', 'medium',
      `Patient age ${age} years < 16`,
      'Use polycarbonate or Trivex; expiry default 1 year');
  }

  if (p.examination.expiryDate) {
    const today = new Date();
    const expiry = new Date(p.examination.expiryDate);
    if (!Number.isNaN(expiry.getTime()) && expiry < today) {
      add('prescription-expired', 'both', 'high',
        `Expiry date ${p.examination.expiryDate} is in the past`,
        'Schedule a new sight test before dispensing');
    }
  }

  const psr = p.examination.priorSphereRight;
  const psl = p.examination.priorSphereLeft;
  if (psr !== null && rs !== null && Math.abs(rs - psr) > 1.00) {
    add('significant-change-from-prior', 'right', 'low',
      `Right sphere changed by ${(rs - psr).toFixed(2)} D since prior`,
      'Counsel patient on adaptation period');
  }
  if (psl !== null && ls !== null && Math.abs(ls - psl) > 1.00) {
    add('significant-change-from-prior', 'left', 'low',
      `Left sphere changed by ${(ls - psl).toFixed(2)} D since prior`,
      'Counsel patient on adaptation period');
  }

  if (p.ocularHealth.pathologyFlag) {
    add('ocular-pathology', 'both', 'high',
      'Ocular pathology recorded on step 10',
      'Consider ophthalmology referral as documented');
  }
  if (p.ocularHealth.referOphthalmology) {
    add('refer-ophthalmology', 'both', 'high',
      'Prescriber requests ophthalmology referral',
      p.ocularHealth.referralReason || 'See step 10 notes');
  }

  return flags;
}
