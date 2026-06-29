import type { FiredRule, MedifAssessment } from './types.js';

// Communicable-disease infectious-period rules per IATA Medical Manual.

interface CommunicableRule {
  id: string;
  band: FiredRule['band'];
  description: string;
  fires: (d: MedifAssessment) => boolean;
}

const RULES: CommunicableRule[] = [
  {
    id: 'R-CD-01',
    band: 'unfit-to-fly',
    description: 'Active communicable disease in infectious period',
    fires: (d) => d.communicable.communicableDiseaseStatus === 'infectious',
  },
  {
    id: 'R-CD-02',
    band: 'requires-review',
    description: 'Convalescent communicable disease — clearance certificate required',
    fires: (d) => d.communicable.communicableDiseaseStatus === 'convalescent',
  },
  {
    id: 'R-CD-03',
    band: 'unfit-to-fly',
    description: 'Isolation precautions required',
    fires: (d) => d.communicable.isolationRequired === 'yes',
  },
];

export function applyCommunicableRules(data: MedifAssessment): FiredRule[] {
  const fired: FiredRule[] = [];
  for (const r of RULES) {
    if (r.fires(data)) {
      fired.push({
        ruleId: r.id,
        category: 'communicable',
        band: r.band,
        description: r.description,
      });
    }
  }
  return fired;
}
