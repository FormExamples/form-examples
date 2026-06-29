import type { FiredRule, MedifAssessment } from './types.js';

// Cardiovascular and respiratory fitness rules drawn from Steps 7, 8 and
// Step 13 (haemoglobin).

interface CardioRespRule {
  id: string;
  band: FiredRule['band'];
  description: string;
  fires: (d: MedifAssessment) => boolean;
}

const RULES: CardioRespRule[] = [
  {
    id: 'R-CR-01',
    band: 'unfit-to-fly',
    description: 'Resting SpO₂ < 85 % on room air',
    fires: (d) =>
      d.respiratory.restingSpo2Percent !== null && d.respiratory.restingSpo2Percent < 85,
  },
  {
    id: 'R-CR-02',
    band: 'requires-review',
    description: 'Resting SpO₂ 85–92 % on room air',
    fires: (d) => {
      const v = d.respiratory.restingSpo2Percent;
      return v !== null && v >= 85 && v < 92;
    },
  },
  {
    id: 'R-CR-03',
    band: 'requires-review',
    description: 'Hypoxic challenge test failed',
    fires: (d) => d.respiratory.hypoxicChallengeResult === 'fail',
  },
  {
    id: 'R-CR-04',
    band: 'fit-with-conditions',
    description: 'Hypoxic challenge test borderline — in-flight oxygen recommended',
    fires: (d) => d.respiratory.hypoxicChallengeResult === 'borderline',
  },
  {
    id: 'R-CR-05',
    band: 'unfit-to-fly',
    description: 'Severe anaemia (haemoglobin < 75 g/L)',
    fires: (d) =>
      d.cabinMeds.haemoglobinGPerL !== null && d.cabinMeds.haemoglobinGPerL < 75,
  },
  {
    id: 'R-CR-06',
    band: 'requires-review',
    description: 'Moderate anaemia (haemoglobin 75–99 g/L)',
    fires: (d) => {
      const v = d.cabinMeds.haemoglobinGPerL;
      return v !== null && v >= 75 && v < 100;
    },
  },
  {
    id: 'R-CR-07',
    band: 'requires-review',
    description: 'Unstable angina',
    fires: (d) => d.cardiovascular.unstableAngina === 'yes',
  },
  {
    id: 'R-CR-08',
    band: 'requires-review',
    description: 'NYHA functional class IV (heart failure at rest)',
    fires: (d) => d.cardiovascular.nyhaClass === 'IV',
  },
  {
    id: 'R-CR-09',
    band: 'fit-with-conditions',
    description: 'NYHA functional class III',
    fires: (d) => d.cardiovascular.nyhaClass === 'III',
  },
  {
    id: 'R-CR-10',
    band: 'requires-review',
    description: 'Severe uncontrolled asthma',
    fires: (d) => d.respiratory.asthmaSeverity === 'severe-uncontrolled',
  },
  {
    id: 'R-CR-11',
    band: 'requires-review',
    description: 'Severe COPD',
    fires: (d) => d.respiratory.copdSeverity === 'severe',
  },
  {
    id: 'R-CR-12',
    band: 'fit-with-conditions',
    description: 'CPAP / BiPAP device for in-flight use',
    fires: (d) =>
      d.respiratory.cpapOrBipapUse === 'cpap' ||
      d.respiratory.cpapOrBipapUse === 'bipap' ||
      d.respiratory.cpapOrBipapUse === 'both',
  },
];

export function applyCardioRespRules(data: MedifAssessment): FiredRule[] {
  const fired: FiredRule[] = [];
  for (const r of RULES) {
    if (r.fires(data)) {
      fired.push({
        ruleId: r.id,
        category: 'cardiorespiratory',
        band: r.band,
        description: r.description,
      });
    }
  }
  return fired;
}
