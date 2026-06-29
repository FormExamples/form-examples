import type { FiredRule, MedifAssessment } from './types.js';

// Pregnancy thresholds aligned with the most conservative IATA member-airline
// policies: singleton > 36 weeks and multiple > 32 weeks are not carried.

interface PregnancyRule {
  id: string;
  band: FiredRule['band'];
  description: string;
  fires: (d: MedifAssessment) => boolean;
}

const RULES: PregnancyRule[] = [
  {
    id: 'R-PR-01',
    band: 'unfit-to-fly',
    description: 'Singleton pregnancy beyond 36 completed weeks',
    fires: (d) =>
      d.pregnancy.isPregnant === 'yes' &&
      d.pregnancy.pregnancyType === 'singleton' &&
      (d.pregnancy.gestationWeeks ?? 0) > 36,
  },
  {
    id: 'R-PR-02',
    band: 'unfit-to-fly',
    description: 'Multiple pregnancy beyond 32 completed weeks',
    fires: (d) =>
      d.pregnancy.isPregnant === 'yes' &&
      (d.pregnancy.pregnancyType === 'twins' || d.pregnancy.pregnancyType === 'multiple') &&
      (d.pregnancy.gestationWeeks ?? 0) > 32,
  },
  {
    id: 'R-PR-03',
    band: 'requires-review',
    description: 'Singleton pregnancy 28–36 weeks — physician certificate required',
    fires: (d) => {
      if (d.pregnancy.isPregnant !== 'yes') return false;
      if (d.pregnancy.pregnancyType !== 'singleton') return false;
      const w = d.pregnancy.gestationWeeks ?? 0;
      return w >= 28 && w <= 36;
    },
  },
  {
    id: 'R-PR-04',
    band: 'requires-review',
    description: 'Multiple pregnancy 24–32 weeks — physician certificate required',
    fires: (d) => {
      if (d.pregnancy.isPregnant !== 'yes') return false;
      if (d.pregnancy.pregnancyType !== 'twins' && d.pregnancy.pregnancyType !== 'multiple')
        return false;
      const w = d.pregnancy.gestationWeeks ?? 0;
      return w >= 24 && w <= 32;
    },
  },
  {
    id: 'R-PR-05',
    band: 'requires-review',
    description: 'Pregnancy complications declared',
    fires: (d) =>
      d.pregnancy.isPregnant === 'yes' && d.pregnancy.pregnancyComplications.trim().length > 0,
  },
];

export function applyPregnancyRules(data: MedifAssessment): FiredRule[] {
  const fired: FiredRule[] = [];
  for (const r of RULES) {
    if (r.fires(data)) {
      fired.push({
        ruleId: r.id,
        category: 'pregnancy',
        band: r.band,
        description: r.description,
      });
    }
  }
  return fired;
}
